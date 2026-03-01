import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema, insertCookieConsentSchema, insertShopOrderSchema, insertCourseMaterialSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendContactNotification, sendContactConfirmation, sendNewsletterConfirmation, sendSubscriptionConfirmation, sendBookingConfirmation } from "./email";
import { forwardToCRM } from "./crm";
import { generateBlogPost } from "./blog-generator";
import { chatWithAI } from "./ai-chat";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault, verifyPaypalOrder } from "./paypal";
import { SHOP_PRODUCTS, getProductBySlug, getEffectivePrice } from "@shared/products";
import { scoreWriting, scoreSpeaking, transcribeAudio } from "./english-test";
import { getAllQuestions } from "./english-test-questions";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
import {
  calculateProbability, calculateFisherInformation, selectNextQuestion,
  updateTheta, updateStandardError, thetaToCEFR, selfAssessmentToTheta,
  checkA0HardFail, calculateFinalLevel,
  getWritingPrompt, getSpeakingPrompt, SECTION_SKILLS,
  shouldEndSection, MAX_QUESTIONS_PER_SECTION,  isLevelStable
} from "./cat-engine";
import { sendEnglishTestResultEmail, sendEnglishTestConfirmationEmail } from "./email";
import multer from "multer";
import cron from "node-cron";
import crypto from "crypto";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
}

const adminSessions = new Map<string, { createdAt: number; userId: string; role: string }>();
const ADMIN_SESSION_DURATION = 4 * 60 * 60 * 1000;

const shopCustomerSessions = new Map<string, { createdAt: number; customerId: string }>();
const SHOP_SESSION_DURATION = 24 * 60 * 60 * 1000;

function generateAdminToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function getAdminSession(token: string | undefined): { userId: string; role: string } | null {
  if (!token) return null;
  const session = adminSessions.get(token);
  if (!session) return null;
  if (Date.now() - session.createdAt > ADMIN_SESSION_DURATION) {
    adminSessions.delete(token);
    return null;
  }
  return { userId: session.userId, role: session.role };
}

function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");
  const session = getAdminSession(token);
  if (!session) {
    return res.status(401).json({ success: false, message: "Non autorizzato" });
  }
  req.adminSession = session;
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");
  const session = getAdminSession(token);
  if (!session) {
    return res.status(401).json({ success: false, message: "Non autorizzato" });
  }
  if (session.role !== "admin") {
    return res.status(403).json({ success: false, message: "Accesso riservato agli amministratori" });
  }
  req.adminSession = session;
  next();
}

const MIN_SUBMIT_TIME_MS = 3000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  return (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_SUBMISSIONS_PER_WINDOW;
}

function checkBotProtection(body: any): { blocked: boolean; reason?: string } {
  if (body._hp && body._hp.length > 0) {
    return { blocked: true, reason: "honeypot" };
  }
  if (body._ts) {
    const elapsed = Date.now() - Number(body._ts);
    if (elapsed < MIN_SUBMIT_TIME_MS) {
      return { blocked: true, reason: "too_fast" };
    }
  }
  return { blocked: false };
}

function stripBotFields(body: any) {
  const { _hp, _ts, ...clean } = body;
  return clean;
}

const GOOGLE_PLACE_ID = "ChIJDWsIWn0xf0cR9w29gPorTls";
let reviewsCache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  const seedDefaultAdmin = async () => {
    try {
      const allUsers = await storage.getAllUsers();
      if (allUsers.length === 0) {
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) {
          console.warn("No ADMIN_PASSWORD set — skipping default admin user creation. Set ADMIN_PASSWORD env var to create the initial admin.");
          return;
        }
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await storage.createUser({
          username: "admin",
          password: hashedPassword,
          name: "Amministratore",
          email: "",
          role: "admin",
          active: true,
        });
        console.log("Default admin user created (username: admin)");
      }
    } catch (error) {
      console.error("Error seeding default admin:", error);
    }
  };
  seedDefaultAdmin();

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username/email e password sono obbligatori" });
      }
      let user = await storage.getUserByUsername(username);
      if (!user && username.includes("@")) {
        user = await storage.getUserByEmail(username);
      }
      if (!user || !user.active) {
        return res.status(401).json({ success: false, message: "Credenziali non valide" });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ success: false, message: "Credenziali non valide" });
      }
      const token = generateAdminToken();
      adminSessions.set(token, { createdAt: Date.now(), userId: user.id, role: user.role });
      res.json({
        success: true,
        token,
        user: { id: user.id, username: user.username, name: user.name, role: user.role },
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get("/api/admin/users", requireAdmin, async (_req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const safeUsers = allUsers.map(({ password, ...u }) => u);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const { username, password, name, email, role } = req.body;
      if (!username || !password || !name) {
        return res.status(400).json({ success: false, message: "Tutti i campi sono obbligatori" });
      }
      if (username.length < 3) {
        return res.status(400).json({ success: false, message: "Username deve avere almeno 3 caratteri" });
      }
      if (!isStrongPassword(password)) {
        return res.status(400).json({ success: false, message: "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale." });
      }
      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(400).json({ success: false, message: "Username già in uso" });
      }
      const validRole = role === "admin" ? "admin" : "staff";
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        name,
        email: email || "",
        role: validRole,
        active: true,
      });
      const { password: _, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role, active, password } = req.body;
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (role !== undefined) updateData.role = role === "admin" ? "admin" : "staff";
      if (active !== undefined) updateData.active = active;
      if (password) {
        if (!isStrongPassword(password)) {
          return res.status(400).json({ success: false, message: "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale." });
        }
        updateData.password = await bcrypt.hash(password, 10);
      }
      const user = await storage.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json({ success: false, message: "Utente non trovato" });
      }
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const session = (req as any).adminSession;
      if (session.userId === id) {
        return res.status(400).json({ success: false, message: "Non puoi eliminare il tuo account" });
      }
      await storage.deleteUser(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get("/api/admin/contacts", requireAuth, async (_req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get("/api/admin/newsletter", requireAuth, async (_req, res) => {
    try {
      const subscriptions = await storage.getNewsletterSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching newsletter subscriptions:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get("/api/admin/blog", requireAuth, async (_req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post("/api/admin/blog/generate", requireAuth, async (_req, res) => {
    try {
      await generateBlogPost();
      res.json({ success: true, message: "Blog post generation triggered" });
    } catch (error) {
      console.error("Blog generation error:", error);
      res.status(500).json({ success: false, message: "Generation failed" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const botCheck = checkBotProtection(req.body);
      if (botCheck.blocked) {
        console.log(`Bot blocked on /api/contact: ${botCheck.reason} from ${getClientIp(req)}`);
        res.status(200).json({ success: true, message: "Contact submission received", id: "ok" });
        return;
      }

      const clientIp = getClientIp(req);
      if (isRateLimited(clientIp)) {
        console.log(`Rate limited on /api/contact: ${clientIp}`);
        res.status(429).json({ success: false, message: "Troppe richieste. Riprova tra qualche minuto." });
        return;
      }

      const cleanBody = stripBotFields(req.body);
      const validatedData = insertContactSchema.parse(cleanBody);
      const submission = await storage.createContactSubmission(validatedData);
      
      try {
        await sendContactNotification({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          courseInterest: validatedData.courseInterest,
          message: validatedData.message,
        });
      } catch (emailError) {
        console.error("Failed to send contact notification email:", emailError);
      }

      try {
        await sendContactConfirmation({
          name: validatedData.name,
          email: validatedData.email,
          courseInterest: validatedData.courseInterest,
        });
      } catch (emailError) {
        console.error("Failed to send contact confirmation email:", emailError);
      }

      try {
        await forwardToCRM({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          courseInterest: validatedData.courseInterest,
          message: validatedData.message,
        });
      } catch (crmError) {
        console.error("Failed to forward to CRM:", crmError);
      }

      res.status(201).json({ 
        success: true, 
        message: "Contact submission received",
        id: submission.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Contact submission error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  app.get("/api/contact", async (_req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const botCheck = checkBotProtection(req.body);
      if (botCheck.blocked) {
        console.log(`Bot blocked on /api/newsletter: ${botCheck.reason} from ${getClientIp(req)}`);
        res.status(200).json({ success: true, message: "Successfully subscribed to newsletter", id: "ok" });
        return;
      }

      const clientIp = getClientIp(req);
      if (isRateLimited(clientIp)) {
        console.log(`Rate limited on /api/newsletter: ${clientIp}`);
        res.status(429).json({ success: false, message: "Troppe richieste. Riprova tra qualche minuto." });
        return;
      }

      const cleanBody = stripBotFields(req.body);
      const validatedData = insertNewsletterSchema.parse(cleanBody);
      
      const existing = await storage.getNewsletterSubscriptionByEmail(validatedData.email);
      if (existing) {
        res.status(200).json({ 
          success: true, 
          message: "Already subscribed",
          id: existing.id 
        });
        return;
      }
      
      let subscription;
      try {
        subscription = await storage.createNewsletterSubscription(validatedData);
      } catch (dbError: any) {
        if (dbError?.code === "23505") {
          const existingAgain = await storage.getNewsletterSubscriptionByEmail(validatedData.email);
          res.status(200).json({ 
            success: true, 
            message: "Already subscribed",
            id: existingAgain?.id 
          });
          return;
        }
        throw dbError;
      }
      
      try {
        await sendNewsletterConfirmation(validatedData.email);
      } catch (emailError) {
        console.error("Failed to send newsletter confirmation email:", emailError);
      }

      res.status(201).json({ 
        success: true, 
        message: "Successfully subscribed to newsletter",
        id: subscription.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid email address", 
          errors: error.errors 
        });
      } else {
        console.error("Newsletter subscription error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  app.get("/api/newsletter", async (_req, res) => {
    try {
      const subscriptions = await storage.getNewsletterSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching newsletter subscriptions:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  app.get("/api/reviews", async (_req, res) => {
    try {
      if (reviewsCache && Date.now() - reviewsCache.timestamp < CACHE_DURATION) {
        return res.json(reviewsCache.data);
      }

      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          success: false, 
          message: "Google API key not configured" 
        });
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&language=it&key=${apiKey}`
      );

      const data = await response.json();

      if (data.status !== "OK") {
        console.error("Google Places API error:", data.status, data.error_message);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to fetch reviews from Google" 
        });
      }

      const result = {
        rating: data.result?.rating || 4.8,
        totalReviews: data.result?.user_ratings_total || 0,
        reviews: (data.result?.reviews || []).map((review: any) => ({
          id: review.time?.toString() || Math.random().toString(),
          name: review.author_name || "Anonimo",
          role: "Google Review",
          content: review.text || "",
          rating: review.rating || 5,
          avatar: review.profile_photo_url || null,
          relativeTime: review.relative_time_description || "",
        })),
      };

      reviewsCache = { data: result, timestamp: Date.now() };

      res.json(result);
    } catch (error) {
      console.error("Error fetching Google reviews:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  app.post("/api/cookie-consent", async (req, res) => {
    try {
      const consentData = {
        ...req.body,
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
      };
      const validatedData = insertCookieConsentSchema.parse(consentData);
      const record = await storage.createCookieConsent(validatedData);
      res.status(201).json({ 
        success: true, 
        message: "Cookie consent recorded",
        id: record.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid consent data", 
          errors: error.errors 
        });
      } else {
        console.error("Cookie consent error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  app.get("/api/cookie-consent", async (_req, res) => {
    try {
      const consents = await storage.getCookieConsents();
      res.json(consents);
    } catch (error) {
      console.error("Error fetching cookie consents:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  app.get("/api/blog", async (_req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  app.post("/api/blog/generate", async (_req, res) => {
    try {
      await generateBlogPost();
      res.json({ success: true, message: "Blog post generation triggered" });
    } catch (error) {
      console.error("Blog generation error:", error);
      res.status(500).json({ success: false, message: "Generation failed" });
    }
  });

  cron.schedule("0 7 * * *", async () => {
    console.log("Running daily blog generation...");
    await generateBlogPost();
  });

  const chatRateLimitMap = new Map<string, { count: number; resetAt: number }>();

  app.post("/api/chat", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      const now = Date.now();
      const chatEntry = chatRateLimitMap.get(clientIp);
      if (chatEntry && now < chatEntry.resetAt && chatEntry.count > 20) {
        res.status(429).json({ success: false, message: "Troppe richieste. Riprova tra qualche minuto." });
        return;
      }
      if (!chatEntry || now > chatEntry.resetAt) {
        chatRateLimitMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
      } else {
        chatEntry.count++;
      }

      const { messages } = req.body;
      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ success: false, message: "Messages array required" });
        return;
      }

      const sanitizedMessages = messages.slice(-10).map((m: any) => ({
        role: m.role === "assistant" ? "assistant" as const : "user" as const,
        content: String(m.content).slice(0, 1000),
      }));

      const reply = await chatWithAI(sanitizedMessages);
      res.json({ success: true, reply });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ success: false, message: "Errore nel servizio di chat" });
    }
  });

  app.get("/api/courses", async (_req, res) => {
    const courses = [
      {
        id: "1",
        title: "Inglese per Tutti",
        description: "Corso completo di inglese dal livello base all'avanzato. Conversazione, grammatica e certificazioni internazionali.",
        category: "languages",
        duration: "3-12 mesi",
        level: "all",
        icon: "globe",
        featured: true,
      },
      {
        id: "2",
        title: "Tedesco Professionale",
        description: "Impara il tedesco per il mondo del lavoro. Focus su comunicazione business e terminologia specifica.",
        category: "languages",
        duration: "6 mesi",
        level: "intermediate",
        icon: "languages",
      },
      {
        id: "3",
        title: "Italiano per Stranieri",
        description: "Corso intensivo di italiano per stranieri. Grammatica, cultura e conversazione quotidiana.",
        category: "languages",
        duration: "3-6 mesi",
        level: "all",
        icon: "globe",
        featured: true,
      },
      {
        id: "4",
        title: "Competenze Digitali",
        description: "Padroneggia gli strumenti digitali essenziali: Office, Google Workspace, collaborazione online.",
        category: "digital",
        duration: "2 mesi",
        level: "beginner",
        icon: "code",
      },
      {
        id: "5",
        title: "Public Speaking",
        description: "Sviluppa le tue capacità di comunicazione pubblica. Tecniche di presentazione e gestione dell'ansia.",
        category: "professional",
        duration: "1 mese",
        level: "all",
        icon: "briefcase",
      },
      {
        id: "6",
        title: "Sviluppo Personale",
        description: "Migliora la tua produttività, gestione del tempo e competenze trasversali per il successo.",
        category: "personal",
        duration: "2 mesi",
        level: "all",
        icon: "brain",
      },
    ];
    
    res.json(courses);
  });

  // =========================================
  // Speaker's Corner API Routes
  // =========================================

  app.post("/api/speakers-corner/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email e password sono obbligatori" });
      }

      const subscriber = await storage.getScSubscriberByEmail(email);
      if (!subscriber) {
        return res.status(401).json({ success: false, message: "Credenziali non valide" });
      }

      const validPassword = await bcrypt.compare(password, subscriber.password);
      if (!validPassword) {
        return res.status(401).json({ success: false, message: "Credenziali non valide" });
      }

      const today = new Date().toISOString().split('T')[0];
      if (!subscriber.active || subscriber.subscriptionEnd < today) {
        return res.status(403).json({ 
          success: false, 
          message: "Il tuo abbonamento non è attivo o è scaduto" 
        });
      }

      const { password: _, ...subscriberData } = subscriber;
      res.json({ success: true, subscriber: subscriberData });
    } catch (error) {
      console.error("Speaker's Corner login error:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.get("/api/speakers-corner/sessions", async (_req, res) => {
    try {
      const sessions = await storage.getUpcomingScSessions();
      const sessionsWithBookings = await Promise.all(
        sessions.map(async (session) => {
          const bookings = await storage.getScBookingsBySession(session.id);
          return { ...session, currentParticipants: bookings.length };
        })
      );
      res.json(sessionsWithBookings);
    } catch (error) {
      console.error("Error fetching SC sessions:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.post("/api/speakers-corner/book", async (req, res) => {
    try {
      const { subscriberId, sessionId } = req.body;
      if (!subscriberId || !sessionId) {
        return res.status(400).json({ success: false, message: "Dati mancanti" });
      }

      const subscriber = await storage.getScSubscriberById(subscriberId);
      if (!subscriber || !subscriber.active) {
        return res.status(403).json({ success: false, message: "Abbonamento non attivo" });
      }

      const session = await storage.getScSessionById(sessionId);
      if (!session || session.status !== "active") {
        return res.status(404).json({ success: false, message: "Sessione non trovata o non attiva" });
      }

      const existingBooking = await storage.getScBooking(subscriberId, sessionId);
      if (existingBooking) {
        return res.status(400).json({ success: false, message: "Sei già prenotato per questa sessione" });
      }

      const bookings = await storage.getScBookingsBySession(sessionId);
      if (bookings.length >= (session.maxParticipants || 12)) {
        return res.status(400).json({ success: false, message: "Sessione al completo" });
      }

      const booking = await storage.createScBooking({ subscriberId, sessionId });

      try {
        await sendBookingConfirmation({
          nome: subscriber.nome,
          cognome: subscriber.cognome,
          email: subscriber.email,
          sessionDate: session.sessionDate,
          sessionTime: session.sessionTime || "18:30",
          topic: session.topic,
        });
      } catch (emailError) {
        console.error("Failed to send booking confirmation email:", emailError);
      }

      res.status(201).json({ success: true, booking });
    } catch (error) {
      console.error("Error creating SC booking:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.delete("/api/speakers-corner/book/:bookingId", async (req, res) => {
    try {
      const { subscriberId } = req.query;
      if (!subscriberId) {
        return res.status(400).json({ success: false, message: "ID iscritto mancante" });
      }
      const bookings = await storage.getScBookingsBySubscriber(subscriberId as string);
      const booking = bookings.find(b => b.id === req.params.bookingId);
      if (!booking) {
        return res.status(403).json({ success: false, message: "Prenotazione non trovata o non autorizzata" });
      }
      await storage.deleteScBooking(req.params.bookingId);
      res.json({ success: true, message: "Prenotazione cancellata" });
    } catch (error) {
      console.error("Error deleting SC booking:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.get("/api/speakers-corner/my-bookings/:subscriberId", async (req, res) => {
    try {
      const bookings = await storage.getScBookingsBySubscriber(req.params.subscriberId);
      const bookingsWithSessions = await Promise.all(
        bookings.map(async (booking) => {
          const session = await storage.getScSessionById(booking.sessionId);
          return { ...booking, session };
        })
      );
      res.json(bookingsWithSessions);
    } catch (error) {
      console.error("Error fetching SC bookings:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  // =========================================
  // Speaker's Corner Admin Routes
  // =========================================

  app.get("/api/admin/speakers-corner/subscribers", async (_req, res) => {
    try {
      const subscribers = await storage.getAllScSubscribers();
      const safeSubscribers = subscribers.map(({ password, ...rest }) => rest);
      res.json(safeSubscribers);
    } catch (error) {
      console.error("Error fetching SC subscribers:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.post("/api/admin/speakers-corner/subscribers", async (req, res) => {
    try {
      const { nome, cognome, email, password, subscriptionStart, subscriptionEnd } = req.body;
      if (!nome || !cognome || !email || !password || !subscriptionStart || !subscriptionEnd) {
        return res.status(400).json({ success: false, message: "Tutti i campi sono obbligatori" });
      }
      if (!isStrongPassword(password)) {
        return res.status(400).json({ success: false, message: "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale." });
      }

      const existing = await storage.getScSubscriberByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: "Email già registrata" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const subscriber = await storage.createScSubscriber({
        nome,
        cognome,
        email,
        password: hashedPassword,
        subscriptionStart,
        subscriptionEnd,
        active: true,
      });

      const { password: _, ...safeSubscriber } = subscriber;
      res.status(201).json({ success: true, subscriber: safeSubscriber });
    } catch (error) {
      console.error("Error creating SC subscriber:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.patch("/api/admin/speakers-corner/subscribers/:id", async (req, res) => {
    try {
      const { nome, cognome, email, subscriptionStart, subscriptionEnd, active, password, tipoFatturazione, codiceFiscale, indirizzo, cap, citta, provincia, paese, ragioneSociale, partitaIva, codiceSdi, pec } = req.body;
      const updateData: any = {};
      if (nome !== undefined) updateData.nome = nome;
      if (cognome !== undefined) updateData.cognome = cognome;
      if (email !== undefined) updateData.email = email;
      if (subscriptionStart !== undefined) updateData.subscriptionStart = subscriptionStart;
      if (subscriptionEnd !== undefined) updateData.subscriptionEnd = subscriptionEnd;
      if (active !== undefined) updateData.active = active;
      if (password) {
        if (!isStrongPassword(password)) {
          return res.status(400).json({ success: false, message: "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale." });
        }
        updateData.password = await bcrypt.hash(password, 10);
      }
      if (tipoFatturazione !== undefined) updateData.tipoFatturazione = tipoFatturazione || null;
      if (codiceFiscale !== undefined) updateData.codiceFiscale = codiceFiscale || null;
      if (indirizzo !== undefined) updateData.indirizzo = indirizzo || null;
      if (cap !== undefined) updateData.cap = cap || null;
      if (citta !== undefined) updateData.citta = citta || null;
      if (provincia !== undefined) updateData.provincia = provincia || null;
      if (paese !== undefined) updateData.paese = paese || null;
      if (ragioneSociale !== undefined) updateData.ragioneSociale = ragioneSociale || null;
      if (partitaIva !== undefined) updateData.partitaIva = partitaIva || null;
      if (codiceSdi !== undefined) updateData.codiceSdi = codiceSdi || null;
      if (pec !== undefined) updateData.pec = pec || null;

      const subscriber = await storage.updateScSubscriber(req.params.id, updateData);
      if (!subscriber) {
        return res.status(404).json({ success: false, message: "Iscritto non trovato" });
      }

      const { password: _, ...safeSubscriber } = subscriber;
      res.json({ success: true, subscriber: safeSubscriber });
    } catch (error) {
      console.error("Error updating SC subscriber:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.get("/api/admin/speakers-corner/sessions", async (_req, res) => {
    try {
      const sessions = await storage.getAllScSessions();
      const sessionsWithBookings = await Promise.all(
        sessions.map(async (session) => {
          const bookings = await storage.getScBookingsBySession(session.id);
          return { ...session, currentParticipants: bookings.length };
        })
      );
      res.json(sessionsWithBookings);
    } catch (error) {
      console.error("Error fetching SC sessions:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.post("/api/admin/speakers-corner/sessions", async (req, res) => {
    try {
      const { sessionDate, sessionTime, topic, maxParticipants, status } = req.body;
      if (!sessionDate) {
        return res.status(400).json({ success: false, message: "La data della sessione è obbligatoria" });
      }

      const session = await storage.createScSession({
        sessionDate,
        sessionTime: sessionTime || "18:30",
        topic: topic || null,
        maxParticipants: maxParticipants || 12,
        status: status || "active",
      });
      res.status(201).json({ success: true, session });
    } catch (error) {
      console.error("Error creating SC session:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.patch("/api/admin/speakers-corner/sessions/:id", async (req, res) => {
    try {
      const session = await storage.updateScSession(req.params.id, req.body);
      if (!session) {
        return res.status(404).json({ success: false, message: "Sessione non trovata" });
      }
      res.json({ success: true, session });
    } catch (error) {
      console.error("Error updating SC session:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.get("/api/admin/speakers-corner/email-settings", async (_req, res) => {
    try {
      const settings = await storage.getScEmailSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching SC email settings:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.patch("/api/admin/speakers-corner/email-settings", async (req, res) => {
    try {
      const { emailsSuspended, suspensionReason } = req.body;
      const settings = await storage.updateScEmailSettings(emailsSuspended, suspensionReason);
      res.json({ success: true, settings });
    } catch (error) {
      console.error("Error updating SC email settings:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.post("/api/admin/speakers-corner/generate-sessions", async (req, res) => {
    try {
      const { weeks } = req.body;
      const numWeeks = weeks || 8;
      const created: any[] = [];

      for (let i = 0; i < numWeeks; i++) {
        const date = new Date();
        const dayOfWeek = date.getDay();
        const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
        date.setDate(date.getDate() + daysUntilFriday + (i * 7));
        const sessionDate = date.toISOString().split('T')[0];

        const existing = await storage.getAllScSessions();
        const alreadyExists = existing.some(s => s.sessionDate === sessionDate);
        if (!alreadyExists) {
          const session = await storage.createScSession({
            sessionDate,
            sessionTime: "18:30",
            topic: null,
            maxParticipants: 12,
            status: "active",
          });
          created.push(session);
        }
      }

      res.json({ success: true, created: created.length, sessions: created });
    } catch (error) {
      console.error("Error generating SC sessions:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  app.post("/api/speakers-corner/purchase", async (req, res) => {
    try {
      const { paypalOrderId, nome, cognome, email, password, tipoFatturazione, codiceFiscale, indirizzo, cap, citta, provincia, paese, ragioneSociale, partitaIva, codiceSdi, pec } = req.body;
      if (!paypalOrderId || !nome || !cognome || !email || !password || !codiceFiscale || !indirizzo || !cap || !citta || !provincia) {
        return res.status(400).json({ success: false, message: "Dati mancanti. Compila tutti i campi obbligatori." });
      }
      if (!isStrongPassword(password)) {
        return res.status(400).json({ success: false, message: "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale." });
      }

      const existing = await storage.getScSubscriberByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: "Esiste già un account con questa email. Accedi dalla pagina Speaker's Corner." });
      }

      const existingPayment = await storage.getScPaymentByOrderId(paypalOrderId);
      if (existingPayment) {
        return res.status(400).json({ success: false, message: "Questo pagamento è già stato elaborato." });
      }

      const verification = await verifyPaypalOrder(paypalOrderId);
      if (!verification.verified) {
        console.error("PayPal order verification failed:", verification);
        return res.status(400).json({ 
          success: false, 
          message: "Pagamento non verificato. Contatta l'assistenza se il problema persiste." 
        });
      }

      const today = new Date();
      const endDate = new Date(today);
      endDate.setFullYear(endDate.getFullYear() + 1);

      const hashedPassword = await bcrypt.hash(password, 10);
      const subscriber = await storage.createScSubscriber({
        nome,
        cognome,
        email,
        password: hashedPassword,
        tipoFatturazione: tipoFatturazione || null,
        codiceFiscale: codiceFiscale || null,
        indirizzo: indirizzo || null,
        cap: cap || null,
        citta: citta || null,
        provincia: provincia || null,
        paese: paese || null,
        ragioneSociale: ragioneSociale || null,
        partitaIva: partitaIva || null,
        codiceSdi: codiceSdi || null,
        pec: pec || null,
        subscriptionStart: today.toISOString().split('T')[0],
        subscriptionEnd: endDate.toISOString().split('T')[0],
        active: true,
      });

      await storage.createScPayment({
        subscriberId: subscriber.id,
        paypalOrderId,
        amount: verification.amount || "200.00",
        currency: verification.currency || "EUR",
        status: "completed",
        payerEmail: verification.payerEmail || email,
        billingNome: nome,
        billingCognome: cognome,
        billingCodiceFiscale: codiceFiscale || null,
        billingIndirizzo: indirizzo || null,
        billingCap: cap || null,
        billingCitta: citta || null,
        billingProvincia: provincia || null,
        billingPartitaIva: partitaIva || null,
        billingCodiceSdi: codiceSdi || null,
        billingPec: pec || null,
      });

      try {
        await sendSubscriptionConfirmation({
          nome,
          cognome,
          email,
          subscriptionStart: today.toISOString().split('T')[0],
          subscriptionEnd: endDate.toISOString().split('T')[0],
          amount: verification.amount || "200.00",
          paypalOrderId,
        });
      } catch (emailError) {
        console.error("Failed to send subscription confirmation email:", emailError);
      }

      const { password: _, ...safeSubscriber } = subscriber;
      res.json({ success: true, subscriber: safeSubscriber });
    } catch (error) {
      console.error("Error processing SC purchase:", error);
      res.status(500).json({ success: false, message: "Errore durante l'elaborazione dell'acquisto" });
    }
  });

  app.get("/api/shop/products", async (_req, res) => {
    res.json(SHOP_PRODUCTS);
  });

  app.post("/api/shop/purchase", async (req, res) => {
    try {
      const { paypalOrderId, productSlug, customerFirstName, customerLastName, customerEmail, customerPhone, billingCodiceFiscale, billingIndirizzo, billingCap, billingCitta, billingProvincia, billingPartitaIva, billingCodiceSdi, billingPec, notes } = req.body;

      const orderData = {
        productSlug: req.body.productSlug,
        productName: "",
        amount: "",
        currency: "EUR",
        paypalOrderId: req.body.paypalOrderId,
        status: "completed",
        customerFirstName: req.body.customerFirstName,
        customerLastName: req.body.customerLastName,
        customerEmail: req.body.customerEmail,
        customerPhone: req.body.customerPhone || null,
        studentFirstName: req.body.studentFirstName || null,
        studentLastName: req.body.studentLastName || null,
        studentEmail: req.body.studentEmail || null,
        billingCodiceFiscale: req.body.billingCodiceFiscale || null,
        billingIndirizzo: req.body.billingIndirizzo || null,
        billingCap: req.body.billingCap || null,
        billingCitta: req.body.billingCitta || null,
        billingProvincia: req.body.billingProvincia || null,
        billingPartitaIva: req.body.billingPartitaIva || null,
        billingCodiceSdi: req.body.billingCodiceSdi || null,
        billingPec: req.body.billingPec || null,
        notes: req.body.notes || null,
      };

      const parsed = insertShopOrderSchema.safeParse(orderData);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: "Dati mancanti o non validi.", errors: parsed.error.errors });
      }

      const product = getProductBySlug(parsed.data.productSlug);
      if (!product) {
        return res.status(400).json({ success: false, message: "Prodotto non trovato." });
      }

      const existingOrder = await storage.getShopOrderByPaypalId(parsed.data.paypalOrderId);
      if (existingOrder) {
        return res.status(400).json({ success: false, message: "Questo pagamento è già stato elaborato." });
      }

      let selectedOptions: Record<string, string> = {};
      try {
        if (req.body.selectedOptions) {
          selectedOptions = JSON.parse(req.body.selectedOptions);
        }
      } catch {}

      if (product.options && product.options.length > 0) {
        for (const opt of product.options) {
          const val = selectedOptions[opt.name];
          if (!val) {
            return res.status(400).json({ success: false, message: `Opzione obbligatoria mancante: ${opt.label}` });
          }
          if (!opt.values.includes(val)) {
            return res.status(400).json({ success: false, message: `Valore non valido per ${opt.label}: ${val}` });
          }
        }
      }

      if (product.variations && product.variations.length > 0) {
        const matchedVariation = product.variations.find((v) =>
          Object.entries(v.options).every(([key, value]) => selectedOptions[key] === value)
        );
        if (!matchedVariation) {
          return res.status(400).json({ success: false, message: "Combinazione di opzioni non valida per questo prodotto." });
        }
      }

      const expectedPrice = getEffectivePrice(product, selectedOptions);

      const verification = await verifyPaypalOrder(parsed.data.paypalOrderId, expectedPrice);
      if (!verification.verified) {
        console.error("PayPal order verification failed for shop:", verification);
        return res.status(400).json({
          success: false,
          message: "Pagamento non verificato. Contatta l'assistenza se il problema persiste.",
        });
      }

      let customerId: string | null = null;
      const customerPassword = req.body.customerPassword;

      if (customerPassword && customerPassword.length >= 6) {
        const existingCustomer = await storage.getShopCustomerByEmail(parsed.data.customerEmail);
        if (existingCustomer) {
          const passwordMatch = await bcrypt.compare(customerPassword, existingCustomer.password);
          if (passwordMatch) {
            customerId = existingCustomer.id;
          }
        } else {
          const hashedPassword = await bcrypt.hash(customerPassword, 10);
          const newCustomer = await storage.createShopCustomer({
            email: parsed.data.customerEmail,
            password: hashedPassword,
            name: `${parsed.data.customerFirstName} ${parsed.data.customerLastName}`,
            phone: parsed.data.customerPhone || null,
          });
          customerId = newCustomer.id;
        }
      }

      const optionsSummary = Object.entries(selectedOptions).map(([k, v]) => `${k}: ${v}`).join(", ");
      const productNameWithOptions = optionsSummary ? `${product.name} (${optionsSummary})` : product.name;

      const order = await storage.createShopOrder({
        ...parsed.data,
        productName: productNameWithOptions,
        amount: expectedPrice,
        customerId: customerId,
      });

      let customerToken: string | undefined;
      if (customerId) {
        customerToken = generateAdminToken();
        shopCustomerSessions.set(customerToken, { createdAt: Date.now(), customerId });
      }

      try {
        await sendContactNotification({
          name: `${customerFirstName} ${customerLastName}`,
          email: customerEmail,
          phone: customerPhone || undefined,
          courseInterest: `Acquisto: ${productNameWithOptions} (${expectedPrice} EUR)`,
          message: `Ordine completato via PayPal. ID: ${paypalOrderId}`,
        });
      } catch (emailError) {
        console.error("Failed to send shop purchase notification:", emailError);
      }

      res.json({ success: true, order, customerToken, customerId });
    } catch (error) {
      console.error("Error processing shop purchase:", error);
      res.status(500).json({ success: false, message: "Errore durante l'elaborazione dell'acquisto." });
    }
  });

  app.post("/api/shop/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email e password sono obbligatori." });
      }
      const customer = await storage.getShopCustomerByEmail(email);
      if (!customer) {
        return res.status(401).json({ success: false, message: "Email o password non corretti." });
      }
      const valid = await bcrypt.compare(password, customer.password);
      if (!valid) {
        return res.status(401).json({ success: false, message: "Email o password non corretti." });
      }
      const token = generateAdminToken();
      shopCustomerSessions.set(token, { createdAt: Date.now(), customerId: customer.id });
      res.json({
        success: true,
        token,
        customer: { id: customer.id, name: customer.name, email: customer.email },
      });
    } catch (error) {
      console.error("Shop customer login error:", error);
      res.status(500).json({ success: false, message: "Errore del server." });
    }
  });

  app.get("/api/shop/me", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ success: false, message: "Non autorizzato." });
      const session = shopCustomerSessions.get(token);
      if (!session || Date.now() - session.createdAt > SHOP_SESSION_DURATION) {
        if (session) shopCustomerSessions.delete(token);
        return res.status(401).json({ success: false, message: "Sessione scaduta." });
      }
      const customer = await storage.getShopCustomerById(session.customerId);
      if (!customer) return res.status(401).json({ success: false, message: "Cliente non trovato." });
      res.json({ id: customer.id, name: customer.name, email: customer.email });
    } catch (error) {
      console.error("Shop me error:", error);
      res.status(500).json({ success: false, message: "Errore del server." });
    }
  });

  app.get("/api/shop/my-orders", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ success: false, message: "Non autorizzato." });
      const session = shopCustomerSessions.get(token);
      if (!session || Date.now() - session.createdAt > SHOP_SESSION_DURATION) {
        if (session) shopCustomerSessions.delete(token);
        return res.status(401).json({ success: false, message: "Sessione scaduta." });
      }
      const orders = await storage.getShopOrdersByCustomerId(session.customerId);
      res.json(orders);
    } catch (error) {
      console.error("Shop my-orders error:", error);
      res.status(500).json({ success: false, message: "Errore del server." });
    }
  });

  app.get("/api/shop/materials/:slug", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ success: false, message: "Non autorizzato." });
      const session = shopCustomerSessions.get(token);
      if (!session || Date.now() - session.createdAt > SHOP_SESSION_DURATION) {
        if (session) shopCustomerSessions.delete(token);
        return res.status(401).json({ success: false, message: "Sessione scaduta." });
      }
      const orders = await storage.getShopOrdersByCustomerId(session.customerId);
      const hasPurchased = orders.some((o) => o.productSlug === req.params.slug && o.status === "completed");
      if (!hasPurchased) {
        return res.status(403).json({ success: false, message: "Non hai acquistato questo corso." });
      }
      const materials = await storage.getCourseMaterialsBySlug(req.params.slug);
      res.json(materials);
    } catch (error) {
      console.error("Shop materials error:", error);
      res.status(500).json({ success: false, message: "Errore del server." });
    }
  });

  app.get("/api/admin/shop/materials", requireAuth, async (_req, res) => {
    try {
      const materials = await storage.getAllCourseMaterials();
      res.json(materials);
    } catch (error) {
      console.error("Error fetching materials:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.post("/api/admin/shop/materials", requireAuth, async (req, res) => {
    try {
      const parsed = insertCourseMaterialSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, message: "Dati non validi.", errors: parsed.error.errors });
      }
      const material = await storage.createCourseMaterial(parsed.data);
      res.json({ success: true, material });
    } catch (error) {
      console.error("Error creating material:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.delete("/api/admin/shop/materials/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteCourseMaterial(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting material:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.get("/api/admin/shop/orders", requireAuth, async (_req, res) => {
    try {
      const orders = await storage.getShopOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching shop orders:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  app.get("/api/admin/speakers-corner/payments", requireAuth, async (req, res) => {
    try {
      const payments = await storage.getScPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching SC payments:", error);
      res.status(500).json({ success: false, message: "Errore del server" });
    }
  });

  function registerTestRoutes(prefix: string, testType: string, maxQ: number) {

  app.post(`${prefix}/start`, async (req, res) => {
    try {
      const { firstName, lastName, email, company, phone, city, province, selfAssessedLevel } = req.body;
      if (!firstName || !lastName || !email || !selfAssessedLevel) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const questionCount = await storage.getBeQuestionCount();
      if (questionCount === 0) {
        const questions = getAllQuestions();
        for (const q of questions) {
          await storage.createBeQuestion(q);
        }
      } else {
        const existingQuestions = await storage.getBeQuestions();
        const listeningWithoutAudio = existingQuestions.filter(q => q.skillType === "listening" && !q.audioUrl);
        if (listeningWithoutAudio.length > 0) {
          const freshQuestions = getAllQuestions();
          const freshListening = freshQuestions.filter(q => q.skillType === "listening");
          for (const dbQ of listeningWithoutAudio) {
            const match = freshListening.find(fq => fq.question === dbQ.question && fq.level === dbQ.level);
            if (match?.audioUrl) {
              await storage.updateBeQuestionAudioUrl(dbQ.id, match.audioUrl);
            }
          }
        }
      }

      const startingTheta = selfAssessmentToTheta(selfAssessedLevel);
      const session = await storage.createBeTestSession({
        firstName,
        lastName,
        email,
        company: company || null,
        phone: phone || null,
        city: city || null,
        province: province || null,
        selfAssessedLevel,
        currentLevel: thetaToCEFR(startingTheta),
        currentTheta: startingTheta,
        standardError: 100,
        confidenceLevel: 0,
        previousQuestions: "[]",
        currentSectionIndex: 1,
        totalSections: 8,
        levelHistory: "[]",
        questionsAtCurrentLevel: 0,
        consecutiveIncorrectA1: 0,
        testType,
      });

      const allQuestions = await storage.getBeQuestions();
      let firstQuestion = null;
      let startSectionIndex = 1;
      let startSkill = SECTION_SKILLS[0];

      for (let si = 0; si < SECTION_SKILLS.length; si++) {
        const skill = SECTION_SKILLS[si];
        const q = selectNextQuestion(startingTheta, [], skill, allQuestions);
        if (q) {
          firstQuestion = q;
          startSectionIndex = si + 1;
          startSkill = skill;
          break;
        }
      }

      if (!firstQuestion) {
        return res.status(500).json({ success: false, message: "No questions available. Please contact the administrator." });
      }

      if (startSectionIndex !== 1) {
        await storage.updateBeTestSession(session.id, { currentSectionIndex: startSectionIndex });
      }

      res.json({
        success: true,
        sessionId: session.id,
        currentTheta: startingTheta,
        currentLevel: session.currentLevel,
        currentSectionIndex: startSectionIndex,
        currentSkill: startSkill,
        question: {
          id: firstQuestion.id,
          question: firstQuestion.question,
          options: shuffleArray(JSON.parse(firstQuestion.options)),
          skillType: firstQuestion.skillType,
          level: firstQuestion.level,
          passage: firstQuestion.passage,
          audioUrl: firstQuestion.audioUrl,
        },
      });
    } catch (error) {
      console.error(`Error starting ${testType} test:`, error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post(`${prefix}/answer`, async (req, res) => {
    try {
      const { sessionId, questionId, answer, timeSpent } = req.body;
      if (!sessionId || !questionId || !answer) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      const session = await storage.getBeTestSession(sessionId);
      if (!session) return res.status(404).json({ success: false, message: "Session not found" });

      const currentSectionIdx = session.currentSectionIndex ?? 1;
      if (currentSectionIdx > SECTION_SKILLS.length) {
        return res.status(400).json({ success: false, message: "MC phase already completed" });
      }

      const question = await storage.getBeQuestionById(questionId);
      if (!question) return res.status(404).json({ success: false, message: "Question not found" });

      const expectedSkill = SECTION_SKILLS[currentSectionIdx - 1];
      if (question.skillType !== expectedSkill) {
        return res.status(400).json({ success: false, message: "Question does not belong to current section" });
      }

      const isCorrect = answer === question.correctAnswer;
      const oldTheta = session.currentTheta ?? 0;
      const oldSE = session.standardError ?? 100;
      const diff = question.difficulty ?? 0;
      const disc = question.discrimination ?? 100;
      const newTheta = updateTheta(oldTheta, isCorrect, oldSE, diff, disc);
      const newSE = updateStandardError(oldSE, oldTheta, diff, disc);
      const info = calculateFisherInformation(oldTheta, diff, disc);

      await storage.createBeResponse({
        sessionId,
        questionId,
        userAnswer: answer,
        isCorrect,
        timeSpent: timeSpent || null,
        thetaBefore: oldTheta,
        thetaAfter: newTheta,
        standardErrorBefore: oldSE,
        standardErrorAfter: newSE,
        informationGain: Math.round(info * 100),
      });

      const newTotalQ = (session.totalQuestions ?? 0) + 1;
      const newCorrect = (session.correctAnswers ?? 0) + (isCorrect ? 1 : 0);
      const newLevel = thetaToCEFR(newTheta);
      let prevQuestions: number[];
      try { prevQuestions = JSON.parse(session.previousQuestions || "[]"); } catch { prevQuestions = []; }
      prevQuestions.push(questionId);

      let questionsAtCurrentLevel = session.questionsAtCurrentLevel ?? 0;
      if (newLevel === session.currentLevel) {
        questionsAtCurrentLevel++;
      } else {
        questionsAtCurrentLevel = 1;
      }

      let consecutiveIncorrectA1 = session.consecutiveIncorrectA1 ?? 0;
      if (newLevel === "A1" && !isCorrect) {
        consecutiveIncorrectA1++;
      } else if (isCorrect) {
        consecutiveIncorrectA1 = 0;
      }

      let levelHistory: string[];
      try { levelHistory = JSON.parse(session.levelHistory || "[]"); } catch { levelHistory = []; }
      levelHistory.push(newLevel);

      const confidence = Math.max(0, Math.min(100, Math.round((1 - newSE / 100) * 100)));

      const currentSectionIndex = session.currentSectionIndex ?? 1;
      const currentSkillIdx = currentSectionIndex - 1;
      const currentSkill = SECTION_SKILLS[currentSkillIdx];

      const sectionResponses = await storage.getBeResponsesBySession(sessionId);
      const allQs = await storage.getBeQuestions();

      let questionsInCurrentSection = 0;
      let correctInCurrentSection = 0;
      for (const resp of sectionResponses) {
        const rq = allQs.find(q => q.id === resp.questionId);
        if (rq && rq.skillType === currentSkill) {
          questionsInCurrentSection++;
          if (resp.isCorrect) correctInCurrentSection++;
        }
      }

      let a0HardFail = false;
      if (checkA0HardFail(consecutiveIncorrectA1, newLevel)) {
        a0HardFail = true;
      }

      const adaptedLevel = a0HardFail ? "A0" : newLevel;

      const recentSectionLevels: string[] = [];
      for (const resp of sectionResponses) {
        const rq = allQs.find(q => q.id === resp.questionId);
        if (rq && rq.skillType === currentSkill && resp.thetaAfter != null) {
          recentSectionLevels.push(thetaToCEFR(resp.thetaAfter));
        }
      }

      let nextSectionIndex = currentSectionIndex;
      let advanceSection = false;

      const wouldHaveQuestion = selectNextQuestion(newTheta, prevQuestions, currentSkill, allQs);
      const outOfQuestions = !wouldHaveQuestion;

      console.log(`[CAT] Session ${sessionId} | Section: ${currentSkill} | Q#${questionsInCurrentSection} | ` +
        `correct: ${isCorrect} | theta: ${oldTheta} -> ${newTheta} | SE: ${oldSE} -> ${newSE} | ` +
        `level: ${adaptedLevel} | recentLevels: [${recentSectionLevels.join(",")}] | ` +
        `a0Fail: ${a0HardFail} | outOfQ: ${outOfQuestions} | ` +
        `difficulty: ${diff} | disc: ${disc} | P: ${calculateProbability(oldTheta, diff, disc).toFixed(3)}`);

      const levelStable = isLevelStable(recentSectionLevels);
      const sectionEnding = shouldEndSection(questionsInCurrentSection, newSE, recentSectionLevels, maxQ);
      if (sectionEnding) {
        const seCheck = newSE <= 40;
        const maxCheck = questionsInCurrentSection >= maxQ;
        console.log(`[CAT] >>> SECTION ENDING: SE<=40? ${seCheck} (SE=${newSE}) | stable? ${levelStable} | maxQ? ${maxCheck} (${questionsInCurrentSection}/${maxQ})`);
      } else if (newSE <= 40 && !levelStable) {
        console.log(`[CAT] >>> SE low (${newSE}) but level not stable yet — last 3 levels: [${recentSectionLevels.slice(-3).join(",")}]`);
      }

      if (a0HardFail || outOfQuestions || sectionEnding) {
        await storage.createBeSectionResult({
          sessionId,
          sectionName: currentSkill,
          sectionIndex: currentSectionIndex,
          questionsAttempted: questionsInCurrentSection,
          questionsCorrect: correctInCurrentSection,
          accuracyPercentage: questionsInCurrentSection > 0 ? Math.round((correctInCurrentSection / questionsInCurrentSection) * 100) : 0,
          cefrLevel: adaptedLevel,
          finalTheta: newTheta,
          finalStandardError: newSE,
          sectionConfidence: confidence,
        });

        nextSectionIndex = currentSectionIndex + 1;
        advanceSection = true;
      }

      await storage.updateBeTestSession(sessionId, {
        currentTheta: newTheta,
        standardError: newSE,
        currentLevel: adaptedLevel,
        totalQuestions: newTotalQ,
        correctAnswers: newCorrect,
        previousQuestions: JSON.stringify(prevQuestions),
        questionsAtCurrentLevel,
        consecutiveIncorrectA1,
        levelHistory: JSON.stringify(levelHistory),
        confidenceLevel: confidence,
        currentSectionIndex: nextSectionIndex,
      });

      if (a0HardFail) {
        const mcLevel = "A0";
        const writingPrompt = getWritingPrompt(mcLevel);
        return res.json({
          success: true,
          isCorrect,
          newTheta,
          newLevel: mcLevel,
          confidence,
          mcPhaseComplete: true,
          mcLevel,
          writingPrompt,
          a0HardFail: true,
        });
      }

      if (nextSectionIndex > SECTION_SKILLS.length) {
        const writingPrompt = getWritingPrompt(adaptedLevel);
        return res.json({
          success: true,
          isCorrect,
          newTheta,
          newLevel: adaptedLevel,
          confidence,
          mcPhaseComplete: true,
          mcLevel: adaptedLevel,
          writingPrompt,
        });
      }

      let nextSkill = SECTION_SKILLS[nextSectionIndex - 1];
      let nextQuestion = selectNextQuestion(newTheta, prevQuestions, nextSkill, allQs);

      while (!nextQuestion) {
        await storage.createBeSectionResult({
          sessionId,
          sectionName: nextSkill,
          sectionIndex: nextSectionIndex,
          questionsAttempted: 0,
          questionsCorrect: 0,
          accuracyPercentage: 0,
          cefrLevel: adaptedLevel,
          finalTheta: newTheta,
          finalStandardError: newSE,
          sectionConfidence: confidence,
        });
        nextSectionIndex++;
        advanceSection = true;
        await storage.updateBeTestSession(sessionId, { currentSectionIndex: nextSectionIndex });

        if (nextSectionIndex > SECTION_SKILLS.length) {
          const writingPrompt = getWritingPrompt(adaptedLevel);
          return res.json({
            success: true,
            isCorrect,
            newTheta,
            newLevel: adaptedLevel,
            confidence,
            mcPhaseComplete: true,
            mcLevel: adaptedLevel,
            writingPrompt,
          });
        }

        nextSkill = SECTION_SKILLS[nextSectionIndex - 1];
        nextQuestion = selectNextQuestion(newTheta, prevQuestions, nextSkill, allQs);
      }

      res.json({
        success: true,
        isCorrect,
        newTheta,
        newLevel: adaptedLevel,
        confidence,
        mcPhaseComplete: false,
        currentSectionIndex: nextSectionIndex,
        currentSkill: nextSkill,
        sectionAdvanced: advanceSection,
        question: {
          id: nextQuestion.id,
          question: nextQuestion.question,
          options: shuffleArray(JSON.parse(nextQuestion.options)),
          skillType: nextQuestion.skillType,
          level: nextQuestion.level,
          passage: nextQuestion.passage,
          audioUrl: nextQuestion.audioUrl,
        },
      });
    } catch (error) {
      console.error("Error answering English test question:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.get(`${prefix}/session/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getBeTestSession(id);
      if (!session) return res.status(404).json({ success: false, message: "Session not found" });
      res.json(session);
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post(`${prefix}/submit-writing`, async (req, res) => {
    try {
      const { sessionId, response: writtenResponse, prompt } = req.body;
      if (!sessionId) {
        return res.status(400).json({ success: false, message: "Missing sessionId" });
      }

      const session = await storage.getBeTestSession(sessionId);
      if (!session) return res.status(404).json({ success: false, message: "Session not found" });

      if (session.writingScore !== null && session.writingScore !== undefined) {
        return res.status(400).json({ success: false, message: "Writing already submitted" });
      }

      const responseText = writtenResponse || "";
      const aiResult = responseText.trim().length < 5
        ? { level: "A0", grammar: 0, vocabulary: 0, coherence: 0, taskCompletion: 0, feedback: "No writing response provided or response too short to evaluate." }
        : await scoreWriting(
            prompt || getWritingPrompt(session.currentLevel),
            responseText,
            session.currentLevel
          );

      await storage.createBeWritingSpeaking({
        sessionId,
        taskType: "writing",
        prompt: prompt || getWritingPrompt(session.currentLevel),
        response: responseText,
        aiScore: aiResult.level,
        aiGrammarScore: aiResult.grammar,
        aiVocabularyScore: aiResult.vocabulary,
        aiCoherenceScore: aiResult.coherence,
        aiTaskCompletionScore: aiResult.taskCompletion,
        aiFeedback: aiResult.feedback,
      });

      await storage.createBeSectionResult({
        sessionId,
        sectionName: "writing",
        sectionIndex: 6,
        questionsAttempted: 1,
        questionsCorrect: 1,
        accuracyPercentage: Math.round((aiResult.grammar + aiResult.vocabulary + aiResult.coherence + aiResult.taskCompletion) / 4),
        cefrLevel: aiResult.level,
        finalTheta: session.currentTheta,
        finalStandardError: session.standardError,
        sectionConfidence: session.confidenceLevel,
      });

      await storage.updateBeTestSession(sessionId, {
        writingScore: aiResult.level,
        currentSectionIndex: 7,
      });

      const speakingPrompt = getSpeakingPrompt(session.currentLevel);

      res.json({
        success: true,
        writingLevel: aiResult.level,
        writingFeedback: aiResult.feedback,
        writingScores: {
          grammar: aiResult.grammar,
          vocabulary: aiResult.vocabulary,
          coherence: aiResult.coherence,
          taskCompletion: aiResult.taskCompletion,
        },
        speakingPrompt,
      });
    } catch (error) {
      console.error("Error scoring writing:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post(`${prefix}/submit-speaking`, upload.single("audio"), async (req: any, res) => {
    try {
      const { sessionId: rawSessionId, prompt } = req.body;
      if (!rawSessionId || !req.file) {
        return res.status(400).json({ success: false, message: "Missing audio or session" });
      }

      const sessionId = parseInt(rawSessionId);
      if (isNaN(sessionId)) {
        return res.status(400).json({ success: false, message: "Invalid sessionId" });
      }

      const session = await storage.getBeTestSession(sessionId);
      if (!session) return res.status(404).json({ success: false, message: "Session not found" });

      if (session.speakingScore !== null && session.speakingScore !== undefined) {
        return res.status(400).json({ success: false, message: "Speaking already submitted" });
      }

      let transcript = "";
      try {
        transcript = await transcribeAudio(req.file.buffer, req.file.originalname || "audio.webm");
      } catch (transcribeErr) {
        console.error("Whisper transcription failed:", transcribeErr);
      }

      const aiResult = !transcript || transcript.trim().length < 3
        ? { level: "A0", grammar: 0, vocabulary: 0, coherence: 0, taskCompletion: 0, feedback: "Audio could not be transcribed or was too short to evaluate." }
        : await scoreSpeaking(
            prompt || getSpeakingPrompt(session.currentLevel),
            transcript,
            session.currentLevel
          );

      await storage.createBeWritingSpeaking({
        sessionId,
        taskType: "speaking",
        prompt: prompt || getSpeakingPrompt(session.currentLevel),
        response: transcript,
        aiScore: aiResult.level,
        aiGrammarScore: aiResult.grammar,
        aiVocabularyScore: aiResult.vocabulary,
        aiCoherenceScore: aiResult.coherence,
        aiTaskCompletionScore: aiResult.taskCompletion,
        aiFeedback: aiResult.feedback,
      });

      await storage.createBeSectionResult({
        sessionId,
        sectionName: "speaking",
        sectionIndex: 7,
        questionsAttempted: 1,
        questionsCorrect: 1,
        accuracyPercentage: Math.round((aiResult.grammar + aiResult.vocabulary + aiResult.coherence + aiResult.taskCompletion) / 4),
        cefrLevel: aiResult.level,
        finalTheta: session.currentTheta,
        finalStandardError: session.standardError,
        sectionConfidence: session.confidenceLevel,
      });

      await storage.updateBeTestSession(sessionId, {
        speakingScore: aiResult.level,
        currentSectionIndex: 8,
      });

      res.json({
        success: true,
        transcript,
        speakingLevel: aiResult.level,
        speakingFeedback: aiResult.feedback,
        speakingScores: {
          grammar: aiResult.grammar,
          vocabulary: aiResult.vocabulary,
          coherence: aiResult.coherence,
          taskCompletion: aiResult.taskCompletion,
        },
      });
    } catch (error) {
      console.error("Error scoring speaking:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post(`${prefix}/complete`, async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) return res.status(400).json({ success: false, message: "Missing sessionId" });

      const session = await storage.getBeTestSession(sessionId);
      if (!session) return res.status(404).json({ success: false, message: "Session not found" });

      if (session.writingScore === null || session.writingScore === undefined) {
        return res.status(400).json({ success: false, message: "Writing section not yet completed" });
      }
      if ((session.speakingScore === null || session.speakingScore === undefined) && !session.audioUnavailable) {
        return res.status(400).json({ success: false, message: "Speaking section not yet completed" });
      }

      const mcLevel = session.currentLevel;
      const sectionResults = await storage.getBeSectionResultsBySession(sessionId);
      const writingSpeaking = await storage.getBeWritingSpeakingBySession(sessionId);
      const writingTask = writingSpeaking.find(ws => ws.taskType === "writing");
      const speakingTask = writingSpeaking.find(ws => ws.taskType === "speaking");

      if (session.resultsEmailSentAt) {
        return res.json({
          success: true,
          message: "Already completed",
          finalLevel: session.finalLevel,
          mcLevel,
          writingLevel: writingTask?.aiScore,
          speakingLevel: speakingTask?.aiScore,
          sectionResults: sectionResults.map(s => ({
            sectionName: s.sectionName,
            cefrLevel: s.cefrLevel,
            accuracy: s.accuracyPercentage,
          })),
          writingFeedback: writingTask?.aiFeedback,
          speakingFeedback: speakingTask?.aiFeedback,
          competencyReport: {
            writing: writingTask ? {
              grammar: writingTask.aiGrammarScore,
              vocabulary: writingTask.aiVocabularyScore,
              coherence: writingTask.aiCoherenceScore,
              taskCompletion: writingTask.aiTaskCompletionScore,
            } : null,
            speaking: speakingTask ? {
              grammar: speakingTask.aiGrammarScore,
              vocabulary: speakingTask.aiVocabularyScore,
              coherence: speakingTask.aiCoherenceScore,
              taskCompletion: speakingTask.aiTaskCompletionScore,
            } : null,
          },
        });
      }

      const finalLevel = calculateFinalLevel(mcLevel, session.writingScore, session.speakingScore);

      await storage.updateBeTestSession(sessionId, {
        finalLevel,
        overallScore: finalLevel,
        status: "completed",
        completedAt: new Date(),
        resultsEmailSentAt: new Date(),
        competencyReport: JSON.stringify({
          sections: sectionResults.map(s => ({ name: s.sectionName, level: s.cefrLevel, accuracy: s.accuracyPercentage })),
          writing: writingTask ? { level: writingTask.aiScore, feedback: writingTask.aiFeedback } : null,
          speaking: speakingTask ? { level: speakingTask.aiScore, feedback: speakingTask.aiFeedback } : null,
        }),
      });

      try {
        await sendEnglishTestConfirmationEmail(session.email, session.firstName);
      } catch (e) {
        console.error("Failed to send confirmation email:", e);
      }

      try {
        await sendEnglishTestResultEmail({
          candidateName: `${session.firstName} ${session.lastName}`,
          candidateEmail: session.email,
          company: session.company,
          phone: session.phone,
          finalLevel,
          overallScore: finalLevel,
          mcAccuracy: `${session.correctAnswers}/${session.totalQuestions}`,
          writingLevel: writingTask?.aiScore || null,
          writingFeedback: writingTask?.aiFeedback || null,
          writingScores: writingTask ? {
            grammar: writingTask.aiGrammarScore ?? 0,
            vocabulary: writingTask.aiVocabularyScore ?? 0,
            coherence: writingTask.aiCoherenceScore ?? 0,
            taskCompletion: writingTask.aiTaskCompletionScore ?? 0,
          } : null,
          speakingLevel: speakingTask?.aiScore || null,
          speakingFeedback: speakingTask?.aiFeedback || null,
          speakingScores: speakingTask ? {
            grammar: speakingTask.aiGrammarScore ?? 0,
            vocabulary: speakingTask.aiVocabularyScore ?? 0,
            coherence: speakingTask.aiCoherenceScore ?? 0,
            taskCompletion: speakingTask.aiTaskCompletionScore ?? 0,
          } : null,
          sectionResults: sectionResults.map(s => ({
            sectionName: s.sectionName,
            cefrLevel: s.cefrLevel,
            accuracy: s.accuracyPercentage,
          })),
        });
      } catch (e) {
        console.error("Failed to send admin result email:", e);
      }

      res.json({
        success: true,
        finalLevel,
        mcLevel,
        writingLevel: writingTask?.aiScore,
        speakingLevel: speakingTask?.aiScore,
        sectionResults: sectionResults.map(s => ({
          sectionName: s.sectionName,
          cefrLevel: s.cefrLevel,
          accuracy: s.accuracyPercentage,
        })),
        writingFeedback: writingTask?.aiFeedback,
        speakingFeedback: speakingTask?.aiFeedback,
        competencyReport: {
          writing: writingTask ? {
            grammar: writingTask.aiGrammarScore,
            vocabulary: writingTask.aiVocabularyScore,
            coherence: writingTask.aiCoherenceScore,
            taskCompletion: writingTask.aiTaskCompletionScore,
          } : null,
          speaking: speakingTask ? {
            grammar: speakingTask.aiGrammarScore,
            vocabulary: speakingTask.aiVocabularyScore,
            coherence: speakingTask.aiCoherenceScore,
            taskCompletion: speakingTask.aiTaskCompletionScore,
          } : null,
        },
      });
    } catch (error) {
      console.error("Error completing test:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post(`${prefix}/complete-without-speaking`, async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) return res.status(400).json({ success: false, message: "Missing sessionId" });

      const session = await storage.getBeTestSession(sessionId);
      if (!session) return res.status(404).json({ success: false, message: "Session not found" });

      const mcLevel = session.currentLevel;
      const sectionResults = await storage.getBeSectionResultsBySession(sessionId);
      const writingSpeaking = await storage.getBeWritingSpeakingBySession(sessionId);
      const writingTask = writingSpeaking.find(ws => ws.taskType === "writing");

      if (session.resultsEmailSentAt) {
        return res.json({
          success: true,
          message: "Already completed",
          finalLevel: session.finalLevel,
          mcLevel,
          writingLevel: writingTask?.aiScore,
          sectionResults: sectionResults.map(s => ({
            sectionName: s.sectionName,
            cefrLevel: s.cefrLevel,
            accuracy: s.accuracyPercentage,
          })),
          writingFeedback: writingTask?.aiFeedback,
          competencyReport: {
            writing: writingTask ? {
              grammar: writingTask.aiGrammarScore,
              vocabulary: writingTask.aiVocabularyScore,
              coherence: writingTask.aiCoherenceScore,
              taskCompletion: writingTask.aiTaskCompletionScore,
            } : null,
          },
        });
      }

      await storage.updateBeTestSession(sessionId, { audioUnavailable: true });

      const finalLevel = calculateFinalLevel(mcLevel, session.writingScore, null);

      await storage.updateBeTestSession(sessionId, {
        finalLevel,
        overallScore: finalLevel,
        status: "completed",
        completedAt: new Date(),
        resultsEmailSentAt: new Date(),
        audioUnavailable: true,
      });

      try {
        await sendEnglishTestConfirmationEmail(session.email, session.firstName);
        await sendEnglishTestResultEmail({
          candidateName: `${session.firstName} ${session.lastName}`,
          candidateEmail: session.email,
          company: session.company,
          phone: session.phone,
          finalLevel,
          overallScore: finalLevel,
          mcAccuracy: `${session.correctAnswers}/${session.totalQuestions}`,
          writingLevel: writingTask?.aiScore || null,
          writingFeedback: writingTask?.aiFeedback || null,
          writingScores: writingTask ? {
            grammar: writingTask.aiGrammarScore ?? 0,
            vocabulary: writingTask.aiVocabularyScore ?? 0,
            coherence: writingTask.aiCoherenceScore ?? 0,
            taskCompletion: writingTask.aiTaskCompletionScore ?? 0,
          } : null,
          speakingLevel: null,
          speakingFeedback: null,
          speakingScores: null,
          sectionResults: sectionResults.map(s => ({
            sectionName: s.sectionName,
            cefrLevel: s.cefrLevel,
            accuracy: s.accuracyPercentage,
          })),
        });
      } catch (e) {
        console.error("Failed to send emails:", e);
      }

      res.json({
        success: true,
        finalLevel,
        mcLevel,
        writingLevel: writingTask?.aiScore,
        writingFeedback: writingTask?.aiFeedback,
        sectionResults: sectionResults.map(s => ({
          sectionName: s.sectionName,
          cefrLevel: s.cefrLevel,
          accuracy: s.accuracyPercentage,
        })),
        competencyReport: {
          writing: writingTask ? {
            grammar: writingTask.aiGrammarScore,
            vocabulary: writingTask.aiVocabularyScore,
            coherence: writingTask.aiCoherenceScore,
            taskCompletion: writingTask.aiTaskCompletionScore,
          } : null,
        },
      });
    } catch (error) {
      console.error("Error completing without speaking:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  } // end registerTestRoutes

  registerTestRoutes("/api/english-test", "general", MAX_QUESTIONS_PER_SECTION);

  function registerAdminTestResultRoutes(adminPrefix: string, testType: string) {
    app.get(adminPrefix, requireAdmin, async (_req, res) => {
      try {
        const sessions = await storage.getBeTestSessionsByType(testType);
        res.json(sessions);
      } catch (error) {
        console.error(`Error fetching ${testType} test results:`, error);
        res.status(500).json({ success: false, message: "Server error" });
      }
    });

    app.get(`${adminPrefix}/:id`, requireAdmin, async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const session = await storage.getBeTestSession(id);
        if (!session) return res.status(404).json({ success: false, message: "Session not found" });
        if (session.testType !== testType) return res.status(404).json({ success: false, message: "Session not found" });

        const responses = await storage.getBeResponsesBySession(id);
        const sectionResults = await storage.getBeSectionResultsBySession(id);
        const writingSpeaking = await storage.getBeWritingSpeakingBySession(id);

        const allQuestions = await storage.getBeQuestions();
        const enrichedResponses = responses.map(r => {
          const q = allQuestions.find(qq => qq.id === r.questionId);
          return {
            ...r,
            question: q?.question,
            correctAnswer: q?.correctAnswer,
            skillType: q?.skillType,
            level: q?.level,
          };
        });

        res.json({
          session,
          responses: enrichedResponses,
          sectionResults,
          writingSpeaking,
        });
      } catch (error) {
        console.error(`Error fetching ${testType} test result detail:`, error);
        res.status(500).json({ success: false, message: "Server error" });
      }
    });
  }

  registerAdminTestResultRoutes("/api/admin/english-test-results", "general");

  return httpServer;
}


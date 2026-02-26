import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema, insertCookieConsentSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendContactNotification, sendContactConfirmation, sendNewsletterConfirmation } from "./email";
import { forwardToCRM } from "./crm";
import { generateBlogPost } from "./blog-generator";
import { chatWithAI } from "./ai-chat";
import cron from "node-cron";
import crypto from "crypto";

const adminSessions = new Map<string, { createdAt: number; userId: string; role: string }>();
const ADMIN_SESSION_DURATION = 4 * 60 * 60 * 1000;

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
        return res.status(400).json({ success: false, message: "Username e password sono obbligatori" });
      }
      const user = await storage.getUserByUsername(username);
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
      const { username, password, name, role } = req.body;
      if (!username || !password || !name) {
        return res.status(400).json({ success: false, message: "Tutti i campi sono obbligatori" });
      }
      if (username.length < 3) {
        return res.status(400).json({ success: false, message: "Username deve avere almeno 3 caratteri" });
      }
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: "La password deve avere almeno 6 caratteri" });
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
      const { name, role, active, password } = req.body;
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (role !== undefined) updateData.role = role === "admin" ? "admin" : "staff";
      if (active !== undefined) updateData.active = active;
      if (password) updateData.password = await bcrypt.hash(password, 10);
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
      const { name, email, password, subscriptionStart, subscriptionEnd } = req.body;
      if (!name || !email || !password || !subscriptionStart || !subscriptionEnd) {
        return res.status(400).json({ success: false, message: "Tutti i campi sono obbligatori" });
      }

      const existing = await storage.getScSubscriberByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: "Email già registrata" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const subscriber = await storage.createScSubscriber({
        name,
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
      const { name, email, subscriptionStart, subscriptionEnd, active, password } = req.body;
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (subscriptionStart !== undefined) updateData.subscriptionStart = subscriptionStart;
      if (subscriptionEnd !== undefined) updateData.subscriptionEnd = subscriptionEnd;
      if (active !== undefined) updateData.active = active;
      if (password) updateData.password = await bcrypt.hash(password, 10);

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

  return httpServer;
}

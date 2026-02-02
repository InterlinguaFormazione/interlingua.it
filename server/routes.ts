import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema } from "@shared/schema";
import { z } from "zod";

const GOOGLE_PLACE_ID = "ChIJDWsIWn0xf0cR9w29gPorTls";
let reviewsCache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
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
      const validatedData = insertNewsletterSchema.parse(req.body);
      
      const existing = await storage.getNewsletterSubscriptionByEmail(validatedData.email);
      if (existing) {
        res.status(200).json({ 
          success: true, 
          message: "Already subscribed",
          id: existing.id 
        });
        return;
      }
      
      const subscription = await storage.createNewsletterSubscription(validatedData);
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
      // Check cache first
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

      // Update cache
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

  return httpServer;
}

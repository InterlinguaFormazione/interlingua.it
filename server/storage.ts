import { 
  type User, 
  type InsertUser, 
  type ContactSubmission, 
  type InsertContact,
  type NewsletterSubscription,
  type InsertNewsletter,
  type ScSubscriber,
  type InsertScSubscriber,
  type ScSession,
  type InsertScSession,
  type ScBooking,
  type InsertScBooking,
  type ScEmailSettings,
  scSubscribers,
  scSessions,
  scBookings,
  scEmailSettings,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, gte, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContactSubmission(contact: InsertContact): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  createNewsletterSubscription(newsletter: InsertNewsletter): Promise<NewsletterSubscription>;
  getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined>;
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;

  createScSubscriber(subscriber: InsertScSubscriber): Promise<ScSubscriber>;
  getScSubscriberByEmail(email: string): Promise<ScSubscriber | undefined>;
  getScSubscriberById(id: string): Promise<ScSubscriber | undefined>;
  getActiveScSubscribers(): Promise<ScSubscriber[]>;
  getAllScSubscribers(): Promise<ScSubscriber[]>;
  updateScSubscriber(id: string, data: Partial<InsertScSubscriber>): Promise<ScSubscriber | undefined>;

  createScSession(session: InsertScSession): Promise<ScSession>;
  getScSessionById(id: string): Promise<ScSession | undefined>;
  getUpcomingScSessions(): Promise<ScSession[]>;
  getAllScSessions(): Promise<ScSession[]>;
  updateScSession(id: string, data: Partial<InsertScSession>): Promise<ScSession | undefined>;

  createScBooking(booking: InsertScBooking): Promise<ScBooking>;
  getScBookingsBySession(sessionId: string): Promise<ScBooking[]>;
  getScBookingsBySubscriber(subscriberId: string): Promise<ScBooking[]>;
  getScBooking(subscriberId: string, sessionId: string): Promise<ScBooking | undefined>;
  deleteScBooking(id: string): Promise<void>;

  getScEmailSettings(): Promise<ScEmailSettings>;
  updateScEmailSettings(suspended: boolean, reason?: string): Promise<ScEmailSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private newsletterSubscriptions: Map<string, NewsletterSubscription>;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.newsletterSubscriptions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactSubmission(contact: InsertContact): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      ...contact,
      id,
      phone: contact.phone || null,
      courseInterest: contact.courseInterest || null,
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createNewsletterSubscription(newsletter: InsertNewsletter): Promise<NewsletterSubscription> {
    const existing = await this.getNewsletterSubscriptionByEmail(newsletter.email);
    if (existing) {
      return existing;
    }
    
    const id = randomUUID();
    const subscription: NewsletterSubscription = {
      ...newsletter,
      id,
      subscribed: true,
      createdAt: new Date(),
    };
    this.newsletterSubscriptions.set(id, subscription);
    return subscription;
  }

  async getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined> {
    return Array.from(this.newsletterSubscriptions.values()).find(
      (sub) => sub.email === email
    );
  }

  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createScSubscriber(subscriber: InsertScSubscriber): Promise<ScSubscriber> {
    const [result] = await db.insert(scSubscribers).values(subscriber).returning();
    return result;
  }

  async getScSubscriberByEmail(email: string): Promise<ScSubscriber | undefined> {
    const result = await db.select().from(scSubscribers).where(eq(scSubscribers.email, email));
    return result[0];
  }

  async getScSubscriberById(id: string): Promise<ScSubscriber | undefined> {
    const result = await db.select().from(scSubscribers).where(eq(scSubscribers.id, id));
    return result[0];
  }

  async getActiveScSubscribers(): Promise<ScSubscriber[]> {
    const today = new Date().toISOString().split('T')[0];
    return db.select().from(scSubscribers).where(
      and(
        eq(scSubscribers.active, true),
        gte(scSubscribers.subscriptionEnd, today)
      )
    );
  }

  async getAllScSubscribers(): Promise<ScSubscriber[]> {
    return db.select().from(scSubscribers).orderBy(desc(scSubscribers.createdAt));
  }

  async updateScSubscriber(id: string, data: Partial<InsertScSubscriber>): Promise<ScSubscriber | undefined> {
    const [result] = await db.update(scSubscribers).set(data).where(eq(scSubscribers.id, id)).returning();
    return result;
  }

  async createScSession(session: InsertScSession): Promise<ScSession> {
    const [result] = await db.insert(scSessions).values(session).returning();
    return result;
  }

  async getScSessionById(id: string): Promise<ScSession | undefined> {
    const result = await db.select().from(scSessions).where(eq(scSessions.id, id));
    return result[0];
  }

  async getUpcomingScSessions(): Promise<ScSession[]> {
    const today = new Date().toISOString().split('T')[0];
    return db.select().from(scSessions).where(
      and(
        gte(scSessions.sessionDate, today),
        eq(scSessions.status, "active")
      )
    ).orderBy(scSessions.sessionDate);
  }

  async getAllScSessions(): Promise<ScSession[]> {
    return db.select().from(scSessions).orderBy(desc(scSessions.sessionDate));
  }

  async updateScSession(id: string, data: Partial<InsertScSession>): Promise<ScSession | undefined> {
    const [result] = await db.update(scSessions).set(data).where(eq(scSessions.id, id)).returning();
    return result;
  }

  async createScBooking(booking: InsertScBooking): Promise<ScBooking> {
    const [result] = await db.insert(scBookings).values(booking).returning();
    return result;
  }

  async getScBookingsBySession(sessionId: string): Promise<ScBooking[]> {
    return db.select().from(scBookings).where(eq(scBookings.sessionId, sessionId));
  }

  async getScBookingsBySubscriber(subscriberId: string): Promise<ScBooking[]> {
    return db.select().from(scBookings).where(eq(scBookings.subscriberId, subscriberId));
  }

  async getScBooking(subscriberId: string, sessionId: string): Promise<ScBooking | undefined> {
    const result = await db.select().from(scBookings).where(
      and(
        eq(scBookings.subscriberId, subscriberId),
        eq(scBookings.sessionId, sessionId)
      )
    );
    return result[0];
  }

  async deleteScBooking(id: string): Promise<void> {
    await db.delete(scBookings).where(eq(scBookings.id, id));
  }

  async getScEmailSettings(): Promise<ScEmailSettings> {
    const result = await db.select().from(scEmailSettings);
    if (result.length === 0) {
      const [created] = await db.insert(scEmailSettings).values({
        emailsSuspended: false,
        suspensionReason: null,
      }).returning();
      return created;
    }
    return result[0];
  }

  async updateScEmailSettings(suspended: boolean, reason?: string): Promise<ScEmailSettings> {
    const settings = await this.getScEmailSettings();
    const [result] = await db.update(scEmailSettings).set({
      emailsSuspended: suspended,
      suspensionReason: reason || null,
      updatedAt: new Date(),
    }).where(eq(scEmailSettings.id, settings.id)).returning();
    return result;
  }
}

export const storage = new MemStorage();

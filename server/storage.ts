import { 
  type User, 
  type InsertUser, 
  type ContactSubmission, 
  type InsertContact,
  type NewsletterSubscription,
  type InsertNewsletter,
  type CookieConsent,
  type InsertCookieConsent,
  type BlogPost,
  type InsertBlogPost,
  type ScSubscriber,
  type InsertScSubscriber,
  type ScSession,
  type InsertScSession,
  type ScBooking,
  type InsertScBooking,
  type ScEmailSettings,
  type ScPayment,
  type InsertScPayment,
  type ShopCustomer,
  type InsertShopCustomer,
  type ShopOrder,
  type InsertShopOrder,
  type CourseMaterial,
  type InsertCourseMaterial,
  type EnglishTestResult,
  type InsertEnglishTestResult,
  users,
  contactSubmissions,
  newsletterSubscriptions,
  cookieConsents,
  blogPosts,
  scSubscribers,
  scSessions,
  scBookings,
  scEmailSettings,
  scPayments,
  shopCustomers,
  shopOrders,
  courseMaterials,
  englishTestResults,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;
  
  createContactSubmission(contact: InsertContact): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  createNewsletterSubscription(newsletter: InsertNewsletter): Promise<NewsletterSubscription>;
  getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined>;
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;

  createCookieConsent(consent: InsertCookieConsent): Promise<CookieConsent>;
  getCookieConsents(): Promise<CookieConsent[]>;

  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getLatestBlogPost(): Promise<BlogPost | undefined>;

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

  createScPayment(payment: InsertScPayment): Promise<ScPayment>;
  getScPayments(): Promise<ScPayment[]>;
  getScPaymentByOrderId(paypalOrderId: string): Promise<ScPayment | undefined>;
  updateScPaymentStatus(id: string, status: string): Promise<ScPayment | undefined>;

  createShopCustomer(customer: InsertShopCustomer): Promise<ShopCustomer>;
  getShopCustomerByEmail(email: string): Promise<ShopCustomer | undefined>;
  getShopCustomerById(id: string): Promise<ShopCustomer | undefined>;
  getAllShopCustomers(): Promise<ShopCustomer[]>;

  createShopOrder(order: InsertShopOrder): Promise<ShopOrder>;
  getShopOrders(): Promise<ShopOrder[]>;
  getShopOrdersByCustomerId(customerId: string): Promise<ShopOrder[]>;
  getShopOrderByPaypalId(paypalOrderId: string): Promise<ShopOrder | undefined>;
  updateShopOrderStatus(id: string, status: string): Promise<ShopOrder | undefined>;

  createCourseMaterial(material: InsertCourseMaterial): Promise<CourseMaterial>;
  getCourseMaterialsBySlug(productSlug: string): Promise<CourseMaterial[]>;
  getAllCourseMaterials(): Promise<CourseMaterial[]>;
  deleteCourseMaterial(id: string): Promise<void>;

  createEnglishTestResult(result: InsertEnglishTestResult): Promise<EnglishTestResult>;
  getEnglishTestResults(): Promise<EnglishTestResult[]>;
  getEnglishTestResultById(id: string): Promise<EnglishTestResult | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async createContactSubmission(contact: InsertContact): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions).values(contact).returning();
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async createNewsletterSubscription(newsletter: InsertNewsletter): Promise<NewsletterSubscription> {
    const [subscription] = await db.insert(newsletterSubscriptions).values(newsletter).returning();
    return subscription;
  }

  async getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined> {
    const [subscription] = await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email));
    return subscription;
  }

  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return db.select().from(newsletterSubscriptions).orderBy(desc(newsletterSubscriptions.createdAt));
  }

  async createCookieConsent(consent: InsertCookieConsent): Promise<CookieConsent> {
    const [record] = await db.insert(cookieConsents).values(consent).returning();
    return record;
  }

  async getCookieConsents(): Promise<CookieConsent[]> {
    return db.select().from(cookieConsents).orderBy(desc(cookieConsents.createdAt));
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [blogPost] = await db.insert(blogPosts).values(post).returning();
    return blogPost;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getLatestBlogPost(): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).limit(1);
    return post;
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
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const toLocalDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const today = toLocalDate(now);
    const dayOfWeek = now.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday);
    const endOfWeekStr = toLocalDate(endOfWeek);
    return db.select().from(scSessions).where(
      and(
        gte(scSessions.sessionDate, today),
        lte(scSessions.sessionDate, endOfWeekStr),
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

  async createScPayment(payment: InsertScPayment): Promise<ScPayment> {
    const [result] = await db.insert(scPayments).values(payment).returning();
    return result;
  }

  async getScPayments(): Promise<ScPayment[]> {
    return db.select().from(scPayments).orderBy(desc(scPayments.createdAt));
  }

  async getScPaymentByOrderId(paypalOrderId: string): Promise<ScPayment | undefined> {
    const [result] = await db.select().from(scPayments).where(eq(scPayments.paypalOrderId, paypalOrderId));
    return result;
  }

  async updateScPaymentStatus(id: string, status: string): Promise<ScPayment | undefined> {
    const [result] = await db.update(scPayments).set({ status }).where(eq(scPayments.id, id)).returning();
    return result;
  }

  async createShopCustomer(customer: InsertShopCustomer): Promise<ShopCustomer> {
    const [result] = await db.insert(shopCustomers).values(customer).returning();
    return result;
  }

  async getShopCustomerByEmail(email: string): Promise<ShopCustomer | undefined> {
    const [result] = await db.select().from(shopCustomers).where(eq(shopCustomers.email, email));
    return result;
  }

  async getShopCustomerById(id: string): Promise<ShopCustomer | undefined> {
    const [result] = await db.select().from(shopCustomers).where(eq(shopCustomers.id, id));
    return result;
  }

  async getAllShopCustomers(): Promise<ShopCustomer[]> {
    return db.select().from(shopCustomers).orderBy(desc(shopCustomers.createdAt));
  }

  async createShopOrder(order: InsertShopOrder): Promise<ShopOrder> {
    const [result] = await db.insert(shopOrders).values(order).returning();
    return result;
  }

  async getShopOrders(): Promise<ShopOrder[]> {
    return db.select().from(shopOrders).orderBy(desc(shopOrders.createdAt));
  }

  async getShopOrdersByCustomerId(customerId: string): Promise<ShopOrder[]> {
    return db.select().from(shopOrders).where(eq(shopOrders.customerId, customerId)).orderBy(desc(shopOrders.createdAt));
  }

  async getShopOrderByPaypalId(paypalOrderId: string): Promise<ShopOrder | undefined> {
    const [result] = await db.select().from(shopOrders).where(eq(shopOrders.paypalOrderId, paypalOrderId));
    return result;
  }

  async updateShopOrderStatus(id: string, status: string): Promise<ShopOrder | undefined> {
    const [result] = await db.update(shopOrders).set({ status }).where(eq(shopOrders.id, id)).returning();
    return result;
  }

  async createCourseMaterial(material: InsertCourseMaterial): Promise<CourseMaterial> {
    const [result] = await db.insert(courseMaterials).values(material).returning();
    return result;
  }

  async getCourseMaterialsBySlug(productSlug: string): Promise<CourseMaterial[]> {
    return db.select().from(courseMaterials).where(eq(courseMaterials.productSlug, productSlug)).orderBy(desc(courseMaterials.createdAt));
  }

  async getAllCourseMaterials(): Promise<CourseMaterial[]> {
    return db.select().from(courseMaterials).orderBy(desc(courseMaterials.createdAt));
  }

  async deleteCourseMaterial(id: string): Promise<void> {
    await db.delete(courseMaterials).where(eq(courseMaterials.id, id));
  }

  async createEnglishTestResult(data: InsertEnglishTestResult): Promise<EnglishTestResult> {
    const [result] = await db.insert(englishTestResults).values(data).returning();
    return result;
  }

  async getEnglishTestResults(): Promise<EnglishTestResult[]> {
    return db.select().from(englishTestResults).orderBy(desc(englishTestResults.completedAt));
  }

  async getEnglishTestResultById(id: string): Promise<EnglishTestResult | undefined> {
    const [result] = await db.select().from(englishTestResults).where(eq(englishTestResults.id, id));
    return result;
  }
}

export const storage = new DatabaseStorage();

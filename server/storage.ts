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
  type BeTestSession,
  type InsertBeTestSession,
  type BeQuestion,
  type InsertBeQuestion,
  type BeResponse,
  type InsertBeResponse,
  type BeWritingSpeaking,
  type InsertBeWritingSpeaking,
  type BeSectionResult,
  type InsertBeSectionResult,
  type DiscountVoucher,
  type InsertDiscountVoucher,
  type ProductReview,
  type InsertProductReview,
  type BlogComment,
  type InsertBlogComment,
  type Convention,
  type InsertConvention,
  type ConventionRegistration,
  type InsertConventionRegistration,
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
  beTestSessions,
  beQuestions,
  beResponses,
  beWritingSpeaking,
  beSectionResults,
  discountVouchers,
  productReviews,
  blogComments,
  conventions,
  conventionRegistrations,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

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
  unsubscribeNewsletter(email: string): Promise<boolean>;
  updateNewsletterStatus(id: string, subscribed: boolean): Promise<boolean>;
  isActiveNewsletterSubscriber(email: string): Promise<boolean>;

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
  deleteScSubscriber(id: string): Promise<boolean>;

  createScSession(session: InsertScSession): Promise<ScSession>;
  getScSessionById(id: string): Promise<ScSession | undefined>;
  getUpcomingScSessions(): Promise<ScSession[]>;
  getAllScSessions(): Promise<ScSession[]>;
  updateScSession(id: string, data: Partial<InsertScSession>): Promise<ScSession | undefined>;

  getAllScBookings(): Promise<ScBooking[]>;
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
  updateShopCustomer(id: string, data: Partial<{ email: string; firstName: string; lastName: string; phone: string; password: string; codiceFiscale: string; indirizzo: string; cap: string; citta: string; provincia: string }>): Promise<ShopCustomer | undefined>;
  updateOrdersEmail(customerId: string, newEmail: string): Promise<void>;

  createShopOrder(order: InsertShopOrder): Promise<ShopOrder>;
  getShopOrders(): Promise<ShopOrder[]>;
  getShopOrdersByCustomerId(customerId: string): Promise<ShopOrder[]>;
  getShopOrderByPaypalId(paypalOrderId: string): Promise<ShopOrder | undefined>;
  updateShopOrderStatus(id: string, status: string): Promise<ShopOrder | undefined>;
  updateShopOrderNotes(id: string, adminNotes: string): Promise<ShopOrder | undefined>;
  updateShopOrderInvoice(id: string, invoiceNumber: string, invoiceDate: Date): Promise<ShopOrder | undefined>;
  markInvoiceSent(id: string): Promise<ShopOrder | undefined>;
  getNextInvoiceSequence(year: number): Promise<number>;
  getShopOrderById(id: string): Promise<ShopOrder | undefined>;
  hasCompletedOrdersByEmail(email: string): Promise<boolean>;

  createCourseMaterial(material: InsertCourseMaterial): Promise<CourseMaterial>;
  getCourseMaterialsBySlug(productSlug: string): Promise<CourseMaterial[]>;
  getAllCourseMaterials(): Promise<CourseMaterial[]>;
  deleteCourseMaterial(id: string): Promise<void>;

  createEnglishTestResult(result: InsertEnglishTestResult): Promise<EnglishTestResult>;
  getEnglishTestResults(): Promise<EnglishTestResult[]>;
  getEnglishTestResultById(id: string): Promise<EnglishTestResult | undefined>;

  createBeTestSession(session: InsertBeTestSession): Promise<BeTestSession>;
  getBeTestSession(id: number): Promise<BeTestSession | undefined>;
  updateBeTestSession(id: number, data: Partial<BeTestSession>): Promise<BeTestSession | undefined>;
  getBeTestSessions(): Promise<BeTestSession[]>;
  getBeTestSessionsByType(testType: string): Promise<BeTestSession[]>;
  deleteBeTestSession(id: number): Promise<void>;

  createBeQuestion(question: InsertBeQuestion): Promise<BeQuestion>;
  getBeQuestions(): Promise<BeQuestion[]>;
  getBeQuestionsByLanguage(language: string): Promise<BeQuestion[]>;
  getBeQuestionsBySkillAndLevel(skillType: string, level: string): Promise<BeQuestion[]>;
  getBeQuestionById(id: number): Promise<BeQuestion | undefined>;
  getBeQuestionCount(): Promise<number>;
  getBeQuestionCountByLanguage(language: string): Promise<number>;
  updateBeQuestionAudioUrl(id: number, audioUrl: string): Promise<void>;

  createBeResponse(response: InsertBeResponse): Promise<BeResponse>;
  getBeResponsesBySession(sessionId: number): Promise<BeResponse[]>;

  createBeWritingSpeaking(ws: InsertBeWritingSpeaking): Promise<BeWritingSpeaking>;
  getBeWritingSpeakingBySession(sessionId: number): Promise<BeWritingSpeaking[]>;

  createBeSectionResult(result: InsertBeSectionResult): Promise<BeSectionResult>;
  getBeSectionResultsBySession(sessionId: number): Promise<BeSectionResult[]>;

  createDiscountVoucher(voucher: InsertDiscountVoucher): Promise<DiscountVoucher>;
  getDiscountVouchers(): Promise<DiscountVoucher[]>;
  getDiscountVoucherByCode(code: string): Promise<DiscountVoucher | undefined>;
  getDiscountVoucherById(id: string): Promise<DiscountVoucher | undefined>;
  getAutoApplyVouchers(): Promise<DiscountVoucher[]>;
  updateDiscountVoucher(id: string, data: Partial<InsertDiscountVoucher>): Promise<DiscountVoucher | undefined>;
  deleteDiscountVoucher(id: string): Promise<void>;
  incrementVoucherUsage(id: string): Promise<void>;

  createProductReview(review: InsertProductReview): Promise<ProductReview>;
  getProductReviewsBySlug(productSlug: string): Promise<ProductReview[]>;
  getApprovedReviewsBySlug(productSlug: string): Promise<ProductReview[]>;
  getAllProductReviews(): Promise<ProductReview[]>;
  updateProductReview(id: string, data: Partial<{ approved: boolean; verified: boolean }>): Promise<ProductReview | undefined>;
  deleteProductReview(id: string): Promise<void>;

  createBlogComment(comment: InsertBlogComment): Promise<BlogComment>;
  getBlogCommentsBySlug(blogSlug: string): Promise<BlogComment[]>;
  getAllBlogComments(): Promise<BlogComment[]>;
  deleteBlogComment(id: string): Promise<void>;

  createConvention(convention: InsertConvention): Promise<Convention>;
  getConventions(): Promise<Convention[]>;
  getConventionById(id: string): Promise<Convention | undefined>;
  getConventionByCode(code: string): Promise<Convention | undefined>;
  updateConvention(id: string, data: Partial<InsertConvention>): Promise<Convention | undefined>;
  deleteConvention(id: string): Promise<void>;
  createConventionRegistration(registration: InsertConventionRegistration): Promise<ConventionRegistration>;
  getConventionRegistrations(): Promise<ConventionRegistration[]>;
  getRegistrationsByConvention(conventionId: string): Promise<ConventionRegistration[]>;
  getRegistrationByEmail(conventionId: string, email: string): Promise<ConventionRegistration | undefined>;
  getRegistrationsByCustomerEmail(email: string): Promise<Array<{ registration: ConventionRegistration; convention: Convention }>>;
  getRegistrationCountByConvention(conventionId: string): Promise<number>;
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

  async unsubscribeNewsletter(email: string): Promise<boolean> {
    const results = await db.update(newsletterSubscriptions)
      .set({ subscribed: false })
      .where(eq(newsletterSubscriptions.email, email))
      .returning();
    return results.length > 0;
  }

  async updateNewsletterStatus(id: string, subscribed: boolean): Promise<boolean> {
    const results = await db.update(newsletterSubscriptions)
      .set({ subscribed })
      .where(eq(newsletterSubscriptions.id, id))
      .returning();
    return results.length > 0;
  }

  async isActiveNewsletterSubscriber(email: string): Promise<boolean> {
    const [sub] = await db.select({ subscribed: newsletterSubscriptions.subscribed })
      .from(newsletterSubscriptions)
      .where(and(eq(newsletterSubscriptions.email, email), eq(newsletterSubscriptions.subscribed, true)))
      .limit(1);
    return !!sub;
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

  async deleteScSubscriber(id: string): Promise<boolean> {
    await db.delete(scBookings).where(eq(scBookings.subscriberId, id));
    const result = await db.delete(scSubscribers).where(eq(scSubscribers.id, id)).returning();
    return result.length > 0;
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

  async getAllScBookings(): Promise<ScBooking[]> {
    return db.select().from(scBookings);
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

  async updateShopCustomer(id: string, data: Partial<{ email: string; firstName: string; lastName: string; phone: string; password: string; codiceFiscale: string; indirizzo: string; cap: string; citta: string; provincia: string }>): Promise<ShopCustomer | undefined> {
    const updateData: Record<string, string> = {};
    if (data.email !== undefined) updateData.email = data.email;
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.password !== undefined) updateData.password = data.password;
    if (data.codiceFiscale !== undefined) updateData.codiceFiscale = data.codiceFiscale;
    if (data.indirizzo !== undefined) updateData.indirizzo = data.indirizzo;
    if (data.cap !== undefined) updateData.cap = data.cap;
    if (data.citta !== undefined) updateData.citta = data.citta;
    if (data.provincia !== undefined) updateData.provincia = data.provincia;
    const [result] = await db.update(shopCustomers).set(updateData).where(eq(shopCustomers.id, id)).returning();
    return result;
  }

  async updateOrdersEmail(customerId: string, newEmail: string): Promise<void> {
    await db.update(shopOrders)
      .set({ customerEmail: newEmail })
      .where(eq(shopOrders.customerId, customerId));
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

  async updateShopOrderNotes(id: string, adminNotes: string): Promise<ShopOrder | undefined> {
    const [result] = await db.update(shopOrders).set({ adminNotes }).where(eq(shopOrders.id, id)).returning();
    return result;
  }

  async updateShopOrderInvoice(id: string, invoiceNumber: string, invoiceDate: Date): Promise<ShopOrder | undefined> {
    const [result] = await db.update(shopOrders).set({ invoiceNumber, invoiceDate }).where(eq(shopOrders.id, id)).returning();
    return result;
  }

  async markInvoiceSent(id: string): Promise<ShopOrder | undefined> {
    const [result] = await db.update(shopOrders).set({ invoiceSent: true }).where(eq(shopOrders.id, id)).returning();
    return result;
  }

  async getNextInvoiceSequence(year: number): Promise<number> {
    const yearPattern = `/${year}`;
    const results = await db.select({ invoiceNumber: shopOrders.invoiceNumber })
      .from(shopOrders)
      .where(sql`${shopOrders.invoiceNumber} LIKE ${'%' + yearPattern}`);
    let maxSeq = 0;
    for (const r of results) {
      if (r.invoiceNumber) {
        const num = parseInt(r.invoiceNumber.split("/")[0].replace(/\D/g, ""), 10);
        if (!isNaN(num) && num > maxSeq) maxSeq = num;
      }
    }
    return maxSeq + 1;
  }

  async getShopOrderById(id: string): Promise<ShopOrder | undefined> {
    const [result] = await db.select().from(shopOrders).where(eq(shopOrders.id, id));
    return result;
  }

  async hasCompletedOrdersByEmail(email: string): Promise<boolean> {
    const results = await db.select({ id: shopOrders.id }).from(shopOrders)
      .where(and(eq(shopOrders.customerEmail, email), eq(shopOrders.status, "completed")))
      .limit(1);
    return results.length > 0;
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

  async createBeTestSession(session: InsertBeTestSession): Promise<BeTestSession> {
    const [result] = await db.insert(beTestSessions).values(session).returning();
    return result;
  }

  async getBeTestSession(id: number): Promise<BeTestSession | undefined> {
    const [result] = await db.select().from(beTestSessions).where(eq(beTestSessions.id, id));
    return result;
  }

  async updateBeTestSession(id: number, data: Partial<BeTestSession>): Promise<BeTestSession | undefined> {
    const [result] = await db.update(beTestSessions).set(data).where(eq(beTestSessions.id, id)).returning();
    return result;
  }

  async getBeTestSessions(): Promise<BeTestSession[]> {
    return db.select().from(beTestSessions).orderBy(desc(beTestSessions.startedAt));
  }

  async getBeTestSessionsByType(testType: string): Promise<BeTestSession[]> {
    return db.select().from(beTestSessions).where(eq(beTestSessions.testType, testType)).orderBy(desc(beTestSessions.startedAt));
  }

  async deleteBeTestSession(id: number): Promise<void> {
    await db.delete(beResponses).where(eq(beResponses.sessionId, id));
    await db.delete(beWritingSpeaking).where(eq(beWritingSpeaking.sessionId, id));
    await db.delete(beSectionResults).where(eq(beSectionResults.sessionId, id));
    await db.delete(beTestSessions).where(eq(beTestSessions.id, id));
  }

  async createBeQuestion(question: InsertBeQuestion): Promise<BeQuestion> {
    const [result] = await db.insert(beQuestions).values(question).returning();
    return result;
  }

  async getBeQuestions(): Promise<BeQuestion[]> {
    return db.select().from(beQuestions);
  }

  async getBeQuestionsByLanguage(language: string): Promise<BeQuestion[]> {
    return db.select().from(beQuestions).where(eq(beQuestions.language, language));
  }

  async getBeQuestionsBySkillAndLevel(skillType: string, level: string): Promise<BeQuestion[]> {
    return db.select().from(beQuestions).where(and(eq(beQuestions.skillType, skillType), eq(beQuestions.level, level)));
  }

  async getBeQuestionById(id: number): Promise<BeQuestion | undefined> {
    const [result] = await db.select().from(beQuestions).where(eq(beQuestions.id, id));
    return result;
  }

  async getBeQuestionCount(): Promise<number> {
    const results = await db.select().from(beQuestions);
    return results.length;
  }

  async getBeQuestionCountByLanguage(language: string): Promise<number> {
    const results = await db.select().from(beQuestions).where(eq(beQuestions.language, language));
    return results.length;
  }

  async updateBeQuestionAudioUrl(id: number, audioUrl: string): Promise<void> {
    await db.update(beQuestions).set({ audioUrl }).where(eq(beQuestions.id, id));
  }

  async createBeResponse(response: InsertBeResponse): Promise<BeResponse> {
    const [result] = await db.insert(beResponses).values(response).returning();
    return result;
  }

  async getBeResponsesBySession(sessionId: number): Promise<BeResponse[]> {
    return db.select().from(beResponses).where(eq(beResponses.sessionId, sessionId)).orderBy(beResponses.answeredAt);
  }

  async createBeWritingSpeaking(ws: InsertBeWritingSpeaking): Promise<BeWritingSpeaking> {
    const [result] = await db.insert(beWritingSpeaking).values(ws).returning();
    return result;
  }

  async getBeWritingSpeakingBySession(sessionId: number): Promise<BeWritingSpeaking[]> {
    return db.select().from(beWritingSpeaking).where(eq(beWritingSpeaking.sessionId, sessionId));
  }

  async createBeSectionResult(result: InsertBeSectionResult): Promise<BeSectionResult> {
    const [r] = await db.insert(beSectionResults).values(result).returning();
    return r;
  }

  async getBeSectionResultsBySession(sessionId: number): Promise<BeSectionResult[]> {
    return db.select().from(beSectionResults).where(eq(beSectionResults.sessionId, sessionId)).orderBy(beSectionResults.sectionIndex);
  }

  async createDiscountVoucher(voucher: InsertDiscountVoucher): Promise<DiscountVoucher> {
    const [result] = await db.insert(discountVouchers).values(voucher).returning();
    return result;
  }

  async getDiscountVouchers(): Promise<DiscountVoucher[]> {
    return db.select().from(discountVouchers).orderBy(desc(discountVouchers.createdAt));
  }

  async getDiscountVoucherByCode(code: string): Promise<DiscountVoucher | undefined> {
    const [result] = await db.select().from(discountVouchers).where(eq(discountVouchers.code, code.toUpperCase()));
    return result;
  }

  async getDiscountVoucherById(id: string): Promise<DiscountVoucher | undefined> {
    const [result] = await db.select().from(discountVouchers).where(eq(discountVouchers.id, id));
    return result;
  }

  async getAutoApplyVouchers(): Promise<DiscountVoucher[]> {
    return db.select().from(discountVouchers).where(
      and(eq(discountVouchers.active, true), eq(discountVouchers.autoApply, true))
    );
  }

  async updateDiscountVoucher(id: string, data: Partial<InsertDiscountVoucher>): Promise<DiscountVoucher | undefined> {
    const [result] = await db.update(discountVouchers).set(data).where(eq(discountVouchers.id, id)).returning();
    return result;
  }

  async deleteDiscountVoucher(id: string): Promise<void> {
    await db.delete(discountVouchers).where(eq(discountVouchers.id, id));
  }

  async incrementVoucherUsage(id: string): Promise<void> {
    await db.update(discountVouchers)
      .set({ usedCount: sql`COALESCE(${discountVouchers.usedCount}, 0) + 1` })
      .where(eq(discountVouchers.id, id));
  }

  async createProductReview(review: InsertProductReview): Promise<ProductReview> {
    const [result] = await db.insert(productReviews).values(review).returning();
    return result;
  }

  async getProductReviewsBySlug(productSlug: string): Promise<ProductReview[]> {
    return db.select().from(productReviews)
      .where(eq(productReviews.productSlug, productSlug))
      .orderBy(desc(productReviews.createdAt));
  }

  async getApprovedReviewsBySlug(productSlug: string): Promise<ProductReview[]> {
    return db.select().from(productReviews)
      .where(and(eq(productReviews.productSlug, productSlug), eq(productReviews.approved, true)))
      .orderBy(desc(productReviews.createdAt));
  }

  async getAllProductReviews(): Promise<ProductReview[]> {
    return db.select().from(productReviews).orderBy(desc(productReviews.createdAt));
  }

  async updateProductReview(id: string, data: Partial<{ approved: boolean; verified: boolean }>): Promise<ProductReview | undefined> {
    const [result] = await db.update(productReviews).set(data).where(eq(productReviews.id, id)).returning();
    return result;
  }

  async deleteProductReview(id: string): Promise<void> {
    await db.delete(productReviews).where(eq(productReviews.id, id));
  }

  async createBlogComment(comment: InsertBlogComment): Promise<BlogComment> {
    const [result] = await db.insert(blogComments).values(comment).returning();
    return result;
  }

  async getBlogCommentsBySlug(blogSlug: string): Promise<BlogComment[]> {
    return db.select().from(blogComments)
      .where(and(eq(blogComments.blogSlug, blogSlug), eq(blogComments.approved, true)))
      .orderBy(blogComments.createdAt);
  }

  async getAllBlogComments(): Promise<BlogComment[]> {
    return db.select().from(blogComments).orderBy(desc(blogComments.createdAt));
  }

  async deleteBlogComment(id: string): Promise<void> {
    await db.delete(blogComments).where(eq(blogComments.id, id));
  }

  async createConvention(convention: InsertConvention): Promise<Convention> {
    const [result] = await db.insert(conventions).values(convention).returning();
    return result;
  }

  async getConventions(): Promise<Convention[]> {
    return db.select().from(conventions).orderBy(desc(conventions.createdAt));
  }

  async getConventionById(id: string): Promise<Convention | undefined> {
    const [result] = await db.select().from(conventions).where(eq(conventions.id, id));
    return result;
  }

  async getConventionByCode(code: string): Promise<Convention | undefined> {
    const [result] = await db.select().from(conventions).where(eq(conventions.companyCode, code.toUpperCase().trim()));
    return result;
  }

  async updateConvention(id: string, data: Partial<InsertConvention>): Promise<Convention | undefined> {
    const [result] = await db.update(conventions).set(data).where(eq(conventions.id, id)).returning();
    return result;
  }

  async deleteConvention(id: string): Promise<void> {
    await db.delete(conventionRegistrations).where(eq(conventionRegistrations.conventionId, id));
    await db.delete(conventions).where(eq(conventions.id, id));
  }

  async createConventionRegistration(registration: InsertConventionRegistration): Promise<ConventionRegistration> {
    const [result] = await db.insert(conventionRegistrations).values(registration).returning();
    return result;
  }

  async getConventionRegistrations(): Promise<ConventionRegistration[]> {
    return db.select().from(conventionRegistrations).orderBy(desc(conventionRegistrations.createdAt));
  }

  async getRegistrationsByConvention(conventionId: string): Promise<ConventionRegistration[]> {
    return db.select().from(conventionRegistrations)
      .where(eq(conventionRegistrations.conventionId, conventionId))
      .orderBy(desc(conventionRegistrations.createdAt));
  }

  async getRegistrationByEmail(conventionId: string, email: string): Promise<ConventionRegistration | undefined> {
    const [result] = await db.select().from(conventionRegistrations)
      .where(and(eq(conventionRegistrations.conventionId, conventionId), eq(conventionRegistrations.email, email.toLowerCase().trim())));
    return result;
  }

  async getRegistrationsByCustomerEmail(email: string): Promise<Array<{ registration: ConventionRegistration; convention: Convention }>> {
    const results = await db.select({
      registration: conventionRegistrations,
      convention: conventions,
    }).from(conventionRegistrations)
      .innerJoin(conventions, eq(conventionRegistrations.conventionId, conventions.id))
      .where(and(eq(conventionRegistrations.email, email.toLowerCase().trim()), eq(conventions.active, true)));
    return results;
  }

  async getRegistrationCountByConvention(conventionId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(conventionRegistrations)
      .where(eq(conventionRegistrations.conventionId, conventionId));
    return Number(result[0]?.count || 0);
  }
}

export const storage = new DatabaseStorage();

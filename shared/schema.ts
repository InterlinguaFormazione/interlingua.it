import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, date, integer, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  role: text("role").notNull().default("staff"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  courseInterest: text("course_interest"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribed: boolean("subscribed").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNewsletterSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  subscribed: true,
  createdAt: true,
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;

export const cookieConsents = pgTable("cookie_consents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  necessary: boolean("necessary").default(true),
  analytics: boolean("analytics").default(false),
  marketing: boolean("marketing").default(false),
  preferences: boolean("preferences").default(false),
  consentAction: text("consent_action").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCookieConsentSchema = createInsertSchema(cookieConsents).omit({
  id: true,
  createdAt: true,
});

export type InsertCookieConsent = z.infer<typeof insertCookieConsentSchema>;
export type CookieConsent = typeof cookieConsents.$inferSelect;

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  sourceUrl: text("source_url"),
  sourceTitle: text("source_title"),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const scSubscribers = pgTable("sc_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  cognome: text("cognome").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  tipoFatturazione: text("tipo_fatturazione"),
  codiceFiscale: text("codice_fiscale"),
  indirizzo: text("indirizzo"),
  cap: text("cap"),
  citta: text("citta"),
  provincia: text("provincia"),
  paese: text("paese"),
  ragioneSociale: text("ragione_sociale"),
  partitaIva: text("partita_iva"),
  codiceSdi: text("codice_sdi"),
  pec: text("pec"),
  subscriptionStart: date("subscription_start").notNull(),
  subscriptionEnd: date("subscription_end").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScSubscriberSchema = createInsertSchema(scSubscribers).omit({
  id: true,
  createdAt: true,
});

export type InsertScSubscriber = z.infer<typeof insertScSubscriberSchema>;
export type ScSubscriber = typeof scSubscribers.$inferSelect;

export const scSessions = pgTable("sc_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionDate: date("session_date").notNull(),
  sessionTime: text("session_time").notNull().default("18:30"),
  topic: text("topic"),
  maxParticipants: integer("max_participants").default(12),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScSessionSchema = createInsertSchema(scSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertScSession = z.infer<typeof insertScSessionSchema>;
export type ScSession = typeof scSessions.$inferSelect;

export const scBookings = pgTable("sc_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriberId: varchar("subscriber_id").notNull(),
  sessionId: varchar("session_id").notNull(),
  bookedAt: timestamp("booked_at").defaultNow(),
}, (table) => [
  unique("unique_subscriber_session").on(table.subscriberId, table.sessionId),
]);

export const insertScBookingSchema = createInsertSchema(scBookings).omit({
  id: true,
  bookedAt: true,
});

export type InsertScBooking = z.infer<typeof insertScBookingSchema>;
export type ScBooking = typeof scBookings.$inferSelect;

export const scEmailSettings = pgTable("sc_email_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  emailsSuspended: boolean("emails_suspended").default(false),
  suspensionReason: text("suspension_reason"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ScEmailSettings = typeof scEmailSettings.$inferSelect;

export const scPayments = pgTable("sc_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriberId: varchar("subscriber_id").notNull(),
  paypalOrderId: text("paypal_order_id").notNull(),
  amount: text("amount").notNull(),
  currency: text("currency").notNull().default("EUR"),
  status: text("status").notNull().default("pending"),
  payerEmail: text("payer_email"),
  billingNome: text("billing_nome"),
  billingCognome: text("billing_cognome"),
  billingCodiceFiscale: text("billing_codice_fiscale"),
  billingIndirizzo: text("billing_indirizzo"),
  billingCap: text("billing_cap"),
  billingCitta: text("billing_citta"),
  billingProvincia: text("billing_provincia"),
  billingPartitaIva: text("billing_partita_iva"),
  billingCodiceSdi: text("billing_codice_sdi"),
  billingPec: text("billing_pec"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScPaymentSchema = createInsertSchema(scPayments).omit({
  id: true,
  createdAt: true,
});

export type InsertScPayment = z.infer<typeof insertScPaymentSchema>;
export type ScPayment = typeof scPayments.$inferSelect;

export const shopCustomers = pgTable("shop_customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertShopCustomerSchema = createInsertSchema(shopCustomers).omit({
  id: true,
  createdAt: true,
});

export type InsertShopCustomer = z.infer<typeof insertShopCustomerSchema>;
export type ShopCustomer = typeof shopCustomers.$inferSelect;

export const shopOrders = pgTable("shop_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id"),
  productSlug: text("product_slug").notNull(),
  productName: text("product_name").notNull(),
  amount: text("amount").notNull(),
  currency: text("currency").notNull().default("EUR"),
  paypalOrderId: text("paypal_order_id").notNull(),
  status: text("status").notNull().default("pending"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  studentName: text("student_name"),
  billingCodiceFiscale: text("billing_codice_fiscale"),
  billingIndirizzo: text("billing_indirizzo"),
  billingCap: text("billing_cap"),
  billingCitta: text("billing_citta"),
  billingProvincia: text("billing_provincia"),
  billingPartitaIva: text("billing_partita_iva"),
  billingCodiceSdi: text("billing_codice_sdi"),
  billingPec: text("billing_pec"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertShopOrderSchema = createInsertSchema(shopOrders).omit({
  id: true,
  createdAt: true,
});

export type InsertShopOrder = z.infer<typeof insertShopOrderSchema>;
export type ShopOrder = typeof shopOrders.$inferSelect;

export const courseMaterials = pgTable("course_materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productSlug: text("product_slug").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: text("file_size"),
  fileType: text("file_type"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCourseMaterialSchema = createInsertSchema(courseMaterials).omit({
  id: true,
  createdAt: true,
});

export type InsertCourseMaterial = z.infer<typeof insertCourseMaterialSchema>;
export type CourseMaterial = typeof courseMaterials.$inferSelect;

export interface Course {
  id: string;
  title: string;
  description: string;
  category: "languages" | "digital" | "professional" | "personal";
  duration: string;
  level: "beginner" | "intermediate" | "advanced" | "all";
  icon: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

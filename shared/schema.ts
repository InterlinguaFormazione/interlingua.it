import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, date, integer, unique, serial } from "drizzle-orm/pg-core";
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
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
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

export const blogComments = pgTable("blog_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  blogSlug: text("blog_slug").notNull(),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  isAiReply: boolean("is_ai_reply").default(false),
  parentId: varchar("parent_id"),
  approved: boolean("approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBlogCommentSchema = createInsertSchema(blogComments).omit({
  id: true,
  createdAt: true,
});

export type InsertBlogComment = z.infer<typeof insertBlogCommentSchema>;
export type BlogComment = typeof blogComments.$inferSelect;

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
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  codiceFiscale: text("codice_fiscale"),
  indirizzo: text("indirizzo"),
  cap: text("cap"),
  citta: text("citta"),
  provincia: text("provincia"),
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
  customerFirstName: text("customer_first_name").notNull(),
  customerLastName: text("customer_last_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  studentFirstName: text("student_first_name"),
  studentLastName: text("student_last_name"),
  studentEmail: text("student_email"),
  billingCodiceFiscale: text("billing_codice_fiscale"),
  billingIndirizzo: text("billing_indirizzo"),
  billingCap: text("billing_cap"),
  billingCitta: text("billing_citta"),
  billingProvincia: text("billing_provincia"),
  billingPartitaIva: text("billing_partita_iva"),
  billingCodiceSdi: text("billing_codice_sdi"),
  billingPec: text("billing_pec"),
  billingPaese: text("billing_paese"),
  notes: text("notes"),
  adminNotes: text("admin_notes"),
  discountCode: text("discount_code"),
  discountAmount: text("discount_amount"),
  invoiceNumber: text("invoice_number"),
  invoiceDate: timestamp("invoice_date"),
  invoiceSent: boolean("invoice_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertShopOrderSchema = createInsertSchema(shopOrders).omit({
  id: true,
  createdAt: true,
});

export type InsertShopOrder = z.infer<typeof insertShopOrderSchema>;
export type ShopOrder = typeof shopOrders.$inferSelect;

export const discountVouchers = pgTable("discount_vouchers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type").notNull(),
  discountValue: text("discount_value").notNull(),
  minOrderAmount: text("min_order_amount"),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").notNull().default(0),
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  productSlugs: text("product_slugs"),
  productOptions: text("product_options"),
  firstTimeBuyerOnly: boolean("first_time_buyer_only").default(false),
  autoApply: boolean("auto_apply").default(false),
  requiresNewsletterSub: boolean("requires_newsletter_sub").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDiscountVoucherSchema = createInsertSchema(discountVouchers).omit({
  id: true,
  createdAt: true,
});

export type InsertDiscountVoucher = z.infer<typeof insertDiscountVoucherSchema>;
export type DiscountVoucher = typeof discountVouchers.$inferSelect;

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

export const englishTestResults = pgTable("english_test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateNome: text("candidate_nome").notNull(),
  candidateCognome: text("candidate_cognome").notNull(),
  candidateEmail: text("candidate_email").notNull(),
  candidatePhone: text("candidate_phone"),
  candidateAzienda: text("candidate_azienda"),
  candidateCitta: text("candidate_citta"),
  candidateProvincia: text("candidate_provincia"),
  selfAssessedLevel: text("self_assessed_level"),
  grammarScore: integer("grammar_score"),
  grammarLevel: text("grammar_level"),
  writingScore: integer("writing_score"),
  writingLevel: text("writing_level"),
  writingResponses: text("writing_responses"),
  speakingScore: integer("speaking_score"),
  speakingLevel: text("speaking_level"),
  speakingResponses: text("speaking_responses"),
  overallLevel: text("overall_level"),
  overallScore: integer("overall_score"),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertEnglishTestResultSchema = createInsertSchema(englishTestResults).omit({
  id: true,
  completedAt: true,
});

export type InsertEnglishTestResult = z.infer<typeof insertEnglishTestResultSchema>;
export type EnglishTestResult = typeof englishTestResults.$inferSelect;

export const beTestSessions = pgTable("be_test_sessions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  city: text("city"),
  province: text("province"),
  selfAssessedLevel: text("self_assessed_level").notNull(),
  currentLevel: text("current_level").notNull(),
  finalLevel: text("final_level"),
  totalQuestions: integer("total_questions").default(0),
  correctAnswers: integer("correct_answers").default(0),
  writingScore: text("writing_score"),
  speakingScore: text("speaking_score"),
  overallScore: text("overall_score"),
  audioUnavailable: boolean("audio_unavailable").default(false),
  currentTheta: integer("current_theta"),
  standardError: integer("standard_error"),
  confidenceLevel: integer("confidence_level"),
  testingMode: text("testing_mode").default("cat"),
  status: text("status").default("in_progress"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  resultsEmailSentAt: timestamp("results_email_sent_at"),
  previousQuestions: text("previous_questions").default("[]"),
  currentSectionIndex: integer("current_section_index").default(0),
  totalSections: integer("total_sections").default(8),
  competencyReport: text("competency_report"),
  levelHistory: text("level_history").default("[]"),
  questionsAtCurrentLevel: integer("questions_at_current_level").default(0),
  consecutiveIncorrectA1: integer("consecutive_incorrect_a1").default(0),
  testType: text("test_type").default("general"),
  language: text("language").notNull().default("english"),
});

export const insertBeTestSessionSchema = createInsertSchema(beTestSessions).omit({ id: true, startedAt: true });
export type InsertBeTestSession = z.infer<typeof insertBeTestSessionSchema>;
export type BeTestSession = typeof beTestSessions.$inferSelect;

export const beQuestions = pgTable("be_questions", {
  id: serial("id").primaryKey(),
  language: text("language").notNull().default("english"),
  level: text("level").notNull(),
  skillType: text("skill_type").notNull(),
  section: text("section").notNull(),
  topic: text("topic").notNull(),
  question: text("question").notNull(),
  options: text("options").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  audioUrl: text("audio_url"),
  passage: text("passage"),
  explanation: text("explanation"),
  difficulty: integer("difficulty"),
  discrimination: integer("discrimination"),
  calibrationStatus: text("calibration_status").default("pending"),
  calibrationNotes: text("calibration_notes"),
});

export const insertBeQuestionSchema = createInsertSchema(beQuestions).omit({ id: true });
export type InsertBeQuestion = z.infer<typeof insertBeQuestionSchema>;
export type BeQuestion = typeof beQuestions.$inferSelect;

export const beResponses = pgTable("be_responses", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  questionId: integer("question_id").notNull(),
  userAnswer: text("user_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeSpent: integer("time_spent"),
  answeredAt: timestamp("answered_at").defaultNow(),
  thetaBefore: integer("theta_before"),
  thetaAfter: integer("theta_after"),
  standardErrorBefore: integer("standard_error_before"),
  standardErrorAfter: integer("standard_error_after"),
  informationGain: integer("information_gain"),
});

export const insertBeResponseSchema = createInsertSchema(beResponses).omit({ id: true, answeredAt: true });
export type InsertBeResponse = z.infer<typeof insertBeResponseSchema>;
export type BeResponse = typeof beResponses.$inferSelect;

export const beWritingSpeaking = pgTable("be_writing_speaking", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  taskType: text("task_type").notNull(),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  audioUrl: text("audio_url"),
  aiScore: text("ai_score"),
  aiGrammarScore: integer("ai_grammar_score"),
  aiVocabularyScore: integer("ai_vocabulary_score"),
  aiCoherenceScore: integer("ai_coherence_score"),
  aiTaskCompletionScore: integer("ai_task_completion_score"),
  aiFeedback: text("ai_feedback"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const insertBeWritingSpeakingSchema = createInsertSchema(beWritingSpeaking).omit({ id: true, submittedAt: true });
export type InsertBeWritingSpeaking = z.infer<typeof insertBeWritingSpeakingSchema>;
export type BeWritingSpeaking = typeof beWritingSpeaking.$inferSelect;

export const beSectionResults = pgTable("be_section_results", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  sectionName: text("section_name").notNull(),
  sectionIndex: integer("section_index").notNull(),
  questionsAttempted: integer("questions_attempted").default(0),
  questionsCorrect: integer("questions_correct").default(0),
  accuracyPercentage: integer("accuracy_percentage"),
  cefrLevel: text("cefr_level"),
  completedAt: timestamp("completed_at").defaultNow(),
  finalTheta: integer("final_theta"),
  finalStandardError: integer("final_standard_error"),
  sectionConfidence: integer("section_confidence"),
});

export const insertBeSectionResultSchema = createInsertSchema(beSectionResults).omit({ id: true, completedAt: true });
export type InsertBeSectionResult = z.infer<typeof insertBeSectionResultSchema>;
export type BeSectionResult = typeof beSectionResults.$inferSelect;

export const productReviews = pgTable("product_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productSlug: text("product_slug").notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  rating: integer("rating").notNull(),
  title: text("title"),
  comment: text("comment").notNull(),
  verified: boolean("verified").default(false),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductReviewSchema = createInsertSchema(productReviews).omit({
  id: true,
  verified: true,
  approved: true,
  createdAt: true,
});

export type InsertProductReview = z.infer<typeof insertProductReviewSchema>;
export type ProductReview = typeof productReviews.$inferSelect;

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

export const conventions = pgTable("conventions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  companyCode: text("company_code").notNull().unique(),
  discountCode: text("discount_code").notNull(),
  discountDescription: text("discount_description"),
  contactPerson: text("contact_person"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  maxRegistrations: integer("max_registrations"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertConventionSchema = createInsertSchema(conventions).omit({
  id: true,
  createdAt: true,
});
export type InsertConvention = z.infer<typeof insertConventionSchema>;
export type Convention = typeof conventions.$inferSelect;

export const conventionRegistrations = pgTable("convention_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conventionId: varchar("convention_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  companyRole: text("company_role"),
  verified: boolean("verified").default(false),
  discountCodeSent: boolean("discount_code_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertConventionRegistrationSchema = createInsertSchema(conventionRegistrations).omit({
  id: true,
  createdAt: true,
});
export type InsertConventionRegistration = z.infer<typeof insertConventionRegistrationSchema>;
export type ConventionRegistration = typeof conventionRegistrations.$inferSelect;

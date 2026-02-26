import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, date, integer, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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

export const scSubscribers = pgTable("sc_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
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

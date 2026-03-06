CREATE TABLE "be_questions" (
        "id" serial PRIMARY KEY NOT NULL,
        "language" text DEFAULT 'english' NOT NULL,
        "level" text NOT NULL,
        "skill_type" text NOT NULL,
        "section" text NOT NULL,
        "topic" text NOT NULL,
        "question" text NOT NULL,
        "options" text NOT NULL,
        "correct_answer" text NOT NULL,
        "audio_url" text,
        "passage" text,
        "explanation" text,
        "difficulty" integer,
        "discrimination" integer,
        "calibration_status" text DEFAULT 'pending',
        "calibration_notes" text
);
--> statement-breakpoint
CREATE TABLE "be_responses" (
        "id" serial PRIMARY KEY NOT NULL,
        "session_id" integer NOT NULL,
        "question_id" integer NOT NULL,
        "user_answer" text NOT NULL,
        "is_correct" boolean NOT NULL,
        "time_spent" integer,
        "answered_at" timestamp DEFAULT now(),
        "theta_before" integer,
        "theta_after" integer,
        "standard_error_before" integer,
        "standard_error_after" integer,
        "information_gain" integer
);
--> statement-breakpoint
CREATE TABLE "be_section_results" (
        "id" serial PRIMARY KEY NOT NULL,
        "session_id" integer NOT NULL,
        "section_name" text NOT NULL,
        "section_index" integer NOT NULL,
        "questions_attempted" integer DEFAULT 0,
        "questions_correct" integer DEFAULT 0,
        "accuracy_percentage" integer,
        "cefr_level" text,
        "completed_at" timestamp DEFAULT now(),
        "final_theta" integer,
        "final_standard_error" integer,
        "section_confidence" integer
);
--> statement-breakpoint
CREATE TABLE "be_test_sessions" (
        "id" serial PRIMARY KEY NOT NULL,
        "first_name" text NOT NULL,
        "last_name" text NOT NULL,
        "email" text NOT NULL,
        "company" text,
        "phone" text,
        "city" text,
        "province" text,
        "self_assessed_level" text NOT NULL,
        "current_level" text NOT NULL,
        "final_level" text,
        "total_questions" integer DEFAULT 0,
        "correct_answers" integer DEFAULT 0,
        "writing_score" text,
        "speaking_score" text,
        "overall_score" text,
        "audio_unavailable" boolean DEFAULT false,
        "current_theta" integer,
        "standard_error" integer,
        "confidence_level" integer,
        "testing_mode" text DEFAULT 'cat',
        "status" text DEFAULT 'in_progress',
        "started_at" timestamp DEFAULT now(),
        "completed_at" timestamp,
        "results_email_sent_at" timestamp,
        "previous_questions" text DEFAULT '[]',
        "current_section_index" integer DEFAULT 0,
        "total_sections" integer DEFAULT 8,
        "competency_report" text,
        "level_history" text DEFAULT '[]',
        "questions_at_current_level" integer DEFAULT 0,
        "consecutive_incorrect_a1" integer DEFAULT 0,
        "test_type" text DEFAULT 'general',
        "language" text DEFAULT 'english' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "be_writing_speaking" (
        "id" serial PRIMARY KEY NOT NULL,
        "session_id" integer NOT NULL,
        "task_type" text NOT NULL,
        "prompt" text NOT NULL,
        "response" text NOT NULL,
        "audio_url" text,
        "ai_score" text,
        "ai_grammar_score" integer,
        "ai_vocabulary_score" integer,
        "ai_coherence_score" integer,
        "ai_task_completion_score" integer,
        "ai_feedback" text,
        "submitted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_comments" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "blog_slug" text NOT NULL,
        "author_name" text NOT NULL,
        "content" text NOT NULL,
        "is_ai_reply" boolean DEFAULT false,
        "parent_id" varchar,
        "approved" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "slug" text NOT NULL,
        "title" text NOT NULL,
        "excerpt" text NOT NULL,
        "content" text NOT NULL,
        "category" text NOT NULL,
        "image_url" text,
        "source_url" text,
        "source_title" text,
        "author_name" text DEFAULT 'Staff Interlingua Formazione',
        "published" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "phone" text,
        "course_interest" text,
        "message" text NOT NULL,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "convention_registrations" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "convention_id" varchar NOT NULL,
        "first_name" text NOT NULL,
        "last_name" text NOT NULL,
        "email" text NOT NULL,
        "phone" text,
        "company_role" text,
        "verified" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conventions" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "company_name" text NOT NULL,
        "company_code" text NOT NULL,
        "discounts" jsonb DEFAULT '[]'::jsonb,
        "contact_person" text,
        "contact_email" text,
        "contact_phone" text,
        "max_registrations" integer,
        "active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "conventions_company_code_unique" UNIQUE("company_code")
);
--> statement-breakpoint
CREATE TABLE "cookie_consents" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "session_id" text NOT NULL,
        "ip_address" text,
        "user_agent" text,
        "necessary" boolean DEFAULT true,
        "analytics" boolean DEFAULT false,
        "marketing" boolean DEFAULT false,
        "preferences" boolean DEFAULT false,
        "consent_action" text NOT NULL,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "course_materials" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "product_slug" text NOT NULL,
        "file_name" text NOT NULL,
        "file_url" text NOT NULL,
        "file_size" text,
        "file_type" text,
        "description" text,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "discount_vouchers" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "code" text NOT NULL,
        "description" text,
        "discount_type" text NOT NULL,
        "discount_value" text NOT NULL,
        "min_order_amount" text,
        "max_uses" integer,
        "used_count" integer DEFAULT 0 NOT NULL,
        "valid_from" timestamp,
        "valid_until" timestamp,
        "product_slugs" text,
        "excluded_product_slugs" text,
        "product_options" text,
        "first_time_buyer_only" boolean DEFAULT false,
        "auto_apply" boolean DEFAULT false,
        "requires_newsletter_sub" boolean DEFAULT false,
        "active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "discount_vouchers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "english_test_results" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "candidate_nome" text NOT NULL,
        "candidate_cognome" text NOT NULL,
        "candidate_email" text NOT NULL,
        "candidate_phone" text,
        "candidate_azienda" text,
        "candidate_citta" text,
        "candidate_provincia" text,
        "self_assessed_level" text,
        "grammar_score" integer,
        "grammar_level" text,
        "writing_score" integer,
        "writing_level" text,
        "writing_responses" text,
        "speaking_score" integer,
        "speaking_level" text,
        "speaking_responses" text,
        "overall_level" text,
        "overall_score" integer,
        "completed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscriptions" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "first_name" text DEFAULT '' NOT NULL,
        "last_name" text DEFAULT '' NOT NULL,
        "email" text NOT NULL,
        "subscribed" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "newsletter_subscriptions_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "product_reviews" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "product_slug" text NOT NULL,
        "author_name" text NOT NULL,
        "author_email" text NOT NULL,
        "rating" integer NOT NULL,
        "title" text,
        "comment" text NOT NULL,
        "verified" boolean DEFAULT false,
        "approved" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sc_bookings" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "subscriber_id" varchar NOT NULL,
        "session_id" varchar NOT NULL,
        "booked_at" timestamp DEFAULT now(),
        CONSTRAINT "unique_subscriber_session" UNIQUE("subscriber_id","session_id")
);
--> statement-breakpoint
CREATE TABLE "sc_email_settings" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "emails_suspended" boolean DEFAULT false,
        "suspension_reason" text,
        "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sc_payments" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "subscriber_id" varchar NOT NULL,
        "paypal_order_id" text NOT NULL,
        "amount" text NOT NULL,
        "currency" text DEFAULT 'EUR' NOT NULL,
        "status" text DEFAULT 'pending' NOT NULL,
        "payer_email" text,
        "billing_nome" text,
        "billing_cognome" text,
        "billing_codice_fiscale" text,
        "billing_indirizzo" text,
        "billing_cap" text,
        "billing_citta" text,
        "billing_provincia" text,
        "billing_partita_iva" text,
        "billing_codice_sdi" text,
        "billing_pec" text,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sc_sessions" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "session_date" date NOT NULL,
        "session_time" text DEFAULT '18:30' NOT NULL,
        "topic" text,
        "max_participants" integer DEFAULT 12,
        "status" text DEFAULT 'active' NOT NULL,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sc_subscribers" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "nome" text NOT NULL,
        "cognome" text NOT NULL,
        "email" text NOT NULL,
        "password" text NOT NULL,
        "tipo_fatturazione" text,
        "codice_fiscale" text,
        "indirizzo" text,
        "cap" text,
        "citta" text,
        "provincia" text,
        "paese" text,
        "ragione_sociale" text,
        "partita_iva" text,
        "codice_sdi" text,
        "pec" text,
        "subscription_start" date NOT NULL,
        "subscription_end" date NOT NULL,
        "active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "sc_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "shop_customers" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "email" text NOT NULL,
        "password" text NOT NULL,
        "first_name" text NOT NULL,
        "last_name" text NOT NULL,
        "phone" text,
        "codice_fiscale" text,
        "indirizzo" text,
        "cap" text,
        "citta" text,
        "provincia" text,
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "shop_customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "shop_orders" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "customer_id" varchar,
        "product_slug" text NOT NULL,
        "product_name" text NOT NULL,
        "amount" text NOT NULL,
        "currency" text DEFAULT 'EUR' NOT NULL,
        "paypal_order_id" text NOT NULL,
        "status" text DEFAULT 'pending' NOT NULL,
        "customer_first_name" text NOT NULL,
        "customer_last_name" text NOT NULL,
        "customer_email" text NOT NULL,
        "customer_phone" text,
        "student_first_name" text,
        "student_last_name" text,
        "student_email" text,
        "billing_codice_fiscale" text,
        "billing_indirizzo" text,
        "billing_cap" text,
        "billing_citta" text,
        "billing_provincia" text,
        "billing_partita_iva" text,
        "billing_codice_sdi" text,
        "billing_pec" text,
        "billing_paese" text,
        "notes" text,
        "admin_notes" text,
        "discount_code" text,
        "discount_amount" text,
        "invoice_number" text,
        "invoice_date" timestamp,
        "invoice_sent" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "username" text NOT NULL,
        "password" text NOT NULL,
        "name" text DEFAULT '' NOT NULL,
        "email" text DEFAULT '' NOT NULL,
        "role" text DEFAULT 'staff' NOT NULL,
        "active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "users_username_unique" UNIQUE("username")
);

-- Page Views tracking
CREATE TABLE IF NOT EXISTS "page_views" (
  "id" serial PRIMARY KEY NOT NULL,
  "path" text NOT NULL,
  "ip_address" text,
  "user_agent" text,
  "referrer" text,
  "session_id" text,
  "created_at" timestamp DEFAULT now()
);

-- Excluded IPs
CREATE TABLE IF NOT EXISTS "excluded_ips" (
  "id" serial PRIMARY KEY NOT NULL,
  "ip_address" text NOT NULL,
  "label" text,
  "created_at" timestamp DEFAULT now()
);

-- Cart events for abandonment tracking
-- Geolocation columns for page_views
ALTER TABLE "page_views" ADD COLUMN IF NOT EXISTS "city" text;
ALTER TABLE "page_views" ADD COLUMN IF NOT EXISTS "region" text;
ALTER TABLE "page_views" ADD COLUMN IF NOT EXISTS "country" text;

CREATE TABLE IF NOT EXISTS "cart_events" (
  "id" serial PRIMARY KEY NOT NULL,
  "session_id" text NOT NULL,
  "event_type" text NOT NULL,
  "product_slug" text,
  "product_name" text,
  "cart_value" text,
  "item_count" integer,
  "ip_address" text,
  "created_at" timestamp DEFAULT now()
);

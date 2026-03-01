# SkillCraft-Interlingua Website

## Overview
A modern, visually stunning website for SkillCraft-Interlingua, a comprehensive professional training center for private (non-business) users. The site positions SkillCraft-Interlingua as a 360-degree training provider covering AI, digital skills, soft skills, management, experiential learning, and languages (de-emphasized). Languages are intentionally listed last as they are being phased out as the primary focus. AI and digital skills are the primary focus — explicitly mention ChatGPT, Copilot, automation.

## Deployment
- **Target**: User's own VPS at `skillcraft.interlingua.it`
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) — auto-deploys on push to `main`
- **GitHub Secrets needed**: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT` (optional)
- **VPS Stack**: Node.js 20 + PM2 + Nginx reverse proxy + Certbot SSL
- **VPS directory**: `/var/www/SkillCraft-Interlingua`
- **PM2 process name**: `skillcraft-interlingua`
- **Production command**: `node dist/index.cjs` (serves frontend + backend on port 5000)
- **Full deployment guide**: `DEPLOY-VPS.md`

## Tech Stack
- **Frontend**: React with TypeScript, Vite, TailwindCSS, Shadcn/ui components
- **Backend**: Express.js
- **Database**: PostgreSQL (Drizzle ORM)
- **Email**: AWS SES (gracefully disabled if credentials not set)
- **CRM Integration**: Webhook to `crm.skillcraft.it` (via `server/crm.ts`)
- **State Management**: TanStack React Query
- **Animations**: Framer Motion
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation
- **Auth**: bcryptjs for password hashing

## Project Structure

### Frontend (`client/`)
- `src/pages/home.tsx` - Main landing page with all sections
- `src/pages/course-detail.tsx` - Individual course detail pages (20 courses)
- `src/pages/chi-siamo.tsx` - About us page
- `src/pages/bandi-e-corsi.tsx` - Funded courses and tenders listing
- `src/pages/bando-detail.tsx` - Individual bando/funded course detail page
- `src/pages/speakers-corner.tsx` - Speaker's Corner landing page with login
- `src/pages/speakers-corner-dashboard.tsx` - Subscriber dashboard for booking sessions
- `src/pages/admin.tsx` - General admin panel (contacts, newsletter, blog, shop orders, materials, English adaptive test results, user management)
- `src/pages/speakers-corner-admin.tsx` - Admin panel for managing subscribers, sessions, email settings
- `src/pages/blog.tsx` - Blog listing page
- `src/pages/blog-post.tsx` - Blog post detail page
- `src/pages/language-coaching.tsx` - Premium language coaching page (1-to-1, 30% premium pricing, Milton Method copy)
- `src/pages/corsi-italiano.tsx` - Italian for Foreigners page with IT/EN bilingual toggle, course pricing, Vicenza info, contact form
- `src/pages/language-tests.tsx` - Language test landing page at `/test-di-livello` where users select which language test to take. English is available; Italian, German, French, Spanish shown as "coming soon".
- `src/pages/english-test.tsx` - General English Adaptive Test at `/english-test` with CAT/IRT engine, 5 MC sections (grammar, vocabulary, use of English, reading, listening), writing + speaking AI-scored tasks, anti-cheating measures. Topics cover daily life, travel, food, health, education, technology, entertainment, sports, environment, and culture. Company field is optional.
- `src/pages/cookie-policy.tsx` - GDPR cookie policy
- `src/pages/privacy-policy.tsx` - GDPR privacy policy
- `src/components/` - Reusable UI components
  - `navigation.tsx` - Fixed header with mobile menu
  - `hero-section.tsx` - Hero with animated stats
  - `courses-section.tsx` - Course cards grid
  - `features-section.tsx` - Benefits and features
  - `testimonials-section.tsx` - Student reviews (Google Reviews API)
  - `about-section.tsx` - Company information (Vicenza + Thiene locations)
  - `contact-section.tsx` - Contact form with honeypot bot protection
  - `newsletter-section.tsx` - Newsletter signup with honeypot bot protection
  - `cookie-banner.tsx` - GDPR cookie consent banner with granular controls
  - `ai-chat-widget.tsx` - Floating AI chat assistant (OpenAI GPT-4o-mini)
  - `footer.tsx` - Site footer
  - `theme-provider.tsx` - Dark/light mode support
  - `theme-toggle.tsx` - Theme switcher button

### Backend (`server/`)
- `db.ts` - PostgreSQL database connection (drizzle-orm/node-postgres)
- `routes.ts` - API endpoints with bot protection (honeypot, timestamp check, rate limiting)
- `storage.ts` - PostgreSQL database storage (Drizzle ORM)
- `ai-chat.ts` - AI chat endpoint (OpenAI GPT-4o-mini with full site context)
- `english-test.ts` - AI scoring for English test (GPT-4o writing/speaking scoring, Whisper transcription) + business English scoring functions
- `cat-engine.ts` - CAT/IRT engine (2PL model, EAP Bayesian theta update, Fisher Information SE update, theta ×100). Min 5, max 12 questions/section. SE threshold 40 for early stop. Level stability rule: last 3 consecutive answers must be at the same CEFR level before SE-based early stop is allowed. Detailed [CAT] logging on each answer.
- `business-english-questions.ts` - Question bank for General English test (450 questions, 5 skills x 6 levels x 15 per cell, difficulty spread ±40 within each level). Named "business-english" for historical reasons but used exclusively for the General English test.
- `email.ts` - AWS SES email notifications (contact, newsletter, subscription payment, booking confirmation, business English results)
- `crm.ts` - CRM webhook integration (forwards contact submissions)
- `blog-generator.ts` - Automated blog generation

### Shared (`shared/`)
- `schema.ts` - Drizzle schema + Zod validation schemas
- `products.ts` - Product catalog for the online shop (22 courses with options/variations and dynamic pricing)

## Database Tables
- `users` - Basic user accounts
- `contact_submissions` - Contact form submissions
- `newsletter_subscriptions` - Newsletter subscribers
- `cookie_consents` - GDPR cookie consent records
- `blog_posts` - AI-generated blog posts
- `sc_subscribers` - Speaker's Corner subscribers (nome, cognome, email, hashed password, billing fields, subscription dates)
- `sc_sessions` - Weekly Friday sessions (date, time, topic, max participants, status)
- `sc_bookings` - Session bookings (subscriber + session link)
- `sc_email_settings` - Email notification settings (suspend/resume for holidays)
- `sc_payments` - PayPal payment records (subscriber ID, PayPal order ID, amount, currency, status, payer email)
- `shop_customers` - Customer accounts created during shop checkout (email, hashed password, name, phone)
- `shop_orders` - Online shop orders (product slug/name, amount, PayPal order ID, customer first/last name, email, phone, student first/last name + email for third-party purchases, billing info, status, linked to customer account)
- `course_materials` - Downloadable files per course product (slug, file name, URL, size, description)

## API Endpoints
- `POST /api/contact` - Submit contact form (saves to DB + emails + CRM)
- `GET /api/contact` - Get all contact submissions
- `POST /api/newsletter` - Subscribe to newsletter (saves to DB + confirmation email)
- `GET /api/newsletter` - Get all newsletter subscriptions
- `GET /api/courses` - Get available courses
- `POST /api/cookie-consent` - Log cookie consent (GDPR proof-of-consent)
- `GET /api/reviews` - Google Reviews (cached 24h)
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/:slug` - Get blog post by slug
- `POST /api/blog/generate` - Trigger blog post generation
- `POST /api/chat` - AI chat endpoint

### Admin API (protected with server-side token auth)
- `POST /api/admin/login` - Admin login with username/password (returns session token)
- `GET /api/admin/users` - List all users (admin only)
- `POST /api/admin/users` - Create user (admin only)
- `PATCH /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/contacts` - Get all contact submissions (admin + staff)
- `GET /api/admin/newsletter` - Get all newsletter subscriptions (admin + staff)
- `GET /api/admin/blog` - Get all blog posts (admin + staff)
- `POST /api/admin/blog/generate` - Trigger blog post generation (admin + staff)

### Speaker's Corner Subscriber API
- `POST /api/speakers-corner/login` - Subscriber login (email + password)
- `GET /api/speakers-corner/sessions` - Get this week's sessions with participant counts
- `POST /api/speakers-corner/book` - Book a session
- `DELETE /api/speakers-corner/book/:bookingId` - Cancel a booking
- `GET /api/speakers-corner/my-bookings/:subscriberId` - Get subscriber's bookings

### Speaker's Corner Admin API
- `GET /api/admin/speakers-corner/subscribers` - List all subscribers
- `POST /api/admin/speakers-corner/subscribers` - Create subscriber
- `PATCH /api/admin/speakers-corner/subscribers/:id` - Update subscriber
- `GET /api/admin/speakers-corner/sessions` - List all sessions
- `POST /api/admin/speakers-corner/sessions` - Create session
- `PATCH /api/admin/speakers-corner/sessions/:id` - Update session
- `GET /api/admin/speakers-corner/email-settings` - Get email settings
- `PATCH /api/admin/speakers-corner/email-settings` - Update email settings
- `POST /api/admin/speakers-corner/generate-sessions` - Auto-generate Friday sessions
- `GET /api/admin/speakers-corner/payments` - List all payment records

### PayPal Payment API
- `GET /paypal/setup` - Get PayPal client token for SDK initialization
- `POST /paypal/order` - Create a PayPal order (amount, currency, intent)
- `POST /paypal/order/:orderID/capture` - Capture a PayPal order after approval
- `POST /api/speakers-corner/purchase` - Complete purchase (creates subscriber + records payment)

### Shop API
- `GET /api/shop/products` - Get all purchasable products
- `POST /api/shop/purchase` - Complete shop purchase (verifies PayPal, creates order + customer account)
- `POST /api/shop/login` - Customer login (email + password)
- `GET /api/shop/me` - Get current customer info (auth required)
- `GET /api/shop/my-orders` - Get customer's orders (auth required)
- `GET /api/shop/materials/:slug` - Get downloadable materials for a purchased course (auth required)
- `GET /api/admin/shop/orders` - List all shop orders (admin)
- `GET /api/admin/shop/materials` - List all course materials (admin)
- `POST /api/admin/shop/materials` - Add course material (admin)
- `DELETE /api/admin/shop/materials/:id` - Delete course material (admin)

## Bot Protection
- **Honeypot fields**: Hidden fields in both forms — bots fill them, humans don't
- **Timestamp check**: Submissions under 3 seconds rejected (too fast = bot)
- **Rate limiting**: Max 5 submissions per IP per 15 minutes
- Blocked bots get fake 200 responses (so they don't know they were caught)

## Environment Variables / Secrets
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Express session secret
- `GOOGLE_API_KEY` - Google Places API (for reviews)
- `AWS_ACCESS_KEY_ID` - AWS SES
- `AWS_SECRET_ACCESS_KEY` - AWS SES
- `AWS_REGION` - AWS SES region (default: eu-south-1)
- `CRM_WEBHOOK_API_KEY` - CRM webhook key (sk-webhook-...)
- `CRM_BASE_URL` - CRM base URL (default: https://crm.skillcraft.it)
- `ADMIN_PASSWORD` - Default password for the initial admin user (used only for seeding)
- `PAYPAL_CLIENT_ID` - PayPal API client ID (sandbox or production)
- `PAYPAL_CLIENT_SECRET` - PayPal API client secret (sandbox or production)

## Contact Email
- **Default email**: `infocorsi@skillcraft.interlingua.it` (used everywhere on site)
- **Privacy email**: `privacy@interlingua.it` (privacy policy only)
- **Email sender**: `noreply@skillcraft.interlingua.it`

## Pages
- `/` - Home page with hero, courses, features, testimonials, about, contact, newsletter
- `/corsi` - Course catalog
- `/corsi/:id` - Course detail
- `/chi-siamo` - About us
- `/bandi-e-corsi-finanziati` - Funded courses and tenders listing
- `/bandi/:id` - Individual bando/funded course detail page
- `/speakers-corner` - Speaker's Corner info page with subscriber login
- `/speakers-corner/acquista` - Purchase Speaker's Corner subscription (PayPal checkout)
- `/speakers-corner/dashboard` - Subscriber dashboard (view/book sessions)
- `/shop` - Online course shop (all fixed-price courses)
- `/shop/checkout/:slug` - Checkout page with billing, account creation, and PayPal payment
- `/shop/dashboard` - Customer area (login, purchased courses, downloadable materials)
- `/test-inglese` - Free English placement test (CEFR A1-C2, 50 questions)
- `/admin` - General admin panel (contacts, newsletter, orders, blog management)
- `/speakers-corner/admin` - Speaker's Corner admin (manage subscribers, sessions, email settings)
- `/blog` - Blog listing
- `/blog/:slug` - Blog post detail
- `/cookie-policy` - Cookie policy (GDPR)
- `/privacy-policy` - Privacy policy (GDPR)

## Bandi e Corsi Finanziati
- Data source: `client/src/data/bandi-data.ts`
- Images stored locally in `client/public/images/bandi/`
- 22 bando cards (active + expired) with detail pages

## Speaker's Corner Feature
- Weekly English conversation sessions every Friday at 18:30
- Yearly subscription: €200/year with online PayPal checkout (also accepts Visa/Mastercard)
- Purchase flow: fill details → pay with PayPal → auto-create subscriber account → redirect to dashboard
- Subscribers login to view and book sessions (max 12 per session)
- Admin panel to manage subscribers, create/cancel sessions, suspend email notifications, view payment history
- Tuesday weekly email invitations to active subscribers (email service integration pending)
- Email suspension feature for holiday periods
- PayPal integration: uses `@paypal/paypal-server-sdk` with sandbox/production environment switching

## Visual Design System
- **Premium glassmorphism**: Stat cards, feature cards, and hero elements use backdrop-blur with gradient borders
- **Animated gradient orbs**: Floating blurred orbs in hero, newsletter, contact, blog, and course detail sections (all respect prefers-reduced-motion)
- **Dot grid patterns**: Subtle radial-gradient dot overlays on hero, features, courses, and contact sections
- **Gradient border reveal**: Cards in courses, features, and contact sections reveal gradient borders on hover
- **Shimmer effects**: CTA buttons and newsletter background use shimmer animations
- **Framer Motion throughout**: All sections use staggered entrance animations with intersection observer
- **Brand colors**: Primary HSL `222 67% 40%`, Accent HSL `20 91% 53%`
- **Accessibility**: All infinite animations gated by `useReducedMotion()` from framer-motion

## Key Design Decisions
- Languages are de-emphasized (listed last, being phased out)
- AI teaching is very prominent (ChatGPT, Copilot, automation explicitly mentioned)
- Word "eccellenze" is NOT used (overused by competitors)
- Cookie consent uses custom event ("open-cookie-settings") for reopening
- Email service gracefully degrades if AWS SES credentials not configured
- Newsletter handles race condition on unique email constraint
- CRM forwarding gracefully skips when API key not configured

## GDPR Compliance
- Cookie consent banner with granular category controls (necessary, analytics, marketing)
- Cookie consent logged to database with proof-of-consent (sessionId, IP, userAgent, preferences)
- Cookie policy page with specific cookie tables, third-party disclosures, legal bases
- Privacy policy covering all data processing, GDPR rights, Garante Privacy contact
- 12-month consent retention

## Running the Project
- **Dev**: `npm run dev` (Express backend + Vite frontend on port 5000)
- **Build**: `npm run build` (outputs `dist/index.cjs` + `dist/public/`)
- **Production**: `npm start` or `node dist/index.cjs`
- **DB sync**: `npm run db:push` to sync database schema changes

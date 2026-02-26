# SkillCraft-Interlingua Website

## Overview
A modern, visually stunning website for SkillCraft-Interlingua, a training center offering language courses and professional development for private (non-business) users. The site combines offerings from Interlingua Formazione and SkillCraft into one cohesive platform.

## Tech Stack
- **Frontend**: React with TypeScript, Vite, TailwindCSS, Shadcn/ui components
- **Backend**: Express.js with PostgreSQL (Drizzle ORM)
- **State Management**: TanStack React Query
- **Animations**: Framer Motion
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation
- **Auth**: bcryptjs for password hashing

## Project Structure

### Frontend (`client/`)
- `src/pages/home.tsx` - Main landing page with all sections
- `src/pages/speakers-corner.tsx` - Speaker's Corner landing page with login
- `src/pages/speakers-corner-dashboard.tsx` - Subscriber dashboard for booking sessions
- `src/pages/speakers-corner-admin.tsx` - Admin panel for managing subscribers, sessions, email settings
- `src/components/` - Reusable UI components
  - `navigation.tsx` - Fixed header with mobile menu
  - `hero-section.tsx` - Hero with animated stats
  - `courses-section.tsx` - Course cards grid
  - `features-section.tsx` - Benefits and features
  - `testimonials-section.tsx` - Student reviews
  - `about-section.tsx` - Company information
  - `contact-section.tsx` - Contact form
  - `newsletter-section.tsx` - Newsletter signup
  - `footer.tsx` - Site footer
  - `theme-provider.tsx` - Dark/light mode support
  - `theme-toggle.tsx` - Theme switcher button

### Backend (`server/`)
- `db.ts` - PostgreSQL database connection (drizzle-orm/node-postgres)
- `routes.ts` - API endpoints for contact form, newsletter, Speaker's Corner
- `storage.ts` - Storage interface (in-memory for legacy, PostgreSQL for Speaker's Corner)

### Shared (`shared/`)
- `schema.ts` - TypeScript interfaces, Drizzle tables, and Zod schemas

## Database Tables
- `users` - Basic user accounts
- `contact_submissions` - Contact form submissions
- `newsletter_subscriptions` - Newsletter subscribers
- `sc_subscribers` - Speaker's Corner subscribers (name, email, hashed password, subscription dates)
- `sc_sessions` - Weekly Friday sessions (date, time, topic, max participants, status)
- `sc_bookings` - Session bookings (subscriber + session link)
- `sc_email_settings` - Email notification settings (suspend/resume for holidays)

## API Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions
- `POST /api/newsletter` - Subscribe to newsletter
- `GET /api/newsletter` - Get all newsletter subscriptions
- `GET /api/courses` - Get available courses
- `GET /api/reviews` - Get Google reviews (cached)

### Speaker's Corner Subscriber API
- `POST /api/speakers-corner/login` - Subscriber login (email + password)
- `GET /api/speakers-corner/sessions` - Get upcoming sessions with participant counts
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

## Pages
- `/` - Home page with hero, courses, features, testimonials, about, contact, newsletter
- `/corsi` - Course catalog
- `/corsi/:id` - Course detail
- `/chi-siamo` - About us
- `/bandi-e-corsi-finanziati` - Funded courses and tenders listing
- `/bandi/:id` - Individual bando/funded course detail page
- `/speakers-corner` - Speaker's Corner info page with subscriber login
- `/speakers-corner/dashboard` - Subscriber dashboard (view/book sessions)
- `/speakers-corner/admin` - Admin panel (manage subscribers, sessions, email settings)

## Bandi e Corsi Finanziati
- Data source: `client/src/data/bandi-data.ts`
- Images stored locally in `client/public/images/bandi/`
- 22 bando cards (active + expired) with detail pages

## Speaker's Corner Feature
- Weekly English conversation sessions every Friday at 18:30
- Subscribers login to view and book sessions (max 12 per session)
- Admin panel to manage subscribers, create/cancel sessions, suspend email notifications
- Tuesday weekly email invitations to active subscribers (email service integration pending)
- Email suspension feature for holiday periods

## Running the Project
The project runs with `npm run dev` which starts both the Express backend and Vite frontend on port 5000.
Use `npm run db:push` to sync database schema changes.

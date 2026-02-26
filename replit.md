# SkillCraft-Interlingua Website

## Overview
A modern, visually stunning website for SkillCraft-Interlingua, a training center offering language courses and professional development for private (non-business) users. The site combines offerings from Interlingua Formazione and SkillCraft into one cohesive platform.

## Tech Stack
- **Frontend**: React with TypeScript, Vite, TailwindCSS, Shadcn/ui components
- **Backend**: Express.js
- **State Management**: TanStack React Query
- **Animations**: Framer Motion
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation

## Project Structure

### Frontend (`client/`)
- `src/pages/home.tsx` - Main landing page with all sections
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
- `routes.ts` - API endpoints for contact form and newsletter
- `storage.ts` - In-memory storage for submissions

### Shared (`shared/`)
- `schema.ts` - TypeScript interfaces and Zod schemas

## API Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions
- `POST /api/newsletter` - Subscribe to newsletter
- `GET /api/newsletter` - Get all newsletter subscriptions
- `GET /api/courses` - Get available courses

## Design System
- **Primary Color**: Purple (262° hue) - Innovation and creativity
- **Accent Color**: Teal (172° hue) - Trust and growth
- **Font**: Plus Jakarta Sans (modern, professional)
- **Dark Mode**: Full support with system preference detection

## Features
- Responsive design (mobile-first)
- Smooth scroll navigation
- Animated sections with Framer Motion
- SEO optimized with structured data
- Contact form with validation
- Newsletter subscription
- Theme toggle (light/dark)

## Running the Project
The project runs with `npm run dev` which starts both the Express backend and Vite frontend on port 5000.

## Pages
- `/` - Home page with hero, courses, features, testimonials, about, contact, newsletter
- `/corsi` - Course catalog
- `/corsi/:id` - Course detail
- `/chi-siamo` - About us
- `/bandi-e-corsi-finanziati` - Funded courses and tenders listing (recreated from interlingua.it)
- `/bandi/:id` - Individual bando/funded course detail page

## Bandi e Corsi Finanziati
- Data source: `client/src/data/bandi-data.ts` (all card and detail data)
- Images stored locally in `client/public/images/bandi/` (downloaded from original interlingua.it site)
- 22 bando cards (active + expired) with detail pages
- Includes FSE+ projects, Fondimpresa, Fondo ForTe, Fondirigenti, and older POR FSE bandi

## Recent Changes
- Added Bandi e Corsi Finanziati page with all linked detail pages
- Downloaded and stored all original images locally
- Added navigation link for Bandi e Corsi Finanziati
- Initial website build with all core sections
- Implemented contact form and newsletter API
- Added dark mode support
- SEO meta tags and structured data

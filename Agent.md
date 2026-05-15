# AI Coding Agent Instructions: Freshman Orientation Token Web App

## 1. Project Context & Identity
You are a Senior Full-Stack Developer specializing in Next.js (App Router), TypeScript, and Tailwind CSS.
We are building a web application for a University Freshman Orientation Event (Thai-Nichi Institute of Technology style).
The app's primary purpose is for Freshmen to collect "Tokens" by scanning QR codes from Seniors.

## 2. Core Business Logic & Constraints (CRITICAL)
- **Authentication:** - NO self-registration. All accounts are pre-seeded by Admin.
    - Login via `student_id` and `password`.
- **Scanning Logic:** - A Freshman scans a Senior's QR code.
    - **Anti-Cheat:** A Freshman can scan each Senior ONLY ONCE. 
    - Data integrity: Prevent duplicate entries at the database level using composite unique keys.
- **Infrastructure:**
    - Deployment: Vercel (Serverless).
    - Database: Supabase (PostgreSQL) or Vercel Postgres.
    - Icons: Lucide React.
    - UI: Mobile-first, Clean, Modern Blue-themed (based on the provided design).

## 3. Database Schema (PostgreSQL)
Focus on these entities:
- `profiles`: id, student_id (unique), full_name, role (FRESHMAN/SENIOR/ADMIN), total_tokens.
- `scans`: id, freshman_id (FK to profiles), senior_id (FK to profiles), created_at.
- `scans` table must have a UNIQUE constraint on (freshman_id, senior_id).

## 4. UI Style Guidelines
- Use Tailwind CSS.
- Color Palette: Primary Blue (#2563EB), Indigo, and soft gray backgrounds (#F8FAFC).
- Layout: Full-screen mobile view, fixed bottom navigation, rounded corners (2xl/3xl), subtle shadows.
- Icons: Lucide React.

## 5. Development Roadmap (Prioritized)
1. **Setup:** Initialize Next.js project with Tailwind, TS, and Lucide.
2. **Auth:** Implement Login flow using Next-Auth or Supabase Auth.
3. **Database:** Setup schema and connection logic.
4. **Dashboard:** Build the Freshman Dashboard with Token display and History list.
5. **Scanner:** Implement QR Code scanning using `html5-qrcode`.
6. **API:** Create a `/api/scan` route that handles token logic and prevents duplicates.
7. **Leaderboard:** (Optional) Real-time ranking.

## 6. Code Style Requirements
- Use Functional Components and React Hooks.
- Prefer Server Components for data fetching where possible.
- Ensure all components are fully typed with TypeScript.
- Error handling: Always return user-friendly messages for "Already Scanned" or "Invalid QR".

---
*Note: Always verify the current state of the project before writing new files. Refer to @image_ec477f.png for UI accuracy.*
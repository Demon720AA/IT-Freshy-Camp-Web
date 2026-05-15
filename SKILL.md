# Project Skill: Freshman Orientation Token Web App (Next.js 16 + Supabase)

This document serves as the primary knowledge base and operational guide for maintaining and extending the **Freshman Orientation Token Web App**.

## 1. Project Core Identity
- **Purpose**: A mobile-first web app for university freshmen to collect tokens by scanning senior QR codes.
- **Goal**: Gamify the orientation experience with real-time leaderboards and scan history.
- **Theme**: Custom Modern Palette (Primary #3bc4d2, Secondary #3244bb).

## 2. Technical Stack & Conventions
### Framework & Runtime
- **Next.js 15/16 (App Router)**: Utilizing Turbopack for high-performance development.
- **TypeScript**: Strict typing for all components and database entities.
- **Tailwind CSS 4**: Modern utility-first styling with a mobile-first focus.

### Specialized Next.js 16 Patterns (CRITICAL)
- **Proxy Convention**: Next.js 16 deprecates `middleware.ts` in favor of `src/proxy.ts`. 
- **Exports**: The proxy file must export a function named `proxy`. For maximum compatibility, our project uses a dual export:
  ```typescript
  export async function proxy(request: NextRequest) { ... }
  export const middleware = proxy; // Backward compatibility
  ```

### Database & Auth (Supabase)
- **Supabase SSR**: Using `@supabase/ssr` for server-side session management.
- **Authentication**: Pre-seeded accounts. Login via `student_id` (converted to email internally) and password.
- **Password Management**:
    - **Reset Password**: Standard Supabase flow using `resetPasswordForEmail`.
    - **Account Seeding**: Use `auth.admin.inviteUserByEmail()` for a secure first-password experience.
    - **Callback**: `/auth/callback` handles all auth redirects and token exchanges.
- **Session Middleware**: Located in `src/utils/supabase/middleware.ts`, handles token refreshing and route protection.

## 3. Business Logic & Role System
### Role Definitions
1. **`FRESHMAN`**:
   - Collects tokens by scanning.
   - Accesses: Dashboard (Token count), Scanner, Leaderboard, History.
2. **`SENIOR`**:
   - Provides QR codes for scanning.
   - Accesses: Dashboard (Scan count), "My QR" page.
3. **`ADMIN`**:
   - Oversight and account seeding (standard database access).

### Anti-Cheat Logic
- **Database Enforcement**: The `scans` table has a `UNIQUE(freshman_id, senior_id)` constraint.
- **Logic**: A Freshman can scan each Senior exactly once. The API returns a 400 error ("Already scanned") on duplicates.

## 4. Database Schema Summary
- **`profiles`**: Stores user data, roles, and `total_tokens`.
- **`scans`**: Records every successful interaction between a Freshman and a Senior.
- **RLS (Row Level Security)**: 
  - Everyone can see profiles.
  - Users can only see their own scans.
  - Only Freshmen can insert new scans.

## 5. UI/UX Guidelines
- **Mobile-First**: Max-width of `448px` (max-w-md) centered on the screen with a shadow.
- **Color Palette**: 
    - **Primary**: `#3bc4d2` (Teal/Blue)
    - **Secondary/Background**: `#3244bb` (Deep Blue)
- **Icons**: Lucide React.
- **QR Generation**: `qrcode.react` (SVG mode) with download support for Seniors.
- **QR Scanning**: `html5-qrcode` with a custom full-screen overlay and success/error states.

## 6. Deployment & Operations
### Environment Variables
The following must be set in `.env.local` (locally) and Vercel (production):
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Public/Anon API key.

### Common Troubleshooting
- **Invalid supabaseUrl**: Ensure environment variables are correctly loaded and don't contain placeholder text like "your-supabase-url".
- **Middleware/Proxy Errors**: If "Missing expected function export name" occurs, verify `src/proxy.ts` exports an `async function proxy`.
- **Authentication Failed**: Ensure the login format matches the seeded data (e.g., `student_id@tni.ac.th`).

## 7. Operational Workflow for Agents
- **Testing**: Always run `npm run build` before pushing to verify Next.js 16 type-safety and proxy conventions.
- **Styling**: Adhere to the `src/app/globals.css` theme variables.
- **Git**: Use semantic commit messages (e.g., `feat:`, `fix:`, `chore:`).
- **Supabase**: Always refer to `supabase-schema.sql` before modifying database interactions.

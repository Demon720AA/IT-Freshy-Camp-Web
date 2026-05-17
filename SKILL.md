# Project Skill: Freshman Orientation Token Web App (Next.js 16 + Supabase)

This document serves as the primary knowledge base and operational guide for maintaining and extending the **Freshman Orientation Token Web App**.

## 1. Project Core Identity
- **Purpose**: A mobile-first web app for university freshmen to collect tokens by scanning senior QR codes.
- **Goal**: Gamify the orientation experience with real-time leaderboards and scan history.
- **Theme**: TNI-style Modern Blue (Primary #2563eb, Background #f8fafc).

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
    - **Email Rate Limits**: Default Supabase limit is 3/hour. Use **Custom SMTP (e.g., Resend)** to bypass this.
    - **URL Configuration**: Must set "Site URL" and "Redirect URLs" in Supabase Dashboard to match the environment.
    - **Development**: Site URL = `http://localhost:3000`
    - **Production**: Site URL = `https://your-app.vercel.app`
    - **Redirect URLs**: Add `https://your-app.vercel.app/**` to allow all paths.
    - **Callback**: `/auth/callback` handles all auth redirects and token exchanges.
- **Admin Tasks**: Use `src/utils/supabase/admin.ts` with the `SERVICE_ROLE_KEY` for server-side tasks that require bypassing RLS (e.g., forced resets).
- **Session Middleware**: Located in `src/utils/supabase/middleware.ts`, handles token refreshing and route protection.

## 3. Business Logic & Role System
### Role Definitions
1. **`FRESHMAN`**:
   - Collects tokens by scanning.
   - Accesses: Dashboard (Token count), Scanner, Leaderboard, History.
2. **`SENIOR`**:
   - Provides QR codes for scanning.
   - Accesses: Dashboard (Total scan count), "My QR" page, Recent scan history.
3. **`ADMIN`**:
   - Oversight and account seeding (standard database access).

### Atomic Increments
- **RPC Function**: Use `increment_tokens(user_id)` to update token counts.
- **Security**: The function must be created with `SECURITY DEFINER` in SQL to allow Freshmen to update Senior profiles without direct table permissions.

### Anti-Cheat Logic
- **Database Enforcement**: The `scans` table has a `UNIQUE(freshman_id, senior_id)` constraint.
- **Logic**: A Freshman can scan each Senior exactly once. The API returns a 400 error ("Already scanned") on duplicates.

## 4. Database Schema Summary
- **`profiles`**: Stores user data, roles, and `total_tokens`.
- **`scans`**: Records every successful interaction between a Freshman and a Senior.
- **RLS (Row Level Security)**: 
  - Everyone can see profiles.
  - Users can update their own profile.
  - **Scans Visibility**: Users can see scans where they are either the `freshman_id` or the `senior_id`.
  - Only Freshmen can insert new scans.

## 5. UI/UX Guidelines
- **Mobile-First**: Max-width of `448px` (max-w-md) centered on the screen with a shadow.
- **Dynamic Updates**: Use `export const dynamic = 'force-dynamic'` on dashboard pages to ensure real-time token and scan history updates.
- **Color Palette**: 
    - **Primary**: `#2563eb` (Royal Blue)
    - **Secondary/Background**: `#f8fafc` (Slate 50)
- **Icons**: Lucide React.
- **QR Generation**: `qrcode.react` (SVG mode) with download support for Seniors.
- **QR Scanning**: `html5-qrcode` with a custom full-screen overlay and success/error states.

## 6. Deployment & Operations
### Environment Variables
The following must be set in `.env.local` (locally) and Vercel (production):
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Public/Anon API key.
- `SUPABASE_SERVICE_ROLE_KEY`: Secret key for admin-level server tasks (Keep private!).

### Common Troubleshooting
- **Invalid supabaseUrl**: Ensure environment variables are correctly loaded.
- **Middleware/Proxy Errors**: If "Missing expected function export name" occurs, verify `src/proxy.ts` exports an `async function proxy`.
- **Email Not Arriving**: Check Supabase "Email Rate Limit" (Default 3/hr). Switch to Custom SMTP (Resend).
- **Senior Count Not Updating**: Ensure the `increment_tokens` SQL function uses `SECURITY DEFINER`.
- **Senior Can't See Recent Scans**: Ensure the `scans` RLS policy allows `auth.uid() = senior_id`.
- **Authentication Failed**: Ensure the login format matches the seeded data (e.g., `student_id@tni.ac.th`).

## 7. Operational Workflow for Agents
- **Testing**: Always run `npm run build` before pushing to verify Next.js 16 type-safety and proxy conventions.
- **Styling**: Adhere to the `src/app/globals.css` theme variables.
- **Git**: Use semantic commit messages (e.g., `feat:`, `fix:`, `chore:`).
- **Supabase**: Always refer to `supabase-schema.sql` before modifying database interactions.

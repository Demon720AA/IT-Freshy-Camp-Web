# Freshy Camp: Token Collection Web App

A modern, mobile-first web application designed for University Freshman Orientation Events. This app allows Freshmen to collect "Tokens" by scanning QR codes provided by Seniors, featuring an anti-cheat mechanism, real-time leaderboard, and full password management.

## 🚀 Features

- **Auth System**: Secure login via Student ID and password.
- **Password Management**: Full "Forgot Password" flow and secure account onboarding via Supabase invites.
- **Role-Based Experience**:
  - **Freshmen**: Personal dashboard, high-performance QR scanner, ranking, and scan history.
  - **Seniors**: Dedicated QR code page with download/share capability and real-time scan logs.
- **Mobile-First Dashboard**: Clean, modern blue-themed UI (#2563EB) designed for handheld devices.
- **Anti-Cheat Mechanism**: Enforces "one scan per senior" rule at the database level using composite unique keys.
- **Real-time Leaderboard**: Ranking system to display top freshmen performers.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) - Utilizing the new `proxy.ts` convention.
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase SSR](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Scanning**: [html5-qrcode](https://github.com/mebjas/html5-qrcode)
- **QR Generation**: [qrcode.react](https://github.com/zpao/qrcode.react)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Demon720AA/IT-Freshy-Camp-Web.git
   cd IT-Freshy-Camp-Web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄️ Database Setup

Run the following SQL script in your Supabase SQL Editor to set up the required tables and Row Level Security (RLS) policies:

```sql
-- 1. Create Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('FRESHMAN', 'SENIOR', 'ADMIN')) NOT NULL,
  total_tokens INTEGER DEFAULT 0
);

-- 2. Create Scans Table
CREATE TABLE scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  freshman_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  senior_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(freshman_id, senior_id)
);

-- 3. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view their own scans." ON scans FOR SELECT USING (auth.uid() = freshman_id);
CREATE POLICY "Freshmen can insert scans." ON scans FOR INSERT WITH CHECK (
    auth.uid() = freshman_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'FRESHMAN')
);
```

## 📸 UI Style

The app features a clean university-style blue theme:
- **Primary Color**: `#2563EB` (Blue)
- **Background**: `#F8FAFC` (Light Slate)
- **Layout**: Centered mobile view (`max-w-md`) with 2xl/3xl rounded corners.

## 📄 License

This project is licensed under the MIT License.

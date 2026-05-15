# Freshy Camp: Token Collection Web App

A modern, mobile-first web application designed for University Freshman Orientation Events. This app allows Freshmen to collect "Tokens" by scanning QR codes provided by Seniors, featuring an anti-cheat mechanism and real-time leaderboard.

## 🚀 Features

- **Auth System**: Secure login via Student ID and password (integrated with Supabase Auth).
- **Mobile-First Dashboard**: Clean, modern blue-themed UI designed specifically for mobile devices.
- **QR Scanner**: High-performance QR scanning using `html5-qrcode` with a custom-styled overlay.
- **Anti-Cheat Mechanism**: Enforces "one scan per senior" rule at the database level using composite unique keys.
- **Real-time Leaderboard**: Ranking system to display top freshmen performers.
- **Collection History**: Detailed log of all scanned seniors and tokens earned.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Logic**: [html5-qrcode](https://github.com/mebjas/html5-qrcode)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/it-freshy-camp-web.git
   cd it-freshy-camp-web
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
  total_tokens INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
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

## 📸 UI Preview

The app features a modern TNI-style blue theme:
- **Primary Blue**: `#2563EB`
- **Background**: `#F8FAFC`
- **Rounded Corners**: `3rem` for containers, `2xl` for cards.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

FRESHMAN
SENIOR

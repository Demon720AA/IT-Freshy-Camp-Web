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

-- 4. RLS Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5. RLS Policies for Scans
CREATE POLICY "Users can view their own scans." ON scans
  FOR SELECT USING (auth.uid() = freshman_id);

CREATE POLICY "Freshmen can insert scans." ON scans
  FOR INSERT WITH CHECK (
    auth.uid() = freshman_id AND 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'FRESHMAN')
  );

-- 6. Trigger to auto-create profile on signup (Optional, if using Supabase Auth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, student_id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'student_id', new.raw_user_meta_data->>'full_name', 'FRESHMAN');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 1. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 2. Profiles Table (Extends Auth Users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('jobseeker', 'freelancer', 'founder')) DEFAULT 'jobseeker',
  bio TEXT,
  builder_score INTEGER DEFAULT 500,
  wallet_address TEXT UNIQUE,
  is_premium BOOLEAN DEFAULT FALSE,
  skills TEXT[],
  avatar_url TEXT,
  banner_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Jobs Table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT DEFAULT 'Remote',
  type TEXT DEFAULT 'Full-time',
  budget TEXT,
  status TEXT CHECK (status IN ('open', 'filled', 'closed')) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Services Table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_usdc DECIMAL NOT NULL,
  delivery_days INTEGER DEFAULT 7,
  category TEXT,
  rating DECIMAL DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Startups & Blueprints Table
CREATE TABLE market_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('startup', 'blueprint')) NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  revenue DECIMAL,
  users_count INTEGER,
  asking_price DECIMAL NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Messages Table (Real-time)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Notifications Table (Real-time)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 9. Basic RLS Policies
-- Profiles: Users can see all profiles but only edit theirs.
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Jobs: Anyone can view open jobs, only founders can create/edit theirs.
CREATE POLICY "Open jobs are viewable by everyone" ON jobs FOR SELECT USING (status = 'open');
CREATE POLICY "Founders can manage their jobs" ON jobs FOR ALL USING (auth.uid() = founder_id);

-- Messages: Users can only see messages in conversations they are part of.
CREATE POLICY "Users can see their own messages" ON messages FOR SELECT USING (auth.uid() = sender_id);

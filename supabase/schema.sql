-- Foundry Network Database Schema & RLS Policies

-- Drop existing tables to allow clean recreation
DROP TABLE IF EXISTS public.community_members CASCADE;
DROP TABLE IF EXISTS public.communities CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.followers CASCADE;
DROP TABLE IF EXISTS public.blueprints CASCADE;
DROP TABLE IF EXISTS public.startups CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.job_type CASCADE;
DROP TYPE IF EXISTS public.job_status CASCADE;
DROP TYPE IF EXISTS public.application_status CASCADE;
DROP TYPE IF EXISTS public.order_status CASCADE;
DROP TYPE IF EXISTS public.startup_stage CASCADE;
DROP TYPE IF EXISTS public.post_type CASCADE;
DROP TYPE IF EXISTS public.transaction_type CASCADE;
DROP TYPE IF EXISTS public.transaction_status CASCADE;
DROP TYPE IF EXISTS public.community_role CASCADE;

-- Create custom types
CREATE TYPE user_role AS ENUM ('jobseeker', 'freelancer', 'founder');
CREATE TYPE job_type AS ENUM ('fulltime', 'parttime', 'contract', 'gig');
CREATE TYPE job_status AS ENUM ('open', 'closed', 'filled');
CREATE TYPE application_status AS ENUM ('pending', 'viewed', 'interview', 'accepted', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'in_progress', 'delivered', 'completed', 'disputed', 'refunded');
CREATE TYPE startup_stage AS ENUM ('idea', 'mvp', 'revenue', 'growth');
CREATE TYPE post_type AS ENUM ('update', 'blueprint_share', 'job_share', 'milestone');
CREATE TYPE transaction_type AS ENUM ('premium', 'service_payment', 'escrow_lock', 'escrow_release', 'blueprint_purchase');
CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed', 'failed');
CREATE TYPE community_role AS ENUM ('member', 'moderator', 'admin');

-- 1. Users Table (Extension of Supabase Auth)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    wallet_address TEXT UNIQUE,
    role user_role DEFAULT 'freelancer',
    is_premium BOOLEAN DEFAULT false,
    builder_score INTEGER DEFAULT 0,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Profiles Table
CREATE TABLE public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    bio TEXT,
    skills TEXT[],
    portfolio_links JSONB DEFAULT '[]'::jsonb,
    social_links JSONB DEFAULT '{}'::jsonb,
    resume_url TEXT,
    profile_image TEXT,
    banner_image TEXT,
    build_in_public BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Services Table
CREATE TABLE public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price_usdc DECIMAL(10,2) NOT NULL,
    delivery_days INTEGER NOT NULL,
    tiers JSONB DEFAULT '[]'::jsonb,
    images TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0.00,
    orders_completed INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 4. Jobs Table
CREATE TABLE public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    founder_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10,2),
    job_type job_type NOT NULL,
    is_remote BOOLEAN DEFAULT true,
    skills_required TEXT[] DEFAULT '{}',
    status job_status DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- 5. Applications Table
CREATE TABLE public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    applicant_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    cover_letter TEXT,
    resume_link TEXT,
    status application_status DEFAULT 'pending',
    applied_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(job_id, applicant_id)
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 6. Orders (Escrow) Table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID REFERENCES public.services(id) NOT NULL,
    buyer_id UUID REFERENCES public.users(id) NOT NULL,
    seller_id UUID REFERENCES public.users(id) NOT NULL,
    amount_usdc DECIMAL(10,2) NOT NULL,
    escrow_wallet TEXT,
    transaction_hash TEXT,
    status order_status DEFAULT 'pending',
    delivery_file_url TEXT,
    buyer_approved BOOLEAN,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 7. Startups Table
CREATE TABLE public.startups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    founder_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    industry TEXT,
    stage startup_stage DEFAULT 'idea',
    monthly_revenue DECIMAL(10,2) DEFAULT 0.00,
    user_count INTEGER DEFAULT 0,
    asking_price DECIMAL(12,2),
    is_for_sale BOOLEAN DEFAULT false,
    looking_for TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;

-- 8. Blueprints Table
CREATE TABLE public.blueprints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    market_opportunity TEXT,
    monetization TEXT,
    price_usdc DECIMAL(10,2) DEFAULT 0.00,
    is_auctioned BOOLEAN DEFAULT false,
    interested_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;

-- 9. Social Tables
CREATE TABLE public.followers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, follower_id)
);
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT,
    media_urls TEXT[] DEFAULT '{}',
    post_type post_type DEFAULT 'update',
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 10. Transactions Table
CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    wallet_address TEXT NOT NULL,
    amount_usdc DECIMAL(10,2) NOT NULL,
    token TEXT DEFAULT 'USDC',
    transaction_hash TEXT UNIQUE NOT NULL,
    type transaction_type NOT NULL,
    status transaction_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 11. Communities Tables
CREATE TABLE public.communities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES public.users(id) NOT NULL,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    is_private BOOLEAN DEFAULT false,
    member_count INTEGER DEFAULT 1,
    invite_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.community_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role community_role DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(community_id, user_id)
);
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- 12. Trigger to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (new.id, new.email, split_part(new.email, '@', 1) || '_' || substr(md5(random()::text), 1, 6));

  INSERT INTO public.profiles (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- RLS Policies (Basic setup)

-- Users table policies
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own record" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Services policies
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (is_active = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert own services" ON public.services FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own services" ON public.services FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own services" ON public.services FOR DELETE USING (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Founders can insert jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = founder_id);
CREATE POLICY "Founders can update own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = founder_id);
CREATE POLICY "Founders can delete own jobs" ON public.jobs FOR DELETE USING (auth.uid() = founder_id);

-- Applications policies
CREATE POLICY "Founders can view applications for their jobs" ON public.applications FOR SELECT USING (
    job_id IN (SELECT id FROM public.jobs WHERE founder_id = auth.uid()) OR applicant_id = auth.uid()
);
CREATE POLICY "Users can apply for jobs" ON public.applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Users can update their own pending applications" ON public.applications FOR UPDATE USING (auth.uid() = applicant_id AND status = 'pending');
CREATE POLICY "Founders can update application status" ON public.applications FOR UPDATE USING (
    job_id IN (SELECT id FROM public.jobs WHERE founder_id = auth.uid())
);

-- Orders policies
CREATE POLICY "Users can view their own orders (buyer or seller)" ON public.orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers and Sellers can update their orders" ON public.orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Startups policies
CREATE POLICY "Startups are viewable by everyone" ON public.startups FOR SELECT USING (true);
CREATE POLICY "Founders can insert startups" ON public.startups FOR INSERT WITH CHECK (auth.uid() = founder_id);
CREATE POLICY "Founders can update own startups" ON public.startups FOR UPDATE USING (auth.uid() = founder_id);
CREATE POLICY "Founders can delete own startups" ON public.startups FOR DELETE USING (auth.uid() = founder_id);

-- Blueprints policies
CREATE POLICY "Blueprints are viewable by everyone" ON public.blueprints FOR SELECT USING (true);
CREATE POLICY "Creators can insert blueprints" ON public.blueprints FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update own blueprints" ON public.blueprints FOR UPDATE USING (auth.uid() = creator_id);

-- Social (Posts) policies
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can insert own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Followers policies
CREATE POLICY "Followers are viewable by everyone" ON public.followers FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON public.followers FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON public.followers FOR DELETE USING (auth.uid() = follower_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
-- System / Admin will handle inserts/updates for financial integrity via Edge Functions

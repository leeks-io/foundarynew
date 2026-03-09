-- ============================================================
-- FOUNDRY NETWORK — SCHEMA PATCH (Clean Drop + Recreate)
-- Safe to run multiple times
-- ============================================================

create extension if not exists "uuid-ossp";

-- ─── DROP & RECREATE NEW TABLES ─────────────────────────────
-- (safe because these are new tables with no user data yet)
drop table if exists public.service_orders  cascade;
drop table if exists public.post_comments   cascade;
drop table if exists public.post_likes      cascade;
drop table if exists public.posts           cascade;
drop table if exists public.blueprints      cascade;

-- ─── POSTS ──────────────────────────────────────────────────
create table public.posts (
  id             uuid primary key default uuid_generate_v4(),
  author_id      uuid references public.profiles(id) on delete cascade not null,
  content        text not null check (char_length(content) <= 500),
  image_url      text,
  likes_count    integer not null default 0,
  comments_count integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.post_likes (
  post_id    uuid references public.posts(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.post_comments (
  id         uuid primary key default uuid_generate_v4(),
  post_id    uuid references public.posts(id) on delete cascade not null,
  author_id  uuid references public.profiles(id) on delete cascade not null,
  content    text not null,
  created_at timestamptz not null default now()
);

-- ─── BLUEPRINTS ─────────────────────────────────────────────
create table public.blueprints (
  id          uuid primary key default uuid_generate_v4(),
  author_id   uuid references public.profiles(id) on delete cascade not null,
  title       text not null,
  description text,
  content     text,
  category    text,
  tags        text[] not null default '{}',
  is_premium  boolean not null default false,
  price       integer default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── SERVICE ORDERS ─────────────────────────────────────────
create table public.service_orders (
  id         uuid primary key default uuid_generate_v4(),
  service_id uuid references public.services(id) on delete set null,
  buyer_id   uuid references public.profiles(id) on delete cascade not null,
  seller_id  uuid references public.profiles(id) on delete cascade not null,
  amount     integer not null,
  status     text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ─── ADD MISSING COLUMNS TO EXISTING TABLES ─────────────────
alter table public.communities
  add column if not exists member_count integer not null default 0,
  add column if not exists is_public    boolean not null default true,
  add column if not exists category     text,
  add column if not exists avatar_url   text;

alter table public.startups
  add column if not exists is_public boolean not null default true;

-- ─── ENABLE RLS ─────────────────────────────────────────────
alter table public.posts           enable row level security;
alter table public.post_likes      enable row level security;
alter table public.post_comments   enable row level security;
alter table public.blueprints      enable row level security;
alter table public.service_orders  enable row level security;

-- ─── POLICIES: posts ────────────────────────────────────────
create policy "Posts readable by all"
  on public.posts for select using (true);
create policy "Authenticated users can post"
  on public.posts for insert with check (auth.uid() = author_id);
create policy "Authors can update own posts"
  on public.posts for update using (auth.uid() = author_id);
create policy "Authors can delete own posts"
  on public.posts for delete using (auth.uid() = author_id);

-- ─── POLICIES: post_likes ────────────────────────────────────
create policy "Likes readable by all"
  on public.post_likes for select using (true);
create policy "Authenticated users can like"
  on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Users can remove own likes"
  on public.post_likes for delete using (auth.uid() = user_id);

-- ─── POLICIES: post_comments ────────────────────────────────
create policy "Comments readable by all"
  on public.post_comments for select using (true);
create policy "Authenticated users can comment"
  on public.post_comments for insert with check (auth.uid() = author_id);
create policy "Comment authors can delete"
  on public.post_comments for delete using (auth.uid() = author_id);

-- ─── POLICIES: blueprints ───────────────────────────────────
create policy "Blueprints readable by all"
  on public.blueprints for select using (true);
create policy "Authenticated users can create blueprints"
  on public.blueprints for insert with check (auth.uid() = author_id);
create policy "Authors can update own blueprints"
  on public.blueprints for update using (auth.uid() = author_id);
create policy "Authors can delete own blueprints"
  on public.blueprints for delete using (auth.uid() = author_id);

-- ─── POLICIES: service_orders ───────────────────────────────
create policy "Participants can see their orders"
  on public.service_orders for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Authenticated users can create orders"
  on public.service_orders for insert with check (auth.uid() = buyer_id);

-- ─── INDEXES ────────────────────────────────────────────────
create index posts_author_idx       on public.posts(author_id);
create index posts_created_idx      on public.posts(created_at desc);
create index blueprints_author_idx  on public.blueprints(author_id);
create index blueprints_created_idx on public.blueprints(created_at desc);

-- ─── TRIGGER: sync likes_count ──────────────────────────────
create or replace function public.handle_post_like_change()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    update public.posts
      set likes_count = likes_count + 1
      where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update public.posts
      set likes_count = greatest(0, likes_count - 1)
      where id = OLD.post_id;
  end if;
  return null;
end;
$$;

drop trigger if exists on_post_like_change on public.post_likes;
create trigger on_post_like_change
  after insert or delete on public.post_likes
  for each row execute procedure public.handle_post_like_change();

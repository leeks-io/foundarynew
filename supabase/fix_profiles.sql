-- ============================================================
-- FIX: Auto-create profiles for existing auth users
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create missing profile rows for any auth users that don't have one
insert into public.profiles (id, username, full_name, avatar_url, skills, is_premium)
select
  u.id,
  lower(split_part(u.email, '@', 1)) || '_' || substr(u.id::text, 1, 6) as username,
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)) as full_name,
  u.raw_user_meta_data->>'avatar_url' as avatar_url,
  '{}' as skills,
  false as is_premium
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- 2. Ensure the trigger exists for future signups
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url, skills, is_premium)
  values (
    new.id,
    lower(split_part(new.email, '@', 1)) || '_' || substr(new.id::text, 1, 6),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    '{}',
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

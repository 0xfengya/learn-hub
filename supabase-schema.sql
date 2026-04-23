-- ============================================================
-- LearnHub Supabase Schema (Updated with Admin Role)
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabel profiles (extend auth.users)
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text,
  avatar_url  text,
  role        text default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz default now()
);

-- Tambah kolom role kalau tabel sudah ada
alter table public.profiles add column if not exists role text default 'user' check (role in ('user', 'admin'));

-- RLS Profiles
alter table public.profiles enable row level security;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Admin can view all profiles" on public.profiles;

create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Admin can view all profiles"  on public.profiles for select using (
  exists (select 1 from public.profiles p2 where p2.id = auth.uid() and p2.role = 'admin')
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, new.raw_user_meta_data->>'name', 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. Tabel module_progress
create table if not exists public.module_progress (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  module_id   int not null,
  lesson_idx  int not null,
  completed   boolean default false,
  updated_at  timestamptz default now(),
  unique(user_id, module_id, lesson_idx)
);

alter table public.module_progress enable row level security;
drop policy if exists "Users own their progress" on public.module_progress;
drop policy if exists "Admin can view all progress" on public.module_progress;
create policy "Users own their progress" on public.module_progress
  for all using (auth.uid() = user_id);
create policy "Admin can view all progress" on public.module_progress
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );


-- 3. Tabel artikel_bookmarks
create table if not exists public.artikel_bookmarks (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  artikel_id  int not null,
  created_at  timestamptz default now(),
  unique(user_id, artikel_id)
);

alter table public.artikel_bookmarks enable row level security;
drop policy if exists "Users own their bookmarks" on public.artikel_bookmarks;
drop policy if exists "Admin can view all bookmarks" on public.artikel_bookmarks;
create policy "Users own their bookmarks" on public.artikel_bookmarks
  for all using (auth.uid() = user_id);
create policy "Admin can view all bookmarks" on public.artikel_bookmarks
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- CARA SET ADMIN (jalankan setelah register akun admin):
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'uuid-user-kamu';
-- UUID bisa dilihat di Supabase → Authentication → Users
-- ============================================================

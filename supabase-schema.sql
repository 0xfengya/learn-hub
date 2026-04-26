-- ============================================================
-- LearnHub Supabase Schema (Full — dengan Articles & Modules)
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabel profiles (extend auth.users)
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text,
  bio         text,
  avatar_url  text,
  role        text default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz default now()
);

-- Tambah kolom jika tabel sudah ada
alter table public.profiles add column if not exists role       text default 'user' check (role in ('user', 'admin'));
alter table public.profiles add column if not exists bio        text;
alter table public.profiles add column if not exists avatar_url text;

-- RLS Profiles
alter table public.profiles enable row level security;
drop policy if exists "Users can view own profile"  on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Admin can view all profiles"  on public.profiles;
drop policy if exists "Public can view profiles"     on public.profiles;

create policy "Public can view profiles"     on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

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


-- 4. Tabel articles (konten dikelola admin)
create table if not exists public.articles (
  id          bigint generated always as identity primary key,
  title       text not null,
  excerpt     text,
  content     text,
  category    text default 'Pemula',
  cat_color   text default '#22c55e',
  author      text default 'Admin',
  image_url   text,
  read_time   text default '5 mnt',
  published   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.articles enable row level security;
drop policy if exists "Anyone can read articles"  on public.articles;
drop policy if exists "Admin can manage articles" on public.articles;
create policy "Anyone can read articles"  on public.articles for select using (published = true);
create policy "Admin can manage articles" on public.articles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);


-- 5. Tabel modules (konten dikelola admin)
create table if not exists public.modules (
  id          bigint generated always as identity primary key,
  num         text not null default '01',
  icon        text default 'â‚¿',
  title       text not null,
  description text,
  long_desc   text,
  duration    text default '30 mnt',
  level       text default 'Pemula',
  accent      text default '#f59e0b',
  level_color text default '#22c55e',
  published   boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.modules enable row level security;
drop policy if exists "Anyone can read modules"  on public.modules;
drop policy if exists "Admin can manage modules" on public.modules;
create policy "Anyone can read modules"  on public.modules for select using (published = true);
create policy "Admin can manage modules" on public.modules for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);


-- 6. Tabel module_lessons (pelajaran di tiap modul)
create table if not exists public.module_lessons (
  id          bigint generated always as identity primary key,
  module_id   bigint references public.modules(id) on delete cascade not null,
  title       text not null,
  duration    text default '5 mnt',
  sort_order  int default 0,
  created_at  timestamptz default now()
);

alter table public.module_lessons enable row level security;
drop policy if exists "Anyone can read lessons"  on public.module_lessons;
drop policy if exists "Admin can manage lessons" on public.module_lessons;
create policy "Anyone can read lessons"  on public.module_lessons for select using (true);
create policy "Admin can manage lessons" on public.module_lessons for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================================
-- CARA SET ADMIN:
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'uuid-user-kamu';
-- UUID bisa dilihat di Supabase > Authentication > Users
-- ============================================================

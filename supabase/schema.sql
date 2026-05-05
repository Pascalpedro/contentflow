-- ═══════════════════════════════════════════════════════════
-- ContentFlow — Full Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

-- ─── Extensions ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Profiles (extends auth.users) ──────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  company     text,
  plan        text default 'starter',
  timezone    text default 'America/New_York',
  created_at  timestamptz default now()
);

-- ─── Orders ─────────────────────────────────────────────────
create table if not exists public.orders (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid references public.profiles(id) on delete cascade not null,
  order_ref         text not null,
  title             text,
  content_type      text not null,
  status            text not null default 'new'
                    check (status in ('new','in_progress','pending_review','revision','completed','archived')),
  priority          text not null default 'medium'
                    check (priority in ('low','medium','high','urgent')),
  brief             text,
  audience          text,
  tone              text default 'Professional',
  keywords          text,
  word_count        int default 1000,
  price             numeric(10,2),
  due_date          date,
  delivered_at      timestamptz,
  delivered_content text,
  revision_notes    text,
  reference_urls    text,
  notes             text,
  author            text,
  avatar            text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ─── Messages ───────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid references public.orders(id) on delete cascade not null,
  sender_id   uuid references public.profiles(id) on delete cascade not null,
  sender_name text,
  sender_avatar text,
  content     text not null,
  is_own      boolean default false,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

-- ─── Invoices ───────────────────────────────────────────────
create table if not exists public.invoices (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  amount      numeric(10,2) not null,
  status      text not null default 'pending'
              check (status in ('paid','pending','overdue')),
  description text,
  due_date    date,
  paid_at     timestamptz,
  stripe_id   text,
  created_at  timestamptz default now()
);

-- ─── Activity Log ────────────────────────────────────────────
create table if not exists public.activity_log (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  order_id    uuid references public.orders(id) on delete set null,
  action      text not null,
  description text,
  created_at  timestamptz default now()
);

-- ─── Auto-update updated_at ──────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute procedure public.handle_updated_at();

-- ─── Auto-create profile on signup ──────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Row-Level Security ──────────────────────────────────────
alter table public.profiles     enable row level security;
alter table public.orders       enable row level security;
alter table public.messages     enable row level security;
alter table public.invoices     enable row level security;
alter table public.activity_log enable row level security;

-- Add strict length constraints for DB Security
alter table public.orders
  add constraint title_length check (char_length(title) <= 255),
  add constraint brief_length check (char_length(brief) <= 10000);

-- Profiles
drop policy if exists "Users view own profile" on public.profiles;
create policy "Users view own profile"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Orders
drop policy if exists "Users view own orders" on public.orders;
create policy "Users view own orders"
  on public.orders for select using (auth.uid() = user_id);

drop policy if exists "Users create orders" on public.orders;
create policy "Users create orders"
  on public.orders for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own orders" on public.orders;
create policy "Users update own orders"
  on public.orders for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Messages
drop policy if exists "Users view messages on own orders" on public.messages;
create policy "Users view messages on own orders"
  on public.messages for select using (
    exists (select 1 from public.orders where orders.id = messages.order_id and orders.user_id = auth.uid())
  );

drop policy if exists "Users send messages on own orders" on public.messages;
create policy "Users send messages on own orders"
  on public.messages for insert with check (
    auth.uid() = sender_id and
    exists (select 1 from public.orders where orders.id = messages.order_id and orders.user_id = auth.uid())
  );

-- Invoices
drop policy if exists "Users view own invoices" on public.invoices;
create policy "Users view own invoices"
  on public.invoices for select using (auth.uid() = user_id);

-- Activity log
drop policy if exists "Users view own activity" on public.activity_log;
create policy "Users view own activity"
  on public.activity_log for select using (auth.uid() = user_id);

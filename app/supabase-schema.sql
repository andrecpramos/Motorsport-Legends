-- ─── Legends Classic Automobiles — Supabase Schema ───────────────────────────
-- Run this in your Supabase project: SQL Editor → New Query → paste → Run

-- Enquiries table
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  car         text not null,
  name        text not null,
  email       text not null,
  phone       text,
  message     text
);

-- Index for dashboard queries (latest first, filtered by car)
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_car_idx         on public.enquiries (car);

-- ─── Row Level Security ──────────────────────────────────────────────────────
-- Enable RLS so the anon key cannot read or list enquiries from the browser.
-- Only the service_role key (used by our API routes) can bypass RLS.

alter table public.enquiries enable row level security;

-- No public read — only service_role (our API) can read
create policy "Service role only read"
  on public.enquiries
  for select
  using (false);   -- anon/authenticated = blocked; service_role bypasses RLS automatically

-- No public insert — all inserts go through the API route
create policy "Service role only insert"
  on public.enquiries
  for insert
  with check (false);

-- ─── Done ────────────────────────────────────────────────────────────────────
-- After running this, verify in Table Editor that the enquiries table appears.

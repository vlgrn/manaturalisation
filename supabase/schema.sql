-- NaturaGE — Supabase schema + Row-Level Security.
-- Run this in the Supabase SQL editor. Auth (email + Google) is configured in the
-- Supabase dashboard (Authentication > Providers).
--
-- Design: every user-owned table is scoped by `user_id = auth.uid()` via RLS, so
-- each user only ever sees their own rows. Static reference content (conditions,
-- documents, steps, costs) lives in the repo, NOT in the DB.

-- ---------- profile ----------
-- One row per auth user. `has_paid` is flipped by the Stripe webhook (service role).
create table if not exists public.profile (
  id          uuid primary key references auth.users (id) on delete cascade,
  has_paid    boolean not null default false,
  locale      text not null default 'fr',
  created_at  timestamptz not null default now()
);

alter table public.profile enable row level security;

create policy "profile_select_own" on public.profile
  for select using (auth.uid() = id);
create policy "profile_update_own" on public.profile
  for update using (auth.uid() = id);
create policy "profile_insert_own" on public.profile
  for insert with check (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profile (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- eligibility_answers ----------
create table if not exists public.eligibility_answers (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  answers          jsonb not null default '{}'::jsonb,
  computed_result  jsonb,
  computed_at      timestamptz not null default now()
);

alter table public.eligibility_answers enable row level security;
create policy "elig_all_own" on public.eligibility_answers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- documents ----------
-- doc_key matches the keys in src/content/documents.ts.
create table if not exists public.documents (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  doc_key         text not null,
  status          text not null default 'not_started'
                    check (status in ('not_started','in_progress','obtained')),
  requested_date  date,
  obtained_date   date,
  expires_date    date,
  updated_at      timestamptz not null default now(),
  unique (user_id, doc_key)
);

alter table public.documents enable row level security;
create policy "documents_all_own" on public.documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- steps_progress ----------
create table if not exists public.steps_progress (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  step_key        text not null,
  status          text not null default 'todo'
                    check (status in ('todo','in_progress','done')),
  completed_date  date,
  unique (user_id, step_key)
);

alter table public.steps_progress enable row level security;
create policy "steps_all_own" on public.steps_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

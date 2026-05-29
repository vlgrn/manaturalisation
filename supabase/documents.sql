-- MaNaturalisation — document upload + AI analysis schema.
-- Run once in the Supabase SQL editor (Dashboard → SQL Editor → New query).

-- 1. Private storage bucket for the user-uploaded documents.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- 2. Metadata table. One row per uploaded file, scoped to the user.
create table if not exists public.user_documents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  storage_path  text not null,
  file_name     text not null,
  mime_type     text,
  size_bytes    bigint,
  status        text not null default 'analyzing',  -- analyzing | done | error
  doc_key       text,            -- matched canonical document key (or null/unknown)
  doc_label     text,            -- what the AI thinks the document is (FR)
  doc_date      date,            -- issue date found on the document
  expires_at    date,            -- computed from doc_date + validity
  is_valid      boolean,         -- present and not expired
  analysis      jsonb,           -- full AI result
  created_at    timestamptz not null default now()
);

create index if not exists user_documents_user_id_idx on public.user_documents (user_id);

-- 3. Row Level Security: a user only sees and manages their own rows.
alter table public.user_documents enable row level security;

drop policy if exists "own rows - select" on public.user_documents;
create policy "own rows - select" on public.user_documents
  for select using (auth.uid() = user_id);

drop policy if exists "own rows - insert" on public.user_documents;
create policy "own rows - insert" on public.user_documents
  for insert with check (auth.uid() = user_id);

drop policy if exists "own rows - update" on public.user_documents;
create policy "own rows - update" on public.user_documents
  for update using (auth.uid() = user_id);

drop policy if exists "own rows - delete" on public.user_documents;
create policy "own rows - delete" on public.user_documents
  for delete using (auth.uid() = user_id);

-- 4. Storage policies: files live under a top-level folder named after the user id
--    (e.g. "<uid>/<uuid>-filename.pdf"). Each user can only touch their folder.
drop policy if exists "documents - read own" on storage.objects;
create policy "documents - read own" on storage.objects
  for select using (
    bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "documents - insert own" on storage.objects;
create policy "documents - insert own" on storage.objects
  for insert with check (
    bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "documents - delete own" on storage.objects;
create policy "documents - delete own" on storage.objects
  for delete using (
    bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5. Per-user dossier progress (document statuses + step statuses), one row per user.
create table if not exists public.user_progress (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  progress    jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.user_progress enable row level security;

drop policy if exists "progress - select own" on public.user_progress;
create policy "progress - select own" on public.user_progress
  for select using (auth.uid() = user_id);

drop policy if exists "progress - insert own" on public.user_progress;
create policy "progress - insert own" on public.user_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "progress - update own" on public.user_progress;
create policy "progress - update own" on public.user_progress
  for update using (auth.uid() = user_id);

-- Eigenes Supabase-Projekt für NotSan Prüfung. Nicht im Fotografie-Projekt ausführen.
-- Konten werden ausschließlich über Authentication > Users > Send invitation freigegeben.

create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  note text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint access_request_email_format check (email = lower(email) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  constraint access_request_name_length check (char_length(name) between 2 and 120),
  constraint access_request_note_length check (char_length(note) <= 1000)
);

create table if not exists public.learning_question_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null check (char_length(question_id) between 1 and 160),
  correct_count smallint not null check (correct_count between 0 and 3),
  last_result text not null check (last_result in ('correct', 'wrong')),
  updated_at timestamptz not null,
  primary key (user_id, question_id)
);

create table if not exists public.learning_topic_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_number smallint not null check (topic_number between 1 and 100),
  completed boolean not null,
  updated_at timestamptz not null,
  primary key (user_id, topic_number)
);

create table if not exists public.learning_medication_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id text not null check (char_length(case_id) between 1 and 160),
  attempts integer not null check (attempts >= 0),
  correct_count integer not null check (correct_count >= 0 and correct_count <= attempts),
  updated_at timestamptz not null,
  primary key (user_id, case_id)
);

alter table public.access_requests enable row level security;
alter table public.learning_question_progress enable row level security;
alter table public.learning_topic_progress enable row level security;
alter table public.learning_medication_progress enable row level security;

revoke all on public.access_requests from anon, authenticated;
grant insert on public.access_requests to anon, authenticated;

create policy "Anyone can submit a pending access request"
  on public.access_requests for insert to anon, authenticated
  with check (status = 'pending' and reviewed_at is null and char_length(note) <= 1000);

revoke all on public.learning_question_progress from anon, authenticated;
grant select, insert, update on public.learning_question_progress to authenticated;
create policy "Read own question progress" on public.learning_question_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own question progress" on public.learning_question_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own question progress" on public.learning_question_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on public.learning_topic_progress from anon, authenticated;
grant select, insert, update on public.learning_topic_progress to authenticated;
create policy "Read own topic progress" on public.learning_topic_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own topic progress" on public.learning_topic_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own topic progress" on public.learning_topic_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on public.learning_medication_progress from anon, authenticated;
grant select, insert, update on public.learning_medication_progress to authenticated;
create policy "Read own medication progress" on public.learning_medication_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own medication progress" on public.learning_medication_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own medication progress" on public.learning_medication_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

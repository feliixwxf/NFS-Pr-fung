-- Laufende Multiple-Choice-Runden kontogebunden zwischen Geräten fortsetzen.
create table if not exists public.learning_mc_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  session_key text not null check (char_length(session_key) between 1 and 240),
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, session_key)
);

alter table public.learning_mc_sessions enable row level security;
revoke all on public.learning_mc_sessions from anon, authenticated;
grant select, insert, update, delete on public.learning_mc_sessions to authenticated;

create policy "Read own MC sessions" on public.learning_mc_sessions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own MC sessions" on public.learning_mc_sessions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own MC sessions" on public.learning_mc_sessions
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Delete own MC sessions" on public.learning_mc_sessions
  for delete to authenticated using ((select auth.uid()) = user_id);

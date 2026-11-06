create table if not exists public.learning_text_highlights (
  user_id uuid not null references auth.users(id) on delete cascade,
  highlight_id text not null check (char_length(highlight_id) between 1 and 100),
  page_path text not null check (char_length(page_path) between 1 and 300),
  quote text not null check (char_length(quote) between 1 and 1200),
  prefix text not null default '' check (char_length(prefix) <= 160),
  suffix text not null default '' check (char_length(suffix) <= 160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, highlight_id)
);

alter table public.learning_text_highlights enable row level security;
revoke all on public.learning_text_highlights from anon, authenticated;
grant select, insert, update, delete on public.learning_text_highlights to authenticated;

drop policy if exists "Read own text highlights" on public.learning_text_highlights;
drop policy if exists "Insert own text highlights" on public.learning_text_highlights;
drop policy if exists "Update own text highlights" on public.learning_text_highlights;
drop policy if exists "Delete own text highlights" on public.learning_text_highlights;

create policy "Read own text highlights" on public.learning_text_highlights
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own text highlights" on public.learning_text_highlights
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own text highlights" on public.learning_text_highlights
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Delete own text highlights" on public.learning_text_highlights
  for delete to authenticated using ((select auth.uid()) = user_id);

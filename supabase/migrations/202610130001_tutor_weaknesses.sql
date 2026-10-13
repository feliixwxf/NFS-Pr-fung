create table if not exists public.learning_tutor_weaknesses (
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_id text not null check (char_length(entry_id) between 1 and 200),
  score smallint not null default 0 check (score between 0 and 5),
  updated_at timestamptz not null default now(),
  primary key (user_id, entry_id)
);

alter table public.learning_tutor_weaknesses enable row level security;
revoke all on public.learning_tutor_weaknesses from anon, authenticated;
grant select, insert, update, delete on public.learning_tutor_weaknesses to authenticated;

create policy "Read own tutor weaknesses" on public.learning_tutor_weaknesses
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own tutor weaknesses" on public.learning_tutor_weaknesses
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own tutor weaknesses" on public.learning_tutor_weaknesses
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Delete own tutor weaknesses" on public.learning_tutor_weaknesses
  for delete to authenticated using ((select auth.uid()) = user_id);

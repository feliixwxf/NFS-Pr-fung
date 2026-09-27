-- Kontoeinstellungen und private Profilbilder fuer NotSan Pruefung.

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  avatar_path text,
  updated_at timestamptz not null default now(),
  constraint avatar_belongs_to_user check (
    avatar_path is null or avatar_path like user_id::text || '/%'
  )
);

alter table public.user_profiles enable row level security;

revoke all on public.user_profiles from anon, authenticated;
grant select, insert, update on public.user_profiles to authenticated;

drop policy if exists "Read own profile" on public.user_profiles;
create policy "Read own profile" on public.user_profiles
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Insert own profile" on public.user_profiles;
create policy "Insert own profile" on public.user_profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Update own profile" on public.user_profiles;
create policy "Update own profile" on public.user_profiles
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-images',
  'profile-images',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Read own profile images" on storage.objects;
create policy "Read own profile images" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "Upload own profile images" on storage.objects;
create policy "Upload own profile images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "Delete own profile images" on storage.objects;
create policy "Delete own profile images" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

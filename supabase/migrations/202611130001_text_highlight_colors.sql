alter table if exists public.learning_text_highlights
  add column if not exists color text not null default 'yellow';

alter table if exists public.learning_text_highlights
  drop constraint if exists learning_text_highlights_color_check;

alter table if exists public.learning_text_highlights
  add constraint learning_text_highlights_color_check
  check (color in ('yellow', 'red'));

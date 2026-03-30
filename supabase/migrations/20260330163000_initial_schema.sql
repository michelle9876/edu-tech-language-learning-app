create extension if not exists pgcrypto;

create type public.app_language as enum ('en', 'ko');
create type public.language_level as enum (
  'beginner',
  'elementary',
  'intermediate',
  'upper_intermediate',
  'advanced'
);
create type public.card_type as enum ('word', 'expression');
create type public.game_mode as enum ('flashcards', 'recall', 'matching');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  completed_onboarding boolean not null default false,
  native_language public.app_language not null default 'ko',
  target_language public.app_language not null default 'en',
  level public.language_level not null default 'beginner',
  timezone text not null default 'UTC',
  notification_time time not null default '20:30',
  notification_opt_in boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.curriculum_tracks (
  id text primary key,
  native_language public.app_language not null,
  target_language public.app_language not null,
  level public.language_level not null,
  title text not null,
  subtitle text not null,
  description text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.curriculum_modules (
  id text primary key,
  track_id text not null references public.curriculum_tracks (id) on delete cascade,
  title text not null,
  description text not null,
  order_index integer not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.lessons (
  id text primary key,
  module_id text not null references public.curriculum_modules (id) on delete cascade,
  title text not null,
  summary text not null,
  estimated_minutes integer not null,
  difficulty public.language_level not null,
  practice_prompt text not null,
  objectives jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.lesson_card_seeds (
  id text primary key,
  lesson_id text not null references public.lessons (id) on delete cascade,
  type public.card_type not null,
  front text not null,
  back text not null,
  example text not null,
  tags text[] not null default '{}'
);

create table public.saved_cards (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  type public.card_type not null,
  source_lesson_id text not null references public.lessons (id) on delete cascade,
  front text not null,
  back text not null,
  example text not null,
  tags text[] not null default '{}',
  mastery_score numeric(4,3) not null default 0,
  dedupe_key text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, dedupe_key)
);

create table public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null references public.lessons (id) on delete cascade,
  completed boolean not null default false,
  last_viewed_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);

create table public.game_sessions (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  mode public.game_mode not null,
  card_ids text[] not null default '{}',
  score integer not null default 0,
  completed_at timestamptz not null default timezone('utc', now())
);

create table public.user_push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  expo_push_token text not null unique,
  platform text not null default 'expo',
  last_seen_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.daily_content_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  language public.app_language not null,
  level public.language_level not null,
  title text not null,
  body text not null,
  glossary jsonb not null,
  quiz jsonb not null,
  delivery_date date not null default current_date,
  slot_label text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, delivery_date, slot_label)
);

create view public.notification_preferences as
select
  user_id,
  timezone,
  notification_time,
  notification_opt_in,
  updated_at
from public.user_profiles;

create index idx_curriculum_tracks_direction_level
  on public.curriculum_tracks (native_language, target_language, level);
create index idx_curriculum_modules_track_id
  on public.curriculum_modules (track_id, order_index);
create index idx_lessons_module_id
  on public.lessons (module_id);
create index idx_saved_cards_user_id
  on public.saved_cards (user_id, mastery_score);
create index idx_daily_content_cache_user_date
  on public.daily_content_cache (user_id, delivery_date);
create index idx_user_push_tokens_user_id
  on public.user_push_tokens (user_id);

create trigger trg_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.set_updated_at();

create trigger trg_saved_cards_updated_at
before update on public.saved_cards
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

alter table public.user_profiles enable row level security;
alter table public.curriculum_tracks enable row level security;
alter table public.curriculum_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_card_seeds enable row level security;
alter table public.saved_cards enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.game_sessions enable row level security;
alter table public.user_push_tokens enable row level security;
alter table public.daily_content_cache enable row level security;

create policy "Curriculum tracks are readable"
on public.curriculum_tracks
for select
to authenticated, anon
using (true);

create policy "Curriculum modules are readable"
on public.curriculum_modules
for select
to authenticated, anon
using (true);

create policy "Lessons are readable"
on public.lessons
for select
to authenticated, anon
using (true);

create policy "Lesson card seeds are readable"
on public.lesson_card_seeds
for select
to authenticated, anon
using (true);

create policy "Users read their own profile"
on public.user_profiles
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users insert their own profile"
on public.user_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users update their own profile"
on public.user_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users read their own saved cards"
on public.saved_cards
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users insert their own saved cards"
on public.saved_cards
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users update their own saved cards"
on public.saved_cards
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users delete their own saved cards"
on public.saved_cards
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Users read their own lesson progress"
on public.lesson_progress
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users upsert their own lesson progress"
on public.lesson_progress
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users update their own lesson progress"
on public.lesson_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users read their own game sessions"
on public.game_sessions
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users insert their own game sessions"
on public.game_sessions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users read their own push tokens"
on public.user_push_tokens
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users insert their own push tokens"
on public.user_push_tokens
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users update their own push tokens"
on public.user_push_tokens
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users read their own daily content cache"
on public.daily_content_cache
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users insert their own daily content cache"
on public.daily_content_cache
for insert
to authenticated
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('curriculum-imports', 'curriculum-imports', false)
on conflict (id) do nothing;

create policy "Authenticated users can upload curriculum imports"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'curriculum-imports');

create policy "Authenticated users can read curriculum imports"
on storage.objects
for select
to authenticated
using (bucket_id = 'curriculum-imports');


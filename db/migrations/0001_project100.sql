create extension if not exists pgcrypto;

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  unit text not null,
  intent text not null check (intent in ('good', 'risky')),
  target_value integer not null default 100 check (target_value > 0),
  created_at timestamptz not null default timezone('utc', now()),
  archived_at timestamptz
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  target_value integer not null default 100 check (target_value > 0),
  current_value integer not null default 0 check (current_value >= 0),
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  completion_note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  delta integer not null check (delta > 0),
  mood text,
  note text,
  logged_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.activities enable row level security;
alter table public.attempts enable row level security;
alter table public.logs enable row level security;

drop policy if exists "Users can manage own activities" on public.activities;
create policy "Users can manage own activities"
on public.activities
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage own attempts" on public.attempts;
create policy "Users can manage own attempts"
on public.attempts
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage own logs" on public.logs;
create policy "Users can manage own logs"
on public.logs
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

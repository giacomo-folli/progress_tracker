-- Exercises and Steps
create table exercises (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) default auth.uid() not null,
  name text not null,
  icon text,
  type text default 'exercise',
  current_step_index integer default 0 not null
);

create table steps (
  id uuid default gen_random_uuid() primary key,
  exercise_id uuid references exercises(id) on delete cascade not null,
  description text not null,
  completed boolean default false not null,
  completed_at timestamp with time zone,
  step_index integer default 0 not null
);

alter table exercises enable row level security;
alter table steps enable row level security;

-- Split out for total security against column spoofing
create policy "Users can view and delete own exercises" on exercises
  for select using (auth.uid() = user_id);

create policy "Users can insert own exercises" on exercises
  for insert with check (auth.uid() = user_id);

create policy "Users can update own exercises" on exercises
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own exercises" on exercises
  for delete using (auth.uid() = user_id);

-- Steps policies fixed to protect data entry payloads
create policy "Users can view steps" on steps
  for select using (
    exists (select 1 from exercises where exercises.id = steps.exercise_id and exercises.user_id = auth.uid())
  );

create policy "Users can insert steps" on steps
  for insert with check (
    exists (select 1 from exercises where exercises.id = steps.exercise_id and exercises.user_id = auth.uid())
  );

create policy "Users can update steps" on steps
  for update using (
    exists (select 1 from exercises where exercises.id = steps.exercise_id and exercises.user_id = auth.uid())
  ) with check (
    exists (select 1 from exercises where exercises.id = steps.exercise_id and exercises.user_id = auth.uid())
  );

create policy "Users can delete steps" on steps
  for delete using (
    exists (select 1 from exercises where exercises.id = steps.exercise_id and exercises.user_id = auth.uid())
  );



-- Training Sessions
create table training_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) default auth.uid() not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  exercises jsonb default '[]'::jsonb not null
);

alter table training_sessions enable row level security;

create policy "Users can view training sessions" on training_sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert training sessions" on training_sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can update training sessions" on training_sessions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete training sessions" on training_sessions
  for delete using (auth.uid() = user_id);


-- User Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  updated_at timestamp with time zone default now(),
  display_name text,
  full_name text,
  avatar_url text
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "Users can update own profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Handing over control to PostgREST (Notice: No INSERT grant needed!)
grant select, update on public.profiles to authenticated;


-- Signup Trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do update
    set updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
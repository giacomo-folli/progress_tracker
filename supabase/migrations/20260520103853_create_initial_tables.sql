-- Create Exercises Table
create table exercises (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) default auth.uid(), -- For security
  name text not null,
  icon text,
  type text default 'exercise',
  current_step_index integer default 0 not null
);

-- Create Steps Table (Linked to Exercises)
create table steps (
  id uuid default gen_random_uuid() primary key,
  exercise_id uuid references exercises(id) on delete cascade not null,
  description text not null,
  completed boolean default false not null,
  completed_at timestamp with time zone,
  step_index integer default 0 not null
);

-- Enable RLS so users don't see each other's exercises
alter table exercises enable row level security;
alter table steps enable row level security;

create policy "Users can manage their own exercises" on exercises
  for all using (auth.uid() = user_id);

create policy "Users can manage steps of their own exercises" on steps
  for all using (
    exists (
      select 1 from exercises 
      where exercises.id = steps.exercise_id and exercises.user_id = auth.uid()
    )
  );
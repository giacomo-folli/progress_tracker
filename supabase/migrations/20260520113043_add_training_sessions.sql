-- Create the Training Sessions Table
create table training_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) default auth.uid() not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- The jsonb type handles nested arrays perfectly and lets you query inside them later if needed
  exercises jsonb default '[]'::jsonb not null
);

-- Enable Row Level Security (RLS)
alter table training_sessions enable row level security;

-- Policy: Users can only see, create, or delete their own historical sessions
create policy "Users can manage their own training sessions" on training_sessions
  for all using (auth.uid() = user_id);
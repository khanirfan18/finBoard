-- Create User Settings table for Currency
create table public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  currency jsonb not null,
  created_at timestamptz default now(),
  unique(user_id)
);

-- Create Transactions table
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  date text not null,
  amount numeric not null,
  description text not null,
  currency jsonb,
  created_at timestamptz default now()
);

-- Create Budgets table
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  category text not null,
  amount numeric not null,
  created_at timestamptz default now(),
  unique(user_id, category)
);

-- Create Goals table
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  name text not null,
  target numeric not null,
  deadline text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.user_settings enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.goals enable row level security;

-- Policies for User Settings
create policy "Users can view their own settings" on public.user_settings for select using (auth.uid() = user_id);
create policy "Users can insert their own settings" on public.user_settings for insert with check (auth.uid() = user_id);
create policy "Users can update their own settings" on public.user_settings for update using (auth.uid() = user_id);
create policy "Users can delete their own settings" on public.user_settings for delete using (auth.uid() = user_id);

-- Policies for Transactions
create policy "Users can view their own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert their own transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Users can update their own transactions" on public.transactions for update using (auth.uid() = user_id);
create policy "Users can delete their own transactions" on public.transactions for delete using (auth.uid() = user_id);

-- Policies for Budgets
create policy "Users can view their own budgets" on public.budgets for select using (auth.uid() = user_id);
create policy "Users can insert their own budgets" on public.budgets for insert with check (auth.uid() = user_id);
create policy "Users can update their own budgets" on public.budgets for update using (auth.uid() = user_id);
create policy "Users can delete their own budgets" on public.budgets for delete using (auth.uid() = user_id);

-- Policies for Goals
create policy "Users can view their own goals" on public.goals for select using (auth.uid() = user_id);
create policy "Users can insert their own goals" on public.goals for insert with check (auth.uid() = user_id);
create policy "Users can update their own goals" on public.goals for update using (auth.uid() = user_id);
create policy "Users can delete their own goals" on public.goals for delete using (auth.uid() = user_id);

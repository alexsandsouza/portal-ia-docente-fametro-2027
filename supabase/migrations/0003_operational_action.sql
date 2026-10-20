create table if not exists public.operational_action (
  id uuid primary key default gen_random_uuid(),
  actor_id text not null,
  action text not null,
  target_type text not null,
  target_id text not null,
  created_at timestamptz not null default now()
);

alter table public.operational_action enable row level security;

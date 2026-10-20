create table if not exists public.data_subject_request (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participant(id),
  kind text not null check (kind in ('access', 'correction', 'deletion')),
  previous_name text,
  new_name text,
  created_at timestamptz not null default now(),
  executed_at timestamptz
);

alter table public.data_subject_request enable row level security;

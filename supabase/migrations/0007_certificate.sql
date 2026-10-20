create table if not exists public.certificate (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null unique references public.participant(id),
  authenticity_code text not null unique,
  issued_at timestamptz not null default now(),
  authorized_by text not null
);

alter table public.certificate enable row level security;

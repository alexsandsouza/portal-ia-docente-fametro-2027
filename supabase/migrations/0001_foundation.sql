create table if not exists public.operational_member (
  email text primary key,
  created_at timestamptz not null default now(),
  constraint operational_member_email_lowercase check (email = lower(email))
);

create table if not exists public.rate_limit_bucket (
  scope text not null check (scope in ('enrollment', 'check_in', 'certificate_lookup')),
  subject_key text not null,
  window_started_at timestamptz not null,
  attempts integer not null default 0,
  primary key (scope, subject_key)
);

alter table public.operational_member enable row level security;
alter table public.rate_limit_bucket enable row level security;

-- A participante não lê estas tabelas. Não há política de select para o papel authenticated.

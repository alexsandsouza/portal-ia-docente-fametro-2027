create table if not exists public.participant (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(btrim(full_name)) > 0),
  email text not null unique check (email = lower(email)),
  access_link_version integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollment (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null unique references public.participant(id),
  status text not null check (status in ('pending', 'confirmed')),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  confirmed_by text
);

alter table public.participant enable row level security;
alter table public.enrollment enable row level security;

create policy participant_reads_own on public.participant
  for select to authenticated
  using (email = (select auth.jwt() ->> 'email'));

create policy enrollment_reads_own on public.enrollment
  for select to authenticated
  using (participant_id in (
    select id from public.participant where email = (select auth.jwt() ->> 'email')
  ));

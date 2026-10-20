create table if not exists public.check_in_code (
  enrollment_id uuid primary key references public.enrollment(id),
  code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.check_in (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null unique references public.enrollment(id),
  recorded_by text not null,
  checked_in_at timestamptz not null default now()
);

alter table public.check_in_code enable row level security;
alter table public.check_in enable row level security;

create policy participant_reads_own_code on public.check_in_code
  for select to authenticated
  using (enrollment_id in (
    select enrollment.id from public.enrollment
    join public.participant on participant.id = enrollment.participant_id
    where participant.email = (select auth.jwt() ->> 'email')
  ));

create table if not exists public.material (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  destination_url text not null,
  published boolean not null default false,
  updated_by text not null,
  updated_at timestamptz not null default now()
);

alter table public.material enable row level security;

create policy published_materials_for_enrolled on public.material
  for select to authenticated
  using (
    published = true
    and exists (
      select 1 from public.participant
      where participant.email = (select auth.jwt() ->> 'email')
    )
  );

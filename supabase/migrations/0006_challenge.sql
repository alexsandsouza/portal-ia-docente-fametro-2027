create table if not exists public.challenge (
  id uuid primary key default gen_random_uuid(),
  position integer not null unique check (position between 1 and 5),
  title text not null,
  statement text,
  updated_by text,
  updated_at timestamptz not null default now()
);

create table if not exists public.challenge_progress (
  participant_id uuid not null references public.participant(id),
  challenge_id uuid not null references public.challenge(id),
  status text not null check (status in ('waiting_for_content', 'not_started', 'completed')),
  completed_at timestamptz,
  primary key (participant_id, challenge_id)
);

insert into public.challenge (position, title)
select position, 'Desafio ' || position
from generate_series(1, 5) as position
on conflict (position) do nothing;

alter table public.challenge enable row level security;
alter table public.challenge_progress enable row level security;

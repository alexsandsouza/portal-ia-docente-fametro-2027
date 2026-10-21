alter table public.participant
  add column if not exists given_name text,
  add column if not exists family_name text,
  add column if not exists cpf text;

create unique index if not exists participant_cpf_unique
  on public.participant (cpf)
  where cpf is not null;

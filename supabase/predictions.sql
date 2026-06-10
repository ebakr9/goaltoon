-- Run this in Supabase Dashboard → SQL Editor

create table if not exists predictions (
  id          bigserial primary key,
  fixture_id  text        not null,
  pick        text        not null check (pick in ('1', 'x', '2')),
  created_at  timestamptz not null default now()
);

-- Index for fast aggregation per fixture
create index if not exists predictions_fixture_id_idx on predictions(fixture_id);

-- Row Level Security: allow anyone to insert and read counts, but NOT update/delete
alter table predictions enable row level security;

create policy "Anyone can insert a prediction"
  on predictions for insert
  with check (true);

create policy "Anyone can read predictions"
  on predictions for select
  using (true);

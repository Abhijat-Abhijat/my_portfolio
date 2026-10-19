-- Redesign migration (run once in the Supabase SQL editor on an existing project;
-- supabase/schema.sql already includes all of this for fresh projects).

-- 1. Featured projects: the home-page collage shows these. With none flagged,
--    the site falls back to the first four by sort order.
alter table projects add column if not exists featured boolean not null default false;

-- 2. Hall of hackers: winners of the hack-me terminal game.
create table if not exists hall_of_hackers (
  id uuid primary key default gen_random_uuid(),
  handle text not null check (handle ~* '^[a-z0-9_.-]{2,20}$'),
  ms int not null check (ms between 20000 and 604800000),
  hints int not null default 0 check (hints between 0 and 20),
  score bigint generated always as (ms::bigint + hints::bigint * 60000) stored,
  ip text,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index if not exists hall_of_hackers_handle_key on hall_of_hackers (lower(handle));
create index if not exists hall_of_hackers_score_idx on hall_of_hackers (score, created_at);

alter table hall_of_hackers enable row level security;
drop policy if exists "public read visible" on hall_of_hackers;
create policy "public read visible" on hall_of_hackers for select using (hidden = false);

-- Column-level grants: the anon key can read the board but never `ip`. Writes
-- only ever happen through the joinHall server action (service-role key).
revoke all on hall_of_hackers from anon, authenticated;
grant select (id, handle, ms, hints, score, created_at) on hall_of_hackers to anon, authenticated;

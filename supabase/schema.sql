-- Portfolio content schema.
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query)
-- on a fresh project, then run `npm run db:seed` from the repo to load starting content.
--
-- Design: every table is public-readable (RLS "select using (true)") and has NO
-- insert/update/delete policy at all. The admin panel never writes with the anon
-- key — every write goes through a server action using the service-role key,
-- which bypasses RLS entirely. So "no write policy" is intentional, not an
-- oversight: it means the anon key genuinely cannot write, even if leaked.

create extension if not exists pgcrypto;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  description text not null default '',
  stack text[] not null default '{}',
  visual text not null default 'product-ui',
  image_url text,
  problem text not null default '',
  approach text[] not null default '{}',
  key_decisions jsonb not null default '[]', -- [{ "title": "...", "body": "..." }]
  metrics jsonb not null default '[]', -- [{ "value": "...", "label": "..." }]
  learned text not null default '',
  link_live text,
  link_github text,
  limited_info boolean not null default false,
  views int not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists experience_entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'experience' check (kind in ('experience', 'volunteer')),
  company text not null,
  role text not null,
  start_date text not null,
  end_date text not null,
  location text,
  highlights text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company, role, start_date)
);

create table if not exists ventures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  start_date text not null,
  end_date text not null,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, start_date)
);

create table if not exists skill_groups (
  id uuid primary key default gen_random_uuid(),
  label text unique not null,
  skills text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null,
  title text not null,
  excerpt text not null default '',
  reading_time text not null default '',
  date text not null default '',
  tags text[] not null default '{}',
  outline text[] not null default '{}',
  body_markdown text not null default '',
  image_url text,
  published boolean not null default false,
  views int not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists publications (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('Book', 'Paper', 'IP')),
  title text unique not null,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  title text unique not null,
  org text not null,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  title text unique not null,
  issuer text,
  date text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Single-row table for hero text / contact links.
create table if not exists site_settings (
  id int primary key default 1,
  name text not null,
  role text not null,
  tagline text not null,
  location text not null,
  email text not null,
  github text not null,
  linkedin text not null,
  status text not null,
  site_url text not null,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

-- Contact form submissions. Holds visitor PII (name/email/message), so unlike
-- every other table above, this one gets NO policies at all — not even public
-- insert. The contact form's server action and /admin/messages both use the
-- service-role key, which bypasses RLS entirely, so the anon key genuinely
-- cannot read, write, or spam this table even if leaked.
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  ip text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Per-visit event log backing /admin/analytics (daily trend, top content by
-- date range). `views` on projects/articles stays the fast lifetime counter;
-- this table is the append-only history behind it. No PII, so unlike
-- contact_submissions it still gets zero policies purely because nothing
-- but the increment_*_views functions ever needs to write it, and only the
-- admin (service-role) ever needs to read it.
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('project', 'article')),
  slug text not null,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_idx on page_views (created_at desc);
create index if not exists page_views_slug_idx on page_views (slug, created_at desc);

alter table page_views enable row level security;

alter table contact_submissions enable row level security;

alter table projects enable row level security;
alter table experience_entries enable row level security;
alter table ventures enable row level security;
alter table skill_groups enable row level security;
alter table articles enable row level security;
alter table publications enable row level security;
alter table achievements enable row level security;
alter table certifications enable row level security;
alter table site_settings enable row level security;

create policy "public read" on projects for select using (true);
create policy "public read" on experience_entries for select using (true);
create policy "public read" on ventures for select using (true);
create policy "public read" on skill_groups for select using (true);
create policy "public read published" on articles for select using (published = true);
create policy "public read" on publications for select using (true);
create policy "public read" on achievements for select using (true);
create policy "public read" on certifications for select using (true);
create policy "public read" on site_settings for select using (true);

-- Storage bucket for project/article images. Public read; writes only ever
-- happen server-side via the service-role key, so no write policy is needed.
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

create policy "public read site-assets" on storage.objects
  for select using (bucket_id = 'site-assets');

-- Keeps updated_at current on every UPDATE, on every content table. Without
-- this, "Last updated" on the public site would only ever show the row's
-- original creation time — the column default only fires on INSERT.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on projects;
create trigger set_updated_at before update on projects
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on articles;
create trigger set_updated_at before update on articles
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on experience_entries;
create trigger set_updated_at before update on experience_entries
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on ventures;
create trigger set_updated_at before update on ventures
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on skill_groups;
create trigger set_updated_at before update on skill_groups
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on publications;
create trigger set_updated_at before update on publications
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on achievements;
create trigger set_updated_at before update on achievements
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on certifications;
create trigger set_updated_at before update on certifications
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on site_settings;
create trigger set_updated_at before update on site_settings
  for each row execute function set_updated_at();

-- View counters. RLS blocks the anon key from UPDATE on projects/articles
-- directly (no write policy exists, by design) — these two functions are a
-- narrow, explicit exception: SECURITY DEFINER lets an anon caller increment
-- exactly one counter column on one row, nothing else.
create or replace function increment_project_views(project_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update projects set views = views + 1 where slug = project_slug;
  if found then
    insert into page_views (content_type, slug) values ('project', project_slug);
  end if;
end;
$$;

create or replace function increment_article_views(article_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update articles set views = views + 1 where slug = article_slug and published = true;
  if found then
    insert into page_views (content_type, slug) values ('article', article_slug);
  end if;
end;
$$;

grant execute on function increment_project_views(text) to anon;
grant execute on function increment_article_views(text) to anon;

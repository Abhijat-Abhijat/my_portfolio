@AGENTS.md

# portfolio — repo rules

Personal portfolio site for Abhijat (AI Engineer / Full-Stack Software Engineer).
Next.js (App Router) + Tailwind v4 + `@react-three/fiber` (Three.js) for the hero visual.
Content is stored in Supabase (Postgres + Storage) and edited through a built-in
admin panel at `/admin`. Independent repo — part of the `leapath` umbrella workspace,
but not part of the `leapath-platform` / `MS-Assessments` contract.

## Structure

- `supabase/schema.sql` — full DB schema + RLS policies + storage bucket. Run once in a
  fresh Supabase project's SQL editor.
- `scripts/seed-data.mts` + `scripts/seed.mts` — one-time starting content, loaded via
  `npm run db:seed`. Not read at runtime — once seeded, Supabase is the source of truth.
- `src/lib/content/` — public read layer (anon key). One file per content type, each
  exporting `getX()` fetchers used by server components. Cached per-request via React's
  `cache()`.
- `src/lib/admin/` — admin-only: `entities.ts` (declarative field config driving the
  generic CRUD UI), `actions.ts` (server actions, service-role key), `session.ts` /
  `require-session.ts` (signed shared-secret cookie auth), `field-codec.ts` (textarea
  ⇄ array/JSON conversion for `lines`/`pairs` field types).
- `src/lib/supabase/public-client.ts` (anon key, safe anywhere) vs `admin-client.ts`
  (service-role key, `server-only`, bypasses RLS — only call from code that already
  checked `requireAdminSession()`).
- `src/app/(site)/` — public pages (route group, no effect on URLs): home, `projects/[slug]`,
  `blog/[slug]`, wrapped by `(site)/layout.tsx` (site header/footer, fetches
  `site_settings` once).
- `src/app/admin/login/` sits *outside* the protected chrome; `src/app/admin/(protected)/`
  (dashboard, `[entity]` list/form, `settings`) is wrapped by its own layout — keep it that
  way, the login page must never render the "Log out" button (a past bug: a stray duplicate
  submit button in the header made an automated login test fire `logout()` instead).
- `src/proxy.ts` — Next 16's middleware replacement; gates every `/admin/**` route except
  `/admin/login` by checking the signed session cookie. Runs on the Node.js runtime
  (needed for `node:crypto`).
- All public + admin pages that read Supabase are `export const dynamic = "force-dynamic"`
  — content changes anytime via `/admin`, and this also keeps `npm run build` working
  without real Supabase credentials present (useful in CI / sandboxed environments).
- Root `layout.tsx` metadata (title/description/OG) is static, not Supabase-backed —
  deliberate: `/admin/login` must be reachable even before Supabase is configured, so
  nothing on the auth path can depend on a live DB call.

## Content model

- Projects: `image_url` (real screenshot) takes precedence over the generated CSS/SVG
  `visual` placeholder in `ProjectVisual` — same pattern for articles' `ArticleHero`.
  Both render via `next/image` (see `next.config.ts` `images.remotePatterns` for the
  `*.supabase.co` wildcard — don't hardcode a project ref there).
- Articles: `published` boolean gates public visibility (RLS enforces this — the public
  `select` policy on `articles` is `published = true`). Unpublished drafts are only
  visible through `/admin` (service-role key bypasses RLS).
- `experience_entries.kind` (`'experience' | 'volunteer'`) — one table, two admin sections.
- Do not guess project `link_live` / `link_github` — leave empty unless confirmed.
- `projects.views` / `articles.views` increment via the `increment_project_views` /
  `increment_article_views` Postgres functions (`SECURITY DEFINER`, granted to `anon`) —
  the one deliberate, narrow exception to "anon can never write." Don't add a general
  anon UPDATE policy to reach the same goal.
- `updated_at` on every content table is kept current by a `set_updated_at` trigger, not
  application code — a server action's `UPDATE` doesn't need to (and shouldn't) set it.
- `contact_submissions.ip` backs a simple per-IP rate limit in
  `src/lib/content/contact-actions.ts` (5/hour) — read via `headers()`'s
  `x-forwarded-for`, not a real auth signal, just abuse mitigation.
- Admin list pages (`ReorderableList`) reorder via drag or ▲▼ buttons, persisted through
  `reorderEntities` (writes `sort_order = index` for every row) — not a `sort_order`
  number field to hand-edit anymore.
- `--danger` (globals.css) exists because Tailwind's `red-400` fails WCAG AA (~2.6:1) in
  light mode — always use `text-danger`, never a literal `text-red-*` class.

## Setup (for the site owner, not needed to just read/edit code)

1. Create a Supabase project, then in its SQL editor run `supabase/schema.sql`.
2. `cp .env.local.example .env.local`, fill in the Supabase URL/keys + pick an
   `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
3. `npm run db:seed` — loads starting content.
4. `npm run dev`, sign in at `/admin`.

## Checks

`npm run lint` and `npm run build` before calling a change done. Both must pass without
requiring `.env.local` to exist (see force-dynamic note above) — if a change breaks that,
it's a regression, not a sandbox limitation.

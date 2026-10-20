# portfolio

Personal portfolio of Abhijat, AI Engineer and full-stack software engineer. Live at [abhijat.co.in](https://abhijat.co.in).

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Supabase. All content lives in Supabase and is edited through a built-in admin panel at `/admin`, so updating the site never needs a code change or redeploy.

## Highlights

- **One person, four modes.** The hero switches between Designer, Builder, Human and Debugger. Each mode changes the avatar pose, the headline verb and the site accent color (`src/lib/modes.ts`).
- **Light, dark and hacker skins.** Light by default, dark through the toggle. Press `` ` `` (or use the footer switch) for the hacker skin, which opens a draggable terminal with a small capture-the-flag puzzle.
- **Hall of hackers.** People who find all four flags can sign the public leaderboard. Flags are not secrets: the puzzle is meant to be solvable from the page.
- **Content admin.** Generic CRUD for projects, articles, experience, certificates, achievements, publications and skills, with drag-to-reorder lists, contact messages, view analytics and Hall moderation.
- **Publishing extras.** RSS feed (`/feed.xml`), sitemap, robots.txt and generated Open Graph images for each project and article.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, server actions, `proxy.ts` instead of middleware) |
| UI | React 19, Tailwind CSS v4 |
| Data | Supabase Postgres with row-level security, Supabase Storage for images |
| Markdown | `marked` for article bodies |
| Hosting | Vercel, deployed from GitHub Actions |

## Getting started

### Prerequisites

- Node.js 22
- A Supabase project (the free tier is enough)

### 1. Install

```bash
npm install
```

### 2. Create the database

Open your Supabase project's SQL editor and run [`supabase/schema.sql`](supabase/schema.sql). It creates the tables, row-level security policies and the storage bucket.

If your database was created before the modes redesign, also run [`supabase/migrations/2026-10-19-modes-redesign.sql`](supabase/migrations/2026-10-19-modes-redesign.sql).

### 3. Configure environment variables

Create `.env.local` in the project root:

```bash
# Supabase → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server only. Bypasses row-level security. Never expose it to the browser.
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin login (single user, shared secret)
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=a-long-random-string   # e.g. openssl rand -hex 32

# Optional: search engine ownership verification
GOOGLE_SITE_VERIFICATION=
BING_SITE_VERIFICATION=
```

`.env*` files are ignored by git. Never commit them.

### 4. Load starting content

```bash
npm run db:seed
```

This is a one-time step. After seeding, Supabase is the source of truth and you edit everything through `/admin`.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/admin](http://localhost:3000/admin) to sign in with `ADMIN_PASSWORD`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Load starting content into Supabase (reads `.env.local`) |
| `node scripts/check-hall.mts` | Run the Hall of hackers validation checks |

`npm run build` works without `.env.local`. Every page that reads Supabase renders on demand, so CI can build with no credentials.

## Project structure

```
src/
  app/
    (site)/            public pages: home, projects, blog, experience, certifications, achievements
    admin/login/       login page, outside the protected layout
    admin/(protected)/ dashboard, entity list and forms, messages, analytics, settings
    feed.xml/          RSS feed
  components/          site components; components/admin/ for the admin UI
  lib/
    content/           public read layer (anon key), one file per content type
    admin/             admin entity config, server actions, session auth
    supabase/          public client (anon key) and admin client (service role, server only)
    hack/flags.ts      rules for the terminal puzzle and Hall validation
    modes.ts           the four hero modes
  proxy.ts             protects every /admin route except /admin/login
supabase/              schema and migrations
scripts/               seed script and checks
public/                avatars, toolbox icons, badges
design/                standalone HTML design reference
```

## Security notes

- The anon key can only read published content. Row-level security enforces this, for example unpublished articles stay hidden.
- Anonymous users can write in three narrow ways only: incrementing view counts (through `SECURITY DEFINER` functions), the contact form, and joining the Hall. The contact form and the Hall are rate limited per IP.
- The service-role key is only used in server code, after the admin session check.
- Admin auth is a single shared password with a signed session cookie.

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs lint and build on every push and pull request. Pull requests get a Vercel preview deployment, and pushes to `main` or `master` deploy to production.

The workflow needs these GitHub repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`. Runtime variables (Supabase keys, `ADMIN_*`) are set in the Vercel project settings.

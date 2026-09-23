// One-time loader: pushes scripts/seed-data.mts into a fresh Supabase project.
// Usage: npm run db:seed  (reads .env.local via --env-file)
// Safe to re-run: uses upsert on each table's natural unique key.

import { createClient } from "@supabase/supabase-js";
import {
  achievements,
  articles,
  certifications,
  experienceEntries,
  projects,
  publications,
  siteSettings,
  skillGroups,
  ventures,
} from "./seed-data.mts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Copy .env.local.example to .env.local, fill in your Supabase project's values, then re-run:\n" +
      "  npm run db:seed"
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function upsert(table: string, rows: unknown[], onConflict: string) {
  const { error } = await supabase.from(table).upsert(rows as never, { onConflict });
  if (error) {
    console.error(`✗ ${table}: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`✓ ${table}: ${rows.length} row(s)`);
}

async function main() {
  console.log(`Seeding ${url} ...\n`);

  await upsert("projects", projects, "slug");
  await upsert("experience_entries", experienceEntries, "company,role,start_date");
  await upsert("ventures", ventures, "name,start_date");
  await upsert("skill_groups", skillGroups, "label");
  await upsert("articles", articles, "slug");
  await upsert("publications", publications, "title");
  await upsert("achievements", achievements, "title");
  await upsert("certifications", certifications, "title");
  await upsert("site_settings", [siteSettings], "id");

  console.log("\nDone. Visit /admin to edit content.");
}

main();

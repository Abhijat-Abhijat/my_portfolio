// One-time finalize step: fills in the 6 original stub bodies, pulls the
// 27 newer articles' dates back so none are in the future, then publishes
// every article. Usage: node --env-file=.env.local scripts/finalize-articles.mts

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local.");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

const __dirname = dirname(fileURLToPath(import.meta.url));
const bodies = JSON.parse(
  readFileSync(join(__dirname, "stub-articles-bodies.json"), "utf-8")
) as Record<string, string>;

// Redistribute the 27 new articles' dates into Jul/Aug/Sep 2026 (9 each) so
// nothing is future-dated relative to today. Original 6 already span
// 2026-01..2026-06, so this keeps the full 33 within Jan-Sep 2026.
const MONTHS = ["2026-07", "2026-08", "2026-09"];

async function main() {
  // 1. Fill in the 6 stub bodies.
  for (const [slug, body_markdown] of Object.entries(bodies)) {
    const { error } = await supabase.from("articles").update({ body_markdown }).eq("slug", slug);
    if (error) {
      console.error(`✗ body update failed for ${slug}: ${error.message}`);
      process.exitCode = 1;
    } else {
      console.log(`✓ wrote full body: ${slug}`);
    }
  }

  // 2. Fix dates on the 27 newer articles (sort_order 6..32) and publish everything.
  const { data: all, error: fetchErr } = await supabase
    .from("articles")
    .select("id, slug, sort_order")
    .order("sort_order", { ascending: true });
  if (fetchErr || !all) {
    console.error("Failed to fetch articles:", fetchErr?.message);
    process.exit(1);
  }

  for (const row of all) {
    const patch: Record<string, unknown> = { published: true };
    if (row.sort_order >= 6) {
      const monthIndex = Math.floor((row.sort_order - 6) / 9); // 9 per month
      patch.date = MONTHS[Math.min(monthIndex, MONTHS.length - 1)];
    }
    const { error } = await supabase.from("articles").update(patch).eq("id", row.id);
    if (error) {
      console.error(`✗ publish/date update failed for ${row.slug}: ${error.message}`);
      process.exitCode = 1;
    }
  }

  console.log(`\nDone. ${all.length} articles published.`);
}

main();

// One-time loader for the 27 new draft articles in new-articles-data.json.
// Inserted unpublished (published: false) so nothing goes live until
// reviewed and published via /admin. Safe to re-run: upserts on slug.
// Usage: node --env-file=.env.local scripts/seed-new-articles.mts

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
const raw = readFileSync(join(__dirname, "new-articles-data.json"), "utf-8");
const newArticles = JSON.parse(raw) as Array<{
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  reading_time: string;
  date: string;
  tags: string[];
  outline: string[];
  body_markdown: string;
}>;

async function main() {
  const { data: existing, error: fetchErr } = await supabase.from("articles").select("sort_order");
  if (fetchErr) {
    console.error("Failed to read existing sort_order:", fetchErr.message);
    process.exit(1);
  }
  const startOrder = Math.max(-1, ...(existing ?? []).map((r) => r.sort_order as number)) + 1;

  const rows = newArticles.map((a, i) => ({
    ...a,
    image_url: null,
    published: false,
    sort_order: startOrder + i,
  }));

  const { error } = await supabase.from("articles").upsert(rows as never, { onConflict: "slug" });
  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }
  console.log(`Inserted/updated ${rows.length} articles, sort_order ${startOrder}..${startOrder + rows.length - 1}, all unpublished.`);
}

main();

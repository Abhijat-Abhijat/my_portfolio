import { createClient } from "@supabase/supabase-js";

/**
 * Anon-key client for public reads (site pages, sitemap). RLS on every table
 * allows select-only for this key — see supabase/schema.sql.
 */
export function getPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and fill in your Supabase project's values."
    );
  }

  return createClient(url, key, { auth: { persistSession: false } });
}

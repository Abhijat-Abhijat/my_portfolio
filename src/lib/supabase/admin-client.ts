import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client. Bypasses RLS — only ever call this from server actions
 * / route handlers that have already verified an admin session
 * (see src/lib/admin/session.ts). The `server-only` import makes accidentally
 * bundling this into client code a build error instead of a leaked secret.
 */
export function getAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Copy .env.local.example to .env.local and fill in your Supabase project's values."
    );
  }

  return createClient(url, key, { auth: { persistSession: false } });
}

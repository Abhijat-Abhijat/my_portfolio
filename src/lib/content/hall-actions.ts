"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";
import { validateHallEntry, type HallInput } from "@/lib/hack/flags";

// Second public write path (after the contact form): one validated row into
// hall_of_hackers. Same shape of protection — server-side validation, a per-IP
// rate limit, the service-role key never leaving the server. The game is
// client-side, so a determined cheater can still post a fake time; this keeps
// it fun and spam-free, not cheat-proof. Moderate via /admin/hall.

export type JoinHallResult = { ok: true; id: string; rank: number } | { ok: false; error: string };

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

async function getClientIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function joinHall(input: HallInput): Promise<JoinHallResult> {
  const check = validateHallEntry(input);
  if (!check.ok) return check;
  const { handle, ms, hints } = check.value;

  const ip = await getClientIp();
  const supabase = getAdminSupabaseClient();

  if (ip !== "unknown") {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count, error } = await supabase
      .from("hall_of_hackers")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", since);
    if (!error && (count ?? 0) >= RATE_LIMIT_MAX) {
      return { ok: false, error: "too many signatures from this connection — try again later." };
    }
  }

  const { data, error } = await supabase
    .from("hall_of_hackers")
    .insert({ handle, ms, hints, ip })
    .select("id, score")
    .single();

  if (error || !data) {
    if (error?.code === "23505") return { ok: false, error: "that handle is taken. pick another." };
    console.error("Hall of hackers insert failed:", error?.message);
    return { ok: false, error: "the wall is busy — try again in a moment." };
  }

  const { count } = await supabase
    .from("hall_of_hackers")
    .select("id", { count: "exact", head: true })
    .eq("hidden", false)
    .lt("score", data.score);

  revalidatePath("/");
  return { ok: true, id: String(data.id), rank: (count ?? 0) + 1 };
}

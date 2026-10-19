import { cache } from "react";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";

export type HallEntry = { id: string; handle: string; ms: number; hints: number; score: number; createdAt: string };

type HallRow = { id: string; handle: string; ms: number; hints: number; score: number; created_at: string };

/**
 * Public leaderboard (visible rows only — RLS + column grants keep `ip` and
 * hidden rows out of the anon key's reach). Unlike other getters this one
 * degrades to an empty board instead of throwing: the table arrives via a
 * migration, and a missing leaderboard must never take the home page down.
 */
export const getHall = cache(async (): Promise<HallEntry[]> => {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("hall_of_hackers")
    .select("id, handle, ms, hints, score, created_at")
    .order("score", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) {
    console.warn(`Hall of hackers unavailable: ${error.message}`);
    return [];
  }
  return (data as HallRow[]).map((r) => ({
    id: r.id,
    handle: r.handle,
    ms: r.ms,
    hints: r.hints,
    score: r.score,
    createdAt: r.created_at,
  }));
});

import { cache } from "react";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";

export type Achievement = { id: string; title: string; org: string; featured: boolean };

export const getAchievements = cache(async (): Promise<Achievement[]> => {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("id, title, org, featured")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load achievements: ${error.message}`);
  return data as Achievement[];
});

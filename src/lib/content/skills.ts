import { cache } from "react";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";

export type SkillGroup = { id: string; label: string; skills: string[] };

export const getSkillGroups = cache(async (): Promise<SkillGroup[]> => {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("skill_groups")
    .select("id, label, skills")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load skill groups: ${error.message}`);
  return data as SkillGroup[];
});

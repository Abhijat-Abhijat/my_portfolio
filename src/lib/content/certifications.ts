import { cache } from "react";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";

export type Certification = { id: string; title: string; issuer: string | null; date: string | null };

export const getCertifications = cache(async (): Promise<Certification[]> => {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("id, title, issuer, date")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load certifications: ${error.message}`);
  return data as Certification[];
});

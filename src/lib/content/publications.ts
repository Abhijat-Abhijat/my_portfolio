import { cache } from "react";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";

export type PublicationKind = "Book" | "Paper" | "IP";
export type Publication = { id: string; kind: PublicationKind; title: string; description: string };

export const getPublications = cache(async (): Promise<Publication[]> => {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("publications")
    .select("id, kind, title, description")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load publications: ${error.message}`);
  return data as Publication[];
});

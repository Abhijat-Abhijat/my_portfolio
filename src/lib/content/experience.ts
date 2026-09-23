import { cache } from "react";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";

export type ExperienceEntry = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  location?: string;
  highlights: string[];
};

export type Venture = {
  id: string;
  name: string;
  role: string;
  start: string;
  end: string;
  description: string;
};

type ExperienceRow = {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  location: string | null;
  highlights: string[];
};

function mapRow(row: ExperienceRow): ExperienceEntry {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    start: row.start_date,
    end: row.end_date,
    location: row.location ?? undefined,
    highlights: row.highlights ?? [],
  };
}

const fetchByKind = cache(async (kind: "experience" | "volunteer"): Promise<ExperienceEntry[]> => {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("experience_entries")
    .select("id, company, role, start_date, end_date, location, highlights")
    .eq("kind", kind)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load ${kind}: ${error.message}`);
  return (data as ExperienceRow[]).map(mapRow);
});

export const getExperience = () => fetchByKind("experience");
export const getVolunteer = () => fetchByKind("volunteer");

export const getVentures = cache(async (): Promise<Venture[]> => {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("ventures")
    .select("id, name, role, start_date, end_date, description")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load ventures: ${error.message}`);
  return (data as Array<{ id: string; name: string; role: string; start_date: string; end_date: string; description: string }>).map(
    (row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      start: row.start_date,
      end: row.end_date,
      description: row.description,
    })
  );
});

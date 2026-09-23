import { cache } from "react";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";

export type SiteSettings = {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  status: string;
  siteUrl: string;
};

type SiteSettingsRow = {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  status: string;
  site_url: string;
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("name, role, tagline, location, email, github, linkedin, status, site_url")
    .eq("id", 1)
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to load site settings: ${error?.message ?? "no row found"}. Did you run \`npm run db:seed\`?`
    );
  }

  const row = data as SiteSettingsRow;
  return {
    name: row.name,
    role: row.role,
    tagline: row.tagline,
    location: row.location,
    email: row.email,
    github: row.github,
    linkedin: row.linkedin,
    status: row.status,
    siteUrl: row.site_url,
  };
});

/** Strips the protocol for display, e.g. "https://github.com/x" → "github.com/x". */
export function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "");
}

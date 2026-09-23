import { cache } from "react";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";

export type ProjectVisualKind =
  | "agent-graph"
  | "terminal"
  | "product-ui"
  | "dashboard"
  | "kanban"
  | "finance"
  | "desktop"
  | "timer"
  | "qr-code"
  | "blog"
  | "game";

export type Metric = { value: string; label: string };
export type KeyDecision = { title: string; body: string };
export type ProjectLinks = { live?: string; github?: string };

export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  visual: ProjectVisualKind;
  imageUrl: string | null;
  problem: string;
  approach: string[];
  keyDecisions: KeyDecision[];
  metrics: Metric[];
  learned: string;
  links: ProjectLinks;
  limitedInfo: boolean;
  views: number;
  updatedAt: string;
};

type ProjectRow = {
  slug: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  visual: string;
  image_url: string | null;
  problem: string;
  approach: string[];
  key_decisions: KeyDecision[];
  metrics: Metric[];
  learned: string;
  link_live: string | null;
  link_github: string | null;
  limited_info: boolean;
  views: number;
  updated_at: string;
};

function mapRow(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    description: row.description,
    stack: row.stack ?? [],
    visual: row.visual as ProjectVisualKind,
    imageUrl: row.image_url,
    problem: row.problem,
    approach: row.approach ?? [],
    keyDecisions: row.key_decisions ?? [],
    metrics: row.metrics ?? [],
    learned: row.learned,
    links: {
      live: row.link_live ?? undefined,
      github: row.link_github ?? undefined,
    },
    limitedInfo: row.limited_info,
    views: row.views,
    updatedAt: row.updated_at,
  };
}

const PROJECT_COLUMNS =
  "slug, title, category, description, stack, visual, image_url, problem, approach, key_decisions, metrics, learned, link_live, link_github, limited_info, views, updated_at";

export const getProjects = cache(async (): Promise<Project[]> => {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load projects: ${error.message}`);
  return (data as ProjectRow[]).map(mapRow);
});

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getAdjacentProjects(slug: string) {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return { previous, next };
}

/** Fire-and-forget: never let a broken counter break the page. */
export async function incrementProjectViews(slug: string) {
  try {
    const supabase = getPublicSupabaseClient();
    await supabase.rpc("increment_project_views", { project_slug: slug });
  } catch {
    // ignore
  }
}

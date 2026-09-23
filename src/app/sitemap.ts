import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content/projects";
import { getArticles } from "@/lib/content/articles";

const SITE_URL = "https://abhijat.co.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/experience`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/certifications`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/achievements`, changeFrequency: "monthly", priority: 0.4 },
  ];

  // Falls back to just the homepage if Supabase isn't configured/seeded yet,
  // rather than crashing the whole sitemap route.
  try {
    const [projects, articles] = await Promise.all([getProjects(), getArticles()]);
    return [
      ...base,
      ...projects.map((p) => ({
        url: `${SITE_URL}/projects/${p.slug}`,
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
      ...articles.map((a) => ({
        url: `${SITE_URL}/blog/${a.slug}`,
        changeFrequency: "yearly" as const,
        priority: 0.5,
      })),
    ];
  } catch {
    return base;
  }
}

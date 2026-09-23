import { cache } from "react";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";

export type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readingTime: string;
  date: string;
  tags: string[];
  outline: string[];
  bodyMarkdown: string;
  imageUrl: string | null;
  published: boolean;
  views: number;
  updatedAt: string;
};

type ArticleRow = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  reading_time: string;
  date: string;
  tags: string[];
  outline: string[];
  body_markdown: string;
  image_url: string | null;
  published: boolean;
  views: number;
  updated_at: string;
};

function mapRow(row: ArticleRow): Article {
  return {
    slug: row.slug,
    category: row.category,
    title: row.title,
    excerpt: row.excerpt,
    readingTime: row.reading_time,
    date: row.date,
    tags: row.tags ?? [],
    outline: row.outline ?? [],
    bodyMarkdown: row.body_markdown,
    imageUrl: row.image_url,
    published: row.published,
    views: row.views,
    updatedAt: row.updated_at,
  };
}

const ARTICLE_COLUMNS =
  "slug, category, title, excerpt, reading_time, date, tags, outline, body_markdown, image_url, published, views, updated_at";

/** Published articles only — for the public site. */
export const getArticles = cache(async (): Promise<Article[]> => {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load articles: ${error.message}`);
  return (data as ArticleRow[]).map(mapRow);
});

export async function getArticle(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug);
}

export async function getAdjacentArticles(slug: string) {
  const articles = await getArticles();
  const index = articles.findIndex((a) => a.slug === slug);
  const previous = articles[(index - 1 + articles.length) % articles.length];
  const next = articles[(index + 1) % articles.length];
  return { previous, next };
}

/** Fire-and-forget: never let a broken counter break the page. */
export async function incrementArticleViews(slug: string) {
  try {
    const supabase = getPublicSupabaseClient();
    await supabase.rpc("increment_article_views", { article_slug: slug });
  } catch {
    // ignore
  }
}

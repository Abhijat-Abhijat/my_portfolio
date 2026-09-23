import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentArticles, getArticle, incrementArticleViews } from "@/lib/content/articles";
import { ArticleHero } from "@/components/article-hero";
import { PrevNextNav } from "@/components/prev-next-nav";
import { Reveal } from "@/components/reveal";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/utils";

const SITE_NAME = "Abhijat";

// Content lives in Supabase and can change anytime via /admin — always render fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const { previous, next } = await getAdjacentArticles(article.slug);
  await incrementArticleViews(article.slug);
  const html = renderMarkdown(article.bodyMarkdown);

  return (
    <article>
      <header className="border-b border-border pt-16 pb-12 md:pt-24 md:pb-14">
        <div className="container-page">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            ← Back to Writing
          </Link>

          <p className="mt-8 font-mono text-xs uppercase tracking-wide text-accent">
            {article.category}
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl tracking-tight text-fg sm:text-5xl md:text-6xl">
            {article.title}
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted">
            {article.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-fg-faint">
            <span>{SITE_NAME}</span>
            <span aria-hidden="true">·</span>
            <span>{article.date}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readingTime}</span>
            <span aria-hidden="true">·</span>
            <span>{article.views + 1} view{article.views === 0 ? "" : "s"}</span>
          </div>
          <p className="mt-2 text-xs text-fg-faint">
            Last updated {formatDate(article.updatedAt)}
          </p>
        </div>
      </header>

      <div className="container-page py-16 md:py-20">
        <Reveal className="mx-auto max-w-3xl">
          <ArticleHero category={article.category} imageUrl={article.imageUrl} title={article.title} />
        </Reveal>

        <div className="mx-auto mt-14 max-w-3xl">
          <Reveal>
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Reveal>

          {article.tags.length > 0 && (
            <Reveal className="mt-14">
              <h2 className="font-display text-2xl tracking-tight text-fg">Tags</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 font-mono text-xs text-fg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <p className="border-t border-border pt-8 text-sm text-fg-faint">Related posts</p>
          <PrevNextNav
            base="/blog"
            previous={{ slug: previous.slug, title: previous.title }}
            next={{ slug: next.slug, title: next.title }}
          />
        </div>
      </div>
    </article>
  );
}

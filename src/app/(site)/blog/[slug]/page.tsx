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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const { previous, next } = await getAdjacentArticles(article.slug);
  await incrementArticleViews(article.slug);
  const html = renderMarkdown(article.bodyMarkdown);

  return (
    <article>
      <header className="page-head pb-12">
        <div className="container-page">
          <Link href="/blog" className="tlink text-sm">
            ← Back to the notebook
          </Link>
          <div className="mx-auto mt-10 max-w-3xl">
            <span className="kicker">{article.category.toLowerCase()}</span>
            <h1 className="text-balance text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[1.02]">{article.title}</h1>
            {article.excerpt && <p className="mt-5 text-balance text-xl leading-relaxed text-fg-muted">{article.excerpt}</p>}
            <p className="mt-6 font-hand text-xl text-fg-faint">
              {SITE_NAME}
              {article.date && ` · ${article.date}`}
              {article.readingTime && ` · ${article.readingTime}`} · {article.views + 1} view{article.views === 0 ? "" : "s"} · updated{" "}
              {formatDate(article.updatedAt)}
            </p>
          </div>
        </div>
      </header>

      <div className="container-page pb-24">
        <Reveal className="mx-auto max-w-4xl">
          <ArticleHero slug={article.slug} imageUrl={article.imageUrl} title={article.title} />
        </Reveal>

        <div className="mx-auto mt-14 max-w-3xl">
          <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />

          {article.tags.length > 0 && (
            <ul className="mt-14 flex flex-wrap gap-2" aria-label="Tags">
              {article.tags.map((tag, i) => (
                <li key={tag} className="tape px-3 pb-1 pt-0.5 font-hand text-xl" style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <p className="font-hand text-2xl text-fg-faint">keep reading —</p>
          <PrevNextNav base="/blog" previous={{ slug: previous.slug, title: previous.title }} next={{ slug: next.slug, title: next.title }} />
        </div>
      </div>
    </article>
  );
}

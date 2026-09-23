import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/content/articles";
import { ArticlesList } from "@/components/articles-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on AI engineering, software systems, developer tools, and the lessons that only show up after you ship.",
};

export default async function BlogIndexPage() {
  const articles = await getArticles();

  return (
    <article>
      <header className="border-b border-border pt-16 pb-12 md:pt-24 md:pb-14">
        <div className="container-page">
          <Link
            href="/#writing"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            ← Back home
          </Link>

          <p className="mt-8 font-sans text-xs font-medium uppercase tracking-[0.24em] text-accent">
            Writing
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl tracking-tight text-fg sm:text-5xl md:text-6xl">
            Everything I&rsquo;ve written
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted">
            Notes on AI engineering, software systems, developer tools, and the lessons that only show up after you ship. {articles.length} post{articles.length === 1 ? "" : "s"}.
          </p>
        </div>
      </header>

      <div className="container-page py-16 md:py-20">
        {articles.length > 0 ? (
          <ArticlesList articles={articles} />
        ) : (
          <p className="text-sm text-fg-muted">Nothing published yet — check back soon.</p>
        )}
      </div>
    </article>
  );
}

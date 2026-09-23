import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { ArticleCard } from "@/components/article-card";
import { getArticles } from "@/lib/content/articles";

const FEATURED_COUNT = 5;

export async function Writing() {
  const articles = await getArticles();
  const featured = articles.slice(0, FEATURED_COUNT);

  return (
    <section id="writing" className="scroll-mt-24 border-t border-border py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Writing"
          title="Things I've learned building things."
          description="Notes on AI engineering, software systems, developer tools, and the lessons that only show up after you ship."
        />

        {featured.length > 0 ? (
          <div className="mt-10 border-b border-border">
            {featured.map((article, i) => (
              <ArticleCard key={article.slug} article={article} delay={(i % 3) * 60} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-fg-muted">
            Nothing published yet — check back soon.
          </p>
        )}

        {articles.length > FEATURED_COUNT && (
          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors hover:text-accent"
            >
              View all {articles.length} posts
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

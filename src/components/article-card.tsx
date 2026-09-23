import Link from "next/link";
import type { Article } from "@/lib/content/articles";
import { Reveal } from "@/components/reveal";

export function ArticleCard({ article, delay = 0 }: { article: Article; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <Link
        href={`/blog/${article.slug}`}
        className="group grid gap-4 border-t border-border py-8 transition-colors md:grid-cols-[140px_1fr_auto] md:items-start md:gap-8"
      >
        <p className="font-mono text-xs uppercase tracking-wide text-accent">
          {article.category}
        </p>

        <div>
          <h3 className="text-balance font-display text-2xl tracking-tight text-fg transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">
            {article.title}
          </h3>
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-fg-muted md:text-base">
            {article.excerpt}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-fg-faint">
            <span>{article.readingTime}</span>
            <span aria-hidden="true">·</span>
            <span>{article.date}</span>
            <span aria-hidden="true">·</span>
            <span>{article.tags.join(", ")}</span>
          </div>
        </div>

        <span className="hidden shrink-0 items-center gap-1.5 self-center text-sm font-medium text-fg md:inline-flex">
          Read article
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </Reveal>
  );
}

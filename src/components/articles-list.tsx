"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/lib/content/articles";
import { ArticleCard } from "@/components/article-card";

export function ArticlesList({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) =>
      [a.title, a.excerpt, a.category, ...a.tags].join(" ").toLowerCase().includes(q)
    );
  }, [articles, query]);

  return (
    <div>
      <div className="relative max-w-sm">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search writing…"
          aria-label="Search writing"
          className="w-full rounded-full border border-border bg-bg-elevated px-4 py-2.5 text-sm text-fg outline-none placeholder:text-fg-faint focus-visible:border-accent"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-fg-muted">No posts match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="mt-2 border-b border-border">
          {filtered.map((article, i) => (
            <ArticleCard key={article.slug} article={article} delay={(i % 3) * 60} />
          ))}
        </div>
      )}
    </div>
  );
}

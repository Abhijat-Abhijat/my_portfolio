import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";
import { getArticles, type Article } from "@/lib/content/articles";

export function Notebook({ articles, showExcerpt = false }: { articles: Article[]; showExcerpt?: boolean }) {
  return (
    <Reveal>
      <div className="notebook">
        <ul>
          {articles.map((a, i) => (
            <li key={a.slug} className="relative">
              <span aria-hidden="true" className="absolute left-[calc(-1*clamp(44px,6vw,80px))] top-4 font-hand text-[22px] text-fg-faint">
                {i + 1}.
              </span>
              <Link href={`/blog/${a.slug}`} className="group grid gap-x-4 py-3.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
                <span>
                  <span className="font-display text-[clamp(1.35rem,2.6vw,2.1rem)] leading-[1.12] transition-colors group-hover:text-m">{a.title}</span>
                  {showExcerpt && a.excerpt && <span className="mt-1 block text-fg-muted">{a.excerpt}</span>}
                </span>
                <span className="whitespace-nowrap font-hand text-xl text-fg-faint">
                  {a.category}
                  {showExcerpt && a.readingTime ? ` · ${a.readingTime}` : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export async function Writing({ limit = 4 }: { limit?: number }) {
  const articles = await getArticles();
  if (articles.length === 0) return null;

  return (
    <section id="notes" className="sec-tight scroll-mt-24" aria-labelledby="notes-h">
      <div className="container-page">
        <SectionHead id="notes-h" kicker="things I wrote down" title="From the" ital="notebook" meta={`${articles.length} notes · rss`} />
        <Notebook articles={articles.slice(0, limit)} />
        {articles.length > limit && (
          <Link href="/blog" className="btn-more mt-6">
            All {articles.length} notes →
          </Link>
        )}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { PageHead } from "@/components/page-head";
import { Notebook } from "@/components/writing";
import { getArticles } from "@/lib/content/articles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on AI engineering, software systems, developer tools, and the lessons that only show up after you ship.",
};

export default async function BlogIndexPage() {
  const articles = await getArticles();

  return (
    <article>
      <PageHead back="/#notes" backLabel="Back home" kicker="things I wrote down" title="The" ital="notebook">
        Notes on AI engineering, software systems, developer tools, and the lessons that only show up after you ship.{" "}
        {articles.length} post{articles.length === 1 ? "" : "s"}.
      </PageHead>
      <div className="container-page pb-28">
        {articles.length > 0 ? (
          <Notebook articles={articles} showExcerpt />
        ) : (
          <p className="font-hand text-2xl text-fg-muted">nothing published yet — check back soon.</p>
        )}
      </div>
    </article>
  );
}

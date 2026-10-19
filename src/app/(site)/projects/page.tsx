import type { Metadata } from "next";
import { PageHead } from "@/components/page-head";
import { ProjectIndex } from "@/components/project-index";
import { WorkCollage } from "@/components/selected-work";
import { getFeaturedProjects, getProjects } from "@/lib/content/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of systems, products, experiments, and developer tools I've built.",
};

export default async function ProjectsIndexPage() {
  const [featured, all] = await Promise.all([getFeaturedProjects(), getProjects()]);
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const rest = all.filter((p) => !featuredSlugs.has(p.slug));

  return (
    <article>
      <PageHead back="/#work" backLabel="Back home" kicker="everything I've built" title="All" ital="projects">
        Systems, products, experiments and developer tools — {all.length} project{all.length === 1 ? "" : "s"} so far.
      </PageHead>
      <div className="container-page pb-28">
        {all.length === 0 && <p className="font-hand text-2xl text-fg-muted">nothing here yet — check back soon.</p>}
        <WorkCollage projects={featured} />
        {rest.length > 0 && (
          <section className="mt-[clamp(96px,12vw,160px)]" aria-labelledby="rest-h">
            <span className="kicker">and a lot more tinkering</span>
            <h2 id="rest-h" className="h2 mb-10">
              Everything <span className="ital mc">else</span>
            </h2>
            <ProjectIndex
              items={rest.map((p, i) => ({
                slug: p.slug,
                n: featured.length + i + 1,
                title: p.title,
                category: p.category,
                stack: p.stack,
                metric: p.metrics[0] ? `${p.metrics[0].value} ${p.metrics[0].label}` : "",
              }))}
            />
          </section>
        )}
      </div>
    </article>
  );
}

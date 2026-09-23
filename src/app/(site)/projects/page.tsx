import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/content/projects";
import { ProjectsGrid } from "@/components/projects-grid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of systems, products, experiments, and developer tools I've built.",
};

export default async function ProjectsIndexPage() {
  const projects = await getProjects();

  return (
    <article>
      <header className="border-b border-border pt-16 pb-12 md:pt-24 md:pb-14">
        <div className="container-page">
          <Link
            href="/#work"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            ← Back home
          </Link>

          <p className="mt-8 font-sans text-xs font-medium uppercase tracking-[0.24em] text-accent">
            Selected work
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl tracking-tight text-fg sm:text-5xl md:text-6xl">
            Everything I&rsquo;ve built
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted">
            Systems, products, experiments, and developer tools. {projects.length} project{projects.length === 1 ? "" : "s"}.
          </p>
        </div>
      </header>

      <div className="container-page py-16 md:py-20">
        {projects.length > 0 ? (
          <ProjectsGrid projects={projects} />
        ) : (
          <p className="text-sm text-fg-muted">Nothing here yet — check back soon.</p>
        )}
      </div>
    </article>
  );
}

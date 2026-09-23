import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/lib/content/projects";

const FEATURED_COUNT = 6;

export async function SelectedWork() {
  const projects = await getProjects();
  const featured = projects.slice(0, FEATURED_COUNT);

  return (
    <section id="work" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Selected work"
          title="Systems I've worked on"
          description="A selection of systems, products, experiments, and developer tools I've built."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} delay={(i % 2) * 90} />
          ))}
        </div>

        {projects.length > FEATURED_COUNT && (
          <div className="mt-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors hover:text-accent"
            >
              View all {projects.length} projects
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

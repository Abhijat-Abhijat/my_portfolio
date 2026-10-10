import Link from "next/link";
import type { Project } from "@/lib/content/projects";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";

export function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="rounded-xl shadow-[0_24px_48px_-28px_var(--shadow)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
          <ProjectVisual kind={project.visual} imageUrl={project.imageUrl} alt={project.title} />
        </div>

        <div className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-faint transition-colors group-hover:text-accent">
            {project.category}
          </p>
          <h3 className="mt-2 text-3xl tracking-[-0.035em] text-fg">
            {project.title}
            <span className="text-accent">.</span>
          </h3>
          <p className="mt-3 max-w-md text-base leading-relaxed text-fg-muted">{project.description}</p>

          <p className="mt-4 font-mono text-xs text-fg-faint">{project.stack.join(" · ")}</p>

          <span className="link-underline mt-6 text-sm">
            View case study
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

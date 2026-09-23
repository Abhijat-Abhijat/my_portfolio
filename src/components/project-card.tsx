import Link from "next/link";
import type { Project } from "@/lib/content/projects";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";

export function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <Link
        href={`/projects/${project.slug}`}
        className="group block overflow-hidden rounded-2xl border border-border bg-bg-elevated/40 transition-colors duration-300 hover:border-border-strong hover:bg-bg-elevated"
      >
        <div className="overflow-hidden">
          <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            <ProjectVisual kind={project.visual} imageUrl={project.imageUrl} alt={project.title} />
          </div>
        </div>

        <div className="p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-fg-faint transition-colors group-hover:text-accent">
                {project.category}
              </p>
              <h3 className="mt-1.5 font-display text-2xl tracking-tight text-fg transition-transform duration-300 group-hover:translate-x-1">
                {project.title}
              </h3>
            </div>
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 text-lg text-fg-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
            >
              →
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-fg-muted">{project.description}</p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-fg-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.metrics[0] && (
            <p className="mt-5 text-sm text-fg-muted">
              <span className="font-tabular font-semibold text-accent">
                {project.metrics[0].value}
              </span>{" "}
              {project.metrics[0].label}
            </p>
          )}

          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fg">
            View case study
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

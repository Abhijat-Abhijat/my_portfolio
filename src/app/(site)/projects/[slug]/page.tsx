import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentProjects, getProject, incrementProjectViews } from "@/lib/content/projects";
import { ProjectVisual } from "@/components/project-visual";
import { MetricCounter } from "@/components/metric-counter";
import { PrevNextNav } from "@/components/prev-next-nav";
import { Reveal } from "@/components/reveal";
import { formatDate } from "@/lib/utils";

// Content lives in Supabase and can change anytime via /admin — always render fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const { previous, next } = await getAdjacentProjects(project.slug);
  await incrementProjectViews(project.slug);

  return (
    <article>
      <header className="border-b border-border pt-16 pb-14 md:pt-24 md:pb-16">
        <div className="container-page">
          <Link
            href="/#work"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            ← Back to Work
          </Link>

          <p className="mt-8 font-mono text-xs uppercase tracking-wide text-accent">
            {project.category}
          </p>
          <h1 className="mt-3 text-balance font-display text-5xl tracking-tight text-fg sm:text-6xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-lg leading-relaxed text-fg-muted">
            {project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-fg-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          {(project.links.live || project.links.github) && (
            <div className="mt-6 flex flex-wrap gap-5 text-sm">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-medium text-fg underline decoration-border-strong underline-offset-4 hover:text-accent"
                >
                  Live Demo ↗
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-medium text-fg underline decoration-border-strong underline-offset-4 hover:text-accent"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          )}

          <p className="mt-6 text-xs text-fg-faint">
            {project.views + 1} view{project.views === 0 ? "" : "s"} · Last updated {formatDate(project.updatedAt)}
          </p>
        </div>
      </header>

      <div className="container-page py-16 md:py-20">
        <Reveal className="mx-auto max-w-3xl">
          <ProjectVisual kind={project.visual} imageUrl={project.imageUrl} alt={project.title} />
        </Reveal>

        <div className="mx-auto mt-20 max-w-3xl space-y-20">
          <Reveal>
            <h2 className="font-display text-3xl tracking-tight text-fg">Overview</h2>
            <p className="mt-4 text-base leading-relaxed text-fg-muted md:text-lg">
              {project.description}
              {project.stack.length > 0 && <> Built with {project.stack.join(", ")}.</>}
            </p>
            {project.limitedInfo && (
              <p className="mt-4 rounded-xl border border-border bg-bg-elevated p-4 text-sm leading-relaxed text-fg-muted">
                Limited public detail is available for this project right now — this page will
                fill out with a full write-up (problem, approach, decisions) once that
                information is added.
              </p>
            )}
          </Reveal>

          {project.problem && (
            <Reveal>
              <h2 className="font-display text-3xl tracking-tight text-fg">The Problem</h2>
              <p className="mt-4 text-base leading-relaxed text-fg-muted md:text-lg">
                {project.problem}
              </p>
            </Reveal>
          )}

          {project.approach.length > 0 && (
            <Reveal>
              <h2 className="font-display text-3xl tracking-tight text-fg">The Approach</h2>
              <ul className="mt-4 space-y-3">
                {project.approach.map((line) => (
                  <li key={line} className="flex gap-3 text-base leading-relaxed text-fg-muted md:text-lg">
                    <span aria-hidden="true" className="mt-3 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {project.keyDecisions.length > 0 && (
            <Reveal>
              <h2 className="font-display text-3xl tracking-tight text-fg">
                Key Engineering Decisions
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {project.keyDecisions.map((decision) => (
                  <div key={decision.title} className="rounded-xl border border-border p-5">
                    <h3 className="font-display text-lg tracking-tight text-fg">
                      {decision.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">{decision.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {project.metrics.length > 0 && (
            <Reveal>
              <h2 className="font-display text-3xl tracking-tight text-fg">Results</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-border p-6">
                    <p className="font-tabular font-display text-4xl text-accent md:text-5xl">
                      <MetricCounter value={metric.value} />
                    </p>
                    <p className="mt-2 text-sm text-fg-muted">{metric.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {project.learned && (
            <Reveal>
              <h2 className="font-display text-3xl tracking-tight text-fg">What I Learned</h2>
              <p className="mt-4 text-base leading-relaxed text-fg-muted md:text-lg">
                {project.learned}
              </p>
            </Reveal>
          )}
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <PrevNextNav
            base="/projects"
            previous={{ slug: previous.slug, title: previous.title }}
            next={{ slug: next.slug, title: next.title }}
          />
        </div>
      </div>
    </article>
  );
}

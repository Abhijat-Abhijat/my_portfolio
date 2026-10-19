import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentProjects, getProject, getProjects, incrementProjectViews } from "@/lib/content/projects";
import { ProjectCover } from "@/components/project-cover";
import { MetricCounter } from "@/components/metric-counter";
import { PrevNextNav } from "@/components/prev-next-nav";
import { Reveal } from "@/components/reveal";
import { formatDate } from "@/lib/utils";

// Content lives in Supabase and can change anytime via /admin — always render fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description },
  };
}

function Block({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <h2 className="font-hand text-[28px] font-bold leading-none text-m-ink">{kicker}</h2>
      <div className="mt-4">{children}</div>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();

  const { previous, next } = await getAdjacentProjects(project.slug);
  await incrementProjectViews(project.slug);
  const index = all.findIndex((p) => p.slug === project.slug);

  return (
    <article>
      <header className="page-head pb-12">
        <div className="container-page">
          <Link href="/#work" className="tlink text-sm">
            ← Back to work
          </Link>
          <div className="mt-10 max-w-4xl">
            <span className="kicker">{project.category.toLowerCase()}</span>
            <h1 className="h2 text-balance">{project.title}</h1>
            <p className="mt-5 max-w-2xl text-balance text-xl leading-relaxed text-fg-muted">{project.description}</p>
            {project.stack.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((tech, i) => (
                  <li key={tech} className="tape px-3 pb-1 pt-0.5 font-hand text-xl" style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
                    {tech}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              {project.links.live && (
                <a href={project.links.live} target="_blank" rel="noreferrer noopener" className="btn-ink">
                  Live demo <span aria-hidden="true">↗</span>
                </a>
              )}
              {project.links.github && (
                <a href={project.links.github} target="_blank" rel="noreferrer noopener" className="btn-more">
                  GitHub ↗
                </a>
              )}
              <span className="font-hand text-xl text-fg-faint">
                {project.views + 1} view{project.views === 0 ? "" : "s"} · updated {formatDate(project.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container-page pb-24">
        <Reveal className="mx-auto max-w-5xl">
          <div className="cover">
            <div className="cover-in">
              <ProjectCover project={project} index={Math.max(index, 0)} sizes="(min-width: 1024px) 1000px, 100vw" priority />
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-20 grid max-w-3xl gap-16">
          {project.limitedInfo && (
            <p className="ink-card p-5 text-fg-muted">
              <span className="font-hand text-2xl text-m-ink">work in progress —</span> the full write-up (problem, approach,
              decisions) is on its way.
            </p>
          )}

          {project.problem && (
            <Block kicker="the problem">
              <p className="text-lg leading-relaxed text-fg-muted">{project.problem}</p>
            </Block>
          )}

          {project.approach.length > 0 && (
            <Block kicker="what I did">
              <ol className="grid gap-4">
                {project.approach.map((line, i) => (
                  <li key={line} className="flex gap-4 text-lg leading-relaxed text-fg-muted">
                    <span aria-hidden="true" className="w-8 flex-none font-hand text-2xl text-m-ink">
                      {i + 1}.
                    </span>
                    {line}
                  </li>
                ))}
              </ol>
            </Block>
          )}

          {project.keyDecisions.length > 0 && (
            <Block kicker="decisions that mattered">
              <div className="grid gap-5 sm:grid-cols-2">
                {project.keyDecisions.map((d, i) => (
                  <div key={d.title} className="ink-card p-5" style={{ transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)` }}>
                    <h3 className="text-2xl leading-tight">{d.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{d.body}</p>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {project.metrics.length > 0 && (
            <Block kicker="what happened">
              <div className="flex flex-wrap gap-4">
                {project.metrics.map((m) => (
                  <div key={m.label} className="stk h-36 w-36">
                    <span>
                      <b>
                        <MetricCounter value={m.value} />
                      </b>
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {project.learned && (
            <Block kicker="what I learned">
              <p className="border-l-[3px] border-m pl-5 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] italic leading-snug text-fg">
                {project.learned}
              </p>
            </Block>
          )}
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <PrevNextNav base="/projects" previous={{ slug: previous.slug, title: previous.title }} next={{ slug: next.slug, title: next.title }} />
        </div>
      </div>
    </article>
  );
}

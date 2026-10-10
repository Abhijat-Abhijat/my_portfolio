import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { ProjectVisual } from "@/components/project-visual";
import { HandNote } from "@/components/hand-note";
import { Reveal } from "@/components/reveal";
import { getProjects } from "@/lib/content/projects";
import { cn } from "@/lib/utils";

const FEATURED_COUNT = 4;

export async function SelectedWork() {
  const projects = await getProjects();
  const featured = projects.slice(0, FEATURED_COUNT);

  return (
    <section id="work" className="scroll-mt-24 pb-24 pt-16 md:pb-36">
      <div className="container-page">
        <SectionHeading align="center" eyebrow="Selected work" title="Systems I've worked on" />

        <div className="mt-20 space-y-28 md:mt-28 md:space-y-40">
          {featured.map((project, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={project.slug}
                className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16"
              >
                <Reveal className={cn("md:pl-8", flip && "md:order-2 md:pl-0 md:pr-8")}>
                  <h3 className="text-5xl leading-none tracking-[-0.04em] text-fg md:text-6xl">
                    {project.title}
                    <span className="text-accent">.</span>
                  </h3>
                  <p className="mt-6 max-w-sm text-lg leading-relaxed text-fg-muted">
                    {project.description}
                  </p>
                  {project.metrics[0] && (
                    <p className="mt-6 text-sm text-fg-muted">
                      <span className="font-tabular text-2xl font-bold tracking-tight text-fg">
                        {project.metrics[0].value}
                      </span>{" "}
                      {project.metrics[0].label}
                    </p>
                  )}
                  <Link href={`/projects/${project.slug}`} className="link-underline group mt-8">
                    View case study
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </Link>
                </Reveal>

                <Reveal delay={90} className={cn("relative", flip && "md:order-1")}>
                  <HandNote
                    arrow={flip ? "down-right" : "down-left"}
                    className={cn(
                      "absolute -top-16 z-10 hidden w-48 lg:block",
                      flip ? "-left-6" : "-right-6 text-right"
                    )}
                  >
                    {project.category.toLowerCase()}
                  </HandNote>
                  <Link
                    href={`/projects/${project.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    className={cn(
                      "group block rounded-xl shadow-[0_30px_60px_-30px_var(--shadow)] transition-transform duration-500 ease-out hover:-translate-y-1.5",
                      flip ? "md:-rotate-1" : "md:rotate-1"
                    )}
                  >
                    <ProjectVisual kind={project.visual} imageUrl={project.imageUrl} alt={project.title} />
                  </Link>
                </Reveal>
              </article>
            );
          })}
        </div>

        {projects.length > FEATURED_COUNT && (
          <Reveal className="mt-24 text-center md:mt-32">
            <Link href="/projects" className="link-underline group">
              View all {projects.length} projects
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}

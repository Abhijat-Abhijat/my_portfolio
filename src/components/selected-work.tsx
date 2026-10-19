import Link from "next/link";
import { SectionHead } from "@/components/section-head";
import { ProjectCover } from "@/components/project-cover";
import { ProjectIndex } from "@/components/project-index";
import { getFeaturedProjects, getProjects, type Project } from "@/lib/content/projects";

const TILTS = [-2.2, 1.8, 1.2, -1.6, -1, 2];
const pad = (n: number) => String(n).padStart(2, "0");
const short = (category: string) => category.split(" · ")[0];

export function WorkCollage({ projects }: { projects: Project[] }) {
  return (
    <div className="collage">
      {projects.map((p, i) => {
        const m = p.metrics[0];
        const tilt = { ["--r" as string]: `${TILTS[i % TILTS.length]}deg` } as React.CSSProperties;
        return (
          <div key={p.slug} className="cw" style={tilt}>
            <Link href={`/projects/${p.slug}`} className="card" style={tilt}>
              <div className="cover">
                <div className="cover-in">
                  <ProjectCover project={p} index={i} />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2">
                <span className="eyebrow-mono">
                  {pad(i + 1)} · {short(p.category)}
                </span>
                {m && (
                  <span className="badge-m row-span-2">
                    <span>
                      <b>{m.value}</b>
                      {m.label}
                    </span>
                  </span>
                )}
                <h3 className="col-start-1 text-[clamp(1.8rem,2.8vw,2.5rem)] leading-none">{p.title}</h3>
                <p className="col-span-full max-w-[46ch] text-fg-muted">{p.description}</p>
                <span className="read-link col-span-full">
                  Read the story <span className="arr" aria-hidden="true">↗</span>
                </span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export async function SelectedWork() {
  const [featured, all] = await Promise.all([getFeaturedProjects(), getProjects()]);
  if (featured.length === 0) return null;

  return (
    <section id="work" className="sec scroll-mt-24" aria-labelledby="work-h">
      <div className="container-page">
        <SectionHead id="work-h" kicker="things I've made" title="Selected" ital="work" meta={`${pad(featured.length)} picked · ${all.length} total`} />
        <WorkCollage projects={featured} />
      </div>
    </section>
  );
}

/** Everything that isn't featured — filterable, collapses past `limit`. */
export async function MoreProjects({ limit }: { limit?: number }) {
  const [featured, all] = await Promise.all([getFeaturedProjects(), getProjects()]);
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const rest = all.filter((p) => !featuredSlugs.has(p.slug));
  if (rest.length === 0) return null;

  return (
    <section id="index" className="sec-tight scroll-mt-24" aria-labelledby="index-h">
      <div className="container-page">
        <SectionHead id="index-h" kicker="and a lot more tinkering" title="Everything" ital="else" meta={`${rest.length} side projects`} />
        <ProjectIndex
          limit={limit}
          items={rest.map((p, i) => ({
            slug: p.slug,
            n: featured.length + i + 1,
            title: p.title,
            category: p.category,
            stack: p.stack,
            metric: p.metrics[0] ? `${p.metrics[0].value} ${p.metrics[0].label}` : "",
          }))}
        />
      </div>
    </section>
  );
}

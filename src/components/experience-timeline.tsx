import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { HandNote } from "@/components/hand-note";
import { getExperience, getVentures, getVolunteer, type ExperienceEntry } from "@/lib/content/experience";
import { cn } from "@/lib/utils";

/** Home-page variant: oldest → newest, left → right, each step a little higher. */
function RisingTimeline({ entries }: { entries: ExperienceEntry[] }) {
  const ordered = [...entries].reverse();
  const n = ordered.length;

  return (
    <div className="relative mt-16 md:mt-32">
      <HandNote arrow="down-right" className="absolute -top-10 left-[38%] hidden w-64 lg:block">
        somewhere here, side projects
        <br />
        became production.
      </HandNote>

      <ol
        className="relative grid gap-y-12 border-l border-dashed border-note/50 pl-8 md:grid-cols-[repeat(var(--cols),minmax(0,1fr))] md:gap-x-8 md:border-l-0 md:pl-0"
        style={{ "--cols": n } as React.CSSProperties}
      >
        {ordered.map((entry, i) => {
          const latest = i === n - 1;
          return (
            <li
              key={entry.id}
              className="relative md:mt-[calc(var(--rise)*4.5rem)]"
              style={{ "--rise": n - 1 - i } as React.CSSProperties}
            >
              {/* Dashed connector up to the next (newer) role — md+ only. */}
              {!latest && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute left-1.5 -top-16.5 hidden h-18 w-[calc(100%+2rem)] overflow-visible text-note/60 md:block"
                >
                  <path
                    d="M0 100 C 40 100, 60 0, 100 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[-2.4rem] top-1 block rounded-full md:static md:mb-6",
                  latest
                    ? "h-3.5 w-3.5 bg-accent shadow-[0_0_0_6px_var(--accent-soft)]"
                    : "h-3 w-3 bg-fg"
                )}
              />
              <Reveal delay={i * 80}>
                <h3 className="text-xl tracking-tight text-fg">{entry.company}</h3>
                <p className="mt-1.5 text-base text-fg-muted">{entry.role}</p>
                <p className="mt-1 font-tabular text-sm text-fg-faint">
                  {entry.start} – {entry.end}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export async function ExperienceTimeline({
  limit,
  standalone = false,
}: { limit?: number; standalone?: boolean } = {}) {
  if (!standalone) {
    const allExperience = await getExperience();
    const experience = limit ? allExperience.slice(0, limit) : allExperience;

    return (
      <section id="experience" className="scroll-mt-24 py-24 md:py-36">
        <div className="container-page">
          <SectionHeading
            eyebrow="Experience"
            title="From prototype to production."
            description="Roles where I've built and shipped real systems."
          />
          <RisingTimeline entries={experience} />
          <Reveal className="mt-16 md:mt-20">
            <Link href="/experience" className="link-underline group">
              Full history
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    );
  }

  const [experience, volunteer, ventures] = await Promise.all([
    getExperience(),
    getVolunteer(),
    getVentures(),
  ]);

  return (
    <div className="container-page">
      <div>
        {experience.map((entry, i) => (
          <Reveal key={entry.id} delay={i * 60}>
            <div className="grid gap-3 border-t border-border py-10 md:grid-cols-[minmax(0,220px)_1fr] md:gap-10">
              <div>
                <p className="font-tabular text-sm text-fg-faint">
                  {entry.start} – {entry.end}
                </p>
                {entry.location && <p className="mt-1 text-sm text-fg-faint">{entry.location}</p>}
              </div>
              <div>
                <h3 className="text-2xl tracking-tight text-fg md:text-3xl">{entry.role}</h3>
                <p className="mt-1.5 text-base font-medium text-accent">{entry.company}</p>

                {entry.highlights.length > 0 && (
                  <ul className="mt-5 max-w-[65ch] space-y-3">
                    {entry.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-base leading-relaxed text-fg-muted">
                        <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {volunteer.length > 0 && (
        <Reveal className="mt-16 border-t border-border pt-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Volunteer &amp; community
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {volunteer.map((entry) => (
              <div key={entry.id}>
                <p className="text-lg font-bold tracking-tight text-fg">{entry.role}</p>
                <p className="mt-1 text-sm text-fg-muted">
                  {entry.company} · {entry.start === entry.end ? entry.start : `${entry.start} – ${entry.end}`}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {ventures.length > 0 && (
        <Reveal className="mt-10 border-t border-border pt-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Ventures</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {ventures.map((venture) => (
              <div key={venture.id}>
                <p className="text-lg font-bold tracking-tight text-fg">
                  {venture.role} · {venture.name}
                </p>
                <p className="mt-1 text-sm text-fg-muted">
                  {venture.start} – {venture.end}
                </p>
                <p className="mt-1 text-sm text-fg-muted">{venture.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}

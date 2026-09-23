import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getExperience, getVentures, getVolunteer } from "@/lib/content/experience";

export async function ExperienceTimeline({
  limit,
  standalone = false,
}: { limit?: number; standalone?: boolean } = {}) {
  const [allExperience, volunteer, ventures] = await Promise.all([
    getExperience(),
    getVolunteer(),
    getVentures(),
  ]);
  const experience = limit ? allExperience.slice(0, limit) : allExperience;
  const truncated = limit != null && allExperience.length > limit;

  const body = (
    <div>
      {!standalone && (
        <SectionHeading
          eyebrow="Experience"
          title="From prototype to production."
          description="Roles where I've built and shipped real systems."
        />
      )}

      <div className={standalone ? "space-y-0" : "mt-14 space-y-0"}>
          {experience.map((entry, i) => (
            <Reveal key={entry.id} delay={i * 60}>
              <div className="grid gap-3 border-t border-border py-8 first:border-t md:grid-cols-[minmax(0,220px)_1fr] md:gap-10">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-fg-faint">
                    {entry.start} — {entry.end}
                  </p>
                  {entry.location && (
                    <p className="mt-1 text-xs text-fg-faint">{entry.location}</p>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-2xl tracking-tight text-fg">
                    {entry.role}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-accent">{entry.company}</p>

                  {entry.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2.5">
                      {entry.highlights.map((h) => (
                        <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-fg-muted md:text-base">
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

        {truncated && (
          <div className="mt-8">
            <Link
              href="/experience"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors hover:text-accent"
            >
              View all {allExperience.length} roles
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {volunteer.length > 0 && (
          <Reveal className="mt-16 border-t border-border pt-10">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
              Volunteer &amp; community
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {volunteer.map((entry) => (
                <div key={entry.id}>
                  <p className="font-display text-lg tracking-tight text-fg">{entry.role}</p>
                  <p className="mt-1 text-sm text-fg-muted">
                    {entry.company} · {entry.start === entry.end ? entry.start : `${entry.start} — ${entry.end}`}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {ventures.length > 0 && (
          <Reveal className="mt-10 border-t border-border pt-10">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
              Ventures
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {ventures.map((venture) => (
                <div key={venture.id}>
                  <p className="font-display text-lg tracking-tight text-fg">
                    {venture.role} · {venture.name}
                  </p>
                  <p className="mt-1 text-sm text-fg-muted">
                    {venture.start} — {venture.end}
                  </p>
                  <p className="mt-1 text-sm text-fg-muted">{venture.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
  );

  if (standalone) {
    return <div className="container-page">{body}</div>;
  }

  return (
    <section id="experience" className="scroll-mt-24 border-t border-border py-24 md:py-32">
      <div className="container-page">{body}</div>
    </section>
  );
}

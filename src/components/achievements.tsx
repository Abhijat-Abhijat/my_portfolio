import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getAchievements } from "@/lib/content/achievements";

export async function Achievements({
  limit,
  standalone = false,
}: { limit?: number; standalone?: boolean } = {}) {
  const achievements = await getAchievements();
  const featured = achievements.find((a) => a.featured);
  const allRest = achievements.filter((a) => !a.featured);
  const rest = limit ? allRest.slice(0, limit) : allRest;
  const truncated = limit != null && allRest.length > limit;

  return (
    <section id="achievements" className="scroll-mt-24 border-t border-border py-24 md:py-32">
      <div className="container-page">
        {!standalone && (
          <SectionHeading eyebrow="Achievements" title="A few things I've learned the hard way." />
        )}

        <div className={standalone ? "grid gap-5 md:grid-cols-3" : "mt-14 grid gap-5 md:grid-cols-3"}>
          {featured && (
            <Reveal className="md:col-span-3">
              <div className="relative overflow-hidden rounded-2xl border border-border-strong bg-bg-elevated p-8 md:p-12">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
                  style={{ background: "var(--accent)" }}
                  aria-hidden="true"
                />
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                  Academics
                </p>
                <h3 className="mt-4 text-balance font-display text-3xl tracking-tight text-fg md:text-4xl">
                  {featured.title}
                </h3>
                <p className="mt-2 text-base text-fg-muted">{featured.org}</p>
              </div>
            </Reveal>
          )}

          {rest.map((achievement, i) => (
            <Reveal key={achievement.id} delay={i * 70}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-border p-6">
                <h3 className="font-display text-xl tracking-tight text-fg">
                  {achievement.title}
                </h3>
                <p className="mt-4 text-sm text-fg-muted">{achievement.org}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {truncated && (
          <div className="mt-8">
            <Link
              href="/achievements"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors hover:text-accent"
            >
              View all {allRest.length + (featured ? 1 : 0)} achievements
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

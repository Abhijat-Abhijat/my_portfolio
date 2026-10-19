import { SectionHead } from "@/components/section-head";
import { Journal, type JournalItem } from "@/components/journal";
import { getExperience, getVentures, getVolunteer } from "@/lib/content/experience";

/** Experience + ventures + volunteer work as one field journal. */
export async function ExperienceTimeline({ limit, standalone = false }: { limit?: number; standalone?: boolean }) {
  const [experience, volunteer, ventures] = await Promise.all([getExperience(), getVolunteer(), getVentures()]);

  const items: JournalItem[] = [
    ...experience.map((e) => ({
      id: e.id,
      kind: "experience" as const,
      org: e.company,
      role: e.role,
      start: e.start,
      end: e.end,
      location: e.location,
      highlights: e.highlights,
    })),
    ...ventures.map((v) => ({
      id: v.id,
      kind: "experience" as const,
      org: v.name,
      role: v.role,
      start: v.start,
      end: v.end,
      highlights: v.description ? [v.description] : [],
    })),
    ...volunteer.map((e) => ({
      id: e.id,
      kind: "volunteer" as const,
      org: e.company,
      role: e.role,
      start: e.start,
      end: e.end,
      location: e.location,
      highlights: e.highlights,
    })),
  ];
  if (items.length === 0) return null;

  const body = <Journal items={items} limit={limit} standalone={standalone} />;
  if (standalone) return body;

  return (
    <section id="journal" className="sec-tight scroll-mt-24" aria-labelledby="journal-h">
      <div className="container-page">
        <SectionHead id="journal-h" kicker="where I've been" title="Field" ital="journal" meta={`${items.length} entries`} />
        {body}
      </div>
    </section>
  );
}

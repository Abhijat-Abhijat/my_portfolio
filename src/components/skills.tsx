import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getSkillGroups } from "@/lib/content/skills";

export async function Skills() {
  const skillGroups = await getSkillGroups();

  return (
    <section id="skills" className="scroll-mt-24 border-t border-border py-24 md:py-32">
      <div className="container-page">
        <SectionHeading eyebrow="Technical skills" title="The stack behind the work." />

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.id} delay={(i % 3) * 70}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-fg-faint">
                {group.label}
              </h3>
              <p className="mt-3 font-display text-xl leading-snug text-fg md:text-2xl">
                {group.skills.map((skill, idx) => (
                  <span key={skill}>
                    {skill}
                    {idx < group.skills.length - 1 && (
                      <span className="text-fg-faint"> · </span>
                    )}
                  </span>
                ))}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

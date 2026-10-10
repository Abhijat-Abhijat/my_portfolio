import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { HandNote } from "@/components/hand-note";
import { SkillsExplorer, SkillsMarquee } from "@/components/skills-explorer";
import { getSkillGroups } from "@/lib/content/skills";

export async function Skills() {
  const skillGroups = await getSkillGroups();
  const allSkills = [...new Set(skillGroups.flatMap((g) => g.skills))];
  const total = allSkills.length;

  return (
    <section id="skills" className="scroll-mt-24 overflow-hidden py-24 md:py-36">
      <div className="container-page relative">
        <SectionHeading eyebrow="Technical skills" title="The stack behind the work." />
        <HandNote arrow="down-left" className="absolute right-4 top-2 hidden w-56 text-right md:block">
          {total} tools, still learning
          <br />
          the next one.
        </HandNote>
      </div>

      <Reveal className="mt-14 md:mt-20">
        <SkillsMarquee skills={allSkills} />
      </Reveal>

      <Reveal className="container-page mt-16 md:mt-24">
        <SkillsExplorer groups={skillGroups} />
      </Reveal>
    </section>
  );
}

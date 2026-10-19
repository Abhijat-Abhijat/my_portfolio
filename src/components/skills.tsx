import { SectionHead } from "@/components/section-head";
import { Toolbox } from "@/components/toolbox";
import { getSkillGroups } from "@/lib/content/skills";

export async function Skills() {
  const groups = await getSkillGroups();
  if (groups.length === 0) return null;
  const total = groups.reduce((n, g) => n + g.skills.length, 0);

  return (
    <section id="tools" className="sec scroll-mt-24" aria-labelledby="tools-h">
      <div className="container-page">
        <SectionHead id="tools-h" kicker="what's in the bag" title="Tool" ital="box" glue meta={`${groups.length} drawers · ${total} tools`} />
        <Toolbox groups={groups} />
      </div>
    </section>
  );
}

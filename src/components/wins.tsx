import Link from "next/link";
import { SectionHead } from "@/components/section-head";
import { Achievements } from "@/components/achievements";
import { Publications } from "@/components/publications";
import { getAchievements } from "@/lib/content/achievements";
import { getPublications } from "@/lib/content/publications";

/** Home-page recognition: featured achievement, the medal line, papers. */
export async function Wins() {
  const [achievements, publications] = await Promise.all([getAchievements(), getPublications()]);
  if (!achievements.length && !publications.length) return null;

  return (
    <section id="wins" className="sec-tight scroll-mt-24" aria-labelledby="wins-h">
      <div className="container-page">
        <SectionHead
          id="wins-h"
          kicker="things I'm quietly proud of"
          title="Wins"
          ital="& papers"
          meta={`${achievements.length} wins · ${publications.length} in print`}
        />
        {achievements.length > 0 && <Achievements />}

        {publications.length > 0 && (
          <div className="mt-[clamp(56px,7vw,88px)]">
            <h3 className="kicker mb-5">in print</h3>
            <Publications />
          </div>
        )}

        <Link href="/achievements" className="btn-more mt-10">
          See everything →
        </Link>
      </div>
    </section>
  );
}

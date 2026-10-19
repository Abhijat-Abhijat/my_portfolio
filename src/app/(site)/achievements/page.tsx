import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { Achievements } from "@/components/achievements";
import { Publications } from "@/components/publications";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Awards, recognition, papers and books.",
};

export default function AchievementsIndexPage() {
  return (
    <article>
      <PageHead back="/#about" backLabel="Back home" kicker="things I'm quietly proud of" title="Achievements" ital="& papers" />
      <div className="container-page grid gap-[clamp(80px,10vw,140px)] pb-28">
        <Achievements />
        <section aria-labelledby="pubs-h">
          <span className="kicker">in print</span>
          <h2 id="pubs-h" className="h2 mb-10">
            Papers <span className="ital mc">& books</span>
          </h2>
          <Publications />
        </section>
        <Link href="/certifications" className="btn-more w-fit">
          See certifications →
        </Link>
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import { PageHead } from "@/components/page-head";
import { ExperienceTimeline } from "@/components/experience-timeline";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experience",
  description: "Roles where I've built and shipped real systems.",
};

export default function ExperienceIndexPage() {
  return (
    <article>
      <PageHead back="/#journal" backLabel="Back home" kicker="where I've been" title="The whole" ital="journal" />
      <div className="container-page pb-28">
        <ExperienceTimeline standalone />
      </div>
    </article>
  );
}

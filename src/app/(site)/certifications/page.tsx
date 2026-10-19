import type { Metadata } from "next";
import { PageHead } from "@/components/page-head";
import { Certifications } from "@/components/certifications";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Certifications",
  description: "A few courses along the way.",
};

export default function CertificationsIndexPage() {
  return (
    <article>
      <PageHead back="/achievements" backLabel="Achievements" kicker="a few courses along the way" title="Certifi" ital="cations" glue />
      <div className="container-page pb-28">
        <Certifications />
      </div>
    </article>
  );
}

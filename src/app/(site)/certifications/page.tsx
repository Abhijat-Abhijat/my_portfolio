import type { Metadata } from "next";
import Link from "next/link";
import { Certifications } from "@/components/certifications";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Certifications",
  description: "A few courses along the way.",
};

export default function CertificationsIndexPage() {
  return (
    <article>
      <header className="border-b border-border pt-16 pb-12 md:pt-24 md:pb-14">
        <div className="container-page">
          <Link
            href="/#certifications"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            ← Back home
          </Link>

          <p className="mt-8 font-sans text-xs font-medium uppercase tracking-[0.24em] text-accent">
            Certifications
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl tracking-tight text-fg sm:text-5xl md:text-6xl">
            All my certifications
          </h1>
        </div>
      </header>

      <div className="container-page py-16 md:py-20">
        <Certifications standalone />
      </div>
    </article>
  );
}

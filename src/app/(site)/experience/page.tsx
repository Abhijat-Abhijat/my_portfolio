import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceTimeline } from "@/components/experience-timeline";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experience",
  description: "Roles where I've built and shipped real systems.",
};

export default function ExperienceIndexPage() {
  return (
    <article>
      <header className="border-b border-border pt-16 pb-12 md:pt-24 md:pb-14">
        <div className="container-page">
          <Link
            href="/#experience"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            ← Back home
          </Link>

          <p className="mt-8 font-sans text-xs font-medium uppercase tracking-[0.24em] text-accent">
            Experience
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl tracking-tight text-fg sm:text-5xl md:text-6xl">
            Everywhere I&rsquo;ve worked
          </h1>
        </div>
      </header>

      <ExperienceTimeline />
    </article>
  );
}

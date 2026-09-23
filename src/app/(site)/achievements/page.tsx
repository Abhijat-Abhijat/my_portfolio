import type { Metadata } from "next";
import Link from "next/link";
import { Achievements } from "@/components/achievements";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements",
  description: "A few things I've learned the hard way.",
};

export default function AchievementsIndexPage() {
  return (
    <article>
      <header className="border-b border-border pt-16 pb-12 md:pt-24 md:pb-14">
        <div className="container-page">
          <Link
            href="/#achievements"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            ← Back home
          </Link>

          <p className="mt-8 font-sans text-xs font-medium uppercase tracking-[0.24em] text-accent">
            Achievements
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl tracking-tight text-fg sm:text-5xl md:text-6xl">
            Everything, not just the highlights
          </h1>
        </div>
      </header>

      <div className="pb-16 md:pb-20">
        <Achievements standalone />
      </div>
    </article>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

const HeroScene = dynamic(() => import("@/components/hero-scene").then((m) => m.HeroScene), {
  ssr: false,
});

export function Hero({ githubUrl }: { githubUrl: string }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client mount flag, avoids SSR/CSR mismatch
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
        {mounted && <HeroScene reducedMotion={reducedMotion} />}
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-bg/10 via-bg/40 to-bg" />

      <div className="container-page relative z-10 flex min-h-[86vh] flex-col justify-center py-28 md:py-32">
        <p
          className="hero-in font-sans text-xs font-medium uppercase tracking-[0.24em] text-fg-muted md:text-sm"
          style={{ animationDelay: "0ms" }}
        >
          AI Engineer · Full-Stack Developer · Published Author
        </p>

        <h1
          className="hero-in mt-6 max-w-4xl text-balance font-display text-[2.6rem] leading-[1.05] tracking-tight text-fg sm:text-6xl md:text-7xl"
          style={{ animationDelay: "90ms" }}
        >
          I build useful software and AI products.
        </h1>

        <p
          className="hero-in mt-7 max-w-xl text-balance text-lg leading-relaxed text-fg-muted md:text-xl"
          style={{ animationDelay: "180ms" }}
        >
          AI engineer and full-stack developer building production systems, intelligent
          workflows, and developer tools — and sharing what I learn along the way.
        </p>

        <div className="hero-in mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ animationDelay: "270ms" }}>
          <Link
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5"
          >
            Explore my work
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <Link
            href="#writing"
            className="group inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors hover:text-accent"
          >
            Read my writing
            <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              ↗
            </span>
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            GitHub
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

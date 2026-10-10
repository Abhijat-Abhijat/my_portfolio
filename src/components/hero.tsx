import Link from "next/link";
import { HeroAvatars } from "@/components/hero-avatars";

export function Hero({ name, role, githubUrl }: { name: string; role: string; githubUrl: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* Orbit rings + slow radar sweep — pure CSS, decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(42rem,94vw)] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute inset-0 rounded-full border border-border" />
        <div className="absolute inset-6 rounded-full border border-border opacity-70" />
        <div className="orbit absolute inset-0 rounded-full opacity-70">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_320deg,var(--accent-soft)_360deg)]" />
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_6px_var(--accent-soft)]" />
        </div>
      </div>
      <HeroAvatars />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-bg"
      />

      <div className="container-page relative flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center pb-24 pt-16 text-center">
        <p className="hero-in text-xs font-semibold uppercase tracking-[0.22em] text-fg-muted">
          {role}
        </p>

        <h1
          className="hero-in mt-5 text-[clamp(3.5rem,11vw,7.5rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-fg"
          style={{ animationDelay: "90ms" }}
        >
          {name}
          <span className="text-accent">.</span>
        </h1>

        <p
          className="hero-in mt-7 max-w-xl text-balance text-lg leading-relaxed text-fg-muted md:text-xl"
          style={{ animationDelay: "180ms" }}
        >
          I build useful software and AI products — production systems, intelligent
          workflows and developer tools.
        </p>

        <div
          className="hero-in mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
          style={{ animationDelay: "270ms" }}
        >
          <Link href="#work" className="link-underline group">
            View selected work
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
              ↘
            </span>
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
          >
            GitHub
            <span aria-hidden="true">↗</span>
          </a>
        </div>

      </div>
    </section>
  );
}

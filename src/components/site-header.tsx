"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { isPaused, onMotion, say, setPaused, syncFavicon } from "@/lib/site-events";

export function SiteHeader({ name, status }: { name: string; status: string }) {
  const pathname = usePathname();
  const [paused, setPausedState] = useState(false);

  useEffect(() => {
    const off = onMotion(setPausedState);
    syncFavicon(); // a saved hacker skin should show on pages without the hero too
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && !isPaused()) setPaused(true);
    return off;
  }, []);

  const isActive = (section: string | null) => section !== null && pathname.startsWith(section);

  return (
    <header className="topbar">
      <a href="#main" className="skip-link rounded bg-fg px-3 py-1.5 text-sm text-bg">
        Skip to content
      </a>
      <div className="topbar-in">
        <Link href="/" className="flex min-h-11 items-center gap-2.5 font-display text-2xl leading-none" aria-label={`${name} — home`}>
          <Image
            src="/avatars/thinking.webp"
            alt=""
            width={30}
            height={30}
            className="h-[30px] w-[30px] rounded-full bg-m object-cover object-[50%_18%] transition-colors duration-500"
          />
          {name}
          <span className="mc">.</span>
        </Link>

        <nav className="topbar-nav ml-3 hidden gap-1 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} data-active={isActive(link.section) || undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <span className="mr-2 hidden items-center gap-2 whitespace-nowrap text-[13px] text-fg-muted xl:flex">
            <span className="dot-live" aria-hidden="true" />
            {status}
          </span>
          <button
            type="button"
            className="icon-btn"
            aria-pressed={paused}
            aria-label={paused ? "Resume motion" : "Pause motion"}
            title={paused ? "Resume motion" : "Pause motion"}
            onClick={() => {
              setPaused(!paused);
              say(paused ? "motion back on" : "motion paused");
            }}
          >
            <span aria-hidden="true">{paused ? "▶" : "❚❚"}</span>
          </button>
          <ThemeToggle />
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => window.dispatchEvent(new Event("site:cmdk"))}
            className="inline-flex h-[38px] items-center gap-2 rounded-full bg-fg px-3.5 text-[13px] font-semibold text-bg"
          >
            <kbd className="font-mono text-[11px] opacity-70">⌘K</kbd>
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}

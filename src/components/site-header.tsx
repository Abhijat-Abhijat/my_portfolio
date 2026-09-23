"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function SiteHeader({ name, status }: { name: string; status: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-bg/90 backdrop-blur-md py-2.5"
          : "border-transparent bg-bg/0 py-4"
      )}
    >
      <a href="#main" className="skip-link rounded bg-accent px-3 py-1.5 text-sm text-accent-fg">
        Skip to content
      </a>
      <div className="container-page flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-sans text-sm font-semibold tracking-[0.2em] text-fg"
        >
          {name.toUpperCase()}
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <span className="flex items-center gap-2 text-xs text-fg-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {status}
          </span>
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="container-page mt-3 flex flex-col gap-1 border-t border-border pt-4 pb-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded px-1 py-2.5 text-base text-fg-muted transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center justify-between px-1 pt-2">
            <span className="flex items-center gap-2 text-xs text-fg-muted">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              {status}
            </span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}

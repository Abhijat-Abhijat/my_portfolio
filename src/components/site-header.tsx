"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export function SiteHeader({ name, status }: { name: string; status: string }) {
  const pathname = usePathname();
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

  const isActive = (section: string | null) => section !== null && pathname.startsWith(section);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,box-shadow,padding] duration-300",
        scrolled
          ? "bg-bg/85 py-3 shadow-[0_1px_0_var(--border)] backdrop-blur-md"
          : "bg-bg/0 py-5"
      )}
    >
      <a href="#main" className="skip-link rounded bg-accent px-3 py-1.5 text-sm text-accent-fg">
        Skip to content
      </a>
      <div className="container-page flex items-center justify-between gap-4">
        <Link href="/" className="group" aria-label={`${name} — home`}>
          <Logo name={name} />
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.section) ? "page" : undefined}
              className={cn(
                "relative py-1.5 text-[15px] font-medium text-fg transition-colors hover:text-accent",
                "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-accent after:transition-transform after:duration-300",
                isActive(link.section) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
              )}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-fg transition-colors hover:bg-bg-elevated md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="container-page mt-3 flex flex-col gap-1 pb-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(link.section) ? "page" : undefined}
              className={cn(
                "py-2.5 text-2xl font-bold tracking-tight transition-colors hover:text-accent",
                isActive(link.section) ? "text-accent" : "text-fg"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-4">
            <span className="flex items-center gap-2 text-sm text-fg-muted">
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

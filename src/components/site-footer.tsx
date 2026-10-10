import Link from "next/link";
import { Logo } from "@/components/logo";
import { getSiteSettings } from "@/lib/content/site-settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  const footerLinks = [
    { label: "Projects", href: "/projects" },
    { label: "Writing", href: "/blog" },
    { label: "RSS", href: "/feed.xml" },
    { label: "GitHub", href: settings.github },
    { label: "LinkedIn", href: settings.linkedin },
    { label: "Email", href: `mailto:${settings.email}` },
  ];

  return (
    <footer className="bg-bg-elevated">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div>
          <Logo name={settings.name} />
          <p className="mt-2 text-sm text-fg-faint">© 2026</p>
        </div>

        <p aria-hidden="true" className="-rotate-2 font-hand text-2xl text-note md:text-center">
          Build. Ship. Repeat.
        </p>

        <div className="flex flex-col gap-5 md:items-end">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-fg-muted transition-colors hover:text-fg">
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href="#main"
            className="group inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors hover:text-accent"
          >
            Back to top
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-bg transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

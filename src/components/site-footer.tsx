import Link from "next/link";
import { getSiteSettings } from "@/lib/content/site-settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  const footerLinks = [
    { label: "Work", href: "/#work" },
    { label: "Writing", href: "/#writing" },
    { label: "RSS", href: "/feed.xml" },
    { label: "About", href: "/#about" },
    { label: "GitHub", href: settings.github },
    { label: "LinkedIn", href: settings.linkedin },
    { label: "Email", href: `mailto:${settings.email}` },
  ];

  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col gap-8 py-14 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-sans text-sm font-semibold tracking-[0.2em] text-fg">
            {settings.name.toUpperCase()}
          </p>
          <p className="mt-2 max-w-xs text-sm text-fg-muted">{settings.role}</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm" aria-label="Footer">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-fg-muted transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-border py-6 text-xs text-fg-faint md:flex-row md:items-center md:justify-between">
        <p>© 2026 {settings.name}</p>
        <p>Built with curiosity. Shipped with intent.</p>
      </div>
    </footer>
  );
}

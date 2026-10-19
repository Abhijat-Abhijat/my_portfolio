import { HackerSwitch } from "@/components/hacker-switch";
import { getSiteSettings } from "@/lib/content/site-settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="relative">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 border-t border-border-strong py-6 text-sm text-fg-faint">
        <span>
          © {new Date().getFullYear()} {settings.name} · made with too much chai
        </span>
        <span className="font-hand text-xl">press ⌘K anywhere</span>
        <HackerSwitch />
      </div>
    </footer>
  );
}

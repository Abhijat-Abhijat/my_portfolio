import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CommandPalette } from "@/components/command-palette";
import { HackerTerminal } from "@/components/hacker-terminal";
import { Toast } from "@/components/toast";
import { SiteIntro } from "@/components/site-intro";
import { getSiteSettings } from "@/lib/content/site-settings";
import { getProjects } from "@/lib/content/projects";
import { getHall } from "@/lib/content/hall";

// Flag one of the hack-me game: an HTML comment, only visible in "view source".
const FLAG_ONE = "<!-- 👀 you read the source. that's flag one: flag{1_view_source} — press ` and submit it in the terminal. -->";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, projects, hall] = await Promise.all([getSiteSettings(), getProjects(), getHall()]);

  return (
    // data-mode: the hero's current mode; drives --m (the accent) for everything inside.
    <div id="site" data-mode="design" className="flex flex-1 flex-col">
      <SiteIntro name={settings.name} />
      <SiteHeader name={settings.name} status={settings.status} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <CommandPalette
        projects={projects.map((p) => ({ slug: p.slug, title: p.title, category: p.category }))}
        email={settings.email}
        github={settings.github}
        linkedin={settings.linkedin}
      />
      <HackerTerminal email={settings.email} hall={hall.slice(0, 5).map((e) => ({ handle: e.handle, score: e.score }))} />
      <Toast />
      <div hidden dangerouslySetInnerHTML={{ __html: FLAG_ONE }} />
    </div>
  );
}

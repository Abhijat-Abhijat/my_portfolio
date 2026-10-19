import { Hero } from "@/components/hero";
import { Ribbon } from "@/components/ribbon";
import { MoreProjects, SelectedWork } from "@/components/selected-work";
import { About } from "@/components/about";
import { Skills } from "@/components/skills";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { Writing } from "@/components/writing";
import { HallOfHackers } from "@/components/hall-of-hackers";
import { Contact } from "@/components/contact";
import { getSiteSettings } from "@/lib/content/site-settings";

// Content lives in Supabase and can change anytime via /admin — always render fresh.
export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSiteSettings();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.name,
    url: settings.siteUrl,
    jobTitle: settings.role,
    description: settings.tagline,
    sameAs: [settings.github, settings.linkedin],
  };

  return (
    <>
      {/* Structured data: helps search engines associate this page with "Abhijat" as
          a person, not just a generic keyword match. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Hero name={settings.name} />
      <Ribbon />
      <SelectedWork />
      <MoreProjects limit={6} />
      <About />
      <Skills />
      <ExperienceTimeline limit={5} />
      <Writing />
      <HallOfHackers />
      <Contact />
    </>
  );
}

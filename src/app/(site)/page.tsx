import { Hero } from "@/components/hero";
import { SelectedWork } from "@/components/selected-work";
import { About } from "@/components/about";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { Skills } from "@/components/skills";
import { Writing } from "@/components/writing";
import { Publications } from "@/components/publications";
import { Certifications } from "@/components/certifications";
import { Achievements } from "@/components/achievements";
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero githubUrl={settings.github} />
      <SelectedWork />
      <About />
      <ExperienceTimeline limit={3} />
      <Skills />
      <Writing />
      <Publications />
      <Certifications limit={3} />
      <Achievements limit={2} />
      <Contact />
    </>
  );
}

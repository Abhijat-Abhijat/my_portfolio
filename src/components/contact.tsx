import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { getSiteSettings, displayUrl } from "@/lib/content/site-settings";

export async function Contact() {
  const settings = await getSiteSettings();

  return (
    <section id="contact" className="scroll-mt-24 border-t border-border py-24 md:py-36">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-4xl leading-[1.08] tracking-tight text-fg sm:text-5xl md:text-6xl">
            Have something worth building?
          </h2>
          <p className="mt-6 text-balance text-base leading-relaxed text-fg-muted md:text-lg">
            I&rsquo;m interested in useful products, ambitious engineering problems, AI
            systems, and interesting technical conversations.
          </p>
        </Reveal>

        <Reveal delay={80} className="mx-auto mt-12 max-w-xl">
          <ContactForm />
        </Reveal>

        <Reveal delay={140} className="mx-auto mt-14 max-w-2xl text-center">
          <p className="text-xs uppercase tracking-wide text-fg-faint">Or reach me directly</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <a href={`mailto:${settings.email}`} className="text-fg-muted transition-colors hover:text-fg">
              {settings.email}
            </a>
            <a
              href={settings.github}
              target="_blank"
              rel="noreferrer noopener"
              className="text-fg-muted transition-colors hover:text-fg"
            >
              {displayUrl(settings.github)}
            </a>
            <a
              href={settings.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="text-fg-muted transition-colors hover:text-fg"
            >
              {displayUrl(settings.linkedin)}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

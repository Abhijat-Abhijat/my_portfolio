import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { HandNote } from "@/components/hand-note";
import { getSiteSettings, displayUrl } from "@/lib/content/site-settings";

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-elevated text-fg">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {children}
      </svg>
    </span>
  );
}

export async function Contact() {
  const settings = await getSiteSettings();

  const links = [
    {
      href: `mailto:${settings.email}`,
      label: settings.email,
      icon: (
        <path
          d="M4 6.5h16v11H4v-11Zm0 0 8 6 8-6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ),
    },
    {
      href: settings.github,
      label: displayUrl(settings.github),
      external: true,
      icon: (
        <path
          d="M9 19c-4 1.3-4-2-5.5-2.5M15 21v-3.4c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6.2 0C6.6 2.9 5.6 3.2 5.6 3.2a4.3 4.3 0 0 0-.1 3.2A4.7 4.7 0 0 0 4.2 9.6c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    {
      href: settings.linkedin,
      label: "LinkedIn",
      external: true,
      icon: (
        <path
          d="M4.5 4.5h15v15h-15v-15ZM8.5 10.5v5M8.5 8v.01M11.5 15.5v-5m0 2.2c0-1.3.9-2.2 2-2.2s2 .9 2 2.2v2.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
  ];

  return (
    <section id="contact" className="scroll-mt-24 py-24 md:py-36">
      <div className="container-page grid gap-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Let&rsquo;s connect</p>
          <h2 className="mt-5 text-[clamp(2.75rem,6vw,4.75rem)] leading-[0.98] tracking-[-0.045em] text-fg">
            Good systems start with a conversation.
          </h2>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-fg-muted">
            Useful products, ambitious engineering problems, AI systems, or just an interesting
            technical question — my inbox is open.
          </p>

          <ul className="mt-10 flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="group inline-flex items-center gap-3 text-base text-fg transition-colors hover:text-accent"
                >
                  <IconTile>{link.icon}</IconTile>
                  {link.label}
                </a>
              </li>
            ))}
            {settings.location && (
              <li className="inline-flex items-center gap-3 text-base text-fg-muted">
                <IconTile>
                  <path
                    d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </IconTile>
                {settings.location}
              </li>
            )}
          </ul>
        </Reveal>

        <Reveal delay={100} className="relative">
          <HandNote arrow="down-left" className="mb-4 ml-auto hidden w-60 text-right md:block">
            made it this far?
            <br />
            we should probably talk.
          </HandNote>
          <div className="rounded-2xl bg-bg-elevated p-6 md:p-9">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

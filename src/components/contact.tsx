import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { NowCard } from "@/components/now-card";
import { Reveal } from "@/components/reveal";
import { getSiteSettings } from "@/lib/content/site-settings";

/** A taped sticky note — the side column of the contact section. */
function Note({ label, tilt, children }: { label: string; tilt: number; children: React.ReactNode }) {
  return (
    <div className="ink-card relative p-5 pt-6" style={{ transform: `rotate(${tilt}deg)` }}>
      <span aria-hidden="true" className="tape absolute -top-3 left-6 h-6 w-20 -rotate-3" />
      <h3 className="mb-2 font-hand text-[22px] leading-none text-fg-faint">{label}</h3>
      {children}
    </div>
  );
}

export async function Contact() {
  const settings = await getSiteSettings();

  return (
    <section id="contact" className="scroll-mt-24 overflow-hidden pb-20 pt-16 md:pb-28 md:pt-[clamp(110px,14vw,180px)]" aria-labelledby="contact-h">
      <div className="container-page relative">
        <figure
          className="relative mb-1 ml-auto w-[120px] md:absolute md:right-[clamp(16px,4vw,48px)] md:top-[clamp(-40px,-3vw,0px)] md:mb-0 md:w-[clamp(180px,22vw,300px)]"
          aria-hidden="true"
        >
          <Image src="/avatars/details.webp" alt="" width={600} height={600} sizes="300px" className="sticker-img" />
          <div className="bubble right-[86%] top-[8%] whitespace-nowrap">found you.</div>
        </figure>
        <Reveal>
          <span className="kicker">got an idea, a bug, or time for tea?</span>
        </Reveal>
        <h2 id="contact-h" className="say">
          Say <em className="mc">hello.</em>
        </h2>

        {/* Postcard stretches to the notes column's height (its lined message area grows),
            so both columns always end on the same line — no dead space under either. */}
        <div className="mt-[clamp(56px,7vw,96px)] grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-14">
          <Reveal className="h-full">
            <ContactForm toName={settings.name} />
          </Reveal>

          <aside className="grid content-between gap-8 sm:grid-cols-2 lg:grid-cols-1" aria-label="Other ways to reach me">
            <Note label="email is fastest" tilt={0.8}>
              <CopyEmail email={settings.email} />
              <p className="mt-4 flex flex-wrap items-center gap-x-2 text-[15px] text-fg-muted">
                <span className="dot-live" aria-hidden="true" />
                <span className="font-semibold text-fg">{settings.status}</span>· replies within a day or two
              </p>
            </Note>
            <NowCard location={settings.location} />
            <Note label="elsewhere" tilt={0.5}>
              <ul className="flex flex-wrap gap-2">
                {[
                  { href: settings.github, label: "GitHub ↗", external: true },
                  { href: settings.linkedin, label: "LinkedIn ↗", external: true },
                  { href: "/feed.xml", label: "RSS", external: false },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-block rounded-full border-[1.5px] border-fg px-3.5 py-1.5 text-sm font-semibold transition-colors hover:bg-fg hover:text-bg"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Note>
          </aside>
        </div>
      </div>
    </section>
  );
}

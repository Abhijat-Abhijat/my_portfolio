import { SectionHead } from "@/components/section-head";
import { CertDeck } from "@/components/cert-deck";
import { getCertifications } from "@/lib/content/certifications";
import { getSiteSettings } from "@/lib/content/site-settings";

/** Certificates get their own home section: a self-flipping deck, same height for 5 or 50. */
export async function CertificatesSection() {
  const [certs, settings] = await Promise.all([getCertifications(), getSiteSettings()]);
  if (certs.length === 0) return null;

  return (
    <section id="certificates" className="sec-tight scroll-mt-24" aria-labelledby="certs-h">
      <div className="container-page">
        <SectionHead id="certs-h" kicker="courses along the way" title="Certi" ital="ficates" glue meta={`${certs.length} in the stack`} />
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
          <div>
            <p className="font-display text-[clamp(5rem,12vw,9rem)] leading-[0.85]">
              {String(certs.length).padStart(2, "0")}
              <span className="mc">.</span>
            </p>
            <p className="mt-4 max-w-[30ch] text-lg text-fg-muted">
              courses finished, certificates earned — the stack keeps growing.
            </p>
            <p className="mt-5 -rotate-2 font-hand text-2xl text-m-ink" aria-hidden="true">
              it shuffles itself — or tap / swipe the top one <span className="md:hidden">↓</span>
              <span className="hidden md:inline">→</span>
            </p>
          </div>
          <CertDeck certs={certs} name={settings.name} />
        </div>
      </div>
    </section>
  );
}

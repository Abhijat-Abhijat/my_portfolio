import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { getCertifications } from "@/lib/content/certifications";

export async function Certifications({
  limit,
  standalone = false,
}: { limit?: number; standalone?: boolean } = {}) {
  const all = await getCertifications();
  const certifications = limit ? all.slice(0, limit) : all;
  const truncated = limit != null && all.length > limit;

  const body = (
    <>
      {!standalone && (
        <Reveal className="max-w-2xl">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.24em] text-accent">
            Certifications
          </p>
          <h2 className="mt-4 text-balance font-display text-3xl leading-[1.1] tracking-tight text-fg sm:text-4xl">
            A few courses along the way.
          </h2>
        </Reveal>
      )}

      <div className={standalone ? "divide-y divide-border border-t border-border" : "mt-10 divide-y divide-border border-t border-border"}>
        {certifications.map((cert, i) => (
          <Reveal key={cert.id} delay={i * 40}>
            <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
              <p className="text-sm text-fg">{cert.title}</p>
              {(cert.issuer || cert.date) && (
                <p className="text-xs text-fg-faint">
                  {[cert.issuer, cert.date].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {truncated && (
        <div className="mt-8">
          <Link
            href="/certifications"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors hover:text-accent"
          >
            View all {all.length} certifications
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </>
  );

  if (standalone) return <div className="container-page">{body}</div>;

  return (
    <section id="certifications" className="scroll-mt-24 border-t border-border py-24 md:py-32">
      <div className="container-page">{body}</div>
    </section>
  );
}

import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { HandNote } from "@/components/hand-note";
import { getCertifications, type Certification } from "@/lib/content/certifications";
import { cn } from "@/lib/utils";

/** Rotating "completed · verified" stamp — spins while its card is hovered. Decorative. */
function Seal({ id }: { id: string }) {
  const pathId = `seal-${id}`;
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-16 w-16 shrink-0">
      <g className="seal-ring">
        <path id={pathId} d="M32 32m-24 0a24 24 0 1 1 48 0a24 24 0 1 1-48 0" fill="none" />
        <text className="fill-fg-faint font-mono text-[5.6px] uppercase">
          <textPath href={`#${pathId}`} textLength="148" lengthAdjust="spacing">
            completed · verified · completed · verified ·
          </textPath>
        </text>
      </g>
      <circle cx="32" cy="32" r="14" className="fill-accent" />
      <path
        d="m25.5 32.5 4.5 4.5 8.5-9"
        fill="none"
        stroke="var(--accent-fg)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CertificateCard({ cert, index }: { cert: Certification; index: number }) {
  return (
    <Reveal delay={(index % 3) * 90} className="h-full">
      <div
        className={cn(
          "group relative h-full rounded-2xl bg-bg-elevated p-2 transition-transform duration-500 ease-out hover:-translate-y-2 md:hover:rotate-0",
          index % 2 === 0 ? "md:-rotate-1" : "md:rotate-1"
        )}
      >
        <div className="flex h-full flex-col rounded-xl border border-dashed border-border-strong p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-faint">
              Certificate · {String(index + 1).padStart(2, "0")}
            </p>
            <Seal id={cert.id} />
          </div>

          <h3 className="mt-4 text-balance text-2xl leading-tight tracking-[-0.03em] text-fg">{cert.title}</h3>

          <div className="mt-auto pt-8">
            <div className="flex items-end justify-between gap-4 border-t border-border pt-5">
              <p className="text-sm font-medium text-fg-muted">{cert.issuer ?? "Course completed"}</p>
              {cert.date ? (
                <p className="shrink-0 font-tabular text-sm text-fg-faint">{cert.date}</p>
              ) : (
                <p aria-hidden="true" className="shrink-0 -rotate-6 font-hand text-2xl leading-none text-note">
                  done ✓
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export async function Certifications({
  limit,
  standalone = false,
}: { limit?: number; standalone?: boolean } = {}) {
  const all = await getCertifications();
  const certifications = limit ? all.slice(0, limit) : all;
  const truncated = limit != null && all.length > limit;

  const grid = (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {certifications.map((cert, i) => (
        <CertificateCard key={cert.id} cert={cert} index={i} />
      ))}
    </div>
  );

  if (standalone) return grid;

  return (
    <section id="certifications" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <div className="relative">
          <SectionHeading eyebrow="Certifications" title="A few courses along the way." />
          <HandNote arrow="down-left" className="absolute right-4 top-0 hidden w-56 text-right md:block">
            never stop shipping
            <br />
            (or studying).
          </HandNote>
        </div>

        <div className="mt-14">{grid}</div>

        {truncated && (
          <Reveal className="mt-12">
            <Link href="/certifications" className="link-underline group">
              View all {all.length} certifications
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}

import { Reveal } from "@/components/reveal";
import { getCertifications } from "@/lib/content/certifications";

export async function Certifications() {
  const certifications = await getCertifications();

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {certifications.map((c, i) => (
        <Reveal key={c.id} delay={(i % 3) * 70}>
          <li
            className="ink-card flex h-full flex-col p-6 transition-transform duration-500 hover:rotate-0"
            style={{ transform: `rotate(${i % 2 ? -0.7 : 0.7}deg)` }}
          >
            <span className="eyebrow-mono">certificate · {String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 text-balance text-2xl leading-tight">{c.title}</h3>
            <div className="mt-auto flex items-end justify-between gap-4 pt-6">
              <span className="text-sm text-fg-muted">{c.issuer ?? "course completed"}</span>
              <span className="-rotate-6 font-hand text-2xl text-m-ink">{c.date ?? "done ✓"}</span>
            </div>
          </li>
        </Reveal>
      ))}
    </ul>
  );
}

import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { getAchievements } from "@/lib/content/achievements";

const GLYPHS = ["★", "✦", "⚡", "❀", "◆", "✸"];

export async function Achievements({ limit }: { limit?: number } = {}) {
  const achievements = await getAchievements();
  const featured = achievements.find((a) => a.featured);
  const others = achievements.filter((a) => a !== featured);
  const rest = limit ? others.slice(0, limit) : others;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      {featured && (
        <Reveal>
          <div className="ink-card relative flex flex-wrap items-center gap-6 overflow-hidden p-8 md:p-12">
            <Image src="/badges/trophy.webp" alt="" width={160} height={160} className="w-24 md:w-32" />
            <div className="min-w-0 flex-1">
              <span className="kicker">the big one</span>
              <h2 className="text-balance text-[clamp(2rem,4vw,3.2rem)] leading-tight">{featured.title}</h2>
              <p className="mt-2 text-fg-muted">{featured.org}</p>
            </div>
          </div>
        </Reveal>
      )}
      {rest.length > 0 && (
        <Reveal>
          {/* Medal clothesline: each award hangs from a peg and sways; scrolls sideways when long. */}
          <ul className="medal-line" aria-label="More achievements">
            {rest.map((a, i) => (
              <li key={a.id} className="medal" style={{ ["--d" as string]: `${-i * 0.7}s` } as React.CSSProperties}>
                <span className="peg" aria-hidden="true" />
                <svg className="medal-ribbon" viewBox="0 0 64 70" aria-hidden="true">
                  <path d="M10 0 H28 L40 62 L30 56 L22 64 Z" fill="var(--m)" stroke="var(--fg)" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M54 0 H36 L24 62 L34 56 L42 64 Z" fill="var(--paper)" stroke="var(--fg)" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                <span className="medal-disc" aria-hidden="true">
                  {GLYPHS[i % GLYPHS.length]}
                </span>
                <div className="medal-tag">
                  <h3 className="text-[1.15rem] leading-[1.15]">{a.title}</h3>
                  <p className="mt-1.5 font-hand text-lg leading-tight text-fg-muted">{a.org}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </div>
  );
}

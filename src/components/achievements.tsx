import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { getAchievements } from "@/lib/content/achievements";

export async function Achievements() {
  const achievements = await getAchievements();
  const featured = achievements.find((a) => a.featured);
  const rest = achievements.filter((a) => a !== featured);

  return (
    <div className="grid gap-6">
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
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a, i) => (
          <Reveal key={a.id} delay={(i % 3) * 70}>
            <li
              className="ink-card h-full p-6 transition-transform duration-500 hover:rotate-0"
              style={{ transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}
            >
              <h3 className="text-2xl leading-tight">{a.title}</h3>
              <p className="mt-3 font-hand text-xl text-fg-muted">{a.org}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

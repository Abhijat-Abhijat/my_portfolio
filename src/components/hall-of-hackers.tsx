import Image from "next/image";
import { HallBoard } from "@/components/hall-board";
import { getHall } from "@/lib/content/hall";

/** Leaderboard for the hack-me terminal game — only rendered visibly in hacker mode. */
export async function HallOfHackers() {
  const rows = await getHall();

  return (
    <section id="hall" className="sec-tight hacker-only scroll-mt-24" aria-labelledby="hall-h">
      <div className="container-page">
        <div className="mb-12 grid items-end gap-5 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <span className="kicker">they rooted the box</span>
            <h2 id="hall-h" className="h2 flex items-center gap-4">
              <span>
                Hall of <span className="ital mc">hackers</span>
              </span>
              <Image src="/badges/trophy.webp" alt="" width={88} height={88} className="h-[0.9em] w-auto" />
            </h2>
          </div>
          <span className="eyebrow-mono">
            {rows.length} {rows.length === 1 ? "hacker" : "hackers"}
          </span>
        </div>
        <HallBoard rows={rows} />
        <p className="mt-5 font-mono text-[13px] text-fg-faint">ranked by time to root · +60s per hint · press ` and type help to play</p>
      </div>
    </section>
  );
}

import Image from "next/image";
import type { Project } from "@/lib/content/projects";

// Generated collage art for projects without a real screenshot. Deterministic per
// slug (same project, same picture); palette picked by list position so
// neighbours never share colours. A real image_url always wins.
const PALETTES: Array<[string, string, string]> = [
  ["#d6420c", "#f4c95d", "#1a1714"],
  ["#2457d6", "#ff9f80", "#fffaf1"],
  ["#2f9e44", "#ffd8a8", "#1a1714"],
  ["#7048e8", "#ffe066", "#fffaf1"],
  ["#c2255c", "#a5d8ff", "#1a1714"],
  ["#b7791f", "#d0bfff", "#1a1714"],
  ["#0c8599", "#ffc9c9", "#fffaf1"],
];

/** n deterministic pseudo-random numbers in [0, 1) seeded by the slug. */
function seeded(slug: string, n: number) {
  let h = 2166136261;
  for (const c of slug) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  h >>>= 0;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    out.push((h % 1000) / 1000);
  }
  return out;
}

export function ProjectCover({
  project,
  index,
  sizes = "(min-width: 860px) 600px, 100vw",
  priority,
  showTitle = true,
}: {
  project: Pick<Project, "slug" | "title" | "imageUrl">;
  index: number;
  sizes?: string;
  priority?: boolean;
  showTitle?: boolean;
}) {
  if (project.imageUrl) {
    return <Image src={project.imageUrl} alt={`${project.title} screenshot`} fill sizes={sizes} priority={priority} className="object-cover" />;
  }

  const [a, b, c] = PALETTES[index % PALETTES.length];
  const [n0, n1, n2, n3, n4, n5, n6, n7, n8, n9] = seeded(project.slug, 10);
  const cx = 25 + n0 * 50;
  const cy = 18 + n1 * 30;
  const r = 22 + n2 * 14;
  const rx = 60 + n3 * 20;
  const ry = 36 + n4 * 16;
  const rw = 16 + n5 * 10;
  const rh = 16 + n6 * 10;
  const rot = n7 * 30 - 15;
  const amp = 5 + n8 * 6;
  const wy = 52 + n9 * 14;
  const words = project.title.split(" ");
  const last = words.pop();

  return (
    <>
      <svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="100" height="80" fill={a} />
        <circle cx={cx} cy={cy} r={r} fill={b} />
        <rect x={rx} y={ry} width={rw} height={rh} rx="2" fill="none" stroke={c} strokeWidth=".8" transform={`rotate(${rot} 75 50)`} />
        <path
          d={`M 8 ${wy} q 7 -${amp} 14 0 t 14 0 t 14 0 t 14 0 t 14 0 t 14 0`}
          fill="none"
          stroke={c}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={70 + (i % 6) * 4} cy={8 + Math.floor(i / 6) * 4} r=".7" fill={c} opacity=".55" />
        ))}
      </svg>
      {showTitle && (
        <span className="cover-title">
          {words.join(" ")} <i>{last}</i>
        </span>
      )}
    </>
  );
}

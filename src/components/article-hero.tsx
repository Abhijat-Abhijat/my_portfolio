import Image from "next/image";

export function ArticleHero({
  category,
  imageUrl,
  title,
}: {
  category: string;
  imageUrl?: string | null;
  title?: string;
}) {
  if (imageUrl) {
    return (
      <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl border border-border bg-bg-elevated">
        <Image
          src={imageUrl}
          alt={title ?? ""}
          fill
          sizes="(min-width: 768px) 720px, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex aspect-[16/7] w-full items-center overflow-hidden rounded-xl border border-border bg-bg-elevated"
      role="img"
      aria-label={`Abstract visual for the ${category} category`}
    >
      <div className="absolute inset-0 grain-noise opacity-40" aria-hidden="true" />
      <svg viewBox="0 0 400 120" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={i}
            x1={0}
            y1={12 + i * 12}
            x2={400}
            y2={12 + i * 12}
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <circle
            key={i}
            cx={20 + i * 28}
            cy={20 + ((i * 37) % 90)}
            r={i % 4 === 0 ? 3 : 1.6}
            fill="var(--accent)"
            opacity={i % 4 === 0 ? 0.8 : 0.35}
          />
        ))}
      </svg>
      <span className="absolute bottom-3 left-4 font-mono text-[11px] uppercase tracking-wide text-fg-faint">
        {category}
      </span>
    </div>
  );
}

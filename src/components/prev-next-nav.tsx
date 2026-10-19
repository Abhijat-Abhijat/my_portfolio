import Link from "next/link";

export function PrevNextNav({
  base,
  previous,
  next,
}: {
  base: string;
  previous: { slug: string; title: string };
  next: { slug: string; title: string };
}) {
  return (
    <nav aria-label="Adjacent pages" className="grid gap-5 py-10 sm:grid-cols-2">
      <Link href={`${base}/${previous.slug}`} className="group ink-card block p-5 transition-transform hover:-rotate-1">
        <p className="font-hand text-xl text-fg-faint">← previous</p>
        <p className="mt-1 font-display text-2xl leading-tight text-fg transition-colors group-hover:text-m">{previous.title}</p>
      </Link>
      <Link href={`${base}/${next.slug}`} className="group ink-card block p-5 text-right transition-transform hover:rotate-1">
        <p className="font-hand text-xl text-fg-faint">next →</p>
        <p className="mt-1 font-display text-2xl leading-tight text-fg transition-colors group-hover:text-m">{next.title}</p>
      </Link>
    </nav>
  );
}

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
    <nav
      aria-label="Adjacent pages"
      className="grid gap-4 border-t border-border py-10 sm:grid-cols-2"
    >
      <Link
        href={`${base}/${previous.slug}`}
        className="group rounded-xl border border-border p-5 transition-colors hover:border-border-strong"
      >
        <p className="text-xs uppercase tracking-wide text-fg-faint">← Previous</p>
        <p className="mt-2 font-display text-lg text-fg transition-transform duration-300 group-hover:-translate-x-1">
          {previous.title}
        </p>
      </Link>
      <Link
        href={`${base}/${next.slug}`}
        className="group rounded-xl border border-border p-5 text-right transition-colors hover:border-border-strong"
      >
        <p className="text-xs uppercase tracking-wide text-fg-faint">Next →</p>
        <p className="mt-2 font-display text-lg text-fg transition-transform duration-300 group-hover:translate-x-1">
          {next.title}
        </p>
      </Link>
    </nav>
  );
}

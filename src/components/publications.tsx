import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getPublications, type PublicationKind } from "@/lib/content/publications";

const kindLabel: Record<PublicationKind, string> = {
  Book: "Book",
  Paper: "Paper",
  IP: "IP",
};

function KindIcon({ kind }: { kind: PublicationKind }) {
  const paths: Record<PublicationKind, React.ReactNode> = {
    Book: (
      <path
        d="M5 4.5h9.5A2.5 2.5 0 0 1 17 7v12.5H7.5A2.5 2.5 0 0 1 5 17V4.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
    Paper: (
      <path
        d="M7 3.5h7l4 4V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
    IP: (
      <path
        d="M12 3.5 4.5 7v6c0 4 3 6.9 7.5 7.5 4.5-.6 7.5-3.5 7.5-7.5V7L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    ),
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {paths[kind]}
    </svg>
  );
}

export async function Publications() {
  const publications = await getPublications();

  return (
    <section id="publications" className="scroll-mt-24 border-t border-border py-24 md:py-32">
      <div className="container-page">
        <SectionHeading eyebrow="Publications" title="Writing beyond the web." />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {publications.map((pub, i) => (
            <Reveal key={pub.id} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-border p-6">
                <div className="flex items-center gap-2 text-accent">
                  <KindIcon kind={pub.kind} />
                  <span className="font-mono text-xs uppercase tracking-wide">
                    {kindLabel[pub.kind]}
                  </span>
                </div>
                <h3 className="mt-4 text-balance font-display text-xl leading-snug tracking-tight text-fg">
                  {pub.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{pub.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/reveal";
import { getPublications } from "@/lib/content/publications";

export async function Publications() {
  const publications = await getPublications();
  if (publications.length === 0) return null;

  return (
    <ul className="border-t-[1.5px] border-fg">
      {publications.map((p, i) => (
        <Reveal key={p.id} delay={i * 60}>
          <li className="grid gap-x-6 gap-y-2 border-b border-border-strong py-6 sm:grid-cols-[120px_minmax(0,1fr)]">
            <span className="tape h-fit w-fit self-start -rotate-2 px-3 pb-1 pt-0.5 font-hand text-xl">{p.kind}</span>
            <div>
              <h3 className="text-[clamp(1.4rem,2.4vw,2rem)] leading-tight">{p.title}</h3>
              {p.description && <p className="mt-2 max-w-[65ch] text-fg-muted">{p.description}</p>}
            </div>
          </li>
        </Reveal>
      ))}
    </ul>
  );
}

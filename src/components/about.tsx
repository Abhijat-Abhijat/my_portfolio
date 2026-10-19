import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { getPublications } from "@/lib/content/publications";

export async function About() {
  const publications = await getPublications();
  const stickers = [
    { value: "15+", label: "teams use the AI framework I built" },
    { value: "80%", label: "eval accuracy, up from ~60%" },
    { value: "1 OS", label: "written from scratch" },
    ...(publications.length
      ? [{ value: String(publications.length), label: publications.length === 1 ? "publication" : "publications" }]
      : []),
  ];

  return (
    <section id="about" className="sec-tight scroll-mt-24" aria-labelledby="about-h">
      <div className="container-page grid items-center gap-[clamp(32px,6vw,96px)] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Reveal className="justify-self-center">
          <figure className="polaroid m-0">
            <div className="grid aspect-square place-items-end overflow-hidden rounded-[2px] bg-m transition-colors duration-500">
              <Image
                src="/avatars/notes.webp"
                alt="Illustrated Abhijat writing in a notebook, a glass of chai beside him"
                width={600}
                height={600}
                sizes="(min-width: 768px) 400px, 80vw"
                className="w-[92%]"
              />
            </div>
            <figcaption className="absolute inset-x-0 bottom-3.5 text-center font-hand text-[26px]">me, mid-notebook, mid-chai</figcaption>
          </figure>
        </Reveal>
        <div>
          <span className="kicker">hello, human</span>
          <h2 id="about-h" className="sr-only">
            About
          </h2>
          <Reveal>
            <p className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.04]">
              I like building things that are <em className="mc">useful</em> — and making them feel good to use.
            </p>
          </Reveal>
          <Reveal delay={80} className="mt-6 grid max-w-[58ch] gap-3.5 text-[1.06rem] text-fg-muted">
            <p>
              I work where AI meets software engineering. By day I&rsquo;m at Tata Consultancy Services, embedded with UBS,
              building production AI agents and the platforms they run on.
            </p>
            <p>
              By night I build my own things — an operating system in C and assembly, developer tools, small products I ship
              end to end — and I write about what I learn, because the useful parts only become obvious after something ships.
            </p>
          </Reveal>
          <div className="mt-9 flex flex-wrap gap-3.5">
            {stickers.map((s) => (
              <div key={s.label} className="stk">
                <span>
                  <b>{s.value}</b>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

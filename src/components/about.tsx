import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 border-t border-border py-24 md:py-32">
      <div className="container-page grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <SectionHeading eyebrow="About" title="I like building things that are useful." />

        <Reveal delay={80} className="space-y-5 text-base leading-relaxed text-fg-muted md:text-lg">
          <p>
            I work at the intersection of AI and software engineering — not as separate
            interests, but as one practice. Most of what I build is either a system that
            makes a decision (an agent, a ranking model, a verification pipeline) or the
            infrastructure that lets that system run reliably in production.
          </p>
          <p>
            I currently work at Tata Consultancy Services, embedded with UBS, where I build
            production AI agent systems and the scalable backend platforms they run on. That
            work has shaped how I think about software in general: an AI system is only as
            good as the engineering discipline around it — the APIs, the monitoring, the
            deployment pipeline, the verification step that catches what the model gets wrong.
          </p>
          <p>
            Outside of that, I build my own projects — from a custom operating system written
            in C and assembly, to developer tools, to small products I ship end to end. I
            write about what I learn along the way, because the parts worth remembering are
            usually the ones that only become obvious after something has shipped.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

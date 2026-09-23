import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="font-sans text-xs font-medium uppercase tracking-[0.24em] text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-balance font-display text-4xl leading-[1.08] tracking-tight text-fg sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-balance text-base leading-relaxed text-fg-muted md:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}

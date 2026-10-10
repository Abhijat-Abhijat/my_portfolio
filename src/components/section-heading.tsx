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
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
      <h2 className="mt-4 text-balance text-4xl leading-[1.05] tracking-[-0.035em] text-fg sm:text-5xl">
        {title}
      </h2>
      {align === "center" && (
        <span aria-hidden="true" className="mx-auto mt-6 block h-0.75 w-20 rounded-full bg-note" />
      )}
      {description && (
        <p className="mt-5 max-w-[60ch] text-balance text-base leading-relaxed text-fg-muted md:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}

import { Reveal } from "@/components/reveal";

/** Handwritten kicker + serif heading with one italic word in the mode colour. */
export function SectionHead({
  kicker,
  title,
  ital,
  meta,
  id,
  as: Tag = "h2",
  glue = false,
}: {
  kicker: string;
  title: string;
  ital?: string;
  meta?: string;
  id?: string;
  as?: "h1" | "h2";
  /** true = no space before the italic word ("Tool" + "box" → "Toolbox"). */
  glue?: boolean;
}) {
  return (
    <Reveal className="mb-[clamp(40px,6vw,72px)] grid items-end gap-5 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div>
        <span className="kicker">{kicker}</span>
        <Tag id={id} className="h2">
          {title}
          {ital && (
            <>
              {!glue && " "}
              <span className="ital mc">{ital}</span>
            </>
          )}
        </Tag>
      </div>
      {meta && <span className="eyebrow-mono">{meta}</span>}
    </Reveal>
  );
}

import { cn } from "@/lib/utils";

/** Handwritten margin note with a curved arrow — decorative, hidden from screen readers. */
export function HandNote({
  children,
  arrow = "down-left",
  className,
}: {
  children: React.ReactNode;
  arrow?: "down-left" | "down-right" | "none";
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none select-none text-note", className)}>
      <p className="-rotate-6 font-hand text-xl leading-tight md:text-2xl">{children}</p>
      {arrow !== "none" && (
        <svg
          width="56"
          height="44"
          viewBox="0 0 56 44"
          fill="none"
          className={cn("mt-1", arrow === "down-left" ? "ml-6" : "ml-auto mr-6 -scale-x-100")}
        >
          <path
            d="M44 3C46 20 34 34 10 38"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M17 31l-7 7 9 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

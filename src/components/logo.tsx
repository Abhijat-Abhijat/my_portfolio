import { MARK_A_PATH, MARK_DOT, MARK_VIEWBOX } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** "A." monogram tile — follows the theme (ink tile in light mode, paper tile in dark). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} aria-hidden="true" className={cn("h-8 w-8 shrink-0", className)}>
      <rect width="32" height="32" rx="9" fill="var(--fg)" />
      <path d={MARK_A_PATH} fill="var(--bg)" fillRule="evenodd" />
      <circle {...MARK_DOT} fill="var(--accent)" />
    </svg>
  );
}

/** Mark + wordmark. */
export function Logo({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-6" />
      <span className="text-lg font-bold tracking-[-0.03em] text-fg">
        {name}
        <span className="text-accent">.</span>
      </span>
    </span>
  );
}

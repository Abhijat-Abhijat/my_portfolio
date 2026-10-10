"use client";

import { useEffect, useState } from "react";
import type { SkillGroup } from "@/lib/content/skills";
import { cn } from "@/lib/utils";

const AUTO_MS = 3800;

/** Category tabs + chip board. Auto-cycles until the visitor touches it. */
export function SkillsExplorer({ groups }: { groups: SkillGroup[] }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || groups.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((i) => (i + 1) % groups.length), AUTO_MS);
    return () => clearInterval(t);
  }, [auto, groups.length]);

  const group = groups[active];
  if (!group) return null;

  return (
    <div
      className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16"
      onPointerEnter={() => setAuto(false)}
      onFocus={() => setAuto(false)}
    >
      <div
        role="tablist"
        aria-label="Skill categories"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-col md:gap-0 md:overflow-visible md:px-0 md:pb-0"
      >
        {groups.map((g, i) => {
          const selected = i === active;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              id={`skill-tab-${g.id}`}
              aria-selected={selected}
              aria-controls="skill-panel"
              onClick={() => {
                setAuto(false);
                setActive(i);
              }}
              className={cn(
                "group relative flex shrink-0 items-baseline gap-4 rounded-full px-4 py-2 text-left transition-colors duration-300 md:rounded-none md:border-b md:border-border md:px-0 md:py-5",
                selected
                  ? "bg-fg text-bg md:bg-transparent md:text-fg"
                  : "bg-bg-elevated text-fg-muted hover:text-fg md:bg-transparent"
              )}
            >
              <span className="hidden font-mono text-xs text-fg-faint md:inline">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-sm font-semibold transition-transform duration-300 md:text-2xl md:font-bold md:tracking-[-0.03em]",
                  selected ? "md:translate-x-2" : "md:group-hover:translate-x-1"
                )}
              >
                {g.label}
              </span>
              <span className="ml-auto hidden font-tabular text-sm text-fg-faint md:inline">{g.skills.length}</span>
              {/* Active bar; fills over AUTO_MS while auto-cycling. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -bottom-px left-0 hidden h-0.5 bg-accent md:block",
                  selected ? (auto ? "skill-progress" : "w-full") : "w-0"
                )}
                style={selected && auto ? { animationDuration: `${AUTO_MS}ms` } : undefined}
              />
            </button>
          );
        })}
      </div>

      <div
        id="skill-panel"
        role="tabpanel"
        aria-labelledby={`skill-tab-${group.id}`}
        className="relative min-h-64 overflow-hidden rounded-3xl bg-bg-elevated p-7 md:sticky md:top-28 md:self-start md:p-10"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -top-10 select-none font-mono text-[10rem] font-bold leading-none text-fg/5"
        >
          {String(active + 1).padStart(2, "0")}
        </span>
        <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-accent">{group.label}</p>
        {/* key remounts the list so every switch replays the pop-in. */}
        <ul key={group.id} className="relative mt-6 flex flex-wrap gap-2.5">
          {group.skills.map((skill, i) => (
            <li key={`${skill}-${i}`} className="chip-pop" style={{ animationDelay: `${i * 45}ms` }}>
              <span className="inline-block cursor-default rounded-xl bg-bg px-4 py-2.5 text-base font-semibold tracking-tight text-fg shadow-[0_1px_0_var(--border)] transition-[transform,background-color,color] duration-200 hover:-translate-y-1 hover:-rotate-2 hover:bg-fg hover:text-bg">
                {skill}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Two full-bleed rows of every skill drifting in opposite directions. Decorative. */
export function SkillsMarquee({ skills }: { skills: string[] }) {
  const half = Math.ceil(skills.length / 2);
  const rows = [skills.slice(0, half), skills.slice(half)];

  return (
    <div aria-hidden="true" className="marquee-mask space-y-3 overflow-hidden py-2">
      {rows.map((row, r) => (
        <div key={r} className={cn("marquee-track flex w-max", r === 1 && "marquee-reverse")}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {row.map((skill, i) => (
                <span
                  key={`${skill}-${i}`}
                  className={cn(
                    "flex items-center whitespace-nowrap text-4xl font-bold tracking-[-0.04em] md:text-6xl",
                    r === 1 ? "text-transparent [-webkit-text-stroke:1.5px_var(--fg-faint)]" : "text-fg"
                  )}
                >
                  {skill}
                  <span className="mx-5 inline-block h-2.5 w-2.5 rounded-full bg-accent md:mx-8 md:h-3 md:w-3" />
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

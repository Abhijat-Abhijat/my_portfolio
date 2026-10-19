"use client";

import Image from "next/image";
import { useState } from "react";
import type { SkillGroup } from "@/lib/content/skills";

// Drawer icon file per group: public/toolbox/<slug>.webp, e.g. "Cloud / DevOps" →
// cloud-devops.webp. A missing file just hides the icon — new groups work without art.
const iconOf = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const TRY = ["rag", "docker", "react"];

export function Toolbox({ groups }: { groups: SkillGroup[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(groups[0] ? [groups[0].id] : []));
  const [query, setQuery] = useState("");
  const [noIcon, setNoIcon] = useState<Set<string>>(() => new Set());
  const q = query.trim().toLowerCase();
  const hit = (s: string) => !!q && s.toLowerCase().includes(q);
  const hits = groups.reduce((n, g) => n + g.skills.filter(hit).length, 0);
  const isOpen = (g: SkillGroup) => (q ? g.skills.some(hit) : openIds.has(g.id));

  function toggle(id: string) {
    setQuery("");
    setOpenIds((s) => (s.has(id) ? new Set() : new Set([id])));
  }

  return (
    <div className="grid items-center gap-[clamp(20px,4vw,56px)] md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
      <div className="kit-box">
        <div className="tag-search">
          <svg className="ts-string" width="110" height="56" viewBox="0 0 110 56" aria-hidden="true">
            <path d="M108 28 C 80 62, 34 60, 4 18" />
          </svg>
          <span className="ts-hole" aria-hidden="true" />
          <label htmlFor="toolbox-find" className="block font-hand text-2xl leading-none text-m-ink">
            looking for something?
          </label>
          <input
            id="toolbox-find"
            type="search"
            className="ts-input"
            placeholder="type a tool…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <p className="ts-try mt-2 flex flex-wrap items-center gap-1 text-[12.5px] text-fg-faint">
            try
            {TRY.map((t) => (
              <button key={t} type="button" onClick={() => setQuery(t)}>
                {t}
              </button>
            ))}
          </p>
          <p className="mt-1.5 min-h-[1.2em] font-hand text-xl leading-tight text-fg-muted empty:hidden" aria-live="polite">
            {q ? (hits ? `${hits} in the box ✓` : "not in the box yet — teach me?") : ""}
          </p>
        </div>
        <div className="kit-lid" aria-hidden="true">
          <span className="latch left-[14%]" />
          <span className="absolute left-1/2 top-[34px] -translate-x-1/2 -rotate-2 whitespace-nowrap bg-[var(--tape)] px-3.5 pb-1.5 pt-1 font-hand text-2xl leading-none">
            abhijat&rsquo;s kit
          </span>
          <span className="latch right-[14%]" />
        </div>
        <div className="kit-drawers">
          {groups.map((g, gi) => {
            const open = isOpen(g);
            const icon = iconOf(g.label);
            return (
              <div key={g.id} className={`drawer${open ? " open" : ""}${q && !g.skills.some(hit) ? " dim" : ""}`}>
                <button
                  type="button"
                  className="d-front"
                  id={`dr-${g.id}`}
                  aria-expanded={open}
                  aria-controls={`tray-${g.id}`}
                  onClick={() => toggle(g.id)}
                >
                  {!noIcon.has(icon) && (
                    <Image
                      className="d-icon"
                      src={`/toolbox/${icon}.webp`}
                      alt=""
                      width={84}
                      height={84}
                      onError={() => setNoIcon((s) => new Set(s).add(icon))}
                    />
                  )}
                  <span className="d-label">{g.label}</span>
                  <span className="d-pull" aria-hidden="true" />
                  <span className="d-count" aria-label={`${g.skills.length} tools`}>
                    {g.skills.length}
                  </span>
                </button>
                <div className="tray" id={`tray-${g.id}`} role="region" aria-labelledby={`dr-${g.id}`} inert={!open}>
                  <div>
                    <div className="tray-in">
                      <ul className="flex flex-wrap gap-x-2 gap-y-2.5">
                        {g.skills.map((s, j) => (
                          <li
                            key={`${s}-${j}`}
                            className={`tool-tag${hit(s) ? " hit" : ""}`}
                            style={{ ["--t" as string]: `${((((gi + j) * 37) % 7) - 3) * 0.7}deg` } as React.CSSProperties}
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative order-first flex items-end justify-between gap-3 md:order-none md:block" aria-hidden="true">
        <p className="max-w-[15ch] -rotate-3 font-hand text-[clamp(24px,2.4vw,30px)] leading-[1.15] text-fg-muted">
          pull a drawer — this is everything I reach for
          <svg width="90" height="40" viewBox="0 0 90 40" className="ml-[30px] mt-1.5 hidden overflow-visible md:block">
            <path className="dd-stroke" d="M84 4 C 60 30, 30 34, 6 26" />
            <path className="dd-stroke" d="M16 18 L 6 26 L 17 33" />
          </svg>
        </p>
        <Image
          src="/avatars/toolbox.webp"
          alt=""
          width={640}
          height={640}
          sizes="(min-width: 768px) 320px, 150px"
          className="sticker-img mt-2 w-[150px] flex-none md:w-full"
        />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

type Item = { slug: string; n: number; title: string; category: string; stack: string[]; metric: string };

const short = (category: string) => category.split(" · ")[0];

export function ProjectIndex({ items, limit }: { items: Item[]; limit?: number }) {
  const [cat, setCat] = useState("All");
  const [all, setAll] = useState(false);
  const cats = ["All", ...new Set(items.map((p) => short(p.category)))];
  const matching = items.filter((p) => cat === "All" || short(p.category) === cat);
  const shown = limit && !all ? matching.slice(0, limit) : matching;

  return (
    <div>
      {cats.length > 2 && (
        <div className="chips mb-5" role="group" aria-label="Filter by category">
          {cats.map((c) => (
            <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)}>
              {c}
              <sup>{c === "All" ? items.length : items.filter((p) => short(p.category) === c).length}</sup>
            </button>
          ))}
        </div>
      )}
      <ul className="border-t-[1.5px] border-fg">
        {shown.map((p) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}`} className="index-row">
              <span className="font-hand text-[22px] text-fg-faint">{String(p.n).padStart(2, "0")}</span>
              <span>
                <span className="t">{p.title}</span>
                {p.metric && <span className="ml-2 font-hand text-xl text-m-ink">{p.metric}</span>}
              </span>
              <span className="c text-[14.5px] text-fg-muted">{p.category.split(" · ").slice(1).join(" · ") || p.category}</span>
              <span className="s font-mono text-xs text-fg-muted">{p.stack.join(" · ") || "—"}</span>
              <span className="a" aria-hidden="true">
                ↗
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {limit && matching.length > limit && (
        <button type="button" className="btn-more mt-6" onClick={() => setAll((v) => !v)}>
          {all ? "Show fewer ↑" : `Show all ${matching.length} ↓`}
        </button>
      )}
    </div>
  );
}

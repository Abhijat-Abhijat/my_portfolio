"use client";

import { useState } from "react";

export type JournalItem = {
  id: string;
  kind: "experience" | "volunteer";
  org: string;
  role: string;
  start: string;
  end: string;
  location?: string;
  highlights: string[];
};

const isNow = (end: string) => /present|now|ongoing/i.test(end);

export function Journal({ items, limit, standalone }: { items: JournalItem[]; limit?: number; standalone?: boolean }) {
  const [kind, setKind] = useState<"all" | "experience" | "volunteer">("all");
  const [all, setAll] = useState(false);
  const kinds = (
    [
      ["all", "All"],
      ["experience", "Work"],
      ["volunteer", "Community"],
    ] as const
  ).filter(([k]) => k === "all" || items.some((x) => x.kind === k));
  const matching = items.filter((x) => kind === "all" || x.kind === kind);
  const shown = limit && !all ? matching.slice(0, limit) : matching;

  return (
    <div>
      {kinds.length > 2 && (
        <div className="chips mb-5" role="group" aria-label="Filter journal">
          {kinds.map(([k, label]) => (
            <button key={k} type="button" aria-pressed={k === kind} onClick={() => setKind(k)}>
              {label}
              <sup>{k === "all" ? items.length : items.filter((x) => x.kind === k).length}</sup>
            </button>
          ))}
        </div>
      )}
      <ol className="journal">
        {shown.map((x) => {
          const when = x.start ? `${x.start} – ${isNow(x.end) ? "now" : x.end}` : isNow(x.end) ? "ongoing" : "along the way";
          return (
            <li key={x.id} className={isNow(x.end) ? "now" : ""}>
              <span className={`pb-2 pt-1 font-hand text-[22px] leading-tight ${isNow(x.end) ? "text-m-ink" : "text-fg-muted"}`}>{when}</span>
              <div className="entry">
                <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.05]">{x.org}</h3>
                <p className="mt-1 font-semibold">
                  {x.role}
                  {x.location && <span className="font-normal text-fg-faint"> · {x.location}</span>}
                </p>
                {standalone ? (
                  x.highlights.length > 0 && (
                    <ul className="mt-3 grid gap-2 text-fg-muted">
                      {x.highlights.map((h) => (
                        <li key={h} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 flex-none rounded-full bg-m" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )
                ) : (
                  x.highlights[0] && <p className="mt-2 text-fg-muted">{x.highlights[0]}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {limit && matching.length > limit && (
        <button type="button" className="btn-more mt-6" onClick={() => setAll((v) => !v)}>
          {all ? "Fold it back ↑" : `Read the whole journal (${matching.length}) ↓`}
        </button>
      )}
    </div>
  );
}

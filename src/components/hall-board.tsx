"use client";

import { useEffect, useState } from "react";
import { formatClock } from "@/lib/hack/flags";
import type { HallEntry } from "@/lib/content/hall";

export function HallBoard({ rows }: { rows: HallEntry[] }) {
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        setMe(localStorage.getItem("hall-me"));
      } catch {}
    };
    read();
    window.addEventListener("hall:me", read);
    return () => window.removeEventListener("hall:me", read);
  }, []);

  if (rows.length === 0) {
    return <p className="py-7 font-mono text-fg-muted">&gt; no one has rooted this box yet. be the first — press ` and type help.</p>;
  }

  return (
    <table className="w-full border-collapse font-mono text-sm">
      <thead>
        <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-fg-faint">
          <th className="border-b border-border-strong pb-2.5 pr-3 font-medium">rank</th>
          <th className="border-b border-border-strong pb-2.5 pr-3 font-medium">handle</th>
          <th className="border-b border-border-strong pb-2.5 pr-3 font-medium">time</th>
          <th className="border-b border-border-strong pb-2.5 pr-3 font-medium max-sm:hidden">hints</th>
          <th className="border-b border-border-strong pb-2.5 pr-3 font-medium">score</th>
          <th className="border-b border-border-strong pb-2.5 pr-3 font-medium max-sm:hidden">rooted</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((e, i) => (
          <tr key={e.id} className={e.id === me ? "bg-[rgb(57_255_136/10%)]" : ""}>
            <td className="w-16 border-b border-border py-3.5 pr-3 text-m">
              #{String(i + 1).padStart(2, "0")}
              {i === 0 && " ♛"}
            </td>
            <td className="break-all border-b border-border py-3.5 pr-3 font-medium text-fg">
              {e.handle}
              {e.id === me && <span className="text-m">{"  ← you"}</span>}
            </td>
            <td className="border-b border-border py-3.5 pr-3">{formatClock(e.ms)}</td>
            <td className="border-b border-border py-3.5 pr-3 max-sm:hidden">{e.hints}</td>
            <td className="border-b border-border py-3.5 pr-3">{formatClock(e.score)}</td>
            <td className="border-b border-border py-3.5 pr-3 max-sm:hidden">{e.createdAt.slice(0, 10)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

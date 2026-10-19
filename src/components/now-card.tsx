"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false });

// What the owner is probably doing at this hour in IST — each with its own avatar pose.
function guess(hour: number) {
  if (hour < 6) return { pose: "sleeping", doing: "probably asleep", note: "he'll reply in the morning." };
  if (hour < 10) return { pose: "notes", doing: "chai o'clock", note: "good time to catch him." };
  if (hour < 19) return { pose: "building", doing: "at work", note: "replies after hours." };
  if (hour < 23) return { pose: "toolbox", doing: "building side projects", note: "best time to say hi." };
  return { pose: "hacker", doing: "late-night hacking", note: "he's definitely online." };
}

/** "My time" sticky note: local IST time plus a pose that matches the hour. */
export function NowCard({ location }: { location: string }) {
  const [now, setNow] = useState<{ time: string; hour: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const time = fmt.format(new Date());
      setNow({ time, hour: Number(time.slice(0, 2)) });
    };
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  const g = now ? guess(now.hour) : null;

  return (
    <div className="ink-card relative flex items-center gap-4 overflow-visible p-5 pt-6" style={{ transform: "rotate(-1deg)" }}>
      <span aria-hidden="true" className="tape absolute -top-3 right-8 h-6 w-20 rotate-2" />
      <div className="min-w-0 flex-1">
        <h3 className="mb-2 font-hand text-[22px] leading-none text-fg-faint">my time</h3>
        <p className="font-display text-4xl leading-none">
          {now ? now.time : "—"} <span className="font-sans text-sm text-fg-faint">IST · {location}</span>
        </p>
        {g && (
          <p className="mt-2 text-fg-muted">
            <span className="font-semibold text-fg">{g.doing}</span> — {g.note}
          </p>
        )}
      </div>
      {g && (
        <Image
          src={`/avatars/${g.pose}.webp`}
          alt=""
          aria-hidden="true"
          width={240}
          height={240}
          className="sticker-img -my-6 w-[104px] flex-none"
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { isHacker, onSkin, setHacker } from "@/lib/site-events";

export function HackerSwitch() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from <html data-skin>, unavailable during SSR
    setOn(isHacker());
    return onSkin(setOn);
  }, []);

  return (
    <button
      type="button"
      onClick={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        setHacker(!on, b.x + b.width / 2, b.y + b.height / 2);
      }}
      className="min-h-10 rounded-md bg-[#0b100c] px-3 py-2 font-mono text-xs text-[#39ff88] hover:shadow-[0_0_0_2px_#39ff88]"
    >
      {on ? "> exit hacker mode" : ">_ hacker mode"}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Drop matching images into public/avatars/ (transparent-background PNG/WebP, square).
// A pose whose image is missing is skipped, so this renders nothing until art exists.
const POSES = [
  { id: "thinking", quote: "“okay… but why?”", spot: "left-[6%] top-[8%]", noteSide: "right" },
  { id: "building", quote: "“one more deploy.”", spot: "right-[6%] top-[9%]", noteSide: "left" },
  { id: "notes", quote: "“wait. that’s interesting.”", spot: "bottom-[2%] left-[5%]", noteSide: "right" },
  { id: "details", quote: "“found the race condition.”", spot: "bottom-[2%] right-[6%]", noteSide: "left" },
] as const;

const SHOW_MS = 3600;
const EXIT_MS = 650;

export function HeroAvatars() {
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [entered, setEntered] = useState(false);

  const available = POSES.filter((p) => !failed.has(p.id));
  const current = available.length ? available[index % available.length] : null;

  const markFailed = (id: string) =>
    setFailed((s) => (s.has(id) ? s : new Set(s).add(id)));

  useEffect(() => {
    if (available.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let exitTimer: ReturnType<typeof setTimeout>;
    const showTimer = setTimeout(() => {
      setExiting(true);
      exitTimer = setTimeout(() => {
        setExiting(false);
        setEntered(false);
        setIndex((i) => i + 1);
      }, EXIT_MS);
    }, SHOW_MS);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
    };
  }, [index, available.length]);

  // Next frame after a pose mounts, flip it to visible so the spawn transition runs.
  useEffect(() => {
    if (entered) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [entered, index]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
      {POSES.map((pose) => {
        if (failed.has(pose.id)) return null;
        const active = current?.id === pose.id;
        return (
          <figure
            key={pose.id}
            className={cn(
              "avatar absolute m-0 aspect-square w-[clamp(14rem,19vw,19rem)]",
              pose.spot,
              active && entered && !exiting && "is-visible",
              active && exiting && "is-exiting"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- optional static art; a missing file just hides the pose */}
            <img
              src={`/avatars/${pose.id}.webp`}
              alt=""
              className="avatar-media h-full w-full object-contain"
              onError={() => markFailed(pose.id)}
              // Covers a 404 that lands before hydration attaches onError.
              ref={(el) => {
                if (el?.complete && el.naturalWidth === 0) markFailed(pose.id);
              }}
            />
            <figcaption
              className={cn(
                "absolute top-[38%] w-40 -rotate-3 font-hand text-2xl leading-tight text-fg",
                pose.noteSide === "right" ? "left-full ml-2" : "right-full mr-2 text-right"
              )}
            >
              {pose.quote}
              <span
                className={cn("mt-1 block h-0.5 w-12 rounded bg-note", pose.noteSide === "left" && "ml-auto")}
              />
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

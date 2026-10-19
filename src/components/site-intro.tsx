import Image from "next/image";
import { MODES } from "@/lib/modes";

// ~3.8s intro on every full page load / reload (client-side navigation keeps the
// layout, so it doesn't replay). Pure CSS: it plays before hydration and needs no
// JS to finish — the last keyframe hides it and turns pointer events off.
// Skipped entirely under prefers-reduced-motion (see globals.css).
const WORDS = ["designer", "builder", "human", "debugger"];
const STEP = 0.6; // seconds per mode — keep in sync with the intro-* timings in globals.css

export function SiteIntro({ name }: { name: string }) {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-stage">
        <div className="intro-blob" />
        {MODES.map((m, i) => (
          <Image
            key={m.id}
            src={`/avatars/${m.pose}.webp`}
            alt=""
            width={220}
            height={220}
            priority
            sizes="220px"
            className="intro-pose sticker-img"
            style={{ animationDelay: `${i * STEP}s` }}
          />
        ))}
        <span className="intro-name">
          {name}
          <span className="mc">.</span>
        </span>
      </div>
      <div className="intro-words">
        {WORDS.map((w, i) => (
          <span key={w} style={{ animationDelay: `${i * STEP}s` }}>
            {w}
          </span>
        ))}
      </div>
      <div className="intro-meter">
        <span>loading {name.toLowerCase()}.sys</span>
        <span className="intro-count" />
      </div>
      <div className="intro-bar" />
    </div>
  );
}

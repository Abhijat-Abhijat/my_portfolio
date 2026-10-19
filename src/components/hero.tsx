"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MODES, MODE_MS } from "@/lib/modes";
import { isPaused, onMotion, setSiteMode } from "@/lib/site-events";

/** One person, four modes — the signature hero. Auto-cycles until touched; pausable. */
export function Hero({ name }: { name: string }) {
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // bump = remount the animated bits so they replay
  const mode = MODES[index];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the <html> class, unavailable during SSR
    setPaused(isPaused());
    return onMotion(setPaused);
  }, []);

  useEffect(() => setSiteMode(mode.id), [mode.id]);

  useEffect(() => {
    if (touched || paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % MODES.length);
      setTick((k) => k + 1);
    }, MODE_MS);
    return () => clearInterval(t);
  }, [touched, paused]);

  function pick(i: number) {
    setTouched(true);
    setIndex(i);
    setTick((k) => k + 1);
  }

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container-page grid items-center gap-[clamp(24px,4vw,64px)] md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div>
          <span className="inline-block -rotate-3 font-hand text-[clamp(1.6rem,2.6vw,2.2rem)] text-fg-muted">
            hi, I&rsquo;m {name} —
          </span>
          <h1 id="hero-title" className="hero-title" aria-label="I design, build, write about and debug useful things, mostly with AI.">
            <span aria-hidden="true">
              I{" "}
              <span className="verb">
                <span key={`v${tick}`} className="verb-t swap">
                  {mode.verb}
                </span>
                <svg key={`s${tick}`} className="scribble draw" viewBox="0 0 200 20" preserveAspectRatio="none">
                  <path d="M3 13 C 40 4, 80 18, 120 9 S 180 6, 197 12" />
                </svg>
              </span>
              <br />
              useful things,
              <br />
              <span className="ital text-[0.62em]">mostly with AI.</span>
            </span>
          </h1>
          {/* Static, trusted copy from lib/modes.ts — may contain <strong>. */}
          <p
            className="mt-6 min-h-[3.4em] max-w-[34rem] text-[clamp(1.05rem,1.5vw,1.22rem)] text-fg-muted [&_strong]:font-semibold [&_strong]:text-fg"
            dangerouslySetInnerHTML={{ __html: mode.line }}
          />
          <div className="mode-row mt-7 flex flex-wrap gap-2" role="group" aria-label="Pick a mode">
            {MODES.map((m, i) => (
              <button key={m.id} type="button" className="mode-btn" aria-pressed={i === index} onClick={() => pick(i)}>
                <Image src={`/avatars/${m.pose}.webp`} alt="" width={34} height={34} />
                {m.label}
                <span
                  key={i === index ? `p${tick}` : "p"}
                  aria-hidden="true"
                  className={`prog${i === index && !touched && !paused ? " run" : ""}`}
                  style={{ animationDuration: `${MODE_MS}ms` }}
                />
              </button>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-[18px]">
            <Link href="/#work" className="btn-ink">
              See what I&rsquo;ve made <span aria-hidden="true">↘</span>
            </Link>
            <Link href="/#contact" className="tlink">
              or just say hi
            </Link>
          </div>
        </div>

        <div className="stage order-first w-[min(48%,190px)] md:order-none md:w-[min(100%,560px)]" aria-hidden="true">
          <div className="ring" />
          <div className="blob" />
          <div className="not-hacker">
            {MODES.map((m, i) => (
              <figure key={m.id} className={`pose m-0${m.id === mode.id ? " on" : ""}`}>
                <Image
                  src={`/avatars/${m.pose}.webp`}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 520px, 80vw"
                  className="sticker-img object-contain"
                />
              </figure>
            ))}
          </div>
          <figure className="pose on hacker-only m-0">
            <Image src="/avatars/hacker.webp" alt="" fill sizes="(min-width: 768px) 520px, 80vw" className="sticker-img object-contain" />
          </figure>
          <div key={`b${tick}`} className="bubble pop left-[-2%] top-[8%]">
            {mode.quote}
          </div>
          <Doodles active={mode.id} />
        </div>
      </div>
      <span className="absolute bottom-[18px] left-1/2 hidden -translate-x-1/2 font-hand text-[22px] text-fg-faint md:block" aria-hidden="true">
        scroll ↓
      </span>
    </section>
  );
}

function Doodles({ active }: { active: string }) {
  const on = (id: string) => `doodle${active === id ? " on" : ""}`;
  return (
    <>
      <div className={`${on("design")} right-0 top-[14%]`}>
        <svg width="120" height="90" viewBox="0 0 120 90">
          <path className="dd-stroke" d="M8 78 C 30 10, 80 10, 112 60" />
          <path className="dd-stroke" d="M8 78 L 40 24 M112 60 L 92 14" strokeDasharray="3 4" />
          <rect x="3" y="73" width="10" height="10" fill="var(--paper)" className="dd-stroke" />
          <rect x="107" y="55" width="10" height="10" fill="var(--paper)" className="dd-stroke" />
          <circle cx="40" cy="24" r="4" fill="var(--fg)" />
          <circle cx="92" cy="14" r="4" fill="var(--fg)" />
        </svg>
      </div>
      <div className={`${on("design")} bottom-[10%] left-[4%]`}>
        <span className="ink-chip font-hand text-[22px]">Aa · 8px grid</span>
      </div>
      <div className={`${on("build")} right-[2%] top-[16%]`}>
        <span className="ink-chip">&lt;/&gt; ship()</span>
      </div>
      <div className={`${on("build")} bottom-[14%] left-[2%]`}>
        <span className="ink-chip">✓ 15 teams</span>
      </div>
      <div className={`${on("human")} right-[6%] top-[10%]`}>
        <svg width="70" height="80" viewBox="0 0 70 80">
          <path className="dd-stroke" d="M18 70 C 6 56, 30 48, 18 32 S 22 8, 18 4" />
          <path className="dd-stroke" d="M40 70 C 28 56, 52 48, 40 32 S 44 8, 40 4" />
        </svg>
      </div>
      <div className={`${on("human")} bottom-[12%] left-[4%]`}>
        <span className="ink-chip font-hand text-[22px]">note to self ✎</span>
      </div>
      <div className={`${on("hack")} right-[-2%] top-[14%]`}>
        <div className="term-card">
          <b>$</b> sudo make chai
          <br />
          [ok] steeping…
        </div>
      </div>
      <div className={`${on("hack")} bottom-[12%] left-0`}>
        <div className="term-card">
          <b>&gt;</b> found: race condition
        </div>
      </div>
    </>
  );
}

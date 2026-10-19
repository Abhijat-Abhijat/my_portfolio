"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Certification } from "@/lib/content/certifications";
import { isPaused, onMotion } from "@/lib/site-events";

const VISIBLE = 4; // certificates drawn in the stack, however many exist
const TILT = [-1.5, 2.2, -3, 3.6];
const AUTO_MS = 3600; // self-flip interval
const RESUME_MS = 6000; // quiet time after a manual flip before autoplay resumes
const FLY_MS = 380;

const pad = (x: number) => String(x).padStart(2, "0");

/** A self-flipping deck of paper certificates — same footprint for 5 or 50. */
export function CertDeck({ certs, name }: { certs: Certification[]; name: string }) {
  const n = certs.length;
  const [i, setI] = useState(0);
  const [flying, setFlying] = useState(false);
  const [hold, setHold] = useState(false); // hover / focus
  const [userPaused, setUserPaused] = useState(false);
  const [sitePaused, setSitePaused] = useState(false);
  const [inView, setInView] = useState(false);
  const deck = useRef<HTMLDivElement>(null);
  const flyingRef = useRef(false);
  const touched = useRef(0);
  const swipe = useRef<number | null>(null);

  const next = useCallback(() => {
    if (flyingRef.current || n < 2) return;
    flyingRef.current = true;
    setFlying(true);
    setTimeout(() => {
      setI((v) => (v + 1) % n);
      flyingRef.current = false;
      setFlying(false);
    }, FLY_MS);
  }, [n]);
  const go = useCallback((to: number) => !flyingRef.current && setI(((to % n) + n) % n), [n]);
  const manual = (fn: () => void) => () => {
    touched.current = Date.now();
    fn();
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the <html> motion class, unavailable during SSR
    setSitePaused(isPaused());
    return onMotion(setSitePaused);
  }, []);

  useEffect(() => {
    const el = deck.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const autoplay = n > 1 && !hold && !userPaused && !sitePaused && inView;
  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => {
      if (Date.now() - touched.current >= RESUME_MS) next();
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [autoplay, next]);

  if (n === 0) return null;
  const stack = Array.from({ length: Math.min(VISIBLE, n) }, (_, k) => ({ k, c: certs[(i + k) % n] })).reverse();

  return (
    <div>
      <div
        ref={deck}
        className="cert-deck"
        role="region"
        aria-roledescription="carousel"
        aria-label={`Certificates, ${n} total`}
        tabIndex={0}
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={() => setHold(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") manual(next)();
          if (e.key === "ArrowLeft") manual(() => go(i - 1))();
        }}
        onPointerDown={(e) => (swipe.current = e.clientX)}
        onPointerUp={(e) => {
          if (swipe.current === null) return;
          const dx = e.clientX - swipe.current;
          swipe.current = null;
          touched.current = Date.now();
          if (dx < -40) go(i - 1);
          else next(); // a tap or a right swipe flips the top card
        }}
      >
        {stack.map(({ k, c }) => (
          <article
            key={`${c.id}-${k}`}
            className={`cert-card${k === 0 && flying ? " fly" : ""}`}
            style={{ transform: `translate(${k * 8}px, ${k * -10}px) rotate(${TILT[k]}deg)`, zIndex: VISIBLE - k }}
            aria-hidden={k !== 0}
          >
            <div className="cert-frame">
              <p className="cert-kicker">certificate of completion</p>
              <h4 className="cert-title">{c.title}</h4>
              <p className="cert-presented">
                presented to <b>{name}</b>
              </p>
              <div className="cert-foot">
                <span>{c.issuer ?? "course completed"}</span>
                <span className="cert-sig">{c.date ?? "done ✓"}</span>
              </div>
            </div>
            <span className="cert-no">
              no. {pad(((i + k) % n) + 1)}/{pad(n)}
            </span>
            <span className="cert-seal" aria-hidden="true">
              ✓
            </span>
          </article>
        ))}
      </div>

      {n > 1 && (
        <div className="cert-progress" aria-hidden="true">
          <i key={i} style={{ animationDuration: `${AUTO_MS}ms`, animationPlayState: autoplay ? "running" : "paused" }} />
        </div>
      )}

      {n > 1 && (
        <div className="cert-ticks" role="group" aria-label="Jump to a certificate">
          {certs.map((c, k) => (
            <button key={c.id} type="button" aria-current={k === i} aria-label={`Certificate ${k + 1}: ${c.title}`} onClick={() => manual(() => go(k))()} />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button type="button" className="icon-btn border-[1.5px] border-fg" onClick={() => manual(() => go(i - 1))()} aria-label="Previous certificate">
          ←
        </button>
        <button type="button" className="icon-btn border-[1.5px] border-fg" onClick={() => manual(next)()} aria-label="Next certificate">
          →
        </button>
        {n > 1 && (
          <button
            type="button"
            className="icon-btn border-[1.5px] border-fg"
            onClick={() => setUserPaused((v) => !v)}
            aria-pressed={userPaused}
            aria-label={userPaused ? "Play the deck" : "Pause the deck"}
          >
            {userPaused ? "▶" : "❚❚"}
          </button>
        )}
        <span className="ml-2 font-hand text-xl text-fg-faint" aria-live="polite">
          {pad(i + 1)} / {pad(n)}
        </span>
        {n > 1 && (
          <Link href="/certifications" className="tlink ml-auto text-sm">
            see all {n} →
          </Link>
        )}
      </div>
    </div>
  );
}

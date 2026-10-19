// Tiny client-side event bus shared by the header, hero, toolbox, terminal and
// footer. State lives on <html> (classes / data-attributes) so CSS can react to
// it directly; these helpers just flip it and tell listeners.

const TOAST = "site:toast";
const MOTION = "site:motion";
const SKIN = "site:skin";

export function say(message: string) {
  window.dispatchEvent(new CustomEvent(TOAST, { detail: message }));
}

export function onToast(cb: (message: string) => void) {
  const h = (e: Event) => cb((e as CustomEvent<string>).detail);
  window.addEventListener(TOAST, h);
  return () => window.removeEventListener(TOAST, h);
}

export function isPaused() {
  return document.documentElement.classList.contains("paused");
}

export function setPaused(paused: boolean) {
  document.documentElement.classList.toggle("paused", paused);
  document.querySelectorAll("video").forEach((v) => (paused ? v.pause() : v.play().catch(() => {})));
  window.dispatchEvent(new CustomEvent(MOTION, { detail: paused }));
}

export function onMotion(cb: (paused: boolean) => void) {
  const h = (e: Event) => cb((e as CustomEvent<boolean>).detail);
  window.addEventListener(MOTION, h);
  return () => window.removeEventListener(MOTION, h);
}

export function isHacker() {
  return document.documentElement.dataset.skin === "hacker";
}

export function onSkin(cb: (hacker: boolean) => void) {
  const h = (e: Event) => cb((e as CustomEvent<boolean>).detail);
  window.addEventListener(SKIN, h);
  return () => window.removeEventListener(SKIN, h);
}

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

/** Circular View-Transition reveal from (x, y); plain swap when unsupported or paused. */
export function revealFrom(apply: () => void, x = window.innerWidth - 80, y = 36) {
  const doc = document as ViewTransitionDoc;
  if (!doc.startViewTransition || isPaused()) return apply();
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  doc.startViewTransition(apply).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: "cubic-bezier(.7,0,.2,1)", pseudoElement: "::view-transition-new(root)" }
    );
  });
}

export function setHacker(on: boolean, x?: number, y?: number) {
  revealFrom(() => {
    if (on) document.documentElement.dataset.skin = "hacker";
    else delete document.documentElement.dataset.skin;
    try {
      localStorage.setItem("skin", on ? "hacker" : "");
    } catch {}
    window.dispatchEvent(new CustomEvent(SKIN, { detail: on }));
    syncFavicon();
  }, x, y);
  say(on ? "a terminal just opened. try to hack me." : "welcome back, human.");
}

/** The hero's mode drives --m for the whole public site via the #site wrapper. */
export function setSiteMode(mode: string) {
  document.getElementById("site")?.setAttribute("data-mode", mode);
  syncFavicon();
}

/**
 * Tab icon follows the site colour: public/favicons/<mode>.png, or hacker.png in the
 * hacker skin. The static app/icon.png (orange) stays the no-JS / first-paint default.
 * Next can insert its icon <link>s after hydration, so a head observer re-applies.
 */
let faviconObserver: MutationObserver | null = null;

function applyFavicon() {
  const key = isHacker() ? "hacker" : (document.getElementById("site")?.getAttribute("data-mode") ?? "design");
  const href = `/favicons/${key}.png`;
  document.querySelectorAll<HTMLLinkElement>('link[rel="icon"]').forEach((link) => {
    if (link.getAttribute("href") !== href) link.href = href; // attribute change, not childList — no observer loop
  });
}

export function syncFavicon() {
  applyFavicon();
  if (!faviconObserver) {
    faviconObserver = new MutationObserver(applyFavicon);
    faviconObserver.observe(document.head, { childList: true });
  }
}

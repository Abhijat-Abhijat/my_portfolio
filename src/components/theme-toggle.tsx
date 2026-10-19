"use client";

import { revealFrom } from "@/lib/site-events";

/** Light/dark with a circular View-Transition reveal from the button. */
export function ThemeToggle() {
  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const b = e.currentTarget.getBoundingClientRect();
    revealFrom(
      () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try {
          window.localStorage.setItem("theme", next);
        } catch {}
      },
      b.x + b.width / 2,
      b.y + b.height / 2
    );
  }

  return (
    <button type="button" onClick={toggle} aria-label="Toggle light / dark" title="Light / dark" className="icon-btn">
      <span aria-hidden="true">◐</span>
    </button>
  );
}

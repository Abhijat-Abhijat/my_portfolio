"use client";

import { say } from "@/lib/site-events";

export function CopyEmail({ email }: { email: string }) {
  return (
    <button
      type="button"
      className="copy-btn"
      onClick={() =>
        navigator.clipboard.writeText(email).then(
          () => say("email copied — talk soon ✌"),
          () => (window.location.href = `mailto:${email}`)
        )
      }
    >
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{email}</span>
      <span className="flex-none font-mono text-[11.5px] uppercase tracking-wide text-fg-faint">copy</span>
    </button>
  );
}

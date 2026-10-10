"use client";

import { useActionState, useEffect, useState } from "react";
import { submitContactMessage, type ContactFormState } from "@/lib/content/contact-actions";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);
  const [renderedAt, setRenderedAt] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only timestamp, used as a bot-timing check; unavailable/meaningless during SSR
    setRenderedAt(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent-soft p-6 text-center text-sm text-fg">
        Thanks — that went through. I&rsquo;ll get back to you soon.
      </div>
    );
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-border bg-bg px-3.5 py-3 text-base text-fg outline-none transition-colors focus-visible:border-accent";

  return (
    <form action={formAction} className="space-y-5 text-left">
      <input type="hidden" name="rendered_at" value={renderedAt ?? ""} />

      {/* Honeypot — hidden from real visitors, bots often fill every field. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-fg-muted">
            Name
          </label>
          <input id="name" name="name" type="text" required maxLength={200} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-fg-muted">
            Email
          </label>
          <input id="email" name="email" type="email" required maxLength={200} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-fg-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          rows={5}
          className={`${inputClass} resize-y`}
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-danger">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending || renderedAt === null}
        className="group inline-flex items-center gap-3 rounded-full bg-fg px-7 py-3.5 text-sm font-semibold text-bg transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {isPending ? "Sending…" : "Say hello"}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </button>
    </form>
  );
}

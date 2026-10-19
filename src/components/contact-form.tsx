"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { submitContactMessage, type ContactFormState } from "@/lib/content/contact-actions";

const initialState: ContactFormState = { status: "idle" };

/** Contact form as a postcard: lined message side, stamp + address side. */
export function ContactForm({ toName }: { toName: string }) {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);
  const [renderedAt, setRenderedAt] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only timestamp, used as a bot-timing check; unavailable/meaningless during SSR
    setRenderedAt(Date.now());
  }, []);

  const sent = state.status === "success";

  return (
    <form action={formAction} className="postcard" aria-label="Send a postcard">
      <input type="hidden" name="rendered_at" value={renderedAt ?? ""} />

      {/* Honeypot — hidden from real visitors, bots often fill every field. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid flex-1 gap-8 md:grid-cols-[minmax(0,1.25fr)_1px_minmax(0,1fr)]">
        <div className="flex flex-col">
          <label htmlFor="message" className="font-hand text-2xl leading-none text-fg-faint">
            your message
          </label>
          <textarea
            id="message"
            name="message"
            required
            maxLength={5000}
            rows={7}
            disabled={sent}
            placeholder="hey abhijat, I've got a fun problem…"
            className="pc-lines flex-1"
          />
        </div>

        <span aria-hidden="true" className="hidden bg-[var(--line-strong)] md:block" />

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-fg-faint">
              post card
              <br />
              par avion
            </p>
            <div className="relative" aria-hidden="true">
              <div className="stamp">
                <div className="stamp-in">
                  <Image src="/avatars/thinking.webp" alt="" width={120} height={120} className="w-[88%]" />
                </div>
              </div>
              <svg className="postmark" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="44" />
                <circle cx="60" cy="60" r="34" />
                <path id="pm-arc" d="M 22 60 A 38 38 0 0 1 98 60" fill="none" stroke="none" />
                <text>
                  <textPath href="#pm-arc" startOffset="50%" textAnchor="middle">
                    PUNE · IST
                  </textPath>
                </text>
                <path d="M 0 82 q 15 -8 30 0 t 30 0 t 30 0 t 30 0" />
                <path d="M 0 94 q 15 -8 30 0 t 30 0 t 30 0 t 30 0" />
              </svg>
            </div>
          </div>

          <p className="mt-6 border-b-[1.5px] border-fg pb-1 font-hand text-[26px] leading-tight">
            <span className="text-fg-faint">to:</span> {toName}
          </p>
          <label htmlFor="name" className="sr-only">
            Your name
          </label>
          <input id="name" name="name" type="text" required maxLength={200} disabled={sent} placeholder="from: your name" className="pc-line" />
          <label htmlFor="email" className="sr-only">
            Your email
          </label>
          <input id="email" name="email" type="email" required maxLength={200} disabled={sent} placeholder="reply to: you@email.com" className="pc-line" />

          {state.status === "error" && <p className="mt-3 text-sm text-danger">{state.error}</p>}

          {sent ? (
            <p className="mt-6 font-hand text-[26px] leading-tight text-m-ink" role="status">
              on its way — I&rsquo;ll write back soon. ✌
            </p>
          ) : (
            <button type="submit" disabled={isPending || renderedAt === null} className="btn-ink mt-7 w-fit disabled:opacity-60">
              {isPending ? "Posting…" : "Send it"} <span aria-hidden="true">✉</span>
            </button>
          )}
        </div>
      </div>

      {sent && (
        <span aria-hidden="true" className="sent-stamp">
          SENT ✓
        </span>
      )}
    </form>
  );
}

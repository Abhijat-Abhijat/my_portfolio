"use client";

import { useEffect, useState } from "react";
import { onToast } from "@/lib/site-events";

/** One global toast; anything can call `say("…")` from lib/site-events. */
export function Toast() {
  const [message, setMessage] = useState("");
  const [on, setOn] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const off = onToast((m) => {
      setMessage(m);
      setOn(true);
      clearTimeout(timer);
      timer = setTimeout(() => setOn(false), 2400);
    });
    return () => {
      off();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`toast${on ? " on" : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}

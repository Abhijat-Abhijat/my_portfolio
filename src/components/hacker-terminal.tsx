"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FLAGS, FLAG_LIST, formatClock } from "@/lib/hack/flags";
import { joinHall } from "@/lib/content/hall-actions";
import { isHacker, onSkin, say, setHacker } from "@/lib/site-events";

// The hack-me game. Everything here is fake and client-side: no real files, no
// server access except the one Hall of hackers server action. Flag 1 is an HTML
// comment in the page source (site layout), flag 4 lives on window.__abhijat.

type Line = { text: string; cls?: string; img?: string };
type Mode = "cmd" | "pw" | "name";

const FILES: Record<string, string> = {
  "readme.txt":
    "welcome, hacker.\n4 flags are hidden in this site. they look like flag{...}\nsubmit each one with:  submit flag{...}\nnothing here touches a real server — break whatever you like.\nstuck? type: hint",
  "secrets.txt": "ZmxhZ3syX2Jhc2U2NF9pc19ub3RfZW5jcnlwdGlvbn0=",
  "robots.txt": "User-agent: *\nDisallow: /my-first-os      # the admin password is its name",
  ".bash_history": "vim kernel.c\ngit push --force      # oops\nsudo make chai\n# note to self: open devtools and poke window.__abhijat",
};
const HINTS = [
  "flag 1: view the page source (ctrl+u). comments talk.",
  "flag 2: secrets.txt looks encoded. try: decode <text>",
  "flag 3: cat robots.txt, then: ssh admin@abhijat",
  "flag 4: ls -a, read the history, then open devtools (F12).",
];
const CMDS = ["help", "ls", "cat", "decode", "ssh", "submit", "status", "hint", "hall", "join", "reset", "whoami", "nmap", "sudo", "rm", "clear", "prize", "exit"];
const HELP =
  "ls [-a]        list files\ncat <file>     read a file\ndecode <text>  base64 decode\nssh <user@host>\nsubmit <flag>  claim a flag\nstatus         your flags\nhint           a nudge (+60s)\nhall           Hall of hackers\nreset          replay the box\nwhoami · nmap · clear · exit";

const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : (JSON.parse(v) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  del(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

export function HackerTerminal({ email, hall }: { email: string; hall: Array<{ handle: string; score: number }> }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [mode, setMode] = useState<Mode>("cmd");
  const [got, setGot] = useState<string[]>([]);
  const hist = useRef<string[]>([]);
  const hi = useRef(0);
  const greeted = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const out = useRef<HTMLDivElement>(null);
  // Drag by the title bar (pointer events = mouse + touch). null = default bottom-left spot.
  const box = useRef<HTMLElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const won = got.length === FLAG_LIST.length;

  const print = useCallback((text: string, cls?: string, img?: string) => setLines((l) => [...l, { text, cls, img }]), []);

  useEffect(() => {
    out.current?.scrollTo(0, out.current.scrollHeight);
  }, [lines]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring saved progress from localStorage, unavailable during SSR
    setGot(store.get<string[]>("hack-flags", []).filter((f) => FLAGS[f]));
    const show = (on: boolean) => {
      setVisible(on);
      setMinimised(false);
    };
    show(isHacker());
    const off = onSkin(show);
    const onKey = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement as HTMLElement | null)?.tagName ?? "");
      if (e.key === "`" && !typing && !document.querySelector("dialog[open]")) {
        e.preventDefault();
        setHacker(!isHacker());
      }
    };
    window.addEventListener("keydown", onKey);
    (window as unknown as { __abhijat: unknown }).__abhijat = {
      unlock() {
        console.log("%cflag{4_console_cowboy}", "font:700 16px monospace;color:#39ff88;background:#050906;padding:4px 8px");
        return "now submit it in the terminal ↑";
      },
    };
    console.log(
      "%cpsst.",
      "font:700 22px Georgia;color:#d6420c",
      "\nYou opened devtools — my kind of person. Press ` for hacker mode, or say hi: " + email
    );
    return () => {
      off();
      window.removeEventListener("keydown", onKey);
    };
  }, [email]);

  useEffect(() => {
    if (!visible || minimised) return;
    if (!store.get("hack-start", 0) && store.get<string[]>("hack-flags", []).length < FLAG_LIST.length) {
      store.set("hack-start", Date.now()); // the clock starts the first time the terminal opens
    }
    if (!greeted.current) {
      greeted.current = true;
      print("abhijat.sys v1 — authorised fun only.", "dim");
      print('type "help" to start. (this is a game — nothing here is real.)', "ok");
    }
    input.current?.focus();
  }, [visible, minimised, print]);

  function askHandle() {
    if (store.get<string | null>("hall-me", null)) return print("you are already in the Hall of hackers. type: hall", "dim");
    setMode("name");
    print("sign the Hall of hackers — pick a handle (2–20 chars: letters, numbers, _ . -):", "ok");
  }

  function win() {
    const ms = Date.now() - store.get("hack-start", Date.now());
    const hints = store.get<number>("hack-hints", 0);
    store.set("hack-result", { ms, hints });
    print("┌────────────────────────────┐\n│   ROOT ACCESS GRANTED  ✓   │\n└────────────────────────────┘", "ok", "/avatars/rooted.webp");
    print(`you hacked abhijat.co.in in ${formatClock(ms)} with ${hints} hint${hints === 1 ? "" : "s"}. (well, the fun version.)`);
    document.documentElement.classList.add("pwned");
    setTimeout(() => document.documentElement.classList.remove("pwned"), 2000);
    say("pwned. respect. 🫡");
    askHandle();
  }

  function submit(flag: string) {
    if (!FLAGS[flag]) return print("nope. flags look like flag{...}", "err");
    if (got.includes(flag)) return print("already got that one.", "dim");
    const next = [...got, flag];
    setGot(next);
    store.set("hack-flags", next);
    print(`✓ accepted — you ${FLAGS[flag]}. [${next.length}/4]`, "ok", next.length < FLAG_LIST.length ? "/badges/flag.webp" : undefined);
    if (next.length === FLAG_LIST.length) win();
  }

  async function join(handle: string) {
    setMode("cmd");
    const result = store.get<{ ms: number; hints: number } | null>("hack-result", null);
    if (!result) return print("no finished run found. type reset to play again.", "err");
    print("signing the wall…", "dim");
    try {
      const res = await joinHall({ handle, flags: got, ms: result.ms, hints: result.hints });
      if (!res.ok) return print(`${res.error} type "join" to try again.`, "err");
      store.set("hall-me", res.id);
      try {
        localStorage.setItem("hall-me", res.id);
      } catch {}
      window.dispatchEvent(new Event("hall:me"));
      print(`✓ ${handle} is #${res.rank} in the Hall of hackers. type "hall" to see it · "prize" to claim your prize`, "ok");
      router.refresh();
    } catch {
      print('couldn’t reach the wall. type "join" to retry.', "err");
    }
  }

  function run(line: string) {
    if (mode === "pw") {
      setMode("cmd");
      if (/^ash(-?os)?$/i.test(line.trim())) {
        print("welcome, admin. 🫖", "ok");
        print("there is a note on the desk: flag{3_ash_was_the_password}");
      } else print("permission denied. (robots.txt knows things.)", "err");
      return;
    }
    if (mode === "name") {
      print(`handle: ${line}`, "cmd");
      void join(line.trim());
      return;
    }
    print(`$ ${line}`, "cmd");
    const [cmd, ...args] = line.trim().split(/\s+/);
    const arg = args.join(" ");
    switch (cmd) {
      case "":
        return;
      case "help":
        return print(HELP);
      case "ls":
        return print(Object.keys(FILES).filter((f) => args.includes("-a") || !f.startsWith(".")).join("   "));
      case "cat":
        return FILES[arg] ? print(FILES[arg]) : print(`cat: ${arg || "?"}: no such file`, "err");
      case "decode":
        try {
          return print(atob(arg));
        } catch {
          return print("decode: that is not base64", "err");
        }
      case "ssh":
        if (!/^admin@/.test(arg)) return print("ssh: try a user that sounds important.", "err");
        setMode("pw");
        return print(`${arg}'s password:`, "dim");
      case "submit":
        return submit(arg);
      case "status":
        return print(
          Object.entries(FLAGS)
            .map(([f, how], i) => `${got.includes(f) ? "✓" : "·"} flag ${i + 1} — ${got.includes(f) ? how : "???"}`)
            .join("\n")
        );
      case "hint": {
        const next = FLAG_LIST.findIndex((f) => !got.includes(f));
        if (next < 0) return print("no hints left. you won.", "dim");
        store.set("hack-hints", store.get<number>("hack-hints", 0) + 1);
        return print(`${HINTS[next]}  (+60s on the leaderboard)`, "dim");
      }
      case "hall":
        print(
          hall.length ? hall.map((e, i) => `#${i + 1}  ${e.handle.padEnd(20)} ${formatClock(e.score)}`).join("\n") : "the hall is empty. be the first.",
          hall.length ? undefined : "dim"
        );
        router.push("/#hall");
        return;
      case "join":
        return won ? askHandle() : print(`root the box first. you're at ${got.length}/4.`, "err");
      case "reset":
        setGot([]);
        ["hack-flags", "hack-start", "hack-hints", "hack-result"].forEach(store.del);
        store.set("hack-start", Date.now());
        return print("box reset. clock restarted. good luck.", "ok");
      case "whoami":
        return print(won ? "root. obviously." : "guest (for now)");
      case "nmap":
        return print("PORT     STATE     SERVICE\n22/tcp   open      ssh\n80/tcp   open      http\n1337/tcp filtered  chai-dispenser");
      case "sudo":
        return print("nice try. this incident will be reported to my mom.", "err");
      case "rm":
        return print("rm: refusing to delete my portfolio. it took weeks.", "err");
      case "clear":
        return setLines([]);
      case "prize":
        if (!won) return print(`prizes are for root. you're at ${got.length}/4.`, "err");
        print("opening your mail app… tell me how you did it.", "ok");
        window.location.href = `mailto:${email}?subject=${encodeURIComponent("I hacked your portfolio (4/4)")}&body=${encodeURIComponent(
          "Hi Abhijat — I found all 4 flags. Here is how:"
        )}`;
        return;
      case "exit":
        return setHacker(false);
      default:
        return print(`${cmd}: command not found. try "help"`, "err");
    }
  }

  // Keep the terminal fully on screen (also after a resize / rotation).
  const clamp = useCallback((x: number, y: number) => {
    const el = box.current;
    const w = el?.offsetWidth ?? 0;
    const h = el?.offsetHeight ?? 0;
    return {
      x: Math.min(Math.max(0, x), Math.max(0, window.innerWidth - w)),
      y: Math.min(Math.max(0, y), Math.max(0, window.innerHeight - h)),
    };
  }, []);

  useEffect(() => {
    const onResize = () => setPos((p) => (p ? clamp(p.x, p.y) : p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp]);

  function onDragStart(e: React.PointerEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest("button") || !box.current) return;
    const r = box.current.getBoundingClientRect();
    drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function onDragMove(e: React.PointerEvent<HTMLElement>) {
    if (!drag.current) return;
    setPos(clamp(e.clientX - drag.current.dx, e.clientY - drag.current.dy));
  }
  function onDragEnd(e: React.PointerEvent<HTMLElement>) {
    if (!drag.current) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  if (!visible) return null;

  if (minimised) {
    return (
      <button
        type="button"
        onClick={() => setMinimised(false)}
        className="fixed bottom-4 left-4 z-[420] rounded-lg border border-[#39ff88] bg-[#050906] px-3.5 py-2 font-mono text-xs text-[#39ff88]"
      >
        &gt;_ terminal
      </button>
    );
  }

  const prompt = mode === "pw" ? "password:" : mode === "name" ? "handle:" : `${won ? "root" : "guest"}@abhijat:~$`;

  return (
    <section
      ref={box}
      className="hk"
      role="dialog"
      aria-label="Hack-me terminal"
      style={pos ? { left: pos.x, top: pos.y, bottom: "auto" } : undefined}
    >
      <header
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
        title="Drag to move"
        className="flex cursor-grab touch-none select-none items-center gap-3 active:cursor-grabbing border-b border-[rgb(57_255_136/25%)] py-2 pl-3.5 pr-2 text-[11px] uppercase tracking-[0.08em] text-[#77b888]">
        <span>
          <b className="font-medium text-[#39ff88]">root@abhijat</b> — hack me<span className="max-sm:hidden"> (it&rsquo;s a game)</span>
        </span>
        <span className="ml-auto text-[#39ff88]">flags {got.length}/4</span>
        <button type="button" aria-label="Minimise terminal" onClick={() => setMinimised(true)} className="h-7 w-7 rounded-md hover:bg-[rgb(57_255_136/15%)]">
          _
        </button>
      </header>
      <div ref={out} className="hk-out" aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} className={l.cls}>
            {l.img && (
              // eslint-disable-next-line @next/next/no-img-element -- tiny decorative art inside terminal output
              <img src={l.img} alt="" className={l.img.includes("flag") ? "!mr-2 !inline-block !w-6 !align-middle" : ""} />
            )}
            {l.text}
          </div>
        ))}
      </div>
      <form
        className="flex gap-2 border-t border-[rgb(57_255_136/25%)] px-3.5 py-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          const v = input.current?.value ?? "";
          if (input.current) input.current.value = "";
          if (mode === "cmd" && v.trim()) {
            hist.current.push(v);
            hi.current = hist.current.length;
          }
          run(v);
        }}
      >
        <label htmlFor="hk-in" className="whitespace-nowrap text-[#39ff88]">
          {prompt}
        </label>
        <input
          ref={input}
          id="hk-in"
          type={mode === "pw" ? "password" : "text"}
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="off"
          className="min-w-0 flex-1 border-0 bg-transparent text-white caret-[#39ff88] outline-none"
          onKeyDown={(e) => {
            const el = e.currentTarget;
            if (e.key === "Escape") {
              setMinimised(true);
              return;
            }
            if (mode !== "cmd") return;
            if (e.key === "ArrowUp" && hi.current > 0) {
              e.preventDefault();
              el.value = hist.current[--hi.current];
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              hi.current = Math.min(hi.current + 1, hist.current.length);
              el.value = hist.current[hi.current] ?? "";
            } else if (e.key === "Tab") {
              e.preventDefault();
              const parts = el.value.split(" ");
              const last = parts.pop() ?? "";
              const pool = parts.length ? Object.keys(FILES) : CMDS;
              const m = pool.filter((c) => c.startsWith(last));
              if (m.length === 1) el.value = [...parts, m[0]].join(" ") + (parts.length ? "" : " ");
              else if (m.length > 1) print(m.join("   "), "dim");
            }
          }}
        />
      </form>
    </section>
  );
}

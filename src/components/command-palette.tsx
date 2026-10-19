"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isHacker, isPaused, revealFrom, say, setHacker, setPaused } from "@/lib/site-events";

type Cmd = { label: string; hint: string; run: () => void };
type PaletteProps = {
  projects: Array<{ slug: string; title: string; category: string }>;
  email: string;
  github: string;
  linkedin: string;
};

/** ⌘K / Ctrl+K / "/" — doubles as the mobile menu. */
export function CommandPalette({ projects, email, github, linkedin }: PaletteProps) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);

  const commands = useMemo<Cmd[]>(() => {
    const go = (hash: string) => () => router.push(`/${hash}`);
    return [
      ...[
        ["#work", "Work"],
        ["#about", "About"],
        ["#tools", "Toolbox"],
        ["#journal", "Journal"],
        ["#wins", "Wins & papers"],
        ["#certificates", "Certificates"],
        ["#notes", "Notebook"],
        ["#contact", "Say hello"],
      ].map(([hash, label]) => ({ label: `Go to ${label}`, hint: "go", run: go(hash) })),
      { label: "All projects", hint: "page", run: () => router.push("/projects") },
      { label: "All writing", hint: "page", run: () => router.push("/blog") },
      { label: "Achievements & papers", hint: "page", run: () => router.push("/achievements") },
      ...projects.map((p) => ({
        label: `Open ${p.title}`,
        hint: p.category.split(" · ")[0].toLowerCase(),
        run: () => router.push(`/projects/${p.slug}`),
      })),
      {
        label: "Copy email address",
        hint: "do",
        run: () =>
          navigator.clipboard.writeText(email).then(
            () => say("email copied — talk soon ✌"),
            () => (window.location.href = `mailto:${email}`)
          ),
      },
      {
        label: "Toggle light / dark",
        hint: "do",
        run: () =>
          revealFrom(() => {
            const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            try {
              localStorage.setItem("theme", next);
            } catch {}
          }),
      },
      { label: "Toggle hacker mode", hint: "`", run: () => setHacker(!isHacker()) },
      { label: "Pause / resume motion", hint: "do", run: () => setPaused(!isPaused()) },
      { label: "Open GitHub", hint: "link", run: () => window.open(github, "_blank", "noopener") },
      { label: "Open LinkedIn", hint: "link", run: () => window.open(linkedin, "_blank", "noopener") },
    ];
  }, [projects, email, github, linkedin, router]);

  const shown = commands.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(query.trim().toLowerCase()));
  const active = Math.min(sel, Math.max(shown.length - 1, 0));

  useEffect(() => {
    function open() {
      setQuery("");
      setSel(0);
      dialog.current?.showModal();
      input.current?.focus();
    }
    function onKey(e: KeyboardEvent) {
      const typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement as HTMLElement | null)?.tagName ?? "");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      } else if (e.key === "/" && !typing && !document.querySelector("dialog[open]")) {
        e.preventDefault();
        open();
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("site:cmdk", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("site:cmdk", open);
    };
  }, []);

  function run(i: number) {
    const c = shown[i];
    if (!c) return;
    dialog.current?.close();
    c.run();
  }

  return (
    <dialog
      ref={dialog}
      aria-label="Command menu"
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      className="m-auto mt-[14vh] w-[min(600px,calc(100vw-32px))] rounded-[18px] border-[1.5px] border-fg bg-paper p-0 text-fg shadow-[6px_8px_0_var(--fg)] backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <input
        ref={input}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSel(0);
        }}
        onKeyDown={(e) => {
          const n = Math.max(shown.length, 1);
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setSel((active + 1) % n);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSel((active - 1 + n) % n);
          } else if (e.key === "Enter") {
            e.preventDefault();
            run(active);
          }
        }}
        placeholder="Go somewhere, open a project, copy email…"
        aria-label="Search commands"
        aria-controls="cmdk-list"
        aria-activedescendant={shown.length ? `cmdk-${active}` : undefined}
        autoComplete="off"
        className="w-full border-0 border-b border-border-strong bg-transparent px-5 py-[18px] text-[17px] outline-none"
      />
      <ul id="cmdk-list" role="listbox" aria-label="Commands" className="max-h-[52vh] overflow-auto p-2">
        {shown.length === 0 && <li className="px-3 py-2.5 text-fg-faint">nothing here… yet</li>}
        {shown.map((c, i) => (
          <li
            key={c.label}
            id={`cmdk-${i}`}
            role="option"
            aria-selected={i === active}
            onClick={() => run(i)}
            onMouseMove={() => setSel(i)}
            className={`flex cursor-pointer justify-between gap-3 rounded-[10px] px-3 py-2.5 ${i === active ? "bg-m text-white" : ""}`}
          >
            <span>{c.label}</span>
            <span className={`font-hand text-lg ${i === active ? "text-white/80" : "text-fg-faint"}`}>{c.hint}</span>
          </li>
        ))}
      </ul>
    </dialog>
  );
}

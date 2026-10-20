// The hack-me game's rules, shared by the terminal (client) and the Hall of
// hackers server action. Flags are NOT secrets — the game is a puzzle and every
// flag is discoverable in the page by design. Requiring all of them just keeps
// the leaderboard from being a one-request spam target.

export const FLAGS: Record<string, string> = {
  "flag{1_view_source}": "read the page source",
  "flag{2_base64_is_not_encryption}": "decoded the secret",
  "flag{3_ash_was_the_password}": "got into the box over ssh",
  "flag{4_console_cowboy}": "poked the devtools console",
};
export const FLAG_LIST = Object.keys(FLAGS);

const HANDLE_RE = /^[a-z0-9_.-]{2,20}$/i;
const MIN_MS = 20_000; // nobody finds four flags in under 20 seconds
const MAX_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_HINTS = 20;

export type HallInput = { handle: string; flags: string[]; ms: number; hints: number };
export type HallCheck = { ok: true; value: HallInput } | { ok: false; error: string };

export function validateHallEntry(input: HallInput): HallCheck {
  const handle = String(input.handle ?? "").trim();
  if (!HANDLE_RE.test(handle)) {
    return { ok: false, error: "that handle won't fit on the wall (2–20 chars: letters, numbers, _ . -)." };
  }
  const flags = new Set(Array.isArray(input.flags) ? input.flags : []);
  if (flags.size !== FLAG_LIST.length || !FLAG_LIST.every((f) => flags.has(f))) {
    return { ok: false, error: "root the box first — all four flags." };
  }
  const ms = Math.round(Number(input.ms));
  if (!Number.isFinite(ms) || ms < MIN_MS || ms > MAX_MS) return { ok: false, error: "that time doesn't look real." };
  const hints = Math.round(Number(input.hints));
  if (!Number.isFinite(hints) || hints < 0 || hints > MAX_HINTS) {
    return { ok: false, error: "that hint count doesn't look real." };
  }
  return { ok: true, value: { handle, flags: FLAG_LIST, ms, hints } };
}

export function formatClock(ms: number) {
  const s = Math.round(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

import Image from "next/image";
import type { ProjectVisualKind } from "@/lib/content/projects";
import { cn } from "@/lib/utils";

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-bg-elevated",
        className
      )}
      role="img"
      aria-label="Concept visual placeholder — replace with a real product screenshot"
    >
      <div className="absolute inset-0 grain-noise opacity-40" aria-hidden="true" />
      {children}
      <span className="absolute bottom-2.5 right-3 font-mono text-[10px] tracking-wide text-fg-faint">
        [PROJECT SCREENSHOT]
      </span>
    </div>
  );
}

function AgentGraph() {
  const nodes = [
    [18, 30], [48, 14], [78, 26], [12, 62], [42, 52], [70, 66], [90, 48], [30, 84], [62, 88],
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 4], [2, 6], [3, 4], [4, 5], [5, 6], [3, 7], [4, 8], [5, 8],
  ];
  return (
    <Frame>
      <svg viewBox="0 0 100 100" className="h-4/5 w-4/5" aria-hidden="true">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            stroke="var(--accent)"
            strokeWidth="0.4"
            opacity="0.35"
          />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.6 : 1.6} fill="var(--accent)" opacity="0.85" />
        ))}
      </svg>
    </Frame>
  );
}

function Terminal() {
  const lines = [
    "[ 0.0001 ] ash-os boot: initializing bootloader",
    "[ 0.0043 ] cpu: entering long mode (x86-64)",
    "[ 0.0091 ] mem: mapping kernel address space",
    "[ 0.0158 ] fs: applying secure access policy",
    "[ 0.0203 ] kernel: handoff complete",
  ];
  return (
    <Frame className="bg-[#0d0d0f]">
      <div className="w-[86%] font-mono text-[11px] leading-relaxed text-left text-[#8fe3a1]">
        {lines.map((line, i) => (
          <p key={i} className="truncate">
            {line}
          </p>
        ))}
        <p className="mt-1 inline-flex items-center gap-1 text-fg-muted">
          <span className="h-3 w-1.5 animate-pulse bg-[#8fe3a1] motion-reduce:animate-none" />
        </p>
      </div>
    </Frame>
  );
}

function ProductUI() {
  return (
    <Frame>
      <div className="w-[82%] space-y-2">
        {[92, 74, 100, 58].map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md border border-border bg-bg-elevated-2 px-3 py-2.5"
          >
            <span className="h-5 w-5 shrink-0 rounded-full bg-accent-soft text-center text-[10px] font-semibold leading-5 text-accent">
              {96 - i * 3}
            </span>
            <span className="h-2 rounded-full bg-border-strong" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Dashboard() {
  const bars = [40, 70, 35, 90, 55, 65, 30];
  return (
    <Frame>
      <div className="grid w-[82%] grid-cols-3 gap-3">
        <div className="col-span-3 flex items-end gap-1.5 rounded-md border border-border bg-bg-elevated-2 p-3">
          {bars.map((h, i) => (
            <span
              key={i}
              className="w-full rounded-sm bg-accent"
              style={{ height: `${h}%`, opacity: 0.4 + i * 0.08 }}
            />
          ))}
        </div>
        {["Active", "Debug", "Idle"].map((label) => (
          <div key={label} className="rounded-md border border-border bg-bg-elevated-2 p-2 text-center">
            <p className="font-mono text-[10px] text-fg-faint">{label}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Kanban() {
  const columns = [
    { title: "Backlog", cards: 2 },
    { title: "In progress", cards: 3 },
    { title: "Done", cards: 2 },
  ];
  return (
    <Frame>
      <div className="grid w-[86%] grid-cols-3 gap-3">
        {columns.map((col) => (
          <div key={col.title} className="rounded-md border border-border bg-bg-elevated-2 p-2">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-wide text-fg-faint">
              {col.title}
            </p>
            <div className="space-y-1.5">
              {Array.from({ length: col.cards }).map((_, i) => (
                <div key={i} className="h-6 rounded border border-border bg-bg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Finance() {
  const path = "M0,30 L15,26 L30,32 L45,18 L60,22 L75,10 L90,14 L100,4";
  return (
    <Frame>
      <div className="w-[82%] space-y-3">
        <svg viewBox="0 0 100 36" className="h-16 w-full" aria-hidden="true">
          <path d={path} fill="none" stroke="var(--accent)" strokeWidth="1.4" />
        </svg>
        <div className="flex gap-3">
          {["Balance", "Saved", "Insights"].map((label) => (
            <div key={label} className="flex-1 rounded-md border border-border bg-bg-elevated-2 p-2 text-center">
              <p className="font-mono text-[9px] text-fg-faint">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Desktop() {
  return (
    <Frame>
      <div className="relative h-[70%] w-[70%]">
        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-lg border border-border bg-bg-elevated-2" />
        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-lg border border-border bg-bg-elevated-2" />
        <div className="absolute inset-0 flex flex-col rounded-lg border border-border-strong bg-bg-elevated-2">
          <div className="flex items-center gap-1.5 border-b border-border px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint" />
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint" />
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint" />
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Timer() {
  return (
    <Frame>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 40 40" className="h-24 w-24 -rotate-90" aria-hidden="true">
          <circle cx="20" cy="20" r="17" fill="none" stroke="var(--border-strong)" strokeWidth="3" />
          <circle
            cx="20"
            cy="20"
            r="17"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeDasharray={2 * Math.PI * 17}
            strokeDashoffset={2 * Math.PI * 17 * 0.32}
            strokeLinecap="round"
          />
        </svg>
        <div className="flex gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ background: i < 4 ? "var(--accent)" : "var(--border-strong)" }}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}

function QrCode() {
  const seed = [
    1, 1, 1, 0, 1, 0, 1, 1, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 1, 1, 0, 1, 1, 1, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 1,
    1, 1, 1, 0, 1, 1, 1, 0, 0,
    1, 0, 1, 0, 0, 0, 1, 0, 1,
    1, 1, 1, 0, 1, 0, 1, 1, 1,
  ];
  return (
    <Frame>
      <div className="grid grid-cols-9 gap-0.5 rounded-md bg-bg-elevated-2 p-4">
        {seed.map((on, i) => (
          <span
            key={i}
            className="h-2.5 w-2.5"
            style={{ background: on ? "var(--accent)" : "transparent" }}
          />
        ))}
      </div>
    </Frame>
  );
}

function Blog() {
  return (
    <Frame>
      <div className="w-[82%] space-y-4">
        <div className="h-3 w-2/5 rounded-full bg-border-strong" />
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-border" />
          <div className="h-2 w-11/12 rounded-full bg-border" />
          <div className="h-2 w-4/5 rounded-full bg-border" />
        </div>
        <div className="h-2 w-1/4 rounded-full bg-accent opacity-70" />
      </div>
    </Frame>
  );
}

function Game() {
  return (
    <Frame>
      <div className="relative h-[70%] w-[80%] overflow-hidden rounded-md border border-border bg-bg-elevated-2">
        <span className="absolute left-3 top-2 font-mono text-[10px] text-fg-faint">SCORE 0420</span>
        <span
          className="absolute h-3 w-3 rounded-sm"
          style={{ background: "var(--accent)", left: "20%", bottom: "30%" }}
        />
        {[45, 62, 78].map((left, i) => (
          <span
            key={i}
            className="absolute h-2.5 w-2.5 rounded-sm bg-border-strong"
            style={{ left: `${left}%`, bottom: `${18 + i * 14}%` }}
          />
        ))}
      </div>
    </Frame>
  );
}

const registry: Record<ProjectVisualKind, () => React.ReactElement> = {
  "agent-graph": AgentGraph,
  terminal: Terminal,
  "product-ui": ProductUI,
  dashboard: Dashboard,
  kanban: Kanban,
  finance: Finance,
  desktop: Desktop,
  timer: Timer,
  "qr-code": QrCode,
  blog: Blog,
  game: Game,
};

export function ProjectVisual({
  kind,
  imageUrl,
  alt,
  className,
}: {
  kind: ProjectVisualKind;
  imageUrl?: string | null;
  alt?: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <div
        className={cn(
          "relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-bg-elevated",
          className
        )}
      >
        <Image
          src={imageUrl}
          alt={alt ?? ""}
          fill
          sizes="(min-width: 768px) 720px, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  const Component = registry[kind];
  return (
    <div className={className}>
      <Component />
    </div>
  );
}

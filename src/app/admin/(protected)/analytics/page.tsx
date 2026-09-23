import Link from "next/link";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";

export const dynamic = "force-dynamic";

const RANGE_DAYS = 30;

type PageViewRow = { content_type: "project" | "article"; slug: string; created_at: string };
type ContentRow = { id: string; slug: string; title: string; views: number };

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function last30DayKeys() {
  const keys: string[] = [];
  for (let i = RANGE_DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
}

function formatDayLabel(key: string) {
  const [, m, d] = key.split("-");
  return `${d}/${m}`;
}

export default async function AnalyticsPage() {
  const supabase = getAdminSupabaseClient();
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - (RANGE_DAYS - 1));
  cutoff.setUTCHours(0, 0, 0, 0);

  const [viewsInRange, projects, articles] = await Promise.all([
    supabase
      .from("page_views")
      .select("content_type, slug, created_at")
      .gte("created_at", cutoff.toISOString()),
    supabase.from("projects").select("id, slug, title, views"),
    supabase.from("articles").select("id, slug, title, views"),
  ]);

  const rows = (viewsInRange.data ?? []) as PageViewRow[];
  const projectRows = (projects.data ?? []) as ContentRow[];
  const articleRows = (articles.data ?? []) as ContentRow[];

  const contentBySlug = new Map<
    string,
    { title: string; href: string; type: "project" | "article" }
  >();
  for (const p of projectRows) {
    contentBySlug.set(`project:${p.slug}`, { title: p.title, href: `/admin/projects/${p.id}`, type: "project" });
  }
  for (const a of articleRows) {
    contentBySlug.set(`article:${a.slug}`, { title: a.title, href: `/admin/articles/${a.id}`, type: "article" });
  }

  const dayKeys = last30DayKeys();
  const dailyCounts = new Map<string, number>(dayKeys.map((k) => [k, 0]));
  const perSlugCounts = new Map<string, number>();
  let projectViewsInRange = 0;
  let articleViewsInRange = 0;

  for (const row of rows) {
    const key = dayKey(row.created_at);
    if (dailyCounts.has(key)) dailyCounts.set(key, (dailyCounts.get(key) ?? 0) + 1);

    const slugKey = `${row.content_type}:${row.slug}`;
    perSlugCounts.set(slugKey, (perSlugCounts.get(slugKey) ?? 0) + 1);

    if (row.content_type === "project") projectViewsInRange++;
    else articleViewsInRange++;
  }

  const chart = dayKeys.map((key) => ({ key, count: dailyCounts.get(key) ?? 0 }));
  const maxDaily = Math.max(1, ...chart.map((d) => d.count));

  const topInRange = [...perSlugCounts.entries()]
    .map(([slugKey, count]) => ({ slugKey, count, meta: contentBySlug.get(slugKey) }))
    .filter((r) => r.meta)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const totalLifetimeViews =
    projectRows.reduce((s, p) => s + (p.views ?? 0), 0) + articleRows.reduce((s, a) => s + (a.views ?? 0), 0);
  const totalRangeViews = projectViewsInRange + articleViewsInRange;

  const stats = [
    { label: `Views (last ${RANGE_DAYS}d)`, value: totalRangeViews },
    { label: "Lifetime views", value: totalLifetimeViews },
    { label: "Project views (30d)", value: projectViewsInRange },
    { label: "Article views (30d)", value: articleViewsInRange },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight text-fg">Analytics</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Page views logged on every project and article visit. Last {RANGE_DAYS} days shown below.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-fg-faint">{s.label}</p>
            <p className="mt-2 font-display text-3xl tracking-tight font-tabular text-fg">
              {s.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl tracking-tight text-fg">Views per day</h2>
        <div className="mt-4 rounded-xl border border-border p-5">
          <div className="flex h-32 items-end gap-[3px]">
            {chart.map((d) => (
              <div
                key={d.key}
                title={`${d.key}: ${d.count} view${d.count === 1 ? "" : "s"}`}
                className="flex-1 rounded-sm bg-accent/70 transition-colors hover:bg-accent"
                style={{ height: `${Math.max(3, (d.count / maxDaily) * 100)}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-fg-faint">
            <span>{formatDayLabel(chart[0].key)}</span>
            <span>{formatDayLabel(chart[chart.length - 1].key)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl tracking-tight text-fg">Top content (last {RANGE_DAYS}d)</h2>
        <div className="mt-4 divide-y divide-border border-y border-border">
          {topInRange.length === 0 && <p className="py-5 text-sm text-fg-muted">No views yet in this range.</p>}
          {topInRange.map((item) => (
            <Link
              key={item.slugKey}
              href={item.meta!.href}
              className="flex items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-fg"
            >
              <div className="min-w-0">
                <p className="truncate text-fg">{item.meta!.title}</p>
                <p className="text-xs capitalize text-fg-faint">{item.meta!.type}</p>
              </div>
              <span className="shrink-0 font-tabular text-xs text-fg-faint">
                {item.count.toLocaleString()} view{item.count === 1 ? "" : "s"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

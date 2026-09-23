import Link from "next/link";
import { entities } from "@/lib/admin/entities";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";

export const dynamic = "force-dynamic";

async function countRows(table: string, filter?: Record<string, string | boolean>) {
  const supabase = getAdminSupabaseClient();
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      query = query.eq(key, value);
    }
  }
  const { count } = await query;
  return count ?? 0;
}

async function sumViews(table: string) {
  const supabase = getAdminSupabaseClient();
  const { data } = await supabase.from(table).select("views");
  return (data ?? []).reduce((sum, row) => sum + (Number((row as { views: number }).views) || 0), 0);
}

type RecentItem = { id: string; title: string; type: string; href: string; updatedAt: string };

async function recentForEntity(entity: (typeof entities)[number]): Promise<RecentItem[]> {
  const supabase = getAdminSupabaseClient();
  let query = supabase
    .from(entity.table)
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(5);
  if (entity.filter) {
    for (const [key, value] of Object.entries(entity.filter)) {
      query = query.eq(key, value);
    }
  }
  const { data } = await query;
  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id),
    title: String(row[entity.titleField] ?? "(untitled)"),
    type: entity.label,
    href: `/admin/${entity.key}/${row.id}`,
    updatedAt: String(row.updated_at),
  }));
}

type TopItem = { id: string; title: string; type: string; views: number; href: string };

async function topContent(): Promise<TopItem[]> {
  const supabase = getAdminSupabaseClient();
  const [projects, articles] = await Promise.all([
    supabase.from("projects").select("id, title, views").order("views", { ascending: false }).limit(5),
    supabase.from("articles").select("id, title, views").order("views", { ascending: false }).limit(5),
  ]);
  const combined: TopItem[] = [
    ...((projects.data ?? []) as Array<{ id: string; title: string; views: number }>).map((p) => ({
      id: p.id,
      title: p.title,
      type: "Project",
      views: p.views,
      href: `/admin/projects/${p.id}`,
    })),
    ...((articles.data ?? []) as Array<{ id: string; title: string; views: number }>).map((a) => ({
      id: a.id,
      title: a.title,
      type: "Article",
      views: a.views,
      href: `/admin/articles/${a.id}`,
    })),
  ];
  return combined.sort((a, b) => b.views - a.views).slice(0, 5);
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const [counts, messageCount, unreadCount, projectViews, articleViews, recentByEntity, top] =
    await Promise.all([
      Promise.all(entities.map((e) => countRows(e.table, e.filter))),
      countRows("contact_submissions"),
      countRows("contact_submissions", { is_read: false }),
      sumViews("projects"),
      sumViews("articles"),
      Promise.all(entities.map(recentForEntity)),
      topContent(),
    ]);

  const totalItems = counts.reduce((a, b) => a + b, 0);
  const totalViews = projectViews + articleViews;
  const recent = recentByEntity
    .flat()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  const stats = [
    { label: "Total content", value: totalItems },
    { label: "Total views", value: totalViews },
    { label: "Unread messages", value: unreadCount, accent: unreadCount > 0 },
    { label: "Messages", value: messageCount },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight text-fg">Dashboard</h1>
      <p className="mt-1 text-sm text-fg-muted">Everything here is live on the site immediately after saving.</p>

      {params.saved === "settings" && (
        <p className="mt-4 rounded-lg border border-accent/30 bg-accent-soft px-4 py-2.5 text-sm text-fg">
          Site settings saved.
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-fg-faint">{s.label}</p>
            <p
              className={`mt-2 font-display text-3xl tracking-tight font-tabular ${
                s.accent ? "text-accent" : "text-fg"
              }`}
            >
              {s.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="font-display text-xl tracking-tight text-fg">Recently updated</h2>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {recent.length === 0 && <p className="py-5 text-sm text-fg-muted">Nothing yet.</p>}
            {recent.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.href}
                className="flex items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-fg"
              >
                <div className="min-w-0">
                  <p className="truncate text-fg">{item.title}</p>
                  <p className="text-xs text-fg-faint">{item.type}</p>
                </div>
                <span className="shrink-0 text-xs text-fg-faint">{timeAgo(item.updatedAt)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl tracking-tight text-fg">Top content</h2>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {top.length === 0 && <p className="py-5 text-sm text-fg-muted">No views yet.</p>}
            {top.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.href}
                className="flex items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-fg"
              >
                <div className="min-w-0">
                  <p className="truncate text-fg">{item.title}</p>
                  <p className="text-xs text-fg-faint">{item.type}</p>
                </div>
                <span className="shrink-0 font-tabular text-xs text-fg-faint">
                  {item.views.toLocaleString()} views
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

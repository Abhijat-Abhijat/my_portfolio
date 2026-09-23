import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntity } from "@/lib/admin/entities";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";
import { ReorderableList, type ReorderableRow } from "@/components/admin/reorderable-list";

export const dynamic = "force-dynamic";

export default async function EntityListPage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity: entityKey } = await params;
  const entity = getEntity(entityKey);
  if (!entity) notFound();

  const supabase = getAdminSupabaseClient();
  let query = supabase.from(entity.table).select("*").order(entity.orderBy, { ascending: true });
  if (entity.filter) {
    for (const [key, value] of Object.entries(entity.filter)) {
      query = query.eq(key, value);
    }
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows: ReorderableRow[] = (data as Array<Record<string, unknown>>).map((row) => ({
    id: String(row.id),
    title: String(row[entity.titleField] ?? "(untitled)"),
    subtitle: entity.subtitleField ? String(row[entity.subtitleField] ?? "") : "",
    toggleValue: entity.toggleField ? Boolean(row[entity.toggleField.name]) : undefined,
  }));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-fg-muted transition-colors hover:text-fg">
            ← Dashboard
          </Link>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-fg">{entity.label}</h1>
          {rows.length > 1 && (
            <p className="mt-1 text-xs text-fg-faint">Drag ⠿, or use ▲▼, to reorder.</p>
          )}
        </div>
        <Link
          href={`/admin/${entity.key}/new`}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg"
        >
          New
        </Link>
      </div>

      <div className="mt-8">
        <ReorderableList entityKey={entity.key} initialRows={rows} toggleField={entity.toggleField} />
      </div>
    </div>
  );
}

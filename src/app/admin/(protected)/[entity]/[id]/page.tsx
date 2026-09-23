import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntity, type FieldConfig } from "@/lib/admin/entities";
import { saveEntity } from "@/lib/admin/actions";
import { arrayToLines, arrayToPairs } from "@/lib/admin/field-codec";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";

export const dynamic = "force-dynamic";

function fieldDefaultValue(field: FieldConfig, row: Record<string, unknown> | null): string {
  if (!row) return "";
  const value = row[field.name];

  switch (field.type) {
    case "lines":
      return arrayToLines(value as string[]);
    case "pairs":
      return arrayToPairs(value as Array<Record<string, string>>, field.pairKeys!);
    case "boolean":
      return "";
    default:
      return value == null ? "" : String(value);
  }
}

function Field({ field, row }: { field: FieldConfig; row: Record<string, unknown> | null }) {
  const id = `field-${field.name}`;
  const baseInputClass =
    "mt-1.5 w-full rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-sm text-fg outline-none focus-visible:border-accent";

  if (field.type === "boolean") {
    const checked = row ? Boolean(row[field.name]) : false;
    return (
      <label className="flex items-center gap-2.5 text-sm text-fg">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={checked}
          className="h-4 w-4 rounded border-border-strong accent-[--accent]"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "image") {
    const currentUrl = row ? (row.image_url as string | null) : null;
    return (
      <div>
        <label htmlFor={id} className="block text-sm text-fg-muted">
          {field.label}
        </label>
        {currentUrl && (
          <div className="mt-2 flex items-center gap-3">
            <Image
              src={currentUrl}
              alt=""
              width={96}
              height={64}
              className="h-16 w-24 rounded-md border border-border object-cover"
            />
            <label className="flex items-center gap-1.5 text-xs text-fg-muted">
              <input type="checkbox" name="remove_image" value="1" className="h-3.5 w-3.5" />
              Remove current image
            </label>
          </div>
        )}
        <input id={id} name="image" type="file" accept="image/*" className={baseInputClass} />
      </div>
    );
  }

  const commonLabel = (
    <label htmlFor={id} className="block text-sm text-fg-muted">
      {field.label}
      {field.required && <span className="text-accent"> *</span>}
    </label>
  );

  if (field.type === "select") {
    return (
      <div>
        {commonLabel}
        <select
          id={id}
          name={field.name}
          required={field.required}
          defaultValue={fieldDefaultValue(field, row)}
          className={baseInputClass}
        >
          <option value="" disabled>
            Select…
          </option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "textarea" || field.type === "markdown" || field.type === "lines" || field.type === "pairs") {
    return (
      <div>
        {commonLabel}
        {field.help && <p className="mt-1 text-xs text-fg-faint">{field.help}</p>}
        <textarea
          id={id}
          name={field.name}
          required={field.required}
          defaultValue={fieldDefaultValue(field, row)}
          rows={field.type === "markdown" ? 16 : field.type === "textarea" ? 4 : 3}
          className={`${baseInputClass} font-mono text-[13px] leading-relaxed`}
        />
      </div>
    );
  }

  return (
    <div>
      {commonLabel}
      <input
        id={id}
        name={field.name}
        type={field.type === "number" ? "number" : "text"}
        required={field.required}
        defaultValue={fieldDefaultValue(field, row)}
        className={baseInputClass}
      />
    </div>
  );
}

export default async function EntityFormPage({
  params,
}: {
  params: Promise<{ entity: string; id: string }>;
}) {
  const { entity: entityKey, id } = await params;
  const entity = getEntity(entityKey);
  if (!entity) notFound();

  let row: Record<string, unknown> | null = null;
  if (id !== "new") {
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.from(entity.table).select("*").eq("id", id).single();
    if (error || !data) notFound();
    row = data;
  }

  const boundSave = saveEntity.bind(null, entity.key, id === "new" ? null : id);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/admin/${entity.key}`} className="text-sm text-fg-muted transition-colors hover:text-fg">
        ← {entity.label}
      </Link>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-fg">
        {id === "new" ? `New ${entity.label.replace(/s$/, "")}` : `Edit`}
      </h1>

      <form action={boundSave} className="mt-8 space-y-6">
        {entity.fields.map((field) => (
          <Field key={field.name} field={field} row={row} />
        ))}

        <div className="flex items-center gap-4 border-t border-border pt-6">
          <button
            type="submit"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg"
          >
            Save
          </button>
          <Link href={`/admin/${entity.key}`} className="text-sm text-fg-muted transition-colors hover:text-fg">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getEntity } from "@/lib/admin/entities";
import { linesToArray, pairsToArray } from "@/lib/admin/field-codec";
import { requireAdminSession } from "@/lib/admin/require-session";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";

const STORAGE_BUCKET = "site-assets";

function revalidatePublicPaths() {
  revalidatePath("/");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

async function uploadImage(table: string, file: File) {
  const supabase = getAdminSupabaseClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${table}/${randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, bytes, { contentType: file.type || undefined, upsert: false });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function saveEntity(entityKey: string, id: string | null, formData: FormData) {
  await requireAdminSession();

  const entity = getEntity(entityKey);
  if (!entity) throw new Error(`Unknown entity: ${entityKey}`);

  const supabase = getAdminSupabaseClient();
  const row: Record<string, unknown> = { ...entity.fixedValues };

  for (const field of entity.fields) {
    if (field.type === "image") continue; // handled separately below

    const raw = formData.get(field.name);

    switch (field.type) {
      case "lines":
        row[field.name] = linesToArray(String(raw ?? ""));
        break;
      case "pairs":
        row[field.name] = pairsToArray(String(raw ?? ""), field.pairKeys!);
        break;
      case "boolean":
        row[field.name] = raw === "on" || raw === "true";
        break;
      case "number":
        row[field.name] = raw ? Number(raw) : 0;
        break;
      case "text":
      case "textarea":
      case "markdown":
      case "select":
        row[field.name] = String(raw ?? "").trim() || null;
        if (field.required && !row[field.name]) {
          throw new Error(`${field.label} is required.`);
        }
        break;
    }
  }

  if (entity.imageField) {
    const file = formData.get("image");
    const removeImage = formData.get("remove_image") === "1";
    if (file instanceof File && file.size > 0) {
      row[entity.imageField] = await uploadImage(entity.table, file);
    } else if (removeImage) {
      row[entity.imageField] = null;
    }
  }

  const isNew = !id || id === "new";
  const { error } = isNew
    ? await supabase.from(entity.table).insert(row)
    : await supabase.from(entity.table).update(row).eq("id", id);

  if (error) throw new Error(`Save failed: ${error.message}`);

  revalidatePublicPaths();
  redirect(`/admin/${entityKey}`);
}

export async function deleteEntity(entityKey: string, id: string) {
  await requireAdminSession();

  const entity = getEntity(entityKey);
  if (!entity) throw new Error(`Unknown entity: ${entityKey}`);

  const supabase = getAdminSupabaseClient();
  const { error } = await supabase.from(entity.table).delete().eq("id", id);
  if (error) throw new Error(`Delete failed: ${error.message}`);

  revalidatePublicPaths();
  redirect(`/admin/${entityKey}`);
}

export async function toggleEntityField(entityKey: string, id: string, value: boolean) {
  await requireAdminSession();

  const entity = getEntity(entityKey);
  if (!entity) throw new Error(`Unknown entity: ${entityKey}`);
  if (!entity.toggleField) throw new Error(`${entityKey} has no toggle field.`);

  const supabase = getAdminSupabaseClient();
  const { error } = await supabase
    .from(entity.table)
    .update({ [entity.toggleField.name]: value })
    .eq("id", id);
  if (error) throw new Error(`Update failed: ${error.message}`);

  revalidatePublicPaths();
  revalidatePath(`/admin/${entityKey}`);
}

export async function reorderEntities(entityKey: string, orderedIds: string[]) {
  await requireAdminSession();

  const entity = getEntity(entityKey);
  if (!entity) throw new Error(`Unknown entity: ${entityKey}`);

  const supabase = getAdminSupabaseClient();
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from(entity.table).update({ sort_order: index }).eq("id", id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(`Reorder failed: ${failed.error.message}`);

  revalidatePublicPaths();
  revalidatePath(`/admin/${entityKey}`);
}

export async function saveSiteSettings(formData: FormData) {
  await requireAdminSession();

  const supabase = getAdminSupabaseClient();
  const fields = ["name", "role", "tagline", "location", "email", "github", "linkedin", "status", "site_url"];
  const row: Record<string, string> = {};
  for (const f of fields) {
    row[f] = String(formData.get(f) ?? "").trim();
  }

  const { error } = await supabase.from("site_settings").update(row).eq("id", 1);
  if (error) throw new Error(`Save failed: ${error.message}`);

  revalidatePublicPaths();
  redirect("/admin?saved=settings");
}

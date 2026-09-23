"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/require-session";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";

export async function setMessageRead(id: string, read: boolean) {
  await requireAdminSession();
  const supabase = getAdminSupabaseClient();
  const { error } = await supabase.from("contact_submissions").update({ is_read: read }).eq("id", id);
  if (error) throw new Error(`Update failed: ${error.message}`);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdminSession();
  const supabase = getAdminSupabaseClient();
  const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
  if (error) throw new Error(`Delete failed: ${error.message}`);
  revalidatePath("/admin/messages");
}

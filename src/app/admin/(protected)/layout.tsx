import { logout } from "@/lib/admin/auth-actions";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";
import { AdminShell } from "@/components/admin/admin-shell";

async function getUnreadCount() {
  const supabase = getAdminSupabaseClient();
  const { count } = await supabase
    .from("contact_submissions")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);
  return count ?? 0;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const unreadCount = await getUnreadCount();

  return (
    <AdminShell unreadCount={unreadCount} logoutAction={logout}>
      {children}
    </AdminShell>
  );
}

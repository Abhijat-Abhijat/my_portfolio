import Link from "next/link";
import { saveSiteSettings } from "@/lib/admin/actions";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";

export const dynamic = "force-dynamic";

const FIELDS: Array<{ name: string; label: string }> = [
  { name: "name", label: "Name" },
  { name: "role", label: "Role / positioning line" },
  { name: "tagline", label: "Tagline" },
  { name: "location", label: "Location" },
  { name: "email", label: "Email" },
  { name: "github", label: "GitHub URL" },
  { name: "linkedin", label: "LinkedIn URL" },
  { name: "status", label: "Nav status text (e.g. \"Building AI systems\")" },
  { name: "site_url", label: "Site URL" },
];

export default async function AdminSettingsPage() {
  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (error || !data) throw new Error(error?.message ?? "Site settings row not found.");

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin" className="text-sm text-fg-muted transition-colors hover:text-fg">
        ← Dashboard
      </Link>
      <h1 className="mt-2 font-display text-3xl tracking-tight text-fg">Site settings</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Hero credibility line, nav status dot, and contact links shown across the site.
      </p>

      <form action={saveSiteSettings} className="mt-8 space-y-6">
        {FIELDS.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="block text-sm text-fg-muted">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type="text"
              defaultValue={String((data as Record<string, unknown>)[f.name] ?? "")}
              className="mt-1.5 w-full rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-sm text-fg outline-none focus-visible:border-accent"
            />
          </div>
        ))}

        <div className="flex items-center gap-4 border-t border-border pt-6">
          <button
            type="submit"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

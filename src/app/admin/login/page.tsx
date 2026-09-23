import { login } from "@/lib/admin/auth-actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/admin";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <form
        action={login}
        className="w-full max-w-sm rounded-2xl border border-border bg-bg-elevated p-8"
      >
        <h1 className="font-display text-2xl tracking-tight text-fg">Admin</h1>
        <p className="mt-1 text-sm text-fg-muted">Sign in to edit site content.</p>

        <input type="hidden" name="next" value={next} />

        <label className="mt-6 block text-sm text-fg-muted" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="mt-1.5 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-fg outline-none focus-visible:border-accent"
        />

        {params.error && (
          <p className="mt-3 text-sm text-danger">Wrong password. Try again.</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

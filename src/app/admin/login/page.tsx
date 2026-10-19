import Image from "next/image";
import { login } from "@/lib/admin/auth-actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/admin";

  return (
    <div className="grid min-h-screen items-center gap-10 px-6 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)] md:px-16">
      <div className="hidden justify-self-end md:block" aria-hidden="true">
        <Image src="/avatars/toolbox.webp" alt="" width={640} height={640} className="sticker-img w-[min(420px,40vw)]" priority />
      </div>
      <form action={login} className="ink-card w-full max-w-sm justify-self-center p-8 md:justify-self-start">
        <span className="kicker">back to the workshop</span>
        <h1 className="text-4xl leading-tight text-fg">Admin</h1>
        <p className="mt-1 text-sm text-fg-muted">Sign in to edit site content.</p>

        <input type="hidden" name="next" value={next} />

        <label className="mt-6 block text-sm font-semibold text-fg-muted" htmlFor="password">
          Password
        </label>
        <input id="password" name="password" type="password" required autoFocus className="field-ink" />

        {params.error && <p className="mt-3 text-sm text-danger">Wrong password. Try again.</p>}

        <button type="submit" className="btn-ink mt-6 w-full justify-center">
          Sign in <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  );
}

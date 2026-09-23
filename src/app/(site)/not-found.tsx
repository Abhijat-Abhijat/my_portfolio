import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">404</p>
      <h1 className="mt-4 text-balance font-display text-4xl tracking-tight text-fg sm:text-5xl">
        Nothing built here yet.
      </h1>
      <p className="mt-4 max-w-md text-balance text-base text-fg-muted">
        That page doesn&rsquo;t exist — moved, renamed, or never was.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5"
      >
        ← Back home
      </Link>
    </div>
  );
}

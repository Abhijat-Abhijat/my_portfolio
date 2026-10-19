"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";

type AdminShellProps = {
  unreadCount: number;
  logoutAction: () => void;
  children: React.ReactNode;
};

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5">
      <Image src="/avatars/toolbox.webp" alt="" width={34} height={34} className="h-[34px] w-[34px] rounded-full bg-m object-cover object-[50%_15%]" />
      <span className="font-display text-xl leading-none text-fg">
        Abhijat<span className="text-m">.</span>
      </span>
      <span className="tape -rotate-3 px-2 pb-0.5 font-hand text-lg leading-tight">admin</span>
    </Link>
  );
}

export function AdminShell({ unreadCount, logoutAction, children }: AdminShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-border bg-bg px-4 py-3 md:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {open && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] shrink-0 flex-col border-r-[1.5px] border-fg bg-paper transition-transform duration-200 md:sticky md:top-0 md:z-auto md:h-screen md:w-64 md:max-w-none md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Brand />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <AdminSidebar unreadCount={unreadCount} />
        <div className="shrink-0 space-y-1 border-t border-border px-3 py-4 text-sm">
          <Link href="/" target="_blank" className="block rounded-lg px-3 py-2 text-fg-muted transition-colors hover:bg-bg-elevated-2 hover:text-fg">
            View site ↗
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="block w-full rounded-lg px-3 py-2 text-left text-fg-muted transition-colors hover:bg-bg-elevated-2 hover:text-fg"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}

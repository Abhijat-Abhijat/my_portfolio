"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { entities } from "@/lib/admin/entities";

type SidebarProps = {
  unreadCount: number;
};

function NavLink({
  href,
  label,
  badge,
  exact,
}: {
  href: string;
  label: string;
  badge?: number;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-bg-elevated text-fg font-medium"
          : "text-fg-muted hover:bg-bg-elevated hover:text-fg"
      }`}
    >
      <span className="truncate">{label}</span>
      {!!badge && (
        <span className="rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-medium leading-none text-accent-fg">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function AdminSidebar({ unreadCount }: SidebarProps) {
  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-fg-faint">
          Overview
        </p>
        <NavLink href="/admin" label="Dashboard" exact />
        <NavLink href="/admin/analytics" label="Analytics" />
        <NavLink href="/admin/messages" label="Messages" badge={unreadCount} />
      </div>

      <div className="space-y-1">
        <p className="px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-fg-faint">
          Content
        </p>
        {entities.map((entity) => (
          <NavLink key={entity.key} href={`/admin/${entity.key}`} label={entity.label} />
        ))}
      </div>

      <div className="mt-auto space-y-1">
        <p className="px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-fg-faint">
          Site
        </p>
        <NavLink href="/admin/settings" label="Site settings" />
      </div>
    </nav>
  );
}

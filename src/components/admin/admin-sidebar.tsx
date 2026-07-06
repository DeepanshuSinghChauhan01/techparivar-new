"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Clients", href: "/admin/clients", icon: Users },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col py-8 px-6">
      <Link
        href="/admin"
        className="mb-8 flex items-center gap-2.5"
        onClick={onNavigate}
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="size-4" />
        </span>
        <div>
          <p className="font-portal-display text-base font-bold leading-tight">
            TechParivar
          </p>
          <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
            Admin Console
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1">
        {adminNav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-on-surface-variant transition-all hover:bg-white/5 hover:text-foreground",
                active &&
                  "border-r-2 border-primary bg-white/5 font-bold text-primary"
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

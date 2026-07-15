"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  LifeBuoy,
  Folder,
  FileSpreadsheet,
  ShieldCheck,
  Users,
  CalendarClock,
  BookOpen,
  Command,
  Bell,
  Settings,
  Zap,
  Handshake,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { portalNav } from "@/data/portal";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FolderKanban,
  LifeBuoy,
  Folder,
  FileSpreadsheet,
  ShieldCheck,
  Users,
  CalendarClock,
  BookOpen,
  Handshake,
};

export function PortalSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col py-8 px-6">
      <Link href="/portal/dashboard" className="mb-8 flex items-center gap-2.5" onClick={onNavigate}>
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="size-4" />
        </span>
        <div>
          <p className="font-portal-display text-base font-bold leading-tight">TechParivar</p>
          <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
            Client Portal
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1">
        {portalNav.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          const active =
            pathname === item.href || (item.href !== "/portal/dashboard" && pathname.startsWith(item.href));
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

      <div className="space-y-3 border-t border-border/60 pt-5">
        <button className="flex w-full items-center justify-between rounded-lg border border-border bg-surface-container-low px-4 py-2.5 text-xs font-medium text-on-surface-variant transition-colors hover:text-foreground">
          <span className="flex items-center gap-2">
            <Command className="size-3.5" />
            Command Palette
          </span>
          <kbd className="rounded border border-border px-1.5 py-0.5 font-portal-data text-[10px]">
            ⌘K
          </kbd>
        </button>
        <Link
          href="/portal/notifications"
          onClick={onNavigate}
          className="flex items-center gap-3 px-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-foreground"
        >
          <Bell className="size-[18px]" />
          Notifications
        </Link>
        <Link
          href="/portal/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 px-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-foreground"
        >
          <Settings className="size-[18px]" />
          Settings
        </Link>
      </div>
    </div>
  );
}

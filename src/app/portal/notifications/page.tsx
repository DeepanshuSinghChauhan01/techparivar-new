import type { Metadata } from "next";
import {
  GitMerge,
  MessageCircle,
  FileText,
  CalendarClock,
  ShieldCheck,
  Receipt,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { notifications } from "@/data/portal";

export const metadata: Metadata = {
  title: "Notifications | TechParivar Client Portal",
};

const iconMap: Record<string, LucideIcon> = {
  GitMerge,
  MessageCircle,
  FileText,
  CalendarClock,
  ShieldCheck,
  Receipt,
};

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Notifications</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Everything happening across your projects, tickets, and account.
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge>{unreadCount} New</Badge>
        )}
      </div>

      <Card className="gap-0 p-0">
        {notifications.map((notification, index) => {
          const Icon = iconMap[notification.icon];
          return (
            <div
              key={notification.id}
              className={`flex items-start gap-4 px-5 py-4 ${
                index !== notifications.length - 1 ? "border-b border-border/60" : ""
              } ${!notification.read ? "bg-white/[0.02]" : ""}`}
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{notification.title}</p>
                  {!notification.read && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="mt-0.5 text-sm text-on-surface-variant">{notification.description}</p>
              </div>
              <span className="shrink-0 font-portal-data text-[11px] text-on-surface-variant">
                {notification.time}
              </span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

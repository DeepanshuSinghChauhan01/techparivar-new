import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  GitMerge,
  Image as ImageIcon,
  Search,
  ShoppingCart,
  Gauge,
  Video,
  FolderKanban,
  Rocket,
  LifeBuoy,
  Folder,
  Download,
} from "lucide-react";

import { Button } from "@/components/portal-ui/button";
import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { requireUser } from "@/lib/auth-helpers";
import { getMyClientProfileId } from "@/lib/ownership";
import { prisma } from "@/lib/prisma";
import {
  currentUser,
  storeHealth,
  nextMeeting,
  recentUpdates,
  storeSpotlight,
} from "@/data/portal";

export const metadata: Metadata = {
  title: "Dashboard | TechParivar Client Portal",
};

const updateIconMap = {
  FileText,
  GitMerge,
  Image: ImageIcon,
};

const metricIconMap = {
  Gauge,
  Search,
  ShoppingCart,
};

const statusVariant = {
  PLANNING: "secondary",
  ACTIVE: "success",
  ON_HOLD: "warning",
  COMPLETED: "info",
  CANCELLED: "destructive",
} as const;

const priorityVariant = {
  LOW: "secondary",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "destructive",
} as const;

function titleCase(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0] || "there";
  const clientProfileId = await getMyClientProfileId(user);

  const [
    totalProjects,
    activeProjects,
    openTicketsCount,
    availableFilesCount,
    recentProjects,
    openTickets,
    recentFiles,
  ] = clientProfileId
    ? await Promise.all([
        prisma.project.count({ where: { clientId: clientProfileId } }),
        prisma.project.count({
          where: { clientId: clientProfileId, status: "ACTIVE" },
        }),
        prisma.ticket.count({
          where: {
            clientId: clientProfileId,
            status: { in: ["OPEN", "IN_PROGRESS", "WAITING_FOR_CLIENT"] },
          },
        }),
        prisma.managedFile.count({
          where: { clientId: clientProfileId, visibleToClient: true, status: "ACTIVE" },
        }),
        prisma.project.findMany({
          where: { clientId: clientProfileId },
          orderBy: { updatedAt: "desc" },
          take: 3,
          select: { id: true, name: true, status: true, priority: true, progress: true, dueDate: true },
        }),
        prisma.ticket.findMany({
          where: {
            clientId: clientProfileId,
            status: { in: ["OPEN", "IN_PROGRESS", "WAITING_FOR_CLIENT"] },
          },
          orderBy: { updatedAt: "desc" },
          take: 3,
          select: { id: true, subject: true, priority: true, updatedAt: true },
        }),
        prisma.managedFile.findMany({
          where: { clientId: clientProfileId, visibleToClient: true, status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: 3,
          select: { id: true, displayName: true, createdAt: true },
        }),
      ])
    : [0, 0, 0, 0, [], [], []];

  const workStats = [
    { label: "Total Projects", value: totalProjects, icon: FolderKanban },
    { label: "Active Projects", value: activeProjects, icon: Rocket },
    { label: "Open Tickets", value: openTicketsCount, icon: LifeBuoy },
    { label: "Available Files", value: availableFilesCount, icon: Folder },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Welcome banner */}
      <Card className="flex-row flex-wrap items-center justify-between gap-6 border-border/80 bg-surface-container p-8">
        <div className="max-w-lg">
          <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
            Good morning, {firstName}.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant md:text-base">
            {storeHealth.summary.split(storeHealth.performanceDelta)[0]}
            <span className="font-semibold text-mint-green">
              {storeHealth.performanceDelta}
            </span>
            {storeHealth.summary.split(storeHealth.performanceDelta)[1]}
          </p>
          <Button variant="secondary" className="mt-6" asChild>
            <Link href="/portal/store-health">
              View Report <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="flex gap-6 rounded-xl border border-border/60 bg-surface-container-low px-6 py-5">
          <div>
            <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Active Store
            </p>
            <p className="mt-1 font-portal-display text-lg font-bold">
              {currentUser.activeStore}
            </p>
          </div>
          <div className="w-px bg-border/60" />
          <div>
            <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Global Rank
            </p>
            <p className="mt-1 font-portal-display text-lg font-bold text-primary">
              {currentUser.globalRank}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2.2fr_1fr]">
        <div className="space-y-5">
          {/* Store health metric cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {storeHealth.metrics.map((metric) => {
              const Icon = metricIconMap[metric.icon as keyof typeof metricIconMap];
              return (
                <Card key={metric.key} className="gap-4 p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-xs font-semibold text-mint-green">
                      {metric.delta}
                    </span>
                  </div>
                  <div>
                    <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
                      {metric.label}
                    </p>
                    <p className="mt-1 font-portal-display text-2xl font-bold">
                      {metric.value}
                      <span className="text-sm font-medium text-on-surface-variant">
                        {" "}
                        {metric.unit ?? `/ ${metric.max}`}
                      </span>
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Project / ticket / file stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="gap-4 p-5">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
                      {stat.label}
                    </p>
                    <p className="mt-1 font-portal-display text-2xl font-bold">
                      {stat.value}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Current projects */}
          <Card className="gap-5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-portal-display text-lg font-semibold">Current Projects</h2>
                <p className="text-xs text-on-surface-variant">Recently updated engagements</p>
              </div>
              <Link
                href="/portal/projects"
                className="text-sm font-semibold text-primary"
              >
                View All
              </Link>
            </div>
            {recentProjects.length === 0 ? (
              <p className="py-6 text-center text-sm text-on-surface-variant">
                No projects yet.
              </p>
            ) : (
              <div className="space-y-1">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/portal/projects/${project.id}`}
                    className="block rounded-lg p-3 -mx-3 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{project.name}</p>
                      <Badge variant={statusVariant[project.status]}>
                        {titleCase(project.status)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant={priorityVariant[project.priority]}>
                        {titleCase(project.priority)}
                      </Badge>
                      <span className="font-portal-data text-[11px] uppercase tracking-wider text-on-surface-variant">
                        {project.dueDate
                          ? `Due ${project.dueDate.toLocaleDateString()}`
                          : "No due date"}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Recent updates */}
          <Card className="gap-5 p-6">
            <h2 className="font-portal-display text-lg font-semibold">Recent Updates</h2>
            <div className="space-y-4">
              {recentUpdates.map((update) => {
                const Icon = updateIconMap[update.icon as keyof typeof updateIconMap];
                return (
                  <div key={update.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{update.title}</p>
                      <p className="text-xs text-on-surface-variant">{update.meta}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          {/* Next meeting */}
          <Card className="gap-3 border-l-2 border-l-primary p-5">
            <div className="flex items-center justify-between">
              <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
                Next Meeting
              </p>
              <Badge>{nextMeeting.countdown}</Badge>
            </div>
            <div>
              <p className="font-portal-display text-lg font-semibold">{nextMeeting.title}</p>
              <p className="text-sm text-on-surface-variant">{nextMeeting.time}</p>
            </div>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/portal/meetings">
                <Video className="size-4" />
                {nextMeeting.joinLabel}
              </Link>
            </Button>
          </Card>

          {/* Open tickets */}
          <Card className="gap-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-portal-display text-base font-semibold">Open Tickets</h2>
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {openTicketsCount}
              </span>
            </div>
            {openTickets.length === 0 ? (
              <p className="py-4 text-center text-xs text-on-surface-variant">
                No open tickets right now.
              </p>
            ) : (
              <div className="space-y-3">
                {openTickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/portal/support/${ticket.id}`}
                    className="block rounded-lg border border-border/60 bg-surface-container-low p-3 transition-colors hover:border-primary/50"
                  >
                    <Badge variant={priorityVariant[ticket.priority]} className="mb-2">
                      {titleCase(ticket.priority)}
                    </Badge>
                    <p className="text-sm font-semibold">{ticket.subject}</p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      Updated {ticket.updatedAt.toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
            <Link
              href="/portal/support"
              className="text-center text-sm font-semibold text-primary"
            >
              View All Support Tickets
            </Link>
          </Card>

          {/* Recent deliverables */}
          <Card className="gap-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-portal-display text-base font-semibold">
                Recent Deliverables
              </h2>
              <Folder className="size-4 text-on-surface-variant" />
            </div>
            {recentFiles.length === 0 ? (
              <p className="py-4 text-center text-xs text-on-surface-variant">
                No files shared with you yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentFiles.map((file) => (
                  <a
                    key={file.id}
                    href={`/api/files/${file.id}/download`}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-container-low p-3 transition-colors hover:border-primary/50"
                  >
                    <span className="min-w-0 truncate text-sm font-medium">
                      {file.displayName}
                    </span>
                    <Download className="size-4 shrink-0 text-on-surface-variant" />
                  </a>
                ))}
              </div>
            )}
            <Link
              href="/portal/files"
              className="text-center text-sm font-semibold text-primary"
            >
              View All Files
            </Link>
          </Card>

          {/* Store spotlight */}
          <Card className="gap-0 overflow-hidden p-0">
            <div className="flex h-40 items-end bg-gradient-to-br from-[#241b12] to-[#15120e] p-4">
              <div>
                <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
                  {storeSpotlight.label}
                </p>
                <p className="font-portal-display text-lg font-semibold">
                  {storeSpotlight.name}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

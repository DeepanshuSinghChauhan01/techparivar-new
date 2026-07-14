import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  FolderKanban,
  Rocket,
  LifeBuoy,
  AlertTriangle,
  Folder,
  Eye,
} from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin Dashboard | TechParivar",
};

const statusVariant = {
  ACTIVE: "success",
  INACTIVE: "secondary",
  SUSPENDED: "destructive",
} as const;

export default async function AdminDashboardPage() {
  const [
    total,
    active,
    inactive,
    suspended,
    totalProjects,
    activeProjects,
    openTickets,
    urgentTickets,
    totalActiveFiles,
    clientVisibleFiles,
    recentClients,
    recentFiles,
  ] = await Promise.all([
    prisma.clientProfile.count(),
    prisma.clientProfile.count({ where: { status: "ACTIVE" } }),
    prisma.clientProfile.count({ where: { status: "INACTIVE" } }),
    prisma.clientProfile.count({ where: { status: "SUSPENDED" } }),
    prisma.project.count(),
    prisma.project.count({ where: { status: "ACTIVE" } }),
    prisma.ticket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS", "WAITING_FOR_CLIENT"] } } }),
    prisma.ticket.count({ where: { priority: "URGENT", status: { notIn: ["RESOLVED", "CLOSED"] } } }),
    prisma.managedFile.count({ where: { status: "ACTIVE" } }),
    prisma.managedFile.count({ where: { status: "ACTIVE", visibleToClient: true } }),
    prisma.clientProfile.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        userId: true,
        companyName: true,
        status: true,
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.managedFile.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        displayName: true,
        createdAt: true,
        client: { select: { companyName: true } },
      },
    }),
  ]);

  const clientStats = [
    { label: "Total Clients", value: total, icon: Users },
    { label: "Active Clients", value: active, icon: UserCheck },
    { label: "Inactive Clients", value: inactive, icon: UserX },
    { label: "Suspended Clients", value: suspended, icon: ShieldAlert },
  ];

  const workStats = [
    { label: "Total Projects", value: totalProjects, icon: FolderKanban },
    { label: "Active Projects", value: activeProjects, icon: Rocket },
    { label: "Open Tickets", value: openTickets, icon: LifeBuoy },
    { label: "Urgent Tickets", value: urgentTickets, icon: AlertTriangle },
  ];

  const fileStats = [
    { label: "Total Active Files", value: totalActiveFiles, icon: Folder },
    { label: "Client-Visible Files", value: clientVisibleFiles, icon: Eye },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Client, project, and ticket overview
        </p>
      </div>

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {clientStats.map((stat) => {
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fileStats.map((stat) => {
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

      <Card className="gap-5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-portal-display text-lg font-semibold">
              Recent Uploads
            </h2>
            <p className="text-xs text-on-surface-variant">
              Latest files shared with clients
            </p>
          </div>
          <Link href="/admin/files" className="text-sm font-semibold text-primary">
            View All
          </Link>
        </div>

        {recentFiles.length === 0 ? (
          <p className="py-8 text-center text-sm text-on-surface-variant">
            No files uploaded yet.
          </p>
        ) : (
          <div className="space-y-1">
            {recentFiles.map((file) => (
              <Link
                key={file.id}
                href={`/admin/files/${file.id}`}
                className="flex items-center justify-between rounded-lg p-3 -mx-3 transition-colors hover:bg-white/5"
              >
                <div>
                  <p className="font-semibold">{file.displayName}</p>
                  <p className="text-xs text-on-surface-variant">
                    {file.client.companyName}
                  </p>
                </div>
                <span className="text-xs text-on-surface-variant">
                  {file.createdAt.toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Card className="gap-5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-portal-display text-lg font-semibold">
              Recently Added Clients
            </h2>
            <p className="text-xs text-on-surface-variant">
              Latest client accounts created
            </p>
          </div>
          <Link
            href="/admin/clients"
            className="text-sm font-semibold text-primary"
          >
            View All
          </Link>
        </div>

        {recentClients.length === 0 ? (
          <p className="py-8 text-center text-sm text-on-surface-variant">
            No clients yet. Create your first client to get started.
          </p>
        ) : (
          <div className="space-y-1">
            {recentClients.map((client) => (
              <Link
                key={client.id}
                href={`/admin/clients/${client.userId}`}
                className="flex items-center justify-between rounded-lg p-3 -mx-3 transition-colors hover:bg-white/5"
              >
                <div>
                  <p className="font-semibold">{client.user.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {client.companyName} • {client.user.email}
                  </p>
                </div>
                <Badge variant={statusVariant[client.status]}>
                  {client.status}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

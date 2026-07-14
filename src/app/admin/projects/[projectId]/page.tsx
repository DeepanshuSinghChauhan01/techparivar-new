import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";

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

const ticketStatusVariant = {
  OPEN: "info",
  IN_PROGRESS: "warning",
  WAITING_FOR_CLIENT: "secondary",
  RESOLVED: "success",
  CLOSED: "secondary",
} as const;

function titleCase(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

async function getProject(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      projectCode: true,
      name: true,
      description: true,
      status: true,
      priority: true,
      progress: true,
      startDate: true,
      dueDate: true,
      completedAt: true,
      createdAt: true,
      updatedAt: true,
      client: {
        select: {
          companyName: true,
          user: { select: { id: true, name: true, email: true } },
        },
      },
      createdBy: {
        select: { name: true, email: true },
      },
      tickets: {
        orderBy: { createdAt: "desc" },
        select: { id: true, subject: true, status: true, priority: true },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>;
}): Promise<Metadata> {
  const { projectId } = await params;
  const project = await getProject(projectId);
  return {
    title: project
      ? `${project.name} | TechParivar Admin`
      : "Project | TechParivar Admin",
  };
}

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
              {project.name}
            </h1>
            <Badge variant={statusVariant[project.status]}>
              {titleCase(project.status)}
            </Badge>
            <Badge variant={priorityVariant[project.priority]}>
              {titleCase(project.priority)}
            </Badge>
          </div>
          <p className="mt-1 font-portal-data text-xs text-on-surface-variant">
            {project.projectCode}
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            <Link
              href={`/admin/clients/${project.client.user.id}`}
              className="font-semibold text-primary hover:underline"
            >
              {project.client.companyName}
            </Link>{" "}
            • {project.client.user.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <Link href={`/admin/projects/${project.id}/edit`}>
              <Pencil className="size-4" /> Edit Project
            </Link>
          </Button>
          <DeleteProjectButton
            projectId={project.id}
            projectName={project.name}
            redirectOnSuccess="/admin/projects"
          />
        </div>
      </div>

      <Card className="gap-6 p-6">
        <div>
          <div className="flex items-center justify-between">
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Progress
            </dt>
            <span className="text-sm font-semibold">{project.progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Start Date
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {project.startDate ? project.startDate.toLocaleDateString() : "—"}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Due Date
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {project.dueDate ? project.dueDate.toLocaleDateString() : "—"}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Completed
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {project.completedAt ? project.completedAt.toLocaleDateString() : "—"}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Created By
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {project.createdBy?.name ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Created
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {project.createdAt.toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Last Updated
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {project.updatedAt.toLocaleDateString()}
            </dd>
          </div>
        </dl>
        {project.description && (
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Description
            </dt>
            <dd className="mt-2 whitespace-pre-wrap text-sm text-on-surface-variant">
              {project.description}
            </dd>
          </div>
        )}
      </Card>

      <Card className="gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-portal-display text-lg font-semibold">
            Tickets
          </h2>
          <span className="text-xs text-on-surface-variant">
            {project.tickets.length} linked
          </span>
        </div>
        {project.tickets.length === 0 ? (
          <p className="py-6 text-center text-sm text-on-surface-variant">
            No tickets linked to this project yet.
          </p>
        ) : (
          <div className="space-y-1">
            {project.tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                className="flex items-center justify-between rounded-lg p-3 -mx-3 transition-colors hover:bg-white/5"
              >
                <p className="text-sm font-medium">{ticket.subject}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={priorityVariant[ticket.priority]}>
                    {titleCase(ticket.priority)}
                  </Badge>
                  <Badge variant={ticketStatusVariant[ticket.status]}>
                    {titleCase(ticket.status)}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

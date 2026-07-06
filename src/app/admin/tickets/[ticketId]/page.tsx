import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { TicketUpdateForm } from "@/components/admin/ticket-update-form";

const statusVariant = {
  OPEN: "info",
  IN_PROGRESS: "warning",
  WAITING_FOR_CLIENT: "secondary",
  RESOLVED: "success",
  CLOSED: "secondary",
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

async function getTicket(ticketId: string) {
  return prisma.ticket.findUnique({
    where: { id: ticketId },
    select: {
      id: true,
      subject: true,
      description: true,
      status: true,
      priority: true,
      createdAt: true,
      updatedAt: true,
      clientId: true,
      projectId: true,
      client: {
        select: {
          companyName: true,
          user: { select: { id: true, name: true, email: true } },
        },
      },
      project: { select: { id: true, name: true } },
      createdBy: { select: { name: true, email: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}): Promise<Metadata> {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);
  return {
    title: ticket
      ? `${ticket.subject} | TechParivar Admin`
      : "Ticket | TechParivar Admin",
  };
}

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);
  if (!ticket) notFound();

  const clientProjects = await prisma.project.findMany({
    where: { clientId: ticket.clientId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={statusVariant[ticket.status]}>
            {titleCase(ticket.status)}
          </Badge>
          <Badge variant={priorityVariant[ticket.priority]}>
            {titleCase(ticket.priority)}
          </Badge>
        </div>
        <h1 className="mt-3 font-portal-display text-2xl font-bold md:text-3xl">
          {ticket.subject}
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          <Link
            href={`/admin/clients/${ticket.client.user.id}`}
            className="font-semibold text-primary hover:underline"
          >
            {ticket.client.companyName}
          </Link>{" "}
          • {ticket.client.user.name}
          {ticket.project && (
            <>
              {" "}
              •{" "}
              <Link
                href={`/admin/projects/${ticket.project.id}`}
                className="font-semibold text-primary hover:underline"
              >
                {ticket.project.name}
              </Link>
            </>
          )}
        </p>
      </div>

      <Card className="gap-6 p-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Created By
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {ticket.createdBy.name}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Created
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {ticket.createdAt.toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Last Updated
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {ticket.updatedAt.toLocaleDateString()}
            </dd>
          </div>
        </dl>
        <div>
          <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
            Description
          </dt>
          <dd className="mt-2 whitespace-pre-wrap text-sm text-on-surface-variant">
            {ticket.description}
          </dd>
        </div>
      </Card>

      <Card className="gap-5 p-6">
        <h2 className="font-portal-display text-lg font-semibold">
          Update Ticket
        </h2>
        <TicketUpdateForm
          ticketId={ticket.id}
          defaultStatus={ticket.status}
          defaultPriority={ticket.priority}
          defaultProjectId={ticket.projectId ?? ""}
          projects={clientProjects}
        />
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { assertOwnsClientRecord } from "@/lib/ownership";

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

async function getOwnedTicket(ticketId: string) {
  const user = await requireUser();

  const ticket = await prisma.ticket.findUnique({
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
      project: { select: { id: true, name: true } },
    },
  });

  if (!ticket) notFound();
  if (!(await assertOwnsClientRecord(user, ticket.clientId))) notFound();

  return ticket;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}): Promise<Metadata> {
  const { ticketId } = await params;
  const ticket = await getOwnedTicket(ticketId);
  return { title: `${ticket.subject} | TechParivar` };
}

export default async function PortalTicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const ticket = await getOwnedTicket(ticketId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
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
        {ticket.project && (
          <p className="mt-1 text-sm text-on-surface-variant">
            Related to{" "}
            <Link
              href={`/portal/projects/${ticket.project.id}`}
              className="font-semibold text-primary hover:underline"
            >
              {ticket.project.name}
            </Link>
          </p>
        )}
      </div>

      <Card className="gap-6 p-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
    </div>
  );
}

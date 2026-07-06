import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Prisma } from "@prisma/client";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { requireClientProfileId } from "@/lib/ownership";

export const metadata: Metadata = {
  title: "Support Tickets | TechParivar Client Portal",
};

const STATUS_OPTIONS = [
  "ALL",
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_CLIENT",
  "RESOLVED",
  "CLOSED",
] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

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

function parseStatus(value: string | string[] | undefined): StatusOption {
  const v = Array.isArray(value) ? value[0] : value;
  return (STATUS_OPTIONS as readonly string[]).includes(v ?? "")
    ? (v as StatusOption)
    : "ALL";
}

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { clientProfileId } = await requireClientProfileId();
  const params = await searchParams;
  const status = parseStatus(params.status);

  const where: Prisma.TicketWhereInput = {
    clientId: clientProfileId,
    ...(status !== "ALL" ? { status } : {}),
  };

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      subject: true,
      status: true,
      priority: true,
      createdAt: true,
      project: { select: { name: true } },
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
            Support Tickets
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Track engineering requests, bugs, and infrastructure changes.
          </p>
        </div>
        <Button asChild>
          <Link href="/portal/support/new">
            <Plus className="size-4" /> New Ticket
          </Link>
        </Button>
      </div>

      <Card className="gap-4 p-5">
        <form method="GET" className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <label
              htmlFor="status"
              className="text-xs font-portal-data uppercase tracking-wider text-on-surface-variant"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="h-11 rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "ALL" ? "All Statuses" : titleCase(option)}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" variant="secondary">
            Filter
          </Button>
        </form>
      </Card>

      <Card className="gap-0 overflow-hidden p-0">
        {tickets.length === 0 ? (
          <p className="py-16 text-center text-sm text-on-surface-variant">
            {status !== "ALL"
              ? "No tickets match this filter."
              : "No support tickets yet. Create one if you need help."}
          </p>
        ) : (
          <div className="divide-y divide-border/60">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/portal/support/${ticket.id}`}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-white/5 sm:p-5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {ticket.subject}
                  </p>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {ticket.project ? `${ticket.project.name} • ` : ""}
                    {ticket.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={priorityVariant[ticket.priority]}>
                    {titleCase(ticket.priority)}
                  </Badge>
                  <Badge variant={statusVariant[ticket.status]}>
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

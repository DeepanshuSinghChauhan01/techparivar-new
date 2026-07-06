import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon, Eye } from "lucide-react";
import type { Prisma } from "@prisma/client";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Tickets | TechParivar Admin" };

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  "ALL",
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_CLIENT",
  "RESOLVED",
  "CLOSED",
] as const;
const PRIORITY_OPTIONS = ["ALL", "LOW", "MEDIUM", "HIGH", "URGENT"] as const;

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

function parseOption<T extends string>(
  value: string | string[] | undefined,
  options: readonly T[]
): T {
  const v = Array.isArray(value) ? value[0] : value;
  return (options as readonly string[]).includes(v ?? "")
    ? (v as T)
    : (options[0] as T);
}

function parsePage(value: string | string[] | undefined): number {
  const v = Array.isArray(value) ? value[0] : value;
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

function parseQuery(value: string | string[] | undefined): string {
  const v = Array.isArray(value) ? value[0] : value;
  return (v ?? "").trim().slice(0, 100);
}

function parseId(value: string | string[] | undefined): string {
  const v = Array.isArray(value) ? value[0] : value;
  return (v ?? "").trim();
}

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const status = parseOption(params.status, STATUS_OPTIONS);
  const priority = parseOption(params.priority, PRIORITY_OPTIONS);
  const q = parseQuery(params.q);
  const clientId = parseId(params.clientId);
  const projectId = parseId(params.projectId);
  const page = parsePage(params.page);

  const where: Prisma.TicketWhereInput = {
    ...(status !== "ALL" ? { status } : {}),
    ...(priority !== "ALL" ? { priority } : {}),
    ...(clientId ? { clientId } : {}),
    ...(projectId ? { projectId } : {}),
    ...(q
      ? {
          OR: [
            { subject: { contains: q, mode: "insensitive" } },
            { client: { companyName: { contains: q, mode: "insensitive" } } },
            { client: { user: { name: { contains: q, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };

  const [total, tickets, clients, projects] = await Promise.all([
    prisma.ticket.count({ where }),
    prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        subject: true,
        status: true,
        priority: true,
        createdAt: true,
        client: {
          select: { companyName: true, user: { select: { name: true } } },
        },
        project: { select: { id: true, name: true } },
        createdBy: { select: { name: true } },
      },
    }),
    prisma.clientProfile.findMany({
      orderBy: { companyName: "asc" },
      select: { id: true, companyName: true },
    }),
    prisma.project.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (status !== "ALL") sp.set("status", status);
    if (priority !== "ALL") sp.set("priority", priority);
    if (clientId) sp.set("clientId", clientId);
    if (projectId) sp.set("projectId", projectId);
    sp.set("page", String(targetPage));
    return `/admin/tickets?${sp.toString()}`;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
          Tickets
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          {total} ticket{total === 1 ? "" : "s"} total
        </p>
      </div>

      <Card className="gap-4 p-5">
        <form method="GET" className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1 space-y-2">
            <label
              htmlFor="q"
              className="text-xs font-portal-data uppercase tracking-wider text-on-surface-variant"
            >
              Search
            </label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
              <Input
                id="q"
                name="q"
                defaultValue={q}
                placeholder="Subject, client, or company..."
                className="pl-10"
              />
            </div>
          </div>

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

          <div className="space-y-2">
            <label
              htmlFor="priority"
              className="text-xs font-portal-data uppercase tracking-wider text-on-surface-variant"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue={priority}
              className="h-11 rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "ALL" ? "All Priorities" : titleCase(option)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="clientId"
              className="text-xs font-portal-data uppercase tracking-wider text-on-surface-variant"
            >
              Client
            </label>
            <select
              id="clientId"
              name="clientId"
              defaultValue={clientId}
              className="h-11 rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <option value="">All Clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.companyName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="projectId"
              className="text-xs font-portal-data uppercase tracking-wider text-on-surface-variant"
            >
              Project
            </label>
            <select
              id="projectId"
              name="projectId"
              defaultValue={projectId}
              className="h-11 rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
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
            {q || status !== "ALL" || priority !== "ALL" || clientId || projectId
              ? "No tickets match your search or filters."
              : "No tickets yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs font-portal-data uppercase tracking-wider text-on-surface-variant">
                <tr>
                  <th className="px-5 py-3 font-medium">Subject</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="transition-colors hover:bg-white/5"
                  >
                    <td className="px-5 py-4 font-semibold">
                      {ticket.subject}
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {ticket.client.companyName}
                      <span className="block text-xs">
                        {ticket.client.user.name}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {ticket.project?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusVariant[ticket.status]}>
                        {titleCase(ticket.status)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={priorityVariant[ticket.priority]}>
                        {titleCase(ticket.priority)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {ticket.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end">
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/admin/tickets/${ticket.id}`}
                            aria-label={`View ${ticket.subject}`}
                          >
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-on-surface-variant">
          <p>
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={pageHref(page - 1)}>Previous</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
            )}
            {page < totalPages ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={pageHref(page + 1)}>Next</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

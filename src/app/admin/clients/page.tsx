import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search as SearchIcon, Eye, Pencil } from "lucide-react";
import type { Prisma } from "@prisma/client";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { DeleteClientButton } from "@/components/admin/delete-client-button";

export const metadata: Metadata = { title: "Clients | TechParivar Admin" };

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ["ALL", "ACTIVE", "INACTIVE", "SUSPENDED"] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

const statusVariant = {
  ACTIVE: "success",
  INACTIVE: "secondary",
  SUSPENDED: "destructive",
} as const;

function parseStatus(value: string | string[] | undefined): StatusOption {
  const v = Array.isArray(value) ? value[0] : value;
  return (STATUS_OPTIONS as readonly string[]).includes(v ?? "")
    ? (v as StatusOption)
    : "ALL";
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

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const q = parseQuery(params.q);
  const page = parsePage(params.page);

  const where: Prisma.UserWhereInput = {
    role: "CLIENT",
    ...(status !== "ALL" ? { clientProfile: { status } } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            {
              clientProfile: {
                companyName: { contains: q, mode: "insensitive" },
              },
            },
          ],
        }
      : {}),
  };

  const [total, clients] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        clientProfile: { select: { companyName: true, status: true } },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (status !== "ALL") sp.set("status", status);
    sp.set("page", String(targetPage));
    return `/admin/clients?${sp.toString()}`;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
            Clients
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {total} client{total === 1 ? "" : "s"} total
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/clients/new">
            <Plus className="size-4" /> New Client
          </Link>
        </Button>
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
                placeholder="Name, email, or company..."
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
                  {option === "ALL"
                    ? "All Statuses"
                    : option.charAt(0) + option.slice(1).toLowerCase()}
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
        {clients.length === 0 ? (
          <p className="py-16 text-center text-sm text-on-surface-variant">
            {q || status !== "ALL"
              ? "No clients match your search or filter."
              : "No clients yet. Create your first client to get started."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs font-portal-data uppercase tracking-wider text-on-surface-variant">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="transition-colors hover:bg-white/5"
                  >
                    <td className="px-5 py-4 font-semibold">{client.name}</td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {client.clientProfile?.companyName ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {client.email}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          statusVariant[client.clientProfile?.status ?? "ACTIVE"]
                        }
                      >
                        {client.clientProfile?.status ?? "—"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {client.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/admin/clients/${client.id}`}
                            aria-label={`View ${client.name}`}
                          >
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/admin/clients/${client.id}/edit`}
                            aria-label={`Edit ${client.name}`}
                          >
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <DeleteClientButton
                          clientId={client.id}
                          clientName={client.name}
                        />
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

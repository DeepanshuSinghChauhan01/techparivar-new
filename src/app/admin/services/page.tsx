import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search as SearchIcon, Eye, Layers } from "lucide-react";
import type { Prisma } from "@prisma/client";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Services | TechParivar Admin" };

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ["ALL", "ACTIVE", "INACTIVE"] as const;

function parseOption<T extends string>(
  value: string | string[] | undefined,
  options: readonly T[]
): T {
  const v = Array.isArray(value) ? value[0] : value;
  return (options as readonly string[]).includes(v ?? "") ? (v as T) : (options[0] as T);
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

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const status = parseOption(params.status, STATUS_OPTIONS);
  const categoryId = parseId(params.categoryId);
  const q = parseQuery(params.q);
  const page = parsePage(params.page);

  const where: Prisma.ServiceWhereInput = {
    ...(status !== "ALL" ? { isActive: status === "ACTIVE" } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { key: { contains: q, mode: "insensitive" } }] } : {}),
  };

  const [total, services, categories] = await Promise.all([
    prisma.service.count({ where }),
    prisma.service.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        key: true,
        name: true,
        isActive: true,
        category: { select: { name: true } },
        _count: { select: { plans: true, engagements: true } },
      },
    }),
    prisma.serviceCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (status !== "ALL") sp.set("status", status);
    if (categoryId) sp.set("categoryId", categoryId);
    sp.set("page", String(targetPage));
    return `/admin/services?${sp.toString()}`;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Services</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {total} service{total === 1 ? "" : "s"} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <Link href="/admin/services/categories">
              <Layers className="size-4" /> Categories
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus className="size-4" /> New Service
            </Link>
          </Button>
        </div>
      </div>

      <Card className="gap-4 p-5">
        <form method="GET" className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1 space-y-2">
            <label htmlFor="q" className="text-xs font-portal-data uppercase tracking-wider text-on-surface-variant">
              Search
            </label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
              <Input id="q" name="q" defaultValue={q} placeholder="Name or key..." className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-xs font-portal-data uppercase tracking-wider text-on-surface-variant">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="h-11 rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="categoryId" className="text-xs font-portal-data uppercase tracking-wider text-on-surface-variant">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={categoryId}
              className="h-11 rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
        {services.length === 0 ? (
          <p className="py-16 text-center text-sm text-on-surface-variant">
            {q || status !== "ALL" || categoryId
              ? "No services match your search or filters."
              : "No services yet. Create your first service to get started."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs font-portal-data uppercase tracking-wider text-on-surface-variant">
                <tr>
                  <th className="px-5 py-3 font-medium">Service</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Plans</th>
                  <th className="px-5 py-3 font-medium">Engagements</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {services.map((service) => (
                  <tr key={service.id} className="transition-colors hover:bg-white/5">
                    <td className="px-5 py-4 font-semibold">
                      {service.name}
                      <span className="block font-portal-data text-xs font-normal text-on-surface-variant">
                        {service.key}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">{service.category.name}</td>
                    <td className="px-5 py-4">
                      <Badge variant={service.isActive ? "success" : "secondary"}>
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">{service._count.plans}</td>
                    <td className="px-5 py-4 text-on-surface-variant">{service._count.engagements}</td>
                    <td className="px-5 py-4 text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/services/${service.id}`} aria-label={`View ${service.name}`}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
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
          <p>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={pageHref(page - 1)}>Previous</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>Previous</Button>
            )}
            {page < totalPages ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={pageHref(page + 1)}>Next</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>Next</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

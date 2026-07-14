import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search as SearchIcon, Eye, Pencil, FolderCog } from "lucide-react";
import type { Prisma } from "@prisma/client";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { formatBytes } from "@/lib/format";

export const metadata: Metadata = { title: "Files | TechParivar Admin" };

const PAGE_SIZE = 15;

const CATEGORY_OPTIONS = [
  "ALL",
  "DELIVERABLE",
  "DOCUMENT",
  "ASSET",
  "REPORT",
  "CONTRACT",
  "OTHER",
] as const;
const STATUS_OPTIONS = ["ALL", "ACTIVE", "ARCHIVED"] as const;
const VISIBILITY_OPTIONS = ["ALL", "VISIBLE", "HIDDEN"] as const;

const statusVariant = {
  ACTIVE: "success",
  ARCHIVED: "secondary",
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

export default async function AdminFilesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = parseOption(params.category, CATEGORY_OPTIONS);
  const status = parseOption(params.status, STATUS_OPTIONS);
  const visibility = parseOption(params.visibility, VISIBILITY_OPTIONS);
  const q = parseQuery(params.q);
  const clientId = parseId(params.clientId);
  const projectId = parseId(params.projectId);
  const page = parsePage(params.page);

  const where: Prisma.ManagedFileWhereInput = {
    ...(category !== "ALL" ? { category } : {}),
    ...(status !== "ALL" ? { status } : {}),
    ...(visibility !== "ALL" ? { visibleToClient: visibility === "VISIBLE" } : {}),
    ...(clientId ? { clientId } : {}),
    ...(projectId ? { projectId } : {}),
    ...(q
      ? {
          OR: [
            { displayName: { contains: q, mode: "insensitive" } },
            { originalName: { contains: q, mode: "insensitive" } },
            { client: { companyName: { contains: q, mode: "insensitive" } } },
            { client: { user: { name: { contains: q, mode: "insensitive" } } } },
            { project: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [total, files, clients, projects] = await Promise.all([
    prisma.managedFile.count({ where }),
    prisma.managedFile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        displayName: true,
        category: true,
        status: true,
        visibleToClient: true,
        sizeBytes: true,
        version: true,
        createdAt: true,
        client: { select: { companyName: true, user: { select: { name: true } } } },
        project: { select: { name: true } },
        folder: { select: { name: true } },
        uploadedBy: { select: { name: true } },
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
    if (category !== "ALL") sp.set("category", category);
    if (status !== "ALL") sp.set("status", status);
    if (visibility !== "ALL") sp.set("visibility", visibility);
    if (clientId) sp.set("clientId", clientId);
    if (projectId) sp.set("projectId", projectId);
    sp.set("page", String(targetPage));
    return `/admin/files?${sp.toString()}`;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
            Files
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {total} file{total === 1 ? "" : "s"} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/files/folders">
              <FolderCog className="size-4" /> Folders
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/files/upload">
              <Plus className="size-4" /> Upload File
            </Link>
          </Button>
        </div>
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
                placeholder="File, client, company, or project..."
                className="pl-10"
              />
            </div>
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

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-xs font-portal-data uppercase tracking-wider text-on-surface-variant"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={category}
              className="h-11 rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "ALL" ? "All Categories" : titleCase(option)}
                </option>
              ))}
            </select>
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
              htmlFor="visibility"
              className="text-xs font-portal-data uppercase tracking-wider text-on-surface-variant"
            >
              Visibility
            </label>
            <select
              id="visibility"
              name="visibility"
              defaultValue={visibility}
              className="h-11 rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <option value="ALL">All Visibility</option>
              <option value="VISIBLE">Visible to Client</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </div>

          <Button type="submit" variant="secondary">
            Filter
          </Button>
        </form>
      </Card>

      <Card className="gap-0 overflow-hidden p-0">
        {files.length === 0 ? (
          <p className="py-16 text-center text-sm text-on-surface-variant">
            {q || category !== "ALL" || status !== "ALL" || visibility !== "ALL" || clientId || projectId
              ? "No files match your search or filters."
              : "No files yet. Upload your first file to get started."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 text-xs font-portal-data uppercase tracking-wider text-on-surface-variant">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Project / Folder</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Size</th>
                  <th className="px-5 py-3 font-medium">Visibility</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Uploaded</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {files.map((file) => (
                  <tr key={file.id} className="transition-colors hover:bg-white/5">
                    <td className="px-5 py-4 font-semibold">
                      {file.displayName}
                      {file.version > 1 && (
                        <span className="ml-1.5 text-xs font-normal text-on-surface-variant">
                          v{file.version}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {file.client.companyName}
                      <span className="block text-xs">{file.client.user.name}</span>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {file.project?.name ?? "—"}
                      {file.folder && (
                        <span className="block text-xs">{file.folder.name}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {titleCase(file.category)}
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {formatBytes(file.sizeBytes)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={file.visibleToClient ? "success" : "secondary"}>
                        {file.visibleToClient ? "Visible" : "Hidden"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={statusVariant[file.status]}>
                        {titleCase(file.status)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {file.createdAt.toLocaleDateString()}
                      <span className="block text-xs">by {file.uploadedBy.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/admin/files/${file.id}`}
                            aria-label={`View ${file.displayName}`}
                          >
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/admin/files/${file.id}/edit`}
                            aria-label={`Edit ${file.displayName}`}
                          >
                            <Pencil className="size-4" />
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

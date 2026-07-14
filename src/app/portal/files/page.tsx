import type { Metadata } from "next";
import { Download, FileText, Search as SearchIcon } from "lucide-react";
import type { Prisma } from "@prisma/client";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { requireClientProfileId } from "@/lib/ownership";
import { formatBytes } from "@/lib/format";

export const metadata: Metadata = {
  title: "Files | TechParivar Client Portal",
};

const CATEGORY_OPTIONS = [
  "ALL",
  "DELIVERABLE",
  "DOCUMENT",
  "ASSET",
  "REPORT",
  "CONTRACT",
  "OTHER",
] as const;
type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

function titleCase(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function parseCategory(value: string | string[] | undefined): CategoryOption {
  const v = Array.isArray(value) ? value[0] : value;
  return (CATEGORY_OPTIONS as readonly string[]).includes(v ?? "")
    ? (v as CategoryOption)
    : "ALL";
}

function parseId(value: string | string[] | undefined): string {
  const v = Array.isArray(value) ? value[0] : value;
  return (v ?? "").trim();
}

function parseQuery(value: string | string[] | undefined): string {
  const v = Array.isArray(value) ? value[0] : value;
  return (v ?? "").trim().slice(0, 100);
}

export default async function PortalFilesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { clientProfileId } = await requireClientProfileId();
  const params = await searchParams;
  const category = parseCategory(params.category);
  const projectId = parseId(params.projectId);
  const folderId = parseId(params.folderId);
  const q = parseQuery(params.q);

  const where: Prisma.ManagedFileWhereInput = {
    clientId: clientProfileId,
    visibleToClient: true,
    status: "ACTIVE",
    ...(category !== "ALL" ? { category } : {}),
    ...(projectId ? { projectId } : {}),
    ...(folderId ? { folderId } : {}),
    ...(q ? { displayName: { contains: q, mode: "insensitive" } } : {}),
  };

  const [files, projects, folders] = await Promise.all([
    prisma.managedFile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        displayName: true,
        category: true,
        sizeBytes: true,
        version: true,
        createdAt: true,
        project: { select: { name: true } },
        folder: { select: { name: true } },
      },
    }),
    prisma.project.findMany({
      where: { clientId: clientProfileId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.fileFolder.findMany({
      where: { clientId: clientProfileId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Files</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Every deliverable, document, and asset shared with you.
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
              <Input id="q" name="q" defaultValue={q} placeholder="Search files..." className="pl-10" />
            </div>
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

          {projects.length > 0 && (
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
          )}

          {folders.length > 0 && (
            <div className="space-y-2">
              <label
                htmlFor="folderId"
                className="text-xs font-portal-data uppercase tracking-wider text-on-surface-variant"
              >
                Folder
              </label>
              <select
                id="folderId"
                name="folderId"
                defaultValue={folderId}
                className="h-11 rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <option value="">All Folders</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button type="submit" variant="secondary">
            Filter
          </Button>
        </form>
      </Card>

      <Card className="gap-0 p-0">
        {files.length === 0 ? (
          <p className="py-16 text-center text-sm text-on-surface-variant">
            {q || category !== "ALL" || projectId || folderId
              ? "No files match your search or filters."
              : "No files have been shared with you yet."}
          </p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs text-on-surface-variant">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Project / Folder</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Size</th>
                <th className="px-6 py-3 font-medium">Uploaded</th>
                <th className="px-6 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b border-border/40 last:border-0 hover:bg-white/5">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                        <FileText className="size-4" />
                      </span>
                      <span className="font-medium">
                        {file.displayName}
                        {file.version > 1 && (
                          <span className="ml-1.5 text-xs font-normal text-on-surface-variant">
                            v{file.version}
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-on-surface-variant">
                    {file.project?.name ?? "—"}
                    {file.folder && (
                      <span className="block text-xs">{file.folder.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <Badge variant="secondary">{titleCase(file.category)}</Badge>
                  </td>
                  <td className="px-6 py-3.5 text-on-surface-variant">
                    {formatBytes(file.sizeBytes)}
                  </td>
                  <td className="px-6 py-3.5 text-on-surface-variant">
                    {file.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={`/api/files/${file.id}/download`}
                        aria-label={`Download ${file.displayName}`}
                      >
                        <Download className="size-4" />
                      </a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

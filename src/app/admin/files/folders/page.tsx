import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { prisma } from "@/lib/prisma";
import { CreateFolderForm } from "@/components/admin/create-folder-form";
import { FolderRowActions } from "@/components/admin/folder-row-actions";

export const metadata: Metadata = { title: "Folders | TechParivar Admin" };

export default async function AdminFoldersPage() {
  const [clients, projects, folders] = await Promise.all([
    prisma.clientProfile.findMany({
      orderBy: { companyName: "asc" },
      select: { id: true, companyName: true, user: { select: { name: true } } },
    }),
    prisma.project.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, clientId: true },
    }),
    prisma.fileFolder.findMany({
      orderBy: [{ client: { companyName: "asc" } }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        client: { select: { companyName: true } },
        project: { select: { name: true } },
        _count: { select: { files: true } },
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/files"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="size-4" /> Back to Files
        </Link>
        <h1 className="mt-3 font-portal-display text-2xl font-bold md:text-3xl">
          Folders
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Organize client files into folders, optionally scoped to a project.
        </p>
      </div>

      <Card className="p-6">
        <CreateFolderForm
          clients={clients.map((c) => ({
            id: c.id,
            companyName: c.companyName,
            userName: c.user.name,
          }))}
          projects={projects}
        />
      </Card>

      <Card className="gap-0 overflow-hidden p-0">
        {folders.length === 0 ? (
          <p className="py-16 text-center text-sm text-on-surface-variant">
            No folders yet. Create one above.
          </p>
        ) : (
          <div className="divide-y divide-border/60">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{folder.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {folder.client.companyName}
                    {folder.project ? ` • ${folder.project.name}` : ""} •{" "}
                    {folder._count.files} file{folder._count.files === 1 ? "" : "s"}
                  </p>
                </div>
                <FolderRowActions
                  folderId={folder.id}
                  folderName={folder.name}
                  fileCount={folder._count.files}
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Pencil, RefreshCw } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { formatBytes } from "@/lib/format";
import { DeleteFileButton } from "@/components/admin/delete-file-button";
import { ArchiveRestoreFileButton } from "@/components/admin/archive-restore-file-button";

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

async function getFile(fileId: string) {
  return prisma.managedFile.findUnique({
    where: { id: fileId },
    select: {
      id: true,
      displayName: true,
      originalName: true,
      mimeType: true,
      sizeBytes: true,
      category: true,
      status: true,
      visibleToClient: true,
      description: true,
      version: true,
      createdAt: true,
      updatedAt: true,
      client: {
        select: {
          companyName: true,
          user: { select: { id: true, name: true } },
        },
      },
      project: { select: { id: true, name: true } },
      folder: { select: { id: true, name: true } },
      uploadedBy: { select: { name: true, email: true } },
      replacesFile: {
        select: { id: true, displayName: true, version: true },
      },
      newerVersion: {
        select: { id: true, displayName: true, version: true },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ fileId: string }>;
}): Promise<Metadata> {
  const { fileId } = await params;
  const file = await getFile(fileId);
  return {
    title: file
      ? `${file.displayName} | TechParivar Admin`
      : "File | TechParivar Admin",
  };
}

export default async function AdminFileDetailPage({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  const { fileId } = await params;
  const file = await getFile(fileId);
  if (!file) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
              {file.displayName}
            </h1>
            <Badge variant={statusVariant[file.status]}>
              {titleCase(file.status)}
            </Badge>
            <Badge variant={file.visibleToClient ? "success" : "secondary"}>
              {file.visibleToClient ? "Visible to Client" : "Hidden"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">
            <Link
              href={`/admin/clients/${file.client.user.id}`}
              className="font-semibold text-primary hover:underline"
            >
              {file.client.companyName}
            </Link>{" "}
            • {file.client.user.name}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" asChild>
            <a href={`/api/files/${file.id}/download`}>
              <Download className="size-4" /> Download
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/files/${file.id}/edit`}>
              <Pencil className="size-4" /> Edit
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/files/${file.id}/replace`}>
              <RefreshCw className="size-4" /> Replace Version
            </Link>
          </Button>
          <ArchiveRestoreFileButton fileId={file.id} status={file.status} />
          <DeleteFileButton fileId={file.id} fileName={file.displayName} />
        </div>
      </div>

      <Card className="gap-6 p-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Category
            </dt>
            <dd className="mt-1 text-sm font-semibold">{titleCase(file.category)}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Project
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {file.project ? (
                <Link
                  href={`/admin/projects/${file.project.id}`}
                  className="text-primary hover:underline"
                >
                  {file.project.name}
                </Link>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Folder
            </dt>
            <dd className="mt-1 text-sm font-semibold">{file.folder?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Original Filename
            </dt>
            <dd className="mt-1 text-sm font-semibold">{file.originalName}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              File Type
            </dt>
            <dd className="mt-1 text-sm font-semibold">{file.mimeType}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Size
            </dt>
            <dd className="mt-1 text-sm font-semibold">{formatBytes(file.sizeBytes)}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Version
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              v{file.version}
              {file.replacesFile && (
                <>
                  {" "}
                  (replaces{" "}
                  <Link
                    href={`/admin/files/${file.replacesFile.id}`}
                    className="text-primary hover:underline"
                  >
                    v{file.replacesFile.version}
                  </Link>
                  )
                </>
              )}
              {file.newerVersion && (
                <>
                  {" "}
                  —{" "}
                  <Link
                    href={`/admin/files/${file.newerVersion.id}`}
                    className="text-primary hover:underline"
                  >
                    newer version available (v{file.newerVersion.version})
                  </Link>
                </>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Uploaded By
            </dt>
            <dd className="mt-1 text-sm font-semibold">{file.uploadedBy.name}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Created
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {file.createdAt.toLocaleDateString()}
            </dd>
          </div>
        </dl>
        {file.description && (
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Description
            </dt>
            <dd className="mt-2 whitespace-pre-wrap text-sm text-on-surface-variant">
              {file.description}
            </dd>
          </div>
        )}
      </Card>
    </div>
  );
}

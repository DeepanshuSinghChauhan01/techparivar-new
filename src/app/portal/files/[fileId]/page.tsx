import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { assertOwnsClientRecord } from "@/lib/ownership";
import { formatBytes } from "@/lib/format";

function titleCase(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

async function getOwnedVisibleFile(fileId: string) {
  const user = await requireUser();

  const file = await prisma.managedFile.findUnique({
    where: { id: fileId },
    select: {
      id: true,
      displayName: true,
      category: true,
      sizeBytes: true,
      version: true,
      description: true,
      createdAt: true,
      clientId: true,
      visibleToClient: true,
      status: true,
      project: { select: { id: true, name: true } },
      folder: { select: { name: true } },
    },
  });

  if (!file) notFound();
  if (!(await assertOwnsClientRecord(user, file.clientId))) notFound();
  if (user.role === "CLIENT" && (!file.visibleToClient || file.status !== "ACTIVE")) {
    notFound();
  }

  return file;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ fileId: string }>;
}): Promise<Metadata> {
  const { fileId } = await params;
  const file = await getOwnedVisibleFile(fileId);
  return { title: `${file.displayName} | TechParivar` };
}

export default async function PortalFileDetailPage({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  const { fileId } = await params;
  const file = await getOwnedVisibleFile(fileId);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
              {file.displayName}
            </h1>
            {file.version > 1 && (
              <Badge variant="secondary">v{file.version}</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">
            {titleCase(file.category)}
            {file.project ? ` • ${file.project.name}` : ""}
            {file.folder ? ` • ${file.folder.name}` : ""}
          </p>
        </div>
        <Button asChild>
          <a href={`/api/files/${file.id}/download`}>
            <Download className="size-4" /> Download
          </a>
        </Button>
      </div>

      <Card className="gap-6 p-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Size
            </dt>
            <dd className="mt-1 text-sm font-semibold">{formatBytes(file.sizeBytes)}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Uploaded
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

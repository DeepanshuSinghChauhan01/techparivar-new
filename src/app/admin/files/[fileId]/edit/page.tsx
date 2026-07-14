import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/portal-ui/card";
import { prisma } from "@/lib/prisma";
import { EditFileForm } from "@/components/admin/edit-file-form";

export const metadata: Metadata = { title: "Edit File | TechParivar Admin" };

async function getFile(fileId: string) {
  return prisma.managedFile.findUnique({
    where: { id: fileId },
    select: {
      id: true,
      displayName: true,
      category: true,
      description: true,
      visibleToClient: true,
      clientId: true,
      projectId: true,
      folderId: true,
    },
  });
}

export default async function EditFilePage({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  const { fileId } = await params;
  const file = await getFile(fileId);
  if (!file) notFound();

  const [projects, folders] = await Promise.all([
    prisma.project.findMany({
      where: { clientId: file.clientId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.fileFolder.findMany({
      where: { clientId: file.clientId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
          Edit File
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">{file.displayName}</p>
      </div>

      <Card className="p-6">
        <EditFileForm
          fileId={file.id}
          defaultValues={{
            displayName: file.displayName,
            category: file.category,
            description: file.description ?? "",
            visibleToClient: file.visibleToClient,
            projectId: file.projectId ?? "",
            folderId: file.folderId ?? "",
          }}
          projects={projects}
          folders={folders}
          cancelHref={`/admin/files/${file.id}`}
        />
      </Card>
    </div>
  );
}

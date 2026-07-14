import type { Metadata } from "next";

import { Card } from "@/components/portal-ui/card";
import { prisma } from "@/lib/prisma";
import { UploadFileForm } from "@/components/admin/upload-file-form";

export const metadata: Metadata = { title: "Upload File | TechParivar Admin" };

export default async function UploadFilePage() {
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
      orderBy: { name: "asc" },
      select: { id: true, name: true, clientId: true, projectId: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
          Upload File
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Share a deliverable, document, or asset with a client.
        </p>
      </div>

      <Card className="p-6">
        <UploadFileForm
          clients={clients.map((c) => ({
            id: c.id,
            companyName: c.companyName,
            userName: c.user.name,
          }))}
          projects={projects}
          folders={folders}
        />
      </Card>
    </div>
  );
}

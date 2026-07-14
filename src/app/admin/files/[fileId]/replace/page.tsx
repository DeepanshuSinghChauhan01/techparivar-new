import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/portal-ui/card";
import { prisma } from "@/lib/prisma";
import { ReplaceFileForm } from "@/components/admin/replace-file-form";

export const metadata: Metadata = { title: "Replace File | TechParivar Admin" };

export default async function ReplaceFilePage({
  params,
}: {
  params: Promise<{ fileId: string }>;
}) {
  const { fileId } = await params;
  const file = await prisma.managedFile.findUnique({
    where: { id: fileId },
    select: { id: true, displayName: true, version: true },
  });
  if (!file) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
          Replace Version
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          {file.displayName} — current version v{file.version}
        </p>
      </div>

      <Card className="p-6">
        <ReplaceFileForm fileId={file.id} cancelHref={`/admin/files/${file.id}`} />
      </Card>
    </div>
  );
}

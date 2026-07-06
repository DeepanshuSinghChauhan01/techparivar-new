import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/portal-ui/card";
import { prisma } from "@/lib/prisma";
import { EditClientForm } from "@/components/admin/edit-client-form";

export const metadata: Metadata = { title: "Edit Client | TechParivar Admin" };

async function getClient(clientId: string) {
  const client = await prisma.user.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      clientProfile: true,
    },
  });
  if (!client || client.role !== "CLIENT") return null;
  return client;
}

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = await getClient(clientId);
  if (!client) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
          Edit Client
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">{client.email}</p>
      </div>

      <Card className="p-6">
        <EditClientForm
          clientId={client.id}
          defaultValues={{
            name: client.name,
            email: client.email,
            companyName: client.clientProfile?.companyName ?? "",
            phone: client.clientProfile?.phone ?? "",
            website: client.clientProfile?.website ?? "",
            notes: client.clientProfile?.notes ?? "",
            status: client.clientProfile?.status ?? "ACTIVE",
          }}
        />
      </Card>
    </div>
  );
}

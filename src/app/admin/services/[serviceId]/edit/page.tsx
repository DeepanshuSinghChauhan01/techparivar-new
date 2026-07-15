import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/portal-ui/card";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/service-form";
import { updateServiceAction } from "@/app/admin/services/actions";

export const metadata: Metadata = { title: "Edit Service | TechParivar Admin" };

async function getService(serviceId: string) {
  return prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true, key: true, name: true, categoryId: true, description: true, isActive: true },
  });
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const [service, categories] = await Promise.all([
    getService(serviceId),
    prisma.serviceCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
  ]);

  if (!service) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Edit Service</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{service.name}</p>
      </div>

      <Card className="p-6">
        <ServiceForm
          action={updateServiceAction}
          categories={categories}
          serviceId={service.id}
          serviceKey={service.key}
          defaultValues={{
            name: service.name,
            categoryId: service.categoryId,
            description: service.description ?? "",
            isActive: service.isActive,
          }}
          submitLabel="Save Changes"
          pendingLabel="Saving..."
          cancelHref={`/admin/services/${service.id}`}
        />
      </Card>
    </div>
  );
}

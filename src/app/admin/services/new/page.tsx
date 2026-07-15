import type { Metadata } from "next";

import { Card } from "@/components/portal-ui/card";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/service-form";
import { createServiceAction } from "@/app/admin/services/actions";

export const metadata: Metadata = { title: "New Service | TechParivar Admin" };

export default async function NewServicePage() {
  const categories = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">New Service</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Add a new offering to the service catalog.
        </p>
      </div>

      <Card className="p-6">
        <ServiceForm
          action={createServiceAction}
          categories={categories}
          defaultValues={{ name: "", categoryId: "", description: "", isActive: true }}
          submitLabel="Create Service"
          pendingLabel="Creating..."
          cancelHref="/admin/services"
        />
      </Card>
    </div>
  );
}

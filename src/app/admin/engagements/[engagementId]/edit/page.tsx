import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/portal-ui/card";
import { prisma } from "@/lib/prisma";
import { EngagementForm } from "@/components/admin/engagement-form";
import { updateEngagementAction } from "@/app/admin/engagements/actions";

export const metadata: Metadata = { title: "Edit Engagement | TechParivar Admin" };

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

async function getEngagement(engagementId: string) {
  return prisma.clientServiceEngagement.findUnique({
    where: { id: engagementId },
    select: {
      id: true,
      clientId: true,
      serviceId: true,
      planId: true,
      name: true,
      billingType: true,
      billingCycle: true,
      price: true,
      currency: true,
      discountType: true,
      discountValue: true,
      taxRate: true,
      paymentTermsDays: true,
      status: true,
      cancellationReason: true,
      startDate: true,
      endDate: true,
      renewalDate: true,
      client: { select: { companyName: true } },
      service: {
        select: {
          id: true,
          name: true,
          plans: {
            where: { isActive: true },
            orderBy: { name: "asc" },
            select: { id: true, name: true, billingType: true, billingCycle: true, basePrice: true, currency: true },
          },
        },
      },
    },
  });
}

export default async function EditEngagementPage({
  params,
}: {
  params: Promise<{ engagementId: string }>;
}) {
  const { engagementId } = await params;
  const engagement = await getEngagement(engagementId);
  if (!engagement) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Edit Engagement</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{engagement.name}</p>
      </div>

      <Card className="p-6">
        <EngagementForm
          action={updateEngagementAction}
          services={[
            {
              id: engagement.service.id,
              name: engagement.service.name,
              plans: engagement.service.plans.map((p) => ({ ...p, basePrice: p.basePrice.toString() })),
            },
          ]}
          engagementId={engagement.id}
          lockedClientName={engagement.client.companyName}
          isEdit
          defaultValues={{
            clientId: engagement.clientId,
            serviceId: engagement.serviceId,
            planId: engagement.planId ?? "",
            name: engagement.name,
            billingType: engagement.billingType,
            billingCycle: engagement.billingCycle ?? "",
            price: engagement.price.toString(),
            currency: engagement.currency,
            discountType: engagement.discountType,
            discountValue: engagement.discountValue?.toString() ?? "",
            taxRate: engagement.taxRate?.toString() ?? "",
            paymentTermsDays: engagement.paymentTermsDays,
            status: engagement.status,
            cancellationReason: engagement.cancellationReason ?? "",
            startDate: toDateInputValue(engagement.startDate),
            endDate: toDateInputValue(engagement.endDate),
            renewalDate: toDateInputValue(engagement.renewalDate),
          }}
          submitLabel="Save Changes"
          pendingLabel="Saving..."
          cancelHref={`/admin/engagements/${engagement.id}`}
        />
      </Card>
    </div>
  );
}

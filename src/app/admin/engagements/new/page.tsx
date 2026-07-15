import type { Metadata } from "next";

import { Card } from "@/components/portal-ui/card";
import { prisma } from "@/lib/prisma";
import { EngagementForm } from "@/components/admin/engagement-form";
import { createEngagementAction } from "@/app/admin/engagements/actions";
import { SUPPORTED_CURRENCIES } from "@/lib/constants/currency";

export const metadata: Metadata = { title: "New Engagement | TechParivar Admin" };

function parseId(value: string | string[] | undefined): string {
  const v = Array.isArray(value) ? value[0] : value;
  return (v ?? "").trim();
}

export default async function NewEngagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const preselectedClientId = parseId(params.clientId);

  const [clients, services, lockedClient] = await Promise.all([
    prisma.clientProfile.findMany({
      orderBy: { companyName: "asc" },
      select: { id: true, companyName: true, user: { select: { name: true } } },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        plans: {
          where: { isActive: true },
          orderBy: { name: "asc" },
          select: { id: true, name: true, billingType: true, billingCycle: true, basePrice: true, currency: true },
        },
      },
    }),
    preselectedClientId
      ? prisma.clientProfile.findUnique({
          where: { id: preselectedClientId },
          select: { companyName: true },
        })
      : null,
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">New Engagement</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Record what a client has purchased.
        </p>
      </div>

      <Card className="p-6">
        <EngagementForm
          action={createEngagementAction}
          clients={clients.map((c) => ({ id: c.id, companyName: c.companyName, userName: c.user.name }))}
          services={services.map((s) => ({
            id: s.id,
            name: s.name,
            plans: s.plans.map((p) => ({ ...p, basePrice: p.basePrice.toString() })),
          }))}
          lockedClientName={lockedClient ? lockedClient.companyName : undefined}
          defaultValues={{
            clientId: preselectedClientId,
            serviceId: "",
            planId: "",
            name: "",
            billingType: "ONE_TIME",
            billingCycle: "",
            price: "",
            currency: SUPPORTED_CURRENCIES[0],
            discountType: "NONE",
            discountValue: "",
            taxRate: "",
            paymentTermsDays: 15,
            startDate: "",
            endDate: "",
            renewalDate: "",
          }}
          submitLabel="Create Engagement"
          pendingLabel="Creating..."
          cancelHref={preselectedClientId ? `/admin/clients/${preselectedClientId}` : "/admin/engagements"}
        />
      </Card>
    </div>
  );
}

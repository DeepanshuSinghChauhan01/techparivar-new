import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { CreatePlanForm } from "@/components/admin/create-plan-form";
import { PlanCard } from "@/components/admin/plan-card";

async function getService(serviceId: string) {
  return prisma.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      key: true,
      name: true,
      description: true,
      isActive: true,
      category: { select: { id: true, name: true } },
      createdAt: true,
      updatedAt: true,
      _count: { select: { engagements: true } },
      plans: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          billingType: true,
          billingCycle: true,
          basePrice: true,
          currency: true,
          isActive: true,
          _count: { select: { engagements: true } },
          features: {
            orderBy: { sortOrder: "asc" },
            select: { id: true, label: true },
          },
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}): Promise<Metadata> {
  const { serviceId } = await params;
  const service = await getService(serviceId);
  return {
    title: service ? `${service.name} | TechParivar Admin` : "Service | TechParivar Admin",
  };
}

export default async function AdminServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const service = await getService(serviceId);
  if (!service) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
              {service.name}
            </h1>
            <Badge variant={service.isActive ? "success" : "secondary"}>
              {service.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="mt-1 font-portal-data text-xs text-on-surface-variant">
            {service.key}
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">{service.category.name}</p>
        </div>
        <Button variant="secondary" asChild>
          <Link href={`/admin/services/${service.id}/edit`}>
            <Pencil className="size-4" /> Edit Service
          </Link>
        </Button>
      </div>

      <Card className="gap-4 p-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Engagements
            </dt>
            <dd className="mt-1 text-sm font-semibold">{service._count.engagements}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Created
            </dt>
            <dd className="mt-1 text-sm font-semibold">{service.createdAt.toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Last Updated
            </dt>
            <dd className="mt-1 text-sm font-semibold">{service.updatedAt.toLocaleDateString()}</dd>
          </div>
        </dl>
        {service.description && (
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Description
            </dt>
            <dd className="mt-2 whitespace-pre-wrap text-sm text-on-surface-variant">
              {service.description}
            </dd>
          </div>
        )}
      </Card>

      <div>
        <h2 className="font-portal-display text-lg font-semibold">Plans</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Named packages clients can purchase under this service.
        </p>
      </div>

      {service.plans.length === 0 ? (
        <Card className="p-8 text-center text-sm text-on-surface-variant">
          No plans yet. Add one below.
        </Card>
      ) : (
        <div className="space-y-4">
          {service.plans.map((plan) => (
            <PlanCard
              key={plan.id}
              planId={plan.id}
              name={plan.name}
              billingType={plan.billingType}
              billingCycle={plan.billingCycle}
              basePrice={plan.basePrice.toString()}
              currency={plan.currency}
              isActive={plan.isActive}
              engagementCount={plan._count.engagements}
              features={plan.features}
            />
          ))}
        </div>
      )}

      <Card className="p-6">
        <h3 className="mb-4 font-portal-display text-base font-semibold">Add a Plan</h3>
        <CreatePlanForm serviceId={service.id} />
      </Card>
    </div>
  );
}

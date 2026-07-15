import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/format";

const statusVariant = {
  PENDING: "secondary",
  ACTIVE: "success",
  PAUSED: "warning",
  CANCELLED: "destructive",
  EXPIRED: "secondary",
} as const;

function titleCase(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

async function getEngagement(engagementId: string) {
  return prisma.clientServiceEngagement.findUnique({
    where: { id: engagementId },
    select: {
      id: true,
      name: true,
      status: true,
      billingType: true,
      billingCycle: true,
      price: true,
      currency: true,
      discountType: true,
      discountValue: true,
      taxRate: true,
      paymentTermsDays: true,
      startDate: true,
      endDate: true,
      renewalDate: true,
      cancelledAt: true,
      cancellationReason: true,
      createdAt: true,
      updatedAt: true,
      client: { select: { id: true, companyName: true, user: { select: { id: true, name: true } } } },
      service: { select: { id: true, name: true } },
      plan: { select: { id: true, name: true } },
      createdBy: { select: { name: true } },
      projects: { select: { id: true, name: true, projectCode: true, status: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ engagementId: string }>;
}): Promise<Metadata> {
  const { engagementId } = await params;
  const engagement = await getEngagement(engagementId);
  return {
    title: engagement ? `${engagement.name} | TechParivar Admin` : "Engagement | TechParivar Admin",
  };
}

export default async function AdminEngagementDetailPage({
  params,
}: {
  params: Promise<{ engagementId: string }>;
}) {
  const { engagementId } = await params;
  const engagement = await getEngagement(engagementId);
  if (!engagement) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
              {engagement.name}
            </h1>
            <Badge variant={statusVariant[engagement.status]}>{titleCase(engagement.status)}</Badge>
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">
            <Link href={`/admin/clients/${engagement.client.user.id}`} className="font-semibold text-primary hover:underline">
              {engagement.client.companyName}
            </Link>{" "}
            • {engagement.service.name}
            {engagement.plan && ` • ${engagement.plan.name}`}
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link href={`/admin/engagements/${engagement.id}/edit`}>
            <Pencil className="size-4" /> Edit Engagement
          </Link>
        </Button>
      </div>

      <Card className="gap-6 p-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Price</dt>
            <dd className="mt-1 text-sm font-semibold">{formatMoney(engagement.price, engagement.currency)}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Billing</dt>
            <dd className="mt-1 text-sm font-semibold">
              {titleCase(engagement.billingType)}
              {engagement.billingCycle ? ` • ${titleCase(engagement.billingCycle)}` : ""}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Payment Terms</dt>
            <dd className="mt-1 text-sm font-semibold">Net {engagement.paymentTermsDays}</dd>
          </div>
          {engagement.discountType !== "NONE" && (
            <div>
              <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Discount</dt>
              <dd className="mt-1 text-sm font-semibold">
                {engagement.discountType === "PERCENT" ? `${engagement.discountValue}%` : formatMoney(engagement.discountValue, engagement.currency)}
              </dd>
            </div>
          )}
          {engagement.taxRate && (
            <div>
              <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Tax Rate</dt>
              <dd className="mt-1 text-sm font-semibold">{engagement.taxRate.toString()}%</dd>
            </div>
          )}
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Start Date</dt>
            <dd className="mt-1 text-sm font-semibold">{engagement.startDate ? engagement.startDate.toLocaleDateString() : "—"}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">End Date</dt>
            <dd className="mt-1 text-sm font-semibold">{engagement.endDate ? engagement.endDate.toLocaleDateString() : "—"}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Renewal Date</dt>
            <dd className="mt-1 text-sm font-semibold">{engagement.renewalDate ? engagement.renewalDate.toLocaleDateString() : "—"}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Created By</dt>
            <dd className="mt-1 text-sm font-semibold">{engagement.createdBy?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Created</dt>
            <dd className="mt-1 text-sm font-semibold">{engagement.createdAt.toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Last Updated</dt>
            <dd className="mt-1 text-sm font-semibold">{engagement.updatedAt.toLocaleDateString()}</dd>
          </div>
        </dl>
        {engagement.status === "CANCELLED" && engagement.cancellationReason && (
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Cancellation Reason</dt>
            <dd className="mt-2 text-sm text-on-surface-variant">{engagement.cancellationReason}</dd>
            {engagement.cancelledAt && (
              <dd className="mt-1 text-xs text-on-surface-variant">Cancelled {engagement.cancelledAt.toLocaleDateString()}</dd>
            )}
          </div>
        )}
      </Card>

      <Card className="gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-portal-display text-lg font-semibold">Linked Projects</h2>
          <span className="text-xs text-on-surface-variant">{engagement.projects.length} linked</span>
        </div>
        {engagement.projects.length === 0 ? (
          <p className="py-6 text-center text-sm text-on-surface-variant">
            No projects linked to this engagement yet.
          </p>
        ) : (
          <div className="space-y-1">
            {engagement.projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="flex items-center justify-between rounded-lg p-3 -mx-3 transition-colors hover:bg-white/5"
              >
                <div>
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="font-portal-data text-xs text-on-surface-variant">{project.projectCode}</p>
                </div>
                <Badge variant="secondary">{titleCase(project.status)}</Badge>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { assertOwnsClientRecord } from "@/lib/ownership";
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

async function getOwnedEngagement(engagementId: string) {
  const user = await requireUser();

  // Select ONLY client-appropriate fields — no internal admin notes,
  // no createdById, no internal audit metadata beyond what a client
  // should reasonably see about their own purchase.
  const engagement = await prisma.clientServiceEngagement.findUnique({
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
      startDate: true,
      endDate: true,
      renewalDate: true,
      clientId: true,
      service: { select: { name: true } },
      plan: { select: { name: true } },
      projects: {
        select: { id: true, name: true, projectCode: true, status: true, progress: true },
      },
    },
  });

  if (!engagement) notFound();
  // IDOR guard: never trust the URL — verify ownership immediately, before
  // rendering or exposing any other field from the record.
  if (!(await assertOwnsClientRecord(user, engagement.clientId))) notFound();

  return engagement;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ engagementId: string }>;
}): Promise<Metadata> {
  const { engagementId } = await params;
  const engagement = await getOwnedEngagement(engagementId);
  return { title: `${engagement.name} | TechParivar` };
}

export default async function PortalServiceDetailPage({
  params,
}: {
  params: Promise<{ engagementId: string }>;
}) {
  const { engagementId } = await params;
  const engagement = await getOwnedEngagement(engagementId);

  return (
    <div className="relative mx-auto max-w-4xl space-y-6 pb-16">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={statusVariant[engagement.status]}>{titleCase(engagement.status)}</Badge>
        </div>
        <h1 className="mt-3 font-portal-display text-2xl font-bold md:text-3xl">{engagement.name}</h1>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          {engagement.service.name}
          {engagement.plan ? ` • ${engagement.plan.name}` : " • Custom engagement"}
        </p>
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
          {engagement.discountType !== "NONE" && (
            <div>
              <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Discount</dt>
              <dd className="mt-1 text-sm font-semibold">
                {engagement.discountType === "PERCENT"
                  ? `${engagement.discountValue}%`
                  : formatMoney(engagement.discountValue, engagement.currency)}
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
            <dd className="mt-1 text-sm font-semibold">
              {engagement.startDate ? engagement.startDate.toLocaleDateString() : "—"}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">End Date</dt>
            <dd className="mt-1 text-sm font-semibold">
              {engagement.endDate ? engagement.endDate.toLocaleDateString() : "—"}
            </dd>
          </div>
          {engagement.billingType === "RECURRING" && (
            <div>
              <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">Renewal Date</dt>
              <dd className="mt-1 text-sm font-semibold">
                {engagement.renewalDate ? engagement.renewalDate.toLocaleDateString() : "—"}
              </dd>
            </div>
          )}
        </dl>
      </Card>

      <Card className="gap-4 p-6">
        <h2 className="font-portal-display text-lg font-semibold">Related Projects</h2>
        {engagement.projects.length === 0 ? (
          <p className="py-6 text-center text-sm text-on-surface-variant">
            No projects linked to this service yet.
          </p>
        ) : (
          <div className="space-y-1">
            {engagement.projects.map((project) => (
              <Link
                key={project.id}
                href={`/portal/projects/${project.id}`}
                className="flex items-center justify-between rounded-lg p-3 -mx-3 transition-colors hover:bg-white/5"
              >
                <div>
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="font-portal-data text-xs text-on-surface-variant">{project.progress}% complete</p>
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

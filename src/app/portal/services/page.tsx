import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { requireClientProfileId } from "@/lib/ownership";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Services | TechParivar Client Portal",
};

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

export default async function PortalServicesPage() {
  const { clientProfileId } = await requireClientProfileId();

  // Server-side ownership scoping — only this client's own engagements are
  // ever queried, never fetched broadly and filtered client-side.
  const engagements = await prisma.clientServiceEngagement.findMany({
    where: { clientId: clientProfileId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      billingType: true,
      billingCycle: true,
      price: true,
      currency: true,
      renewalDate: true,
      service: { select: { name: true } },
      plan: { select: { name: true } },
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Services</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Every service engagement active or past with our team.
        </p>
      </div>

      {engagements.length === 0 ? (
        <Card className="p-16 text-center">
          <p className="text-sm text-on-surface-variant">
            No services yet. Your account manager will set one up here once work begins.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {engagements.map((engagement) => (
            <Link key={engagement.id} href={`/portal/services/${engagement.id}`}>
              <Card className="gap-4 p-6 transition-colors hover:border-primary/60">
                <div className="flex items-center justify-between">
                  <Badge variant={statusVariant[engagement.status]}>
                    {titleCase(engagement.status)}
                  </Badge>
                  <span className="text-sm font-semibold">
                    {formatMoney(engagement.price, engagement.currency)}
                  </span>
                </div>
                <div>
                  <h2 className="font-portal-display text-xl font-semibold">{engagement.name}</h2>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {engagement.service.name}
                    {engagement.plan ? ` • ${engagement.plan.name}` : " • Custom"}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-4 text-sm">
                  <span className="text-on-surface-variant">
                    {engagement.billingType === "RECURRING" && engagement.renewalDate
                      ? `Renews ${engagement.renewalDate.toLocaleDateString()}`
                      : engagement.billingType === "RECURRING"
                        ? "Recurring"
                        : "One-time"}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    View Details <ArrowRight className="size-4" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Plus } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { DeleteClientButton } from "@/components/admin/delete-client-button";
import { formatMoney } from "@/lib/format";

const statusVariant = {
  ACTIVE: "success",
  INACTIVE: "secondary",
  SUSPENDED: "destructive",
} as const;

const engagementStatusVariant = {
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

async function getClient(clientId: string) {
  const client = await prisma.user.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      clientProfile: true,
    },
  });

  if (!client || client.role !== "CLIENT") return null;
  return client;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clientId: string }>;
}): Promise<Metadata> {
  const { clientId } = await params;
  const client = await getClient(clientId);
  return {
    title: client
      ? `${client.name} | TechParivar Admin`
      : "Client | TechParivar Admin",
  };
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = await getClient(clientId);
  if (!client) notFound();

  const profile = client.clientProfile;
  const lastUpdated = profile?.updatedAt ?? client.updatedAt;

  const engagements = profile
    ? await prisma.clientServiceEngagement.findMany({
        where: { clientId: profile.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          status: true,
          price: true,
          currency: true,
          service: { select: { name: true } },
        },
      })
    : [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
              {client.name}
            </h1>
            {profile && (
              <Badge variant={statusVariant[profile.status]}>
                {profile.status}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">
            {client.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <Link href={`/admin/clients/${client.id}/edit`}>
              <Pencil className="size-4" /> Edit Client
            </Link>
          </Button>
          <DeleteClientButton clientId={client.id} clientName={client.name} />
        </div>
      </div>

      <Card className="gap-6 p-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Company
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {profile?.companyName ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Phone
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {profile?.phone ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Website
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {profile?.website ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Created
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {client.createdAt.toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Last Updated
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {lastUpdated.toLocaleDateString()}
            </dd>
          </div>
        </dl>
        {profile?.notes && (
          <div>
            <dt className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Notes
            </dt>
            <dd className="mt-2 whitespace-pre-wrap text-sm text-on-surface-variant">
              {profile.notes}
            </dd>
          </div>
        )}
      </Card>

      {profile && (
        <Card className="gap-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-portal-display text-lg font-semibold">Service Engagements</h2>
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/admin/engagements/new?clientId=${profile.id}`}>
                <Plus className="size-4" /> New Engagement
              </Link>
            </Button>
          </div>
          {engagements.length === 0 ? (
            <p className="py-6 text-center text-sm text-on-surface-variant">
              No service engagements yet.
            </p>
          ) : (
            <div className="space-y-1">
              {engagements.map((engagement) => (
                <Link
                  key={engagement.id}
                  href={`/admin/engagements/${engagement.id}`}
                  className="flex items-center justify-between rounded-lg p-3 -mx-3 transition-colors hover:bg-white/5"
                >
                  <div>
                    <p className="text-sm font-medium">{engagement.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {engagement.service.name} • {formatMoney(engagement.price, engagement.currency)}
                    </p>
                  </div>
                  <Badge variant={engagementStatusVariant[engagement.status]}>
                    {titleCase(engagement.status)}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

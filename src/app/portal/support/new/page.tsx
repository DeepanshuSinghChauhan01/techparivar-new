import type { Metadata } from "next";

import { Card } from "@/components/portal-ui/card";
import { prisma } from "@/lib/prisma";
import { requireClientProfileId } from "@/lib/ownership";
import { NewTicketForm } from "@/components/portal/new-ticket-form";

export const metadata: Metadata = {
  title: "New Ticket | TechParivar Client Portal",
};

export default async function NewTicketPage() {
  const { clientProfileId } = await requireClientProfileId();

  const projects = await prisma.project.findMany({
    where: { clientId: clientProfileId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
          New Support Ticket
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Tell us what&apos;s going on and we&apos;ll take a look.
        </p>
      </div>

      <Card className="p-6">
        <NewTicketForm projects={projects} />
      </Card>
    </div>
  );
}

import type { Metadata } from "next";

import { Card } from "@/components/portal-ui/card";
import { NewClientForm } from "@/components/admin/new-client-form";

export const metadata: Metadata = { title: "New Client | TechParivar Admin" };

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
          New Client
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Create a client account and profile.
        </p>
      </div>

      <Card className="p-6">
        <NewClientForm />
      </Card>
    </div>
  );
}

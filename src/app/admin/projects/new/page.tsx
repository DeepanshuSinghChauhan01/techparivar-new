import type { Metadata } from "next";

import { Card } from "@/components/portal-ui/card";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/project-form";
import { createProjectAction } from "@/app/admin/projects/actions";

export const metadata: Metadata = { title: "New Project | TechParivar Admin" };

export default async function NewProjectPage() {
  const clients = await prisma.clientProfile.findMany({
    orderBy: { companyName: "asc" },
    select: { id: true, companyName: true, user: { select: { name: true } } },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
          New Project
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Create and assign a project to a client.
        </p>
      </div>

      <Card className="p-6">
        <ProjectForm
          action={createProjectAction}
          clients={clients.map((c) => ({
            id: c.id,
            companyName: c.companyName,
            userName: c.user.name,
          }))}
          defaultValues={{
            name: "",
            clientId: "",
            description: "",
            status: "PLANNING",
            priority: "MEDIUM",
            startDate: "",
            dueDate: "",
          }}
          submitLabel="Create Project"
          pendingLabel="Creating..."
          cancelHref="/admin/projects"
        />
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/portal-ui/card";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/project-form";
import { updateProjectAction } from "@/app/admin/projects/actions";

export const metadata: Metadata = { title: "Edit Project | TechParivar Admin" };

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

async function getProject(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      priority: true,
      clientId: true,
      startDate: true,
      dueDate: true,
    },
  });
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project, clients] = await Promise.all([
    getProject(projectId),
    prisma.clientProfile.findMany({
      orderBy: { companyName: "asc" },
      select: { id: true, companyName: true, user: { select: { name: true } } },
    }),
  ]);

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
          Edit Project
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">{project.name}</p>
      </div>

      <Card className="p-6">
        <ProjectForm
          action={updateProjectAction}
          projectId={project.id}
          clients={clients.map((c) => ({
            id: c.id,
            companyName: c.companyName,
            userName: c.user.name,
          }))}
          defaultValues={{
            name: project.name,
            clientId: project.clientId,
            description: project.description ?? "",
            status: project.status,
            priority: project.priority,
            startDate: toDateInputValue(project.startDate),
            dueDate: toDateInputValue(project.dueDate),
          }}
          submitLabel="Save Changes"
          pendingLabel="Saving..."
          cancelHref={`/admin/projects/${project.id}`}
        />
      </Card>
    </div>
  );
}

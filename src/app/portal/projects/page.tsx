import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { prisma } from "@/lib/prisma";
import { requireClientProfileId } from "@/lib/ownership";

export const metadata: Metadata = {
  title: "Projects | TechParivar Client Portal",
};

const statusVariant = {
  PLANNING: "secondary",
  ACTIVE: "success",
  ON_HOLD: "warning",
  COMPLETED: "info",
  CANCELLED: "destructive",
} as const;

const priorityVariant = {
  LOW: "secondary",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "destructive",
} as const;

function titleCase(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export default async function PortalProjectsPage() {
  const { clientProfileId } = await requireClientProfileId();

  const projects = await prisma.project.findMany({
    where: { clientId: clientProfileId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      priority: true,
      startDate: true,
      dueDate: true,
      updatedAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
          Projects
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Every active and past engagement with our engineering team.
        </p>
      </div>

      {projects.length === 0 ? (
        <Card className="p-16 text-center">
          <p className="text-sm text-on-surface-variant">
            No projects yet. Your project manager will set one up here once
            work begins.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.id} href={`/portal/projects/${project.id}`}>
              <Card className="gap-4 p-6 transition-colors hover:border-primary/60">
                <div className="flex items-center justify-between">
                  <Badge variant={statusVariant[project.status]}>
                    {titleCase(project.status)}
                  </Badge>
                  <Badge variant={priorityVariant[project.priority]}>
                    {titleCase(project.priority)}
                  </Badge>
                </div>
                <div>
                  <h2 className="font-portal-display text-xl font-semibold">
                    {project.name}
                  </h2>
                  {project.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
                      {project.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-4 text-sm">
                  <span className="text-on-surface-variant">
                    {project.dueDate
                      ? `Due ${project.dueDate.toLocaleDateString()}`
                      : "No due date set"}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    View Project <ArrowRight className="size-4" />
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

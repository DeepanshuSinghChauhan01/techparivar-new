import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";

import { Badge } from "@/components/portal-ui/badge";
import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { ProjectTabs } from "@/components/portal/project-tabs";
import { projects } from "@/data/portal";

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  return { title: project ? `${project.name} | TechParivar` : "Project | TechParivar" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <div className="relative mx-auto max-w-6xl space-y-6 pb-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Badge variant="info">{project.status}</Badge>
            <span className="font-portal-data text-xs text-on-surface-variant">{project.code}</span>
          </div>
          <h1 className="mt-3 font-portal-display text-2xl font-bold md:text-3xl">
            {project.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            {project.description}
          </p>
        </div>

        <Card className="flex-row divide-x divide-border/60 p-0">
          <div className="px-6 py-4">
            <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Staging Status
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-portal-display text-lg font-semibold">
              <span className="size-2 rounded-full bg-mint-green" />
              {project.stagingStatus}
            </p>
          </div>
          <div className="px-6 py-4">
            <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Production
            </p>
            <p className="mt-1 font-portal-display text-lg font-semibold text-primary">
              {project.productionEta}
            </p>
          </div>
        </Card>
      </div>

      <ProjectTabs project={project} />

      <Button
        size="icon"
        className="fixed bottom-8 right-8 size-14 rounded-full shadow-[0_8px_30px_rgba(255,92,0,0.4)] lg:right-12"
      >
        <Plus className="size-6" />
      </Button>
    </div>
  );
}

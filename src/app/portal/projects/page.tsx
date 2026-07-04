import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { Progress } from "@/components/portal-ui/progress";
import { projects } from "@/data/portal";

export const metadata: Metadata = {
  title: "Projects | TechParivar Client Portal",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Projects</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Every active and past engagement with our engineering team.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.id} href={`/portal/projects/${project.id}`}>
            <Card className="gap-5 p-6 transition-colors hover:border-primary/60">
              <div className="flex items-center justify-between">
                <Badge variant="info">{project.status}</Badge>
                <span className="font-portal-data text-xs text-on-surface-variant">
                  {project.code}
                </span>
              </div>
              <div>
                <h2 className="font-portal-display text-xl font-semibold">{project.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {project.description}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Overall Health: {project.overallHealth}</span>
                  <span>{project.healthProgress}%</span>
                </div>
                <Progress value={project.healthProgress} indicatorClassName="bg-mint-green" />
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-4 text-sm">
                <span className="text-on-surface-variant">
                  {project.tasks.filter((t) => t.done).length}/{project.totalTasks} tasks complete
                </span>
                <span className="flex items-center gap-1 font-semibold text-primary">
                  View Project <ArrowRight className="size-4" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

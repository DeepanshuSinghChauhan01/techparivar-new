"use client";

import { Filter, ArrowUpDown, FileImage, FileText, Plus } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/portal-ui/tabs";
import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { Checkbox } from "@/components/portal-ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/portal-ui/avatar";
import { Button } from "@/components/portal-ui/button";
import { cn } from "@/lib/utils";
import type { ProjectDetail } from "@/data/portal";

const priorityVariant: Record<string, "destructive" | "warning" | "secondary"> = {
  High: "destructive",
  Medium: "warning",
  Low: "secondary",
};

export function ProjectTabs({ project }: { project: ProjectDetail }) {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="comments">
          Comments <Badge variant="secondary" className="ml-1 px-1.5">12</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-2">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.85fr_1.3fr]">
          <div className="space-y-5">
            <Card className="gap-5 p-6">
              <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Process Milestone
              </p>
              <div className="relative space-y-6 pl-6">
                <div className="absolute left-[7px] top-1 h-[calc(100%-1.75rem)] w-px bg-border" />
                {project.milestones.map((milestone) => (
                  <div key={milestone.key} className="relative">
                    <span
                      className={cn(
                        "absolute -left-6 top-0.5 flex size-4 items-center justify-center rounded-full border-2",
                        milestone.status === "done" &&
                          "border-primary bg-primary",
                        milestone.status === "current" &&
                          "border-primary bg-surface",
                        milestone.status === "upcoming" &&
                          "border-border bg-surface-container-high"
                      )}
                    />
                    <p
                      className={cn(
                        "font-semibold",
                        milestone.status === "upcoming" && "text-on-surface-variant"
                      )}
                    >
                      {milestone.title}
                    </p>
                    <p className="text-xs text-on-surface-variant">{milestone.meta}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-border/60 bg-surface-container-low p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Overall Health</p>
                  <span className="text-xs font-semibold text-mint-green">
                    {project.overallHealth.toUpperCase()}
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full rounded-full bg-mint-green"
                    style={{ width: `${project.healthProgress}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="gap-4 p-6">
              <div className="flex items-center justify-between">
                <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Active Tasks
                </p>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Filter className="size-3.5" /> Filter
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowUpDown className="size-3.5" /> Sort
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-white/5"
                  >
                    <Checkbox checked={task.done} />
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        task.done && "text-on-surface-variant line-through"
                      )}
                    >
                      {task.title}
                    </span>
                    <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[10px]">
                        {task.assigneeInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="w-14 shrink-0 text-right font-portal-data text-[11px] text-on-surface-variant">
                      {task.due}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm font-semibold text-primary">
                View all {project.totalTasks} tasks
              </p>
            </Card>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Card className="gap-4 p-6">
                <div className="flex items-center justify-between">
                  <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Recently Shared
                  </p>
                  <span className="text-xs font-semibold text-primary">View Folder</span>
                </div>
                <div className="space-y-3">
                  {project.sharedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                        {file.type === "image" ? (
                          <FileImage className="size-4" />
                        ) : (
                          <FileText className="size-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-on-surface-variant">
                          {file.size} · {file.sharedMeta}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="gap-4 p-6">
                <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  System Performance
                </p>
                <div className="flex h-20 items-end gap-1.5">
                  {project.performanceBars.map((bar, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex-1 rounded-t-sm bg-surface-container-highest",
                        index === project.performanceBars.length - 2 && "bg-primary"
                      )}
                      style={{ height: `${bar}%` }}
                    />
                  ))}
                </div>
                <div>
                  <p className="font-portal-display text-2xl font-bold">
                    {project.uptime}
                    <span className="ml-2 text-sm font-medium text-mint-green">
                      {project.latencyShift}
                    </span>
                  </p>
                  <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
                    Uptime Reliability
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="timeline" className="mt-2">
        <Card className="gap-6 p-6">
          <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Project Timeline
          </p>
          <div className="relative space-y-8 pl-6">
            <div className="absolute left-[7px] top-1 h-[calc(100%-1.75rem)] w-px bg-border" />
            {project.milestones.map((milestone) => (
              <div key={milestone.key} className="relative">
                <span
                  className={cn(
                    "absolute -left-6 top-0.5 flex size-4 items-center justify-center rounded-full border-2",
                    milestone.status === "done" && "border-primary bg-primary",
                    milestone.status === "current" && "border-primary bg-surface",
                    milestone.status === "upcoming" && "border-border bg-surface-container-high"
                  )}
                />
                <p className="font-semibold">{milestone.title}</p>
                <p className="text-sm text-on-surface-variant">{milestone.meta}</p>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="tasks" className="mt-2">
        <Card className="gap-1 p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              All Tasks ({project.totalTasks})
            </p>
            <Button size="sm" variant="secondary">
              <Plus className="size-3.5" /> Add Task
            </Button>
          </div>
          {project.tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-white/5">
              <Checkbox checked={task.done} />
              <span className={cn("flex-1 text-sm", task.done && "text-on-surface-variant line-through")}>
                {task.title}
              </span>
              <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
              <Avatar className="size-6">
                <AvatarFallback className="text-[10px]">{task.assigneeInitials}</AvatarFallback>
              </Avatar>
              <span className="w-14 shrink-0 text-right font-portal-data text-[11px] text-on-surface-variant">
                {task.due}
              </span>
            </div>
          ))}
        </Card>
      </TabsContent>

      <TabsContent value="files" className="mt-2">
        <Card className="gap-4 p-6">
          <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Project Files
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {project.sharedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-surface-container-low p-3"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  {file.type === "image" ? (
                    <FileImage className="size-4" />
                  ) : (
                    <FileText className="size-4" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {file.size} · {file.sharedMeta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="comments" className="mt-2">
        <Card className="gap-5 p-6">
          <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Discussion
          </p>
          <div className="space-y-5">
            {[
              { initials: "AK", name: "Alex Kim", time: "2h ago", text: "Checkout flow mockups are ready for review — pushed to the shared folder." },
              { initials: "SC", name: "Sarah Chen", time: "1h ago", text: "Looks great! Can we bump the CTA contrast slightly for accessibility?" },
              { initials: "MK", name: "Maya Kapoor", time: "40m ago", text: "On it — will have an updated pass by EOD." },
            ].map((comment) => (
              <div key={comment.name + comment.time} className="flex gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">{comment.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">{comment.name}</span>{" "}
                    <span className="text-xs text-on-surface-variant">{comment.time}</span>
                  </p>
                  <p className="mt-1 text-sm text-on-surface-variant">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

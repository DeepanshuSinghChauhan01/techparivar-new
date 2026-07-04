import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  GitMerge,
  Image as ImageIcon,
  Search,
  ShoppingCart,
  Gauge,
  Video,
} from "lucide-react";

import { Button } from "@/components/portal-ui/button";
import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { Avatar, AvatarFallback } from "@/components/portal-ui/avatar";
import { Progress } from "@/components/portal-ui/progress";
import {
  currentUser,
  storeHealth,
  nextMeeting,
  currentProjects,
  recentUpdates,
  openTicketsPreview,
  storeSpotlight,
} from "@/data/portal";

export const metadata: Metadata = {
  title: "Dashboard | TechParivar Client Portal",
};

const updateIconMap = {
  FileText,
  GitMerge,
  Image: ImageIcon,
};

const metricIconMap = {
  Gauge,
  Search,
  ShoppingCart,
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Welcome banner */}
      <Card className="flex-row flex-wrap items-center justify-between gap-6 border-border/80 bg-surface-container p-8">
        <div className="max-w-lg">
          <h1 className="font-portal-display text-2xl font-bold md:text-3xl">
            Good morning, {currentUser.firstName}.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant md:text-base">
            {storeHealth.summary.split(storeHealth.performanceDelta)[0]}
            <span className="font-semibold text-mint-green">
              {storeHealth.performanceDelta}
            </span>
            {storeHealth.summary.split(storeHealth.performanceDelta)[1]}
          </p>
          <Button variant="secondary" className="mt-6" asChild>
            <Link href="/portal/store-health">
              View Report <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="flex gap-6 rounded-xl border border-border/60 bg-surface-container-low px-6 py-5">
          <div>
            <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Active Store
            </p>
            <p className="mt-1 font-portal-display text-lg font-bold">
              {currentUser.activeStore}
            </p>
          </div>
          <div className="w-px bg-border/60" />
          <div>
            <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
              Global Rank
            </p>
            <p className="mt-1 font-portal-display text-lg font-bold text-primary">
              {currentUser.globalRank}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2.2fr_1fr]">
        <div className="space-y-5">
          {/* Store health metric cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {storeHealth.metrics.map((metric) => {
              const Icon = metricIconMap[metric.icon as keyof typeof metricIconMap];
              return (
                <Card key={metric.key} className="gap-4 p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-xs font-semibold text-mint-green">
                      {metric.delta}
                    </span>
                  </div>
                  <div>
                    <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
                      {metric.label}
                    </p>
                    <p className="mt-1 font-portal-display text-2xl font-bold">
                      {metric.value}
                      <span className="text-sm font-medium text-on-surface-variant">
                        {" "}
                        {metric.unit ?? `/ ${metric.max}`}
                      </span>
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Current projects */}
          <Card className="gap-5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-portal-display text-lg font-semibold">Current Projects</h2>
                <p className="text-xs text-on-surface-variant">Active development sprints</p>
              </div>
              <Link
                href="/portal/projects"
                className="text-sm font-semibold text-primary"
              >
                View Roadmap
              </Link>
            </div>
            <div className="space-y-5">
              {currentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portal/projects/${project.id}`}
                  className="block rounded-lg p-3 -mx-3 transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{project.name}</p>
                    <span className="text-sm font-semibold text-primary">
                      {project.progress}%
                    </span>
                  </div>
                  <Progress value={project.progress} className="mt-3" />
                  <div className="mt-3 flex items-center justify-between">
                    <Avatar className={`size-6 ${project.ownerColor}`}>
                      <AvatarFallback className="bg-transparent text-[10px] text-primary-foreground">
                        {project.ownerInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-portal-data text-[11px] uppercase tracking-wider text-on-surface-variant">
                      {project.eta}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent updates */}
          <Card className="gap-5 p-6">
            <h2 className="font-portal-display text-lg font-semibold">Recent Updates</h2>
            <div className="space-y-4">
              {recentUpdates.map((update) => {
                const Icon = updateIconMap[update.icon as keyof typeof updateIconMap];
                return (
                  <div key={update.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{update.title}</p>
                      <p className="text-xs text-on-surface-variant">{update.meta}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          {/* Next meeting */}
          <Card className="gap-3 border-l-2 border-l-primary p-5">
            <div className="flex items-center justify-between">
              <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
                Next Meeting
              </p>
              <Badge>{nextMeeting.countdown}</Badge>
            </div>
            <div>
              <p className="font-portal-display text-lg font-semibold">{nextMeeting.title}</p>
              <p className="text-sm text-on-surface-variant">{nextMeeting.time}</p>
            </div>
            <Button variant="secondary" className="w-full" asChild>
              <Link href="/portal/meetings">
                <Video className="size-4" />
                {nextMeeting.joinLabel}
              </Link>
            </Button>
          </Card>

          {/* Open tickets */}
          <Card className="gap-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-portal-display text-base font-semibold">Open Tickets</h2>
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {openTicketsPreview.length}
              </span>
            </div>
            <div className="space-y-3">
              {openTicketsPreview.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-lg border border-border/60 bg-surface-container-low p-3"
                >
                  <Badge
                    variant={ticket.priority === "Urgent" ? "destructive" : "success"}
                    className="mb-2"
                  >
                    {ticket.priority}
                  </Badge>
                  <p className="text-sm font-semibold">{ticket.title}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">{ticket.updated}</p>
                </div>
              ))}
            </div>
            <Link
              href="/portal/support"
              className="text-center text-sm font-semibold text-primary"
            >
              View All Support Tickets
            </Link>
          </Card>

          {/* Store spotlight */}
          <Card className="gap-0 overflow-hidden p-0">
            <div className="flex h-40 items-end bg-gradient-to-br from-[#241b12] to-[#15120e] p-4">
              <div>
                <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
                  {storeSpotlight.label}
                </p>
                <p className="font-portal-display text-lg font-semibold">
                  {storeSpotlight.name}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

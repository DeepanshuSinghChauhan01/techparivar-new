import type { Metadata } from "next";
import { Gauge, Search, ShoppingCart } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { storeHealth, currentUser } from "@/data/portal";

export const metadata: Metadata = {
  title: "Store Health | TechParivar Client Portal",
};

const metricIconMap = { Gauge, Search, ShoppingCart };

const uptimeDays = [98, 100, 100, 96, 100, 99, 100, 100, 97, 100, 100, 100, 95, 100];

export default function StoreHealthPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Store Health</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Live performance telemetry for {currentUser.activeStore}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {storeHealth.metrics.map((metric) => {
          const Icon = metricIconMap[metric.icon as keyof typeof metricIconMap];
          return (
            <Card key={metric.key} className="gap-4 p-5">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="text-xs font-semibold text-mint-green">{metric.delta}</span>
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

      <Card className="gap-4 p-6">
        <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Uptime — Last 14 Days
        </p>
        <div className="flex h-32 items-end gap-2">
          {uptimeDays.map((day, index) => (
            <div key={index} className="flex-1 rounded-t-sm bg-mint-green/70" style={{ height: `${day}%` }} />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card className="gap-3 p-6">
          <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Core Web Vitals
          </p>
          {[
            { label: "Largest Contentful Paint", value: "1.2s", status: "Good" },
            { label: "Interaction to Next Paint", value: "84ms", status: "Good" },
            { label: "Cumulative Layout Shift", value: "0.03", status: "Good" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between border-b border-border/40 py-3 last:border-0">
              <span className="text-sm text-on-surface-variant">{row.label}</span>
              <span className="text-sm font-semibold text-mint-green">
                {row.value} · {row.status}
              </span>
            </div>
          ))}
        </Card>

        <Card className="gap-3 p-6">
          <p className="font-portal-data text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Traffic Sources
          </p>
          {[
            { label: "Organic Search", value: "42%" },
            { label: "Email Campaigns", value: "26%" },
            { label: "Paid Social", value: "18%" },
            { label: "Direct", value: "14%" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between border-b border-border/40 py-3 last:border-0">
              <span className="text-sm text-on-surface-variant">{row.label}</span>
              <span className="text-sm font-semibold">{row.value}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Filter, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/portal-ui/button";
import { TicketBoard } from "@/components/portal/ticket-board";

export const metadata: Metadata = {
  title: "Support Tickets | TechParivar Client Portal",
};

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-portal-display text-2xl font-bold md:text-3xl">Support Tickets</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Track engineering requests, bugs, and infrastructure changes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="size-3.5" /> Filters
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="size-3.5" /> Sort
          </Button>
        </div>
      </div>

      <TicketBoard />
    </div>
  );
}

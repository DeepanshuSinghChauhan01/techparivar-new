"use client";

import { useState } from "react";
import { LayoutGrid, List, MessageCircle, Paperclip, Plus } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Badge } from "@/components/portal-ui/badge";
import { Avatar, AvatarFallback } from "@/components/portal-ui/avatar";
import { Progress } from "@/components/portal-ui/progress";
import { cn } from "@/lib/utils";
import { ticketColumns, type Ticket } from "@/data/portal";

const priorityVariant: Record<Ticket["priority"], "destructive" | "warning" | "info"> = {
  Urgent: "destructive",
  High: "warning",
  Normal: "info",
};

function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Card className="cursor-pointer gap-3 p-4 transition-colors hover:border-primary/50">
      <div className="flex items-center justify-between">
        <Badge variant={priorityVariant[ticket.priority]}>{ticket.priority}</Badge>
        <span className="font-portal-data text-[11px] text-on-surface-variant">#{ticket.id}</span>
      </div>
      <p className="text-sm font-semibold leading-snug">{ticket.title}</p>
      <p className="flex items-center gap-1.5 font-portal-data text-[11px] text-on-surface-variant">
        <span className="size-1.5 rounded-full bg-electric-blue" />
        {ticket.domain}
      </p>

      {typeof ticket.progress === "number" && (
        <Progress value={ticket.progress} indicatorClassName="bg-electric-blue" />
      )}

      {ticket.status && (
        <Badge variant="destructive" className="w-fit">
          {ticket.status}
        </Badge>
      )}

      <div className="flex items-center justify-between pt-1">
        {ticket.unassigned ? (
          <span className="flex items-center gap-2 text-xs text-on-surface-variant">
            <Avatar className="size-6">
              <AvatarFallback className="bg-electric-blue/20 text-[10px] text-electric-blue">
                ?
              </AvatarFallback>
            </Avatar>
            Unassigned
          </span>
        ) : (
          <span className="flex items-center gap-2 text-xs text-on-surface-variant">
            <Avatar className="size-6">
              <AvatarFallback className="text-[10px]">{ticket.assignee?.initials}</AvatarFallback>
            </Avatar>
            {ticket.assignee?.name}
          </span>
        )}

        <span className="flex items-center gap-3 text-xs text-on-surface-variant">
          {ticket.comments !== undefined && (
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3.5" /> {ticket.comments}
            </span>
          )}
          {ticket.attachments !== undefined && (
            <span className="flex items-center gap-1">
              <Paperclip className="size-3.5" /> {ticket.attachments}
            </span>
          )}
          {ticket.updated && <span>{ticket.updated}</span>}
        </span>
      </div>
    </Card>
  );
}

export function TicketBoard() {
  const [view, setView] = useState<"kanban" | "table">("kanban");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-lg border border-border bg-surface-container-low p-1">
          <button
            onClick={() => setView("kanban")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              view === "kanban" ? "bg-surface-container-high text-foreground" : "text-on-surface-variant"
            )}
          >
            <LayoutGrid className="size-3.5" /> Kanban
          </button>
          <button
            onClick={() => setView("table")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              view === "table" ? "bg-surface-container-high text-foreground" : "text-on-surface-variant"
            )}
          >
            <List className="size-3.5" /> Table
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {["AV", "LK", "SM", "MK"].map((initials) => (
              <Avatar key={initials} className="size-7 border-2 border-surface">
                <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="font-portal-data text-xs text-on-surface-variant">+4</span>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {ticketColumns.map((column) => (
            <div key={column.key} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className={cn("size-2 rounded-full", column.dotColor)} />
                  {column.title}
                  <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-xs text-on-surface-variant">
                    {column.tickets.length}
                  </span>
                </span>
                <Plus className="size-4 text-on-surface-variant" />
              </div>
              <div className="space-y-3">
                {column.tickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
                {column.tickets.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-on-surface-variant">
                    No tickets
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="gap-0 overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs text-on-surface-variant">
                <th className="px-5 py-3 font-medium">Ticket</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Assignee</th>
                <th className="px-5 py-3 font-medium">Domain</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {ticketColumns.flatMap((column) =>
                column.tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-border/40 last:border-0 hover:bg-white/5">
                    <td className="px-5 py-3">
                      <p className="font-medium">{ticket.title}</p>
                      <p className="font-portal-data text-[11px] text-on-surface-variant">#{ticket.id}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={priorityVariant[ticket.priority]}>{ticket.priority}</Badge>
                    </td>
                    <td className="px-5 py-3 text-on-surface-variant">
                      {ticket.unassigned ? "Unassigned" : ticket.assignee?.name}
                    </td>
                    <td className="px-5 py-3 font-portal-data text-xs text-on-surface-variant">
                      {ticket.domain}
                    </td>
                    <td className="px-5 py-3 text-on-surface-variant">{column.title}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

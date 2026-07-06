"use client";

import { useActionState } from "react";

import { Button } from "@/components/portal-ui/button";
import { Label } from "@/components/portal-ui/label";
import {
  adminUpdateTicketAction,
  type ActionState,
} from "@/app/admin/tickets/actions";

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50";

const initialState: ActionState = {};

export function TicketUpdateForm({
  ticketId,
  defaultStatus,
  defaultPriority,
  defaultProjectId,
  projects,
}: {
  ticketId: string;
  defaultStatus: "OPEN" | "IN_PROGRESS" | "WAITING_FOR_CLIENT" | "RESOLVED" | "CLOSED";
  defaultPriority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  defaultProjectId: string;
  projects: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(
    adminUpdateTicketAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="ticketId" value={ticketId} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={defaultStatus}
            disabled={isPending}
            className={selectClass}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_FOR_CLIENT">Waiting for Client</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            name="priority"
            defaultValue={defaultPriority}
            disabled={isPending}
            className={selectClass}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectId">Project</Label>
          <select
            id="projectId"
            name="projectId"
            defaultValue={defaultProjectId}
            disabled={isPending}
            className={selectClass}
          >
            <option value="">No Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {state.fieldErrors?.projectId && (
            <p className="text-xs text-red-500">
              {state.fieldErrors.projectId[0]}
            </p>
          )}
        </div>
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.success && <p className="text-sm text-mint-green">Changes saved.</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

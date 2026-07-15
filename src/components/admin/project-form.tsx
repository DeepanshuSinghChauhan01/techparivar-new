"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { Textarea } from "@/components/portal-ui/textarea";
import type { ActionState } from "@/app/admin/projects/actions";

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50";

type ClientOption = { id: string; companyName: string; userName: string };
type EngagementOption = {
  id: string;
  name: string;
  status: string;
  serviceName: string;
  planName: string | null;
};

type DefaultValues = {
  name: string;
  clientId: string;
  description: string;
  status: "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  progress: number;
  startDate: string;
  dueDate: string;
  engagementId?: string;
};

const initialState: ActionState = {};

export function ProjectForm({
  action,
  clients,
  defaultValues,
  projectId,
  projectCode,
  engagementOptions,
  submitLabel,
  pendingLabel,
  cancelHref,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  clients: ClientOption[];
  defaultValues: DefaultValues;
  projectId?: string;
  projectCode?: string;
  engagementOptions?: EngagementOption[];
  submitLabel: string;
  pendingLabel: string;
  cancelHref: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {projectId && (
        <input type="hidden" name="projectId" value={projectId} />
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {projectCode && (
          <div className="space-y-2 sm:col-span-2">
            <Label>Project Code</Label>
            <p className="font-portal-data text-sm text-on-surface-variant">
              {projectCode}
            </p>
          </div>
        )}

        {engagementOptions && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="engagementId">
              Engagement <span className="text-on-surface-variant">(optional — link this project to a purchased service)</span>
            </Label>
            <select
              id="engagementId"
              name="engagementId"
              defaultValue={defaultValues.engagementId ?? ""}
              disabled={isPending}
              className={selectClass}
            >
              <option value="">No Engagement</option>
              {engagementOptions.map((engagement) => (
                <option key={engagement.id} value={engagement.id}>
                  {engagement.serviceName} — {engagement.name} ({engagement.status}
                  {engagement.planName ? `, ${engagement.planName}` : ""})
                </option>
              ))}
            </select>
            {state.fieldErrors?.engagementId && (
              <p className="text-xs text-red-500">{state.fieldErrors.engagementId[0]}</p>
            )}
          </div>
        )}

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={defaultValues.name}
            required
            disabled={isPending}
          />
          {state.fieldErrors?.name && (
            <p className="text-xs text-red-500">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientId">Client</Label>
          <select
            id="clientId"
            name="clientId"
            defaultValue={defaultValues.clientId}
            required
            disabled={isPending}
            className={selectClass}
          >
            <option value="" disabled>
              Select a client
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.companyName} — {client.userName}
              </option>
            ))}
          </select>
          {state.fieldErrors?.clientId && (
            <p className="text-xs text-red-500">
              {state.fieldErrors.clientId[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues.status}
            disabled={isPending}
            className={selectClass}
          >
            <option value="PLANNING">Planning</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            name="priority"
            defaultValue={defaultValues.priority}
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
          <Label htmlFor="progress">Progress (%)</Label>
          <Input
            id="progress"
            name="progress"
            type="number"
            min={0}
            max={100}
            step={1}
            defaultValue={defaultValues.progress}
            disabled={isPending}
          />
          {state.fieldErrors?.progress && (
            <p className="text-xs text-red-500">
              {state.fieldErrors.progress[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={defaultValues.startDate}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={defaultValues.dueDate}
            disabled={isPending}
          />
          {state.fieldErrors?.dueDate && (
            <p className="text-xs text-red-500">
              {state.fieldErrors.dueDate[0]}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={defaultValues.description}
            disabled={isPending}
          />
        </div>
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

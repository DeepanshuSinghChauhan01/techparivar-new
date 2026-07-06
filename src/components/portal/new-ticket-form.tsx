"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { Textarea } from "@/components/portal-ui/textarea";
import {
  createTicketAction,
  type ActionState,
} from "@/app/portal/support/actions";

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50";

const initialState: ActionState = {};

export function NewTicketForm({
  projects,
}: {
  projects: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(
    createTicketAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required disabled={isPending} />
        {state.fieldErrors?.subject && (
          <p className="text-xs text-red-500">{state.fieldErrors.subject[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={6}
          required
          disabled={isPending}
        />
        {state.fieldErrors?.description && (
          <p className="text-xs text-red-500">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            name="priority"
            defaultValue="MEDIUM"
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
          <Label htmlFor="projectId">Related Project (optional)</Label>
          <select
            id="projectId"
            name="projectId"
            defaultValue=""
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

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Ticket"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/portal/support">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

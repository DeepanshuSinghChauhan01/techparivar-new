"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import {
  createFolderAction,
  type FolderActionState,
} from "@/app/admin/files/folder-actions";

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50";

const initialState: FolderActionState = {};

type ClientOption = { id: string; companyName: string; userName: string };
type ProjectOption = { id: string; name: string; clientId: string };

export function CreateFolderForm({
  clients,
  projects,
}: {
  clients: ClientOption[];
  projects: ProjectOption[];
}) {
  const [state, formAction, isPending] = useActionState(
    createFolderAction,
    initialState
  );
  const [clientId, setClientId] = useState("");
  const availableProjects = projects.filter((p) => p.clientId === clientId);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
      <div className="space-y-2">
        <Label htmlFor="folder-client">Client</Label>
        <select
          id="folder-client"
          name="clientId"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
          disabled={isPending}
          className={selectClass}
        >
          <option value="" disabled>
            Select a client
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.companyName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="folder-project">Project (optional)</Label>
        <select
          id="folder-project"
          name="projectId"
          defaultValue=""
          disabled={isPending || !clientId}
          className={selectClass}
        >
          <option value="">No Project</option>
          {availableProjects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="folder-name">Folder Name</Label>
        <Input id="folder-name" name="name" required disabled={isPending} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Folder"}
      </Button>

      {state.error && (
        <p className="text-sm text-red-500 sm:col-span-4">{state.error}</p>
      )}
    </form>
  );
}

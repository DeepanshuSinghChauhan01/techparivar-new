"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { Textarea } from "@/components/portal-ui/textarea";
import {
  updateFileMetadataAction,
  type ActionState,
} from "@/app/admin/files/actions";

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50";

const initialState: ActionState = {};

type ProjectOption = { id: string; name: string };
type FolderOption = { id: string; name: string };

type DefaultValues = {
  displayName: string;
  category: "DELIVERABLE" | "DOCUMENT" | "ASSET" | "REPORT" | "CONTRACT" | "OTHER";
  description: string;
  visibleToClient: boolean;
  projectId: string;
  folderId: string;
};

export function EditFileForm({
  fileId,
  defaultValues,
  projects,
  folders,
  cancelHref,
}: {
  fileId: string;
  defaultValues: DefaultValues;
  projects: ProjectOption[];
  folders: FolderOption[];
  cancelHref: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updateFileMetadataAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="fileId" value={fileId} />

      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          name="displayName"
          defaultValue={defaultValues.displayName}
          required
          disabled={isPending}
        />
        {state.fieldErrors?.displayName && (
          <p className="text-xs text-red-500">{state.fieldErrors.displayName[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue={defaultValues.category}
            disabled={isPending}
            className={selectClass}
          >
            <option value="DELIVERABLE">Deliverable</option>
            <option value="DOCUMENT">Document</option>
            <option value="ASSET">Asset</option>
            <option value="REPORT">Report</option>
            <option value="CONTRACT">Contract</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div />

        <div className="space-y-2">
          <Label htmlFor="projectId">Project (optional)</Label>
          <select
            id="projectId"
            name="projectId"
            defaultValue={defaultValues.projectId}
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
            <p className="text-xs text-red-500">{state.fieldErrors.projectId[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="folderId">Folder (optional)</Label>
          <select
            id="folderId"
            name="folderId"
            defaultValue={defaultValues.folderId}
            disabled={isPending}
            className={selectClass}
          >
            <option value="">No Folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          {state.fieldErrors?.folderId && (
            <p className="text-xs text-red-500">{state.fieldErrors.folderId[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues.description}
          disabled={isPending}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="visibleToClient"
          defaultChecked={defaultValues.visibleToClient}
          disabled={isPending}
          className="size-4 rounded border-border"
        />
        Visible to client
      </label>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

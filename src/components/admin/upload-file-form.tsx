"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { Textarea } from "@/components/portal-ui/textarea";
import { uploadFileAction, type ActionState } from "@/app/admin/files/actions";

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50";

const initialState: ActionState = {};

type ClientOption = { id: string; companyName: string; userName: string };
type ProjectOption = { id: string; name: string; clientId: string };
type FolderOption = { id: string; name: string; clientId: string; projectId: string | null };

export function UploadFileForm({
  clients,
  projects,
  folders,
}: {
  clients: ClientOption[];
  projects: ProjectOption[];
  folders: FolderOption[];
}) {
  const [state, formAction, isPending] = useActionState(
    uploadFileAction,
    initialState
  );
  const [clientId, setClientId] = useState("");

  const availableProjects = projects.filter((p) => p.clientId === clientId);
  const availableFolders = folders.filter((f) => f.clientId === clientId);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input id="file" name="file" type="file" required disabled={isPending} />
        <p className="text-xs text-on-surface-variant">
          PDF, PNG, JPEG, WebP, TXT, CSV, DOCX, XLSX, PPTX, or ZIP. Max 20 MB.
        </p>
        {state.fieldErrors?.file && (
          <p className="text-xs text-red-500">{state.fieldErrors.file[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input id="displayName" name="displayName" required disabled={isPending} />
        {state.fieldErrors?.displayName && (
          <p className="text-xs text-red-500">{state.fieldErrors.displayName[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client</Label>
          <select
            id="clientId"
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
                {client.companyName} — {client.userName}
              </option>
            ))}
          </select>
          {state.fieldErrors?.clientId && (
            <p className="text-xs text-red-500">{state.fieldErrors.clientId[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue="OTHER"
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

        <div className="space-y-2">
          <Label htmlFor="projectId">Project (optional)</Label>
          <select
            id="projectId"
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
          {state.fieldErrors?.projectId && (
            <p className="text-xs text-red-500">{state.fieldErrors.projectId[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="folderId">Folder (optional)</Label>
          <select
            id="folderId"
            name="folderId"
            defaultValue=""
            disabled={isPending || !clientId}
            className={selectClass}
          >
            <option value="">No Folder</option>
            {availableFolders.map((folder) => (
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
        <Textarea id="description" name="description" rows={3} disabled={isPending} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="visibleToClient"
          defaultChecked
          disabled={isPending}
          className="size-4 rounded border-border"
        />
        Visible to client
      </label>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Uploading..." : "Upload File"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/files">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

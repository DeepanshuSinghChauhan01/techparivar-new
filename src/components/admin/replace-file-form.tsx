"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import {
  replaceFileVersionAction,
  type ActionState,
} from "@/app/admin/files/actions";

const initialState: ActionState = {};

export function ReplaceFileForm({
  fileId,
  cancelHref,
}: {
  fileId: string;
  cancelHref: string;
}) {
  const [state, formAction, isPending] = useActionState(
    replaceFileVersionAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="fileId" value={fileId} />

      <div className="space-y-2">
        <Label htmlFor="file">Replacement File</Label>
        <Input id="file" name="file" type="file" required disabled={isPending} />
        <p className="text-xs text-on-surface-variant">
          PDF, PNG, JPEG, WebP, TXT, CSV, DOCX, XLSX, PPTX, or ZIP. Max 20 MB.
          The current file will be archived and kept for reference; its
          display name, client, project, folder, and visibility carry over
          to the new version.
        </p>
        {state.fieldErrors?.file && (
          <p className="text-xs text-red-500">{state.fieldErrors.file[0]}</p>
        )}
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Uploading..." : "Upload New Version"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

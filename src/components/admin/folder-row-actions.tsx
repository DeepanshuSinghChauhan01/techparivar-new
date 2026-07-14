"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Check, X } from "lucide-react";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/portal-ui/dialog";
import {
  renameFolderAction,
  deleteFolderAction,
  type FolderActionState,
} from "@/app/admin/files/folder-actions";

const initialState: FolderActionState = {};

export function FolderRowActions({
  folderId,
  folderName,
  fileCount,
}: {
  folderId: string;
  folderName: string;
  fileCount: number;
}) {
  const router = useRouter();
  const [renaming, setRenaming] = useState(false);
  const [state, formAction, isPending] = useActionState(
    renameFolderAction,
    initialState
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    setDeleteError("");
    startDeleteTransition(async () => {
      const result = await deleteFolderAction(folderId);
      if (result?.error) {
        setDeleteError(result.error);
        return;
      }
      setDeleteOpen(false);
      router.refresh();
    });
  }

  if (renaming) {
    return (
      <form
        action={formAction}
        className="flex items-center gap-2"
        onSubmit={() => setTimeout(() => setRenaming(false), 0)}
      >
        <input type="hidden" name="folderId" value={folderId} />
        <Input
          name="name"
          defaultValue={folderName}
          disabled={isPending}
          className="h-8 w-40"
          autoFocus
        />
        <Button type="submit" size="icon" variant="ghost" disabled={isPending} aria-label="Save name">
          <Check className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => setRenaming(false)}
          aria-label="Cancel rename"
        >
          <X className="size-4" />
        </Button>
        {state.error && <p className="text-xs text-red-500">{state.error}</p>}
      </form>
    );
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setRenaming(true)}
        aria-label={`Rename ${folderName}`}
      >
        <Pencil className="size-4" />
      </Button>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Delete ${folderName}`}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {folderName}?</DialogTitle>
            <DialogDescription>
              {fileCount > 0
                ? `This folder still contains ${fileCount} file${fileCount === 1 ? "" : "s"}. Move or remove them before deleting this folder.`
                : "This permanently deletes the empty folder. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || fileCount > 0}
            >
              {isDeleting ? "Deleting..." : "Delete Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

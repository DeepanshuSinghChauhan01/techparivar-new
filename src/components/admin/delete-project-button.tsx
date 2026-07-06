"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/portal-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/portal-ui/dialog";
import { deleteProjectAction } from "@/app/admin/projects/actions";

export function DeleteProjectButton({
  projectId,
  projectName,
  redirectOnSuccess,
}: {
  projectId: string;
  projectName: string;
  redirectOnSuccess?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError("");
    startTransition(async () => {
      const result = await deleteProjectAction(projectId);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      if (redirectOnSuccess) {
        router.push(redirectOnSuccess);
      }
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${projectName}`}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {projectName}?</DialogTitle>
          <DialogDescription>
            This permanently deletes this project. Any linked tickets are
            preserved but will no longer be attached to a project. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

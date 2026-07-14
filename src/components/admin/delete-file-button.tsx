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
import { deleteFileAction } from "@/app/admin/files/actions";

export function DeleteFileButton({
  fileId,
  fileName,
}: {
  fileId: string;
  fileName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError("");
    startTransition(async () => {
      const result = await deleteFileAction(fileId);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.push("/admin/files");
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="size-4" /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permanently delete {fileName}?</DialogTitle>
          <DialogDescription>
            This removes the file from storage and deletes its record. This
            action cannot be undone. Consider archiving instead if you might
            need this file again.
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
            {isPending ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

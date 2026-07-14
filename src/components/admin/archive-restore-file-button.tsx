"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore } from "lucide-react";

import { Button } from "@/components/portal-ui/button";
import { archiveFileAction, restoreFileAction } from "@/app/admin/files/actions";

export function ArchiveRestoreFileButton({
  fileId,
  status,
}: {
  fileId: string;
  status: "ACTIVE" | "ARCHIVED";
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError("");
    startTransition(async () => {
      const action = status === "ACTIVE" ? archiveFileAction : restoreFileAction;
      const result = await action(fileId);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="secondary" size="sm" onClick={handleClick} disabled={isPending}>
        {status === "ACTIVE" ? (
          <>
            <Archive className="size-4" /> {isPending ? "Archiving..." : "Archive"}
          </>
        ) : (
          <>
            <ArchiveRestore className="size-4" /> {isPending ? "Restoring..." : "Restore"}
          </>
        )}
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

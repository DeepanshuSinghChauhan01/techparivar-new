"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { Textarea } from "@/components/portal-ui/textarea";
import { Switch } from "@/components/portal-ui/switch";
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
  updateServiceCategoryAction,
  deleteServiceCategoryAction,
  type ActionState,
} from "@/app/admin/services/actions";

const initialState: ActionState = {};

export function CategoryRowActions({
  categoryId,
  categoryName,
  description,
  kpiTemplateKey,
  sortOrder,
  isActive,
  serviceCount,
}: {
  categoryId: string;
  categoryName: string;
  description: string | null;
  kpiTemplateKey: string | null;
  sortOrder: number;
  isActive: boolean;
  serviceCount: number;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [editActive, setEditActive] = useState(isActive);
  const [state, formAction, isPending] = useActionState(
    updateServiceCategoryAction,
    initialState
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    setDeleteError("");
    startDeleteTransition(async () => {
      const result = await deleteServiceCategoryAction(categoryId);
      if (result?.error) {
        setDeleteError(result.error);
        return;
      }
      setDeleteOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (open) setEditActive(isActive);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Edit ${categoryName}`}>
            <Pencil className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {categoryName}</DialogTitle>
            <DialogDescription>
              Key is permanent and cannot be changed after creation.
            </DialogDescription>
          </DialogHeader>
          <form
            action={formAction}
            className="space-y-4"
            onSubmit={() => setTimeout(() => setEditOpen(false), 0)}
          >
            <input type="hidden" name="categoryId" value={categoryId} />
            <div className="space-y-2">
              <Label htmlFor={`edit-name-${categoryId}`}>Name</Label>
              <Input
                id={`edit-name-${categoryId}`}
                name="name"
                defaultValue={categoryName}
                disabled={isPending}
              />
              {state.fieldErrors?.name && (
                <p className="text-xs text-red-500">{state.fieldErrors.name[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edit-description-${categoryId}`}>Description</Label>
              <Textarea
                id={`edit-description-${categoryId}`}
                name="description"
                rows={2}
                defaultValue={description ?? ""}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edit-kpi-${categoryId}`}>
                KPI Template Key <span className="text-on-surface-variant">(optional)</span>
              </Label>
              <Input
                id={`edit-kpi-${categoryId}`}
                name="kpiTemplateKey"
                defaultValue={kpiTemplateKey ?? ""}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edit-sort-${categoryId}`}>Sort Order</Label>
              <Input
                id={`edit-sort-${categoryId}`}
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={sortOrder}
                disabled={isPending}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={editActive}
                onCheckedChange={setEditActive}
                disabled={isPending}
              />
              <input type="hidden" name="isActive" value={editActive ? "on" : ""} />
              <Label>Active</Label>
            </div>
            {state.error && <p className="text-sm text-red-500">{state.error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Delete ${categoryName}`}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {categoryName}?</DialogTitle>
            <DialogDescription>
              {serviceCount > 0
                ? `This category still has ${serviceCount} service${serviceCount === 1 ? "" : "s"}. Reassign or remove them before deleting this category.`
                : "This permanently deletes the empty category. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || serviceCount > 0}
            >
              {isDeleting ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

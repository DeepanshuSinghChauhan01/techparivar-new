"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Check, X } from "lucide-react";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import {
  updatePlanFeatureAction,
  deletePlanFeatureAction,
  type ActionState,
} from "@/app/admin/services/plan-actions";

const initialState: ActionState = {};

export function PlanFeatureItem({
  featureId,
  label,
}: {
  featureId: string;
  label: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updatePlanFeatureAction,
    initialState
  );
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    startDeleteTransition(async () => {
      await deletePlanFeatureAction(featureId);
      router.refresh();
    });
  }

  if (editing) {
    return (
      <form
        action={formAction}
        className="flex items-center gap-2"
        onSubmit={() => setTimeout(() => setEditing(false), 0)}
      >
        <input type="hidden" name="featureId" value={featureId} />
        <input type="hidden" name="sortOrder" value="0" />
        <Input name="label" defaultValue={label} disabled={isPending} className="h-8" autoFocus />
        <Button type="submit" size="icon" variant="ghost" disabled={isPending} aria-label="Save feature">
          <Check className="size-4" />
        </Button>
        <Button type="button" size="icon" variant="ghost" onClick={() => setEditing(false)} aria-label="Cancel edit">
          <X className="size-4" />
        </Button>
        {state.error && <p className="text-xs text-red-500">{state.error}</p>}
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => setEditing(true)} aria-label={`Edit ${label}`}>
          <Pencil className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`Delete ${label}`}
        >
          <Trash2 className="size-3.5 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

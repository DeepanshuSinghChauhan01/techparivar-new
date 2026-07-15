"use client";

import { useActionState } from "react";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import {
  createServiceCategoryAction,
  type ActionState,
} from "@/app/admin/services/actions";

const initialState: ActionState = {};

export function CreateCategoryForm() {
  const [state, formAction, isPending] = useActionState(
    createServiceCategoryAction,
    initialState
  );

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <input type="hidden" name="isActive" value="on" />
      <div className="space-y-2">
        <Label htmlFor="category-name">Name</Label>
        <Input id="category-name" name="name" required disabled={isPending} />
        {state.fieldErrors?.name && (
          <p className="text-xs text-red-500">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-key">
          Key <span className="text-on-surface-variant">(permanent, lowercase-slug)</span>
        </Label>
        <Input
          id="category-key"
          name="key"
          placeholder="e.g. web-development"
          required
          disabled={isPending}
        />
        {state.fieldErrors?.key && (
          <p className="text-xs text-red-500">{state.fieldErrors.key[0]}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Category"}
      </Button>

      {state.error && (
        <p className="text-sm text-red-500 sm:col-span-3">{state.error}</p>
      )}
    </form>
  );
}

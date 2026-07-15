"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { Textarea } from "@/components/portal-ui/textarea";
import type { ActionState } from "@/app/admin/services/actions";

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50";

type CategoryOption = { id: string; name: string };

type DefaultValues = {
  name: string;
  categoryId: string;
  description: string;
  isActive: boolean;
};

const initialState: ActionState = {};

export function ServiceForm({
  action,
  categories,
  defaultValues,
  serviceId,
  serviceKey,
  submitLabel,
  pendingLabel,
  cancelHref,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  categories: CategoryOption[];
  defaultValues: DefaultValues;
  serviceId?: string;
  serviceKey?: string;
  submitLabel: string;
  pendingLabel: string;
  cancelHref: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {serviceId && <input type="hidden" name="serviceId" value={serviceId} />}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {serviceKey ? (
          <div className="space-y-2 sm:col-span-2">
            <Label>Key</Label>
            <p className="font-portal-data text-sm text-on-surface-variant">{serviceKey}</p>
          </div>
        ) : (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="key">
              Key <span className="text-on-surface-variant">(permanent, lowercase-slug)</span>
            </Label>
            <Input id="key" name="key" placeholder="e.g. seo-audit" required disabled={isPending} />
            {state.fieldErrors?.key && (
              <p className="text-xs text-red-500">{state.fieldErrors.key[0]}</p>
            )}
          </div>
        )}

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={defaultValues.name} required disabled={isPending} />
          {state.fieldErrors?.name && (
            <p className="text-xs text-red-500">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={defaultValues.categoryId}
            required
            disabled={isPending}
            className={selectClass}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {state.fieldErrors?.categoryId && (
            <p className="text-xs text-red-500">{state.fieldErrors.categoryId[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="isActive" className="flex items-center gap-2">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              defaultChecked={defaultValues.isActive}
              disabled={isPending}
              className="size-4 rounded border-border"
            />
            Active (offered for new engagements)
          </Label>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={4} defaultValue={defaultValues.description} disabled={isPending} />
        </div>
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

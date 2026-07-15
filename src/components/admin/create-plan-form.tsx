"use client";

import { useActionState } from "react";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { SUPPORTED_CURRENCIES } from "@/lib/constants/currency";
import {
  createServicePlanAction,
  type ActionState,
} from "@/app/admin/services/plan-actions";

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50";

const initialState: ActionState = {};

export function CreatePlanForm({ serviceId }: { serviceId: string }) {
  const [state, formAction, isPending] = useActionState(
    createServicePlanAction,
    initialState
  );

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-6">
      <input type="hidden" name="serviceId" value={serviceId} />

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="plan-name">Plan Name</Label>
        <Input id="plan-name" name="name" required disabled={isPending} />
        {state.fieldErrors?.name && (
          <p className="text-xs text-red-500">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="plan-billingType">Billing</Label>
        <select id="plan-billingType" name="billingType" defaultValue="ONE_TIME" disabled={isPending} className={selectClass}>
          <option value="ONE_TIME">One-Time</option>
          <option value="RECURRING">Recurring</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="plan-billingCycle">Cycle</Label>
        <select id="plan-billingCycle" name="billingCycle" defaultValue="" disabled={isPending} className={selectClass}>
          <option value="">—</option>
          <option value="MONTHLY">Monthly</option>
          <option value="QUARTERLY">Quarterly</option>
          <option value="YEARLY">Yearly</option>
        </select>
        {state.fieldErrors?.billingCycle && (
          <p className="text-xs text-red-500">{state.fieldErrors.billingCycle[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="plan-basePrice">Price</Label>
        <Input id="plan-basePrice" name="basePrice" placeholder="0.00" required disabled={isPending} />
        {state.fieldErrors?.basePrice && (
          <p className="text-xs text-red-500">{state.fieldErrors.basePrice[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="plan-currency">Currency</Label>
        <select id="plan-currency" name="currency" defaultValue={SUPPORTED_CURRENCIES[0]} disabled={isPending} className={selectClass}>
          {SUPPORTED_CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      <input type="hidden" name="isActive" value="on" />

      <div className="sm:col-span-6">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Plan"}
        </Button>
        {state.error && <p className="mt-2 text-sm text-red-500">{state.error}</p>}
      </div>
    </form>
  );
}

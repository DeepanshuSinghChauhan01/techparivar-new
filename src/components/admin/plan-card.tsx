"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";

import { Card } from "@/components/portal-ui/card";
import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { Badge } from "@/components/portal-ui/badge";
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
import { formatMoney } from "@/lib/format";
import { SUPPORTED_CURRENCIES } from "@/lib/constants/currency";
import {
  updateServicePlanAction,
  createPlanFeatureAction,
  type ActionState as PlanActionState,
} from "@/app/admin/services/plan-actions";
import { PlanFeatureItem } from "@/components/admin/plan-feature-item";

const selectClass =
  "h-10 w-full rounded-lg border border-border bg-surface-container-low px-3 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50";

const initialState: PlanActionState = {};

type Feature = { id: string; label: string };

export function PlanCard({
  planId,
  name,
  billingType,
  billingCycle,
  basePrice,
  currency,
  isActive,
  engagementCount,
  features,
}: {
  planId: string;
  name: string;
  billingType: "ONE_TIME" | "RECURRING";
  billingCycle: "MONTHLY" | "QUARTERLY" | "YEARLY" | null;
  basePrice: string;
  currency: string;
  isActive: boolean;
  engagementCount: number;
  features: Feature[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [editActive, setEditActive] = useState(isActive);
  const [editState, editFormAction, isEditPending] = useActionState(
    updateServicePlanAction,
    initialState
  );
  const [featureState, featureFormAction, isFeaturePending] = useActionState(
    createPlanFeatureAction,
    initialState
  );

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{name}</p>
            <Badge variant={isActive ? "success" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">
            {formatMoney(basePrice, currency)}
            {billingType === "RECURRING" && billingCycle ? ` / ${billingCycle.toLowerCase()}` : " one-time"}
          </p>
          <p className="text-xs text-on-surface-variant">
            {engagementCount} engagement{engagementCount === 1 ? "" : "s"} using this plan
          </p>
        </div>
        <Dialog
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);
            if (open) setEditActive(isActive);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Edit ${name}`}>
              <Pencil className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit {name}</DialogTitle>
              <DialogDescription>
                Changing the price does not affect any engagement already using this plan —
                each engagement keeps its own contracted price.
              </DialogDescription>
            </DialogHeader>
            <form
              action={editFormAction}
              className="space-y-4"
              onSubmit={() => setTimeout(() => setEditOpen(false), 0)}
            >
              <input type="hidden" name="planId" value={planId} />
              <div className="space-y-2">
                <Label htmlFor={`plan-name-${planId}`}>Name</Label>
                <Input id={`plan-name-${planId}`} name="name" defaultValue={name} disabled={isEditPending} />
                {editState.fieldErrors?.name && (
                  <p className="text-xs text-red-500">{editState.fieldErrors.name[0]}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`plan-billingType-${planId}`}>Billing</Label>
                  <select
                    id={`plan-billingType-${planId}`}
                    name="billingType"
                    defaultValue={billingType}
                    disabled={isEditPending}
                    className={selectClass}
                  >
                    <option value="ONE_TIME">One-Time</option>
                    <option value="RECURRING">Recurring</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`plan-billingCycle-${planId}`}>Cycle</Label>
                  <select
                    id={`plan-billingCycle-${planId}`}
                    name="billingCycle"
                    defaultValue={billingCycle ?? ""}
                    disabled={isEditPending}
                    className={selectClass}
                  >
                    <option value="">—</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                  {editState.fieldErrors?.billingCycle && (
                    <p className="text-xs text-red-500">{editState.fieldErrors.billingCycle[0]}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`plan-basePrice-${planId}`}>Price</Label>
                  <Input
                    id={`plan-basePrice-${planId}`}
                    name="basePrice"
                    defaultValue={basePrice}
                    disabled={isEditPending}
                  />
                  {editState.fieldErrors?.basePrice && (
                    <p className="text-xs text-red-500">{editState.fieldErrors.basePrice[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`plan-currency-${planId}`}>Currency</Label>
                  <select
                    id={`plan-currency-${planId}`}
                    name="currency"
                    defaultValue={currency}
                    disabled={isEditPending}
                    className={selectClass}
                  >
                    {SUPPORTED_CURRENCIES.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={editActive} onCheckedChange={setEditActive} disabled={isEditPending} />
                <input type="hidden" name="isActive" value={editActive ? "on" : ""} />
                <Label>Active</Label>
              </div>
              {editState.error && <p className="text-sm text-red-500">{editState.error}</p>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={isEditPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isEditPending}>
                  {isEditPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-1.5 border-t border-border/60 pt-3">
        <p className="font-portal-data text-[10px] uppercase tracking-wider text-on-surface-variant">
          Features
        </p>
        {features.length === 0 ? (
          <p className="py-2 text-xs text-on-surface-variant">No features listed yet.</p>
        ) : (
          <div className="space-y-1">
            {features.map((feature) => (
              <PlanFeatureItem key={feature.id} featureId={feature.id} label={feature.label} />
            ))}
          </div>
        )}
        <form action={featureFormAction} className="mt-2 flex items-center gap-2">
          <input type="hidden" name="planId" value={planId} />
          <input type="hidden" name="sortOrder" value={features.length} />
          <Input
            name="label"
            placeholder="Add a feature..."
            disabled={isFeaturePending}
            className="h-8 flex-1"
          />
          <Button type="submit" size="sm" variant="secondary" disabled={isFeaturePending}>
            {isFeaturePending ? "Adding..." : "Add"}
          </Button>
        </form>
        {featureState.error && <p className="text-xs text-red-500">{featureState.error}</p>}
      </div>
    </Card>
  );
}

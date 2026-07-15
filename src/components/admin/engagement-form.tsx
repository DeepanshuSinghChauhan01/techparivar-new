"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { SUPPORTED_CURRENCIES } from "@/lib/constants/currency";
import type { ActionState } from "@/app/admin/engagements/actions";

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-surface-container-low px-4 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50";

type ClientOption = { id: string; companyName: string; userName: string };
type PlanOption = {
  id: string;
  name: string;
  billingType: "ONE_TIME" | "RECURRING";
  billingCycle: "MONTHLY" | "QUARTERLY" | "YEARLY" | null;
  basePrice: string;
  currency: string;
};
type ServiceOption = { id: string; name: string; plans: PlanOption[] };

type DefaultValues = {
  clientId: string;
  serviceId: string;
  planId: string;
  name: string;
  billingType: "ONE_TIME" | "RECURRING";
  billingCycle: "MONTHLY" | "QUARTERLY" | "YEARLY" | "";
  price: string;
  currency: string;
  discountType: "NONE" | "PERCENT" | "FLAT";
  discountValue: string;
  taxRate: string;
  paymentTermsDays: number;
  status?: "PENDING" | "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED";
  cancellationReason?: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
};

const initialState: ActionState = {};

export function EngagementForm({
  action,
  clients,
  services,
  defaultValues,
  engagementId,
  lockedClientName,
  submitLabel,
  pendingLabel,
  cancelHref,
  isEdit = false,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  clients?: ClientOption[];
  services: ServiceOption[];
  defaultValues: DefaultValues;
  engagementId?: string;
  lockedClientName?: string;
  submitLabel: string;
  pendingLabel: string;
  cancelHref: string;
  isEdit?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [serviceId, setServiceId] = useState(defaultValues.serviceId);
  const [planId, setPlanId] = useState(defaultValues.planId);
  const [discountType, setDiscountType] = useState(defaultValues.discountType);
  const [status, setStatus] = useState(defaultValues.status ?? "PENDING");

  // React resets the underlying DOM form elements once a `<form action={}>`
  // submission settles — but that reset itself runs asynchronously, after
  // this component has already re-rendered with the new action state. So
  // re-applying the submitted values synchronously (during render or in a
  // plain effect) loses the race: the native reset arrives afterward and
  // clobbers it again. Deferring to a macrotask lets the native reset run
  // first; bumping the generation then forces the affected elements to
  // remount via `key`, which guarantees the DOM is rebuilt from state.
  const [renderGeneration, setRenderGeneration] = useState(0);
  useEffect(() => {
    if (!state.submitted) return;
    const timer = setTimeout(() => {
      setServiceId(state.submitted!.serviceId ?? "");
      setPlanId(state.submitted!.planId ?? "");
      setDiscountType((state.submitted!.discountType as typeof discountType) ?? "NONE");
      setStatus((state.submitted!.status as typeof status) ?? "PENDING");
      setRenderGeneration((g) => g + 1);
    }, 0);
    return () => clearTimeout(timer);
  }, [state]);

  const selectedService = services.find((s) => s.id === serviceId);
  const availablePlans = selectedService?.plans ?? [];
  const selectedPlan = availablePlans.find((p) => p.id === planId);

  return (
    <form action={formAction} className="space-y-5">
      {engagementId && <input type="hidden" name="engagementId" value={engagementId} />}

      {state.duplicateWarning && (
        <div className="rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm">
          <p>{state.duplicateWarning}</p>
          <button
            type="submit"
            name="confirmDuplicate"
            value="true"
            className="mt-3 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Continue Anyway
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {lockedClientName ? (
          <div className="space-y-2 sm:col-span-2">
            <Label>Client</Label>
            <p className="text-sm font-semibold">{lockedClientName}</p>
            <input type="hidden" name="clientId" value={defaultValues.clientId} />
          </div>
        ) : (
          !isEdit &&
          clients && (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="clientId">Client</Label>
              <select
                key={`clientId-${renderGeneration}`}
                id="clientId"
                name="clientId"
                defaultValue={state.submitted?.clientId ?? defaultValues.clientId}
                required
                disabled={isPending}
                className={selectClass}
              >
                <option value="" disabled>
                  Select a client
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName} — {client.userName}
                  </option>
                ))}
              </select>
              {state.fieldErrors?.clientId && (
                <p className="text-xs text-red-500">{state.fieldErrors.clientId[0]}</p>
              )}
            </div>
          )
        )}

        {isEdit ? (
          <div className="space-y-2">
            <Label>Service</Label>
            <p className="text-sm font-semibold">{selectedService?.name ?? "—"}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="serviceId">Service</Label>
            <select
              key={`serviceId-${renderGeneration}`}
              id="serviceId"
              name="serviceId"
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                setPlanId("");
              }}
              required
              disabled={isPending}
              className={selectClass}
            >
              <option value="" disabled>
                Select a service
              </option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {state.fieldErrors?.serviceId && (
              <p className="text-xs text-red-500">{state.fieldErrors.serviceId[0]}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="planId">Plan (optional — leave blank for custom)</Label>
          <select
            key={`planId-${renderGeneration}`}
            id="planId"
            name="planId"
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            disabled={isPending || !isEdit && !serviceId}
            className={selectClass}
          >
            <option value="">Custom (no plan)</option>
            {availablePlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
          {state.fieldErrors?.planId && (
            <p className="text-xs text-red-500">{state.fieldErrors.planId[0]}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2" key={`name-${renderGeneration}`}>
          <Label htmlFor="name">
            Engagement Name <span className="text-on-surface-variant">(auto-filled from plan if left blank)</span>
          </Label>
          <Input id="name" name="name" defaultValue={state.submitted?.name ?? defaultValues.name} disabled={isPending} />
          {state.fieldErrors?.name && (
            <p className="text-xs text-red-500">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2" key={`billingType-${planId}-${renderGeneration}`}>
          <Label htmlFor="billingType">Billing Type</Label>
          <select
            id="billingType"
            name="billingType"
            defaultValue={state.submitted?.billingType ?? selectedPlan?.billingType ?? defaultValues.billingType}
            disabled={isPending}
            className={selectClass}
          >
            <option value="ONE_TIME">One-Time</option>
            <option value="RECURRING">Recurring</option>
          </select>
        </div>

        <div className="space-y-2" key={`billingCycle-${planId}-${renderGeneration}`}>
          <Label htmlFor="billingCycle">Billing Cycle</Label>
          <select
            id="billingCycle"
            name="billingCycle"
            defaultValue={state.submitted?.billingCycle ?? selectedPlan?.billingCycle ?? defaultValues.billingCycle}
            disabled={isPending}
            className={selectClass}
          >
            <option value="">—</option>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
          </select>
          {state.fieldErrors?.billingCycle && (
            <p className="text-xs text-red-500">{state.fieldErrors.billingCycle[0]}</p>
          )}
        </div>

        <div className="space-y-2" key={`price-${planId}-${renderGeneration}`}>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            defaultValue={state.submitted?.price ?? selectedPlan?.basePrice ?? defaultValues.price}
            placeholder="0.00"
            required
            disabled={isPending}
          />
          {state.fieldErrors?.price && (
            <p className="text-xs text-red-500">{state.fieldErrors.price[0]}</p>
          )}
        </div>

        <div className="space-y-2" key={`currency-${planId}-${renderGeneration}`}>
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            name="currency"
            defaultValue={state.submitted?.currency ?? selectedPlan?.currency ?? defaultValues.currency}
            disabled={isPending}
            className={selectClass}
          >
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountType">Discount</Label>
          <select
            key={`discountType-${renderGeneration}`}
            id="discountType"
            name="discountType"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as typeof discountType)}
            disabled={isPending}
            className={selectClass}
          >
            <option value="NONE">No Discount</option>
            <option value="PERCENT">Percentage</option>
            <option value="FLAT">Flat Amount</option>
          </select>
        </div>

        {discountType !== "NONE" && (
          <div className="space-y-2" key={`discountValue-${renderGeneration}`}>
            <Label htmlFor="discountValue">
              Discount Value {discountType === "PERCENT" ? "(%)" : "(amount)"}
            </Label>
            <Input
              id="discountValue"
              name="discountValue"
              defaultValue={state.submitted?.discountValue ?? defaultValues.discountValue}
              disabled={isPending}
            />
            {state.fieldErrors?.discountValue && (
              <p className="text-xs text-red-500">{state.fieldErrors.discountValue[0]}</p>
            )}
          </div>
        )}

        <div className="space-y-2" key={`taxRate-${renderGeneration}`}>
          <Label htmlFor="taxRate">Tax Rate % (optional)</Label>
          <Input id="taxRate" name="taxRate" defaultValue={state.submitted?.taxRate ?? defaultValues.taxRate} disabled={isPending} />
          {state.fieldErrors?.taxRate && (
            <p className="text-xs text-red-500">{state.fieldErrors.taxRate[0]}</p>
          )}
        </div>

        <div className="space-y-2" key={`paymentTermsDays-${renderGeneration}`}>
          <Label htmlFor="paymentTermsDays">Payment Terms (days)</Label>
          <Input
            id="paymentTermsDays"
            name="paymentTermsDays"
            type="number"
            min={0}
            defaultValue={state.submitted?.paymentTermsDays ?? defaultValues.paymentTermsDays}
            disabled={isPending}
          />
        </div>

        {isEdit && (
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              key={`status-${renderGeneration}`}
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              disabled={isPending}
              className={selectClass}
            >
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
            </select>
            {state.fieldErrors?.status && (
              <p className="text-xs text-red-500">{state.fieldErrors.status[0]}</p>
            )}
          </div>
        )}

        {isEdit && status === "CANCELLED" && (
          <div className="space-y-2 sm:col-span-2" key={`cancellationReason-${renderGeneration}`}>
            <Label htmlFor="cancellationReason">Cancellation Reason</Label>
            <Input
              id="cancellationReason"
              name="cancellationReason"
              defaultValue={state.submitted?.cancellationReason ?? defaultValues.cancellationReason}
              disabled={isPending}
            />
            {state.fieldErrors?.cancellationReason && (
              <p className="text-xs text-red-500">{state.fieldErrors.cancellationReason[0]}</p>
            )}
          </div>
        )}

        <div className="space-y-2" key={`startDate-${renderGeneration}`}>
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" name="startDate" type="date" defaultValue={state.submitted?.startDate ?? defaultValues.startDate} disabled={isPending} />
        </div>

        <div className="space-y-2" key={`endDate-${renderGeneration}`}>
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" name="endDate" type="date" defaultValue={state.submitted?.endDate ?? defaultValues.endDate} disabled={isPending} />
          {state.fieldErrors?.endDate && (
            <p className="text-xs text-red-500">{state.fieldErrors.endDate[0]}</p>
          )}
        </div>

        <div className="space-y-2" key={`renewalDate-${renderGeneration}`}>
          <Label htmlFor="renewalDate">Renewal Date</Label>
          <Input id="renewalDate" name="renewalDate" type="date" defaultValue={state.submitted?.renewalDate ?? defaultValues.renewalDate} disabled={isPending} />
          {state.fieldErrors?.renewalDate && (
            <p className="text-xs text-red-500">{state.fieldErrors.renewalDate[0]}</p>
          )}
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

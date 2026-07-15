import { z } from "zod";
import { BillingType, BillingCycle } from "@prisma/client";

import { SUPPORTED_CURRENCIES } from "@/lib/constants/currency";

const emptyToUndefined = (val: unknown) =>
  val === null || (typeof val === "string" && val.trim() === "") ? undefined : val;

/** FormData checkboxes only send a value when checked ("on"); absent means false. */
const checkboxBoolean = z.preprocess(
  (val) => val === "on" || val === "true" || val === true,
  z.boolean()
);

/**
 * Decimal-safe amount input: kept as a validated STRING (not coerced to a
 * JS number) so Prisma's Decimal type parses it directly, avoiding
 * IEEE-754 floating-point rounding for currency amounts.
 */
function decimalAmount(maxDecimals: number) {
  return z
    .string()
    .trim()
    .min(1, "Amount is required")
    .regex(
      new RegExp(`^\\d+(\\.\\d{1,${maxDecimals}})?$`),
      `Enter a valid amount (up to ${maxDecimals} decimal places)`
    );
}

const optionalBillingCycle = z.preprocess(
  emptyToUndefined,
  z.nativeEnum(BillingCycle).optional()
);

function refineBillingConsistency<
  T extends { billingType: BillingType; billingCycle?: BillingCycle },
>(data: T, ctx: z.RefinementCtx) {
  if (data.billingType === BillingType.RECURRING && !data.billingCycle) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["billingCycle"],
      message: "Billing cycle is required for recurring plans.",
    });
  }
  if (data.billingType === BillingType.ONE_TIME && data.billingCycle) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["billingCycle"],
      message: "One-time plans cannot have a billing cycle.",
    });
  }
}

const baseServicePlanFields = {
  name: z.string().trim().min(1, "Name is required").max(160),
  billingType: z.nativeEnum(BillingType),
  billingCycle: optionalBillingCycle,
  basePrice: decimalAmount(2),
  currency: z.enum(SUPPORTED_CURRENCIES),
  isActive: checkboxBoolean,
};

export const createServicePlanSchema = z
  .object({
    serviceId: z.string().trim().min(1, "Service is required"),
    ...baseServicePlanFields,
  })
  .superRefine(refineBillingConsistency);

export type CreateServicePlanInput = z.infer<typeof createServicePlanSchema>;

/** Update — deliberately has no `serviceId`. A plan cannot be moved to a
 * different service after creation; immutability enforced by omission,
 * same principle as Service/ServiceCategory's `key`. */
export const updateServicePlanSchema = z
  .object(baseServicePlanFields)
  .superRefine(refineBillingConsistency);

export type UpdateServicePlanInput = z.infer<typeof updateServicePlanSchema>;

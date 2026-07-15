import { z } from "zod";
import { BillingType, BillingCycle, DiscountType, EngagementStatus } from "@prisma/client";

import { SUPPORTED_CURRENCIES } from "@/lib/constants/currency";

const emptyToUndefined = (val: unknown) =>
  val === null || (typeof val === "string" && val.trim() === "") ? undefined : val;

const optionalTrimmedString = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

const optionalId = z.preprocess(emptyToUndefined, z.string().trim().optional());

const optionalDate = z.preprocess(emptyToUndefined, z.coerce.date().optional());

const optionalBillingCycle = z.preprocess(
  emptyToUndefined,
  z.nativeEnum(BillingCycle).optional()
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

const optionalDecimalAmount = (maxDecimals: number) =>
  z.preprocess(emptyToUndefined, decimalAmount(maxDecimals).optional());

const baseEngagementFields = {
  name: optionalTrimmedString(200),
  planId: optionalId,
  billingType: z.nativeEnum(BillingType),
  billingCycle: optionalBillingCycle,
  price: decimalAmount(2),
  currency: z.enum(SUPPORTED_CURRENCIES),
  discountType: z.nativeEnum(DiscountType).default(DiscountType.NONE),
  discountValue: optionalDecimalAmount(2),
  taxRate: optionalDecimalAmount(2),
  paymentTermsDays: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(0).max(365).default(15)
  ),
  startDate: optionalDate,
  endDate: optionalDate,
  renewalDate: optionalDate,
};

/** Cross-field rules shared by create and update — everything derivable
 * from the submitted fields alone, without needing the record's prior
 * database state (that part — legal status transitions — lives in the
 * Server Action, which has to compare against the existing row). */
function refineEngagementConsistency(
  data: {
    billingType: BillingType;
    billingCycle?: BillingCycle;
    price: string;
    discountType: DiscountType;
    discountValue?: string;
    taxRate?: string;
    startDate?: Date;
    endDate?: Date;
    renewalDate?: Date;
    planId?: string;
    name?: string;
  },
  ctx: z.RefinementCtx
) {
  if (data.billingType === BillingType.RECURRING && !data.billingCycle) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["billingCycle"],
      message: "Billing cycle is required for recurring engagements.",
    });
  }
  if (data.billingType === BillingType.ONE_TIME && data.billingCycle) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["billingCycle"],
      message: "One-time engagements cannot have a billing cycle.",
    });
  }

  if (data.discountType === DiscountType.NONE && data.discountValue) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["discountValue"],
      message: "Discount value must be empty when no discount is applied.",
    });
  }
  if (data.discountType === DiscountType.PERCENT) {
    const value = data.discountValue ? Number(data.discountValue) : undefined;
    if (value === undefined || value < 0 || value > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Percentage discount must be between 0 and 100.",
      });
    }
  }
  if (data.discountType === DiscountType.FLAT) {
    const value = data.discountValue ? Number(data.discountValue) : undefined;
    const price = Number(data.price);
    if (value === undefined || value <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Flat discount must be greater than 0.",
      });
    } else if (value > price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Discount cannot exceed the engagement price.",
      });
    }
  }

  if (data.taxRate !== undefined) {
    const rate = Number(data.taxRate);
    if (rate < 0 || rate > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["taxRate"],
        message: "Tax rate must be between 0 and 100.",
      });
    }
  }

  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endDate"],
      message: "End date cannot be before the start date.",
    });
  }
  if (data.startDate && data.renewalDate && data.renewalDate < data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["renewalDate"],
      message: "Renewal date cannot be before the start date.",
    });
  }

  // Name auto-derivation: only required to be typed manually for custom
  // (no-plan) engagements. When a plan is selected, the Server Action
  // derives a default name if this is left blank.
  if (!data.planId && !data.name) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["name"],
      message: "Name is required for custom engagements.",
    });
  }
}

export const createEngagementSchema = z
  .object({
    clientId: z.string().trim().min(1, "Client is required"),
    serviceId: z.string().trim().min(1, "Service is required"),
    ...baseEngagementFields,
  })
  .superRefine(refineEngagementConsistency);

export type CreateEngagementInput = z.infer<typeof createEngagementSchema>;

/** Update — deliberately has no `clientId`/`serviceId`. Neither is
 * reassignable after creation: an engagement's client and service are
 * part of its identity, not editable attributes. `planId` may still
 * change (e.g. upgrading to a different plan of the same service). */
export const updateEngagementSchema = z
  .object({
    status: z.nativeEnum(EngagementStatus),
    cancellationReason: optionalTrimmedString(1000),
    ...baseEngagementFields,
  })
  .superRefine((data, ctx) => {
    refineEngagementConsistency(data, ctx);
    if (data.status === EngagementStatus.CANCELLED && !data.cancellationReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cancellationReason"],
        message: "A reason is required when cancelling an engagement.",
      });
    }
  });

export type UpdateEngagementInput = z.infer<typeof updateEngagementSchema>;

import { z } from "zod";

const emptyToUndefined = (val: unknown) =>
  val === null || (typeof val === "string" && val.trim() === "") ? undefined : val;

const optionalTrimmedString = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

export const createPlanFeatureSchema = z.object({
  planId: z.string().trim().min(1, "Plan is required"),
  label: z.string().trim().min(1, "Label is required").max(160),
  description: optionalTrimmedString(1000),
  sortOrder: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(0).default(0)
  ),
});

export type CreatePlanFeatureInput = z.infer<typeof createPlanFeatureSchema>;

export const updatePlanFeatureSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(160),
  description: optionalTrimmedString(1000),
  sortOrder: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(0).default(0)
  ),
});

export type UpdatePlanFeatureInput = z.infer<typeof updatePlanFeatureSchema>;

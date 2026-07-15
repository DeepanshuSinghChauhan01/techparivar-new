import { z } from "zod";

const emptyToUndefined = (val: unknown) =>
  val === null || (typeof val === "string" && val.trim() === "") ? undefined : val;

const optionalTrimmedString = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

/** FormData checkboxes only send a value when checked ("on"); absent means false. */
const checkboxBoolean = z.preprocess(
  (val) => val === "on" || val === "true" || val === true,
  z.boolean()
);

const keySchema = z
  .string()
  .trim()
  .min(1, "Key is required")
  .max(60)
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "Key must be a lowercase slug (letters, numbers, hyphens only)"
  );

/** Create only — `key` is immutable after creation, see updateServiceCategorySchema. */
export const createServiceCategorySchema = z.object({
  key: keySchema,
  name: z.string().trim().min(1, "Name is required").max(120),
  description: optionalTrimmedString(2000),
  kpiTemplateKey: optionalTrimmedString(120),
  sortOrder: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(0).default(0)
  ),
  isActive: checkboxBoolean,
});

export type CreateServiceCategoryInput = z.infer<
  typeof createServiceCategorySchema
>;

/** Update — deliberately has no `key` field. Immutability is enforced by
 * omission: this schema, and the action that uses it, never accept or
 * write to `key` after creation. */
export const updateServiceCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: optionalTrimmedString(2000),
  kpiTemplateKey: optionalTrimmedString(120),
  sortOrder: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(0).default(0)
  ),
  isActive: checkboxBoolean,
});

export type UpdateServiceCategoryInput = z.infer<
  typeof updateServiceCategorySchema
>;

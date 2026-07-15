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

/** Create only — `key` is immutable after creation, see updateServiceSchema. */
export const createServiceSchema = z.object({
  key: keySchema,
  name: z.string().trim().min(1, "Name is required").max(120),
  categoryId: z.string().trim().min(1, "Category is required"),
  description: optionalTrimmedString(2000),
  isActive: checkboxBoolean,
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

/** Update — deliberately has no `key` field; immutability enforced by omission. */
export const updateServiceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  categoryId: z.string().trim().min(1, "Category is required"),
  description: optionalTrimmedString(2000),
  isActive: checkboxBoolean,
});

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;

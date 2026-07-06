import { z } from "zod";
import { ClientStatus } from "@prisma/client";

const emptyToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

const optionalTrimmedString = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

export const createClientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  companyName: z.string().trim().min(1, "Company name is required").max(160),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  phone: optionalTrimmedString(30),
  website: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(200).url("Enter a valid URL").optional()
  ),
  notes: optionalTrimmedString(2000),
  status: z.nativeEnum(ClientStatus).default(ClientStatus.ACTIVE),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  companyName: z.string().trim().min(1, "Company name is required").max(160),
  phone: optionalTrimmedString(30),
  website: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(200).url("Enter a valid URL").optional()
  ),
  notes: optionalTrimmedString(2000),
  status: z.nativeEnum(ClientStatus),
});

export type UpdateClientInput = z.infer<typeof updateClientSchema>;

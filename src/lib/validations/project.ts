import { z } from "zod";
import { ProjectStatus, ProjectPriority } from "@prisma/client";

const emptyToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

const optionalTrimmedString = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

const optionalDate = z.preprocess(emptyToUndefined, z.coerce.date().optional());

const progressField = z.preprocess(
  emptyToUndefined,
  z.coerce
    .number()
    .int("Progress must be a whole number")
    .min(0, "Progress must be between 0 and 100")
    .max(100, "Progress must be between 0 and 100")
    .default(0)
);

function refineDates<T extends { startDate?: Date; dueDate?: Date }>(data: T) {
  return !data.startDate || !data.dueDate || data.dueDate >= data.startDate;
}

export const createProjectSchema = z
  .object({
    name: z.string().trim().min(1, "Project name is required").max(160),
    clientId: z.string().trim().min(1, "Client is required"),
    description: optionalTrimmedString(2000),
    status: z.nativeEnum(ProjectStatus).default(ProjectStatus.PLANNING),
    priority: z.nativeEnum(ProjectPriority).default(ProjectPriority.MEDIUM),
    progress: progressField,
    startDate: optionalDate,
    dueDate: optionalDate,
  })
  .refine(refineDates, {
    message: "Due date cannot be before the start date",
    path: ["dueDate"],
  });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z
  .object({
    name: z.string().trim().min(1, "Project name is required").max(160),
    clientId: z.string().trim().min(1, "Client is required"),
    description: optionalTrimmedString(2000),
    status: z.nativeEnum(ProjectStatus),
    priority: z.nativeEnum(ProjectPriority),
    progress: progressField,
    startDate: optionalDate,
    dueDate: optionalDate,
  })
  .refine(refineDates, {
    message: "Due date cannot be before the start date",
    path: ["dueDate"],
  });

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

import { z } from "zod";
import { TicketStatus, TicketPriority } from "@prisma/client";

const emptyToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

const optionalId = z.preprocess(emptyToUndefined, z.string().trim().optional());

export const createTicketSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(5000),
  priority: z.nativeEnum(TicketPriority).default(TicketPriority.MEDIUM),
  projectId: optionalId,
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const adminUpdateTicketSchema = z.object({
  status: z.nativeEnum(TicketStatus),
  priority: z.nativeEnum(TicketPriority),
  projectId: optionalId,
});

export type AdminUpdateTicketInput = z.infer<typeof adminUpdateTicketSchema>;

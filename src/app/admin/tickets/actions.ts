"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import { adminUpdateTicketSchema } from "@/lib/validations/ticket";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  success?: boolean;
};

async function assertAdmin() {
  const user = await getCurrentUser();
  return user && user.role === "ADMIN" ? user : null;
}

export async function adminUpdateTicketAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const ticketId = formData.get("ticketId");
  if (typeof ticketId !== "string" || !ticketId) {
    return { error: "Ticket not found." };
  }

  const parsed = adminUpdateTicketSchema.safeParse({
    status: formData.get("status"),
    priority: formData.get("priority"),
    projectId: formData.get("projectId"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, clientId: true },
  });
  if (!existing) {
    return { error: "Ticket not found." };
  }

  const { status, priority, projectId } = parsed.data;

  // A ticket may only be linked to a project owned by the SAME client —
  // never trust the submitted projectId without re-checking ownership.
  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, clientId: true },
    });
    if (!project || project.clientId !== existing.clientId) {
      return {
        error: "Selected project does not belong to this ticket's client.",
        fieldErrors: {
          projectId: ["Selected project does not belong to this client."],
        },
      };
    }
  }

  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status, priority, projectId: projectId ?? null },
    });
  } catch (err) {
    console.error("[admin/tickets] update failed:", err);
    return { error: "Failed to update ticket. Please try again." };
  }

  revalidatePath("/admin/tickets");
  revalidatePath(`/admin/tickets/${ticketId}`);
  revalidatePath("/admin");
  return { success: true };
}

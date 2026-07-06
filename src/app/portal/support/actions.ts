"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireClientProfileId } from "@/lib/ownership";
import { createTicketSchema } from "@/lib/validations/ticket";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createTicketAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Redirects to /login or /admin for anyone who isn't an authenticated
  // CLIENT with a profile — never trust a clientId/createdById from the form.
  const { user, clientProfileId } = await requireClientProfileId();

  const parsed = createTicketSchema.safeParse({
    subject: formData.get("subject"),
    description: formData.get("description"),
    priority: formData.get("priority") || undefined,
    projectId: formData.get("projectId"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { subject, description, priority, projectId } = parsed.data;

  // A ticket may only reference one of the client's OWN projects.
  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, clientId: true },
    });
    if (!project || project.clientId !== clientProfileId) {
      return {
        error: "Selected project could not be found.",
        fieldErrors: { projectId: ["Selected project could not be found."] },
      };
    }
  }

  let createdId: string;
  try {
    const created = await prisma.ticket.create({
      data: {
        subject,
        description,
        priority,
        status: "OPEN",
        clientId: clientProfileId,
        createdById: user.id,
        projectId: projectId ?? null,
      },
      select: { id: true },
    });
    createdId = created.id;
  } catch (err) {
    console.error("[portal/support] create ticket failed:", err);
    return { error: "Failed to create ticket. Please try again." };
  }

  revalidatePath("/portal/support");
  revalidatePath("/portal/dashboard");
  redirect(`/portal/support/${createdId}`);
}

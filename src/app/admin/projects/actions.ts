"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@/lib/validations/project";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

async function assertAdmin() {
  const user = await getCurrentUser();
  return user && user.role === "ADMIN" ? user : null;
}

export async function createProjectAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const parsed = createProjectSchema.safeParse({
    name: formData.get("name"),
    clientId: formData.get("clientId"),
    description: formData.get("description"),
    status: formData.get("status") || undefined,
    priority: formData.get("priority") || undefined,
    startDate: formData.get("startDate"),
    dueDate: formData.get("dueDate"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, clientId, description, status, priority, startDate, dueDate } =
    parsed.data;

  // Never trust a browser-supplied clientId: confirm it's a real ClientProfile.
  const client = await prisma.clientProfile.findUnique({
    where: { id: clientId },
    select: { id: true },
  });
  if (!client) {
    return {
      error: "Selected client does not exist.",
      fieldErrors: { clientId: ["Selected client does not exist."] },
    };
  }

  let createdId: string;
  try {
    const created = await prisma.project.create({
      data: { name, clientId, description, status, priority, startDate, dueDate },
      select: { id: true },
    });
    createdId = created.id;
  } catch (err) {
    console.error("[admin/projects] create failed:", err);
    return { error: "Failed to create project. Please try again." };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  redirect(`/admin/projects/${createdId}`);
}

export async function updateProjectAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const projectId = formData.get("projectId");
  if (typeof projectId !== "string" || !projectId) {
    return { error: "Project not found." };
  }

  const parsed = updateProjectSchema.safeParse({
    name: formData.get("name"),
    clientId: formData.get("clientId"),
    description: formData.get("description"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    startDate: formData.get("startDate"),
    dueDate: formData.get("dueDate"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, clientId: true, _count: { select: { tickets: true } } },
  });
  if (!existing) {
    return { error: "Project not found." };
  }

  const { name, clientId, description, status, priority, startDate, dueDate } =
    parsed.data;

  // Reassigning the client would strand any existing Tickets on this project
  // under the wrong client (a Ticket's clientId never changes, so it would
  // no longer match the Project's new client) — reject outright rather than
  // silently create a cross-client relationship.
  if (clientId !== existing.clientId && existing._count.tickets > 0) {
    return {
      error:
        "This project has existing tickets and cannot be reassigned to a different client. Remove or reassign its tickets first.",
      fieldErrors: {
        clientId: [
          "Cannot change client while this project has linked tickets.",
        ],
      },
    };
  }

  const client = await prisma.clientProfile.findUnique({
    where: { id: clientId },
    select: { id: true },
  });
  if (!client) {
    return {
      error: "Selected client does not exist.",
      fieldErrors: { clientId: ["Selected client does not exist."] },
    };
  }

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { name, clientId, description, status, priority, startDate, dueDate },
    });
  } catch (err) {
    console.error("[admin/projects] update failed:", err);
    return { error: "Failed to update project. Please try again." };
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/admin");
  redirect(`/admin/projects/${projectId}`);
}

export async function deleteProjectAction(
  projectId: string
): Promise<{ error?: string }> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const existing = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  if (!existing) {
    return { error: "Project not found." };
  }

  try {
    // Ticket.project uses onDelete: SetNull — linked tickets survive with
    // their project link cleared, they are not deleted.
    await prisma.project.delete({ where: { id: projectId } });
  } catch (err) {
    console.error("[admin/projects] delete failed:", err);
    return { error: "Failed to delete project. Please try again." };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  return {};
}

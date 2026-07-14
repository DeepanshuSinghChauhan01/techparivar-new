"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma, ProjectStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import { generateProjectCode } from "@/lib/project-code";
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

/** Unique-constraint violation on `projectCode` (P2002) — extremely unlikely given
 * the pre-check in generateProjectCode(), but a concurrent request could still
 * win the race. Retried a few times with a freshly generated code. */
function isProjectCodeConflict(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002" &&
    Array.isArray(err.meta?.target) &&
    err.meta.target.includes("projectCode")
  );
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
    progress: formData.get("progress"),
    startDate: formData.get("startDate"),
    dueDate: formData.get("dueDate"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, clientId, description, status, priority, progress, startDate, dueDate } =
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

  const completedAt = status === ProjectStatus.COMPLETED ? new Date() : null;

  let createdId: string | undefined;
  for (let attempt = 0; attempt < 3 && !createdId; attempt++) {
    const projectCode = await generateProjectCode();
    try {
      const created = await prisma.project.create({
        data: {
          name,
          clientId,
          description,
          status,
          priority,
          progress,
          startDate,
          dueDate,
          completedAt,
          projectCode,
          createdById: admin.id,
        },
        select: { id: true },
      });
      createdId = created.id;
    } catch (err) {
      if (isProjectCodeConflict(err) && attempt < 2) {
        continue;
      }
      console.error("[admin/projects] create failed:", err);
      return { error: "Failed to create project. Please try again." };
    }
  }

  if (!createdId) {
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
    progress: formData.get("progress"),
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
    select: {
      id: true,
      clientId: true,
      status: true,
      completedAt: true,
      _count: { select: { tickets: true } },
    },
  });
  if (!existing) {
    return { error: "Project not found." };
  }

  const { name, clientId, description, status, priority, progress, startDate, dueDate } =
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

  // Auto-track completion time from the status transition rather than a
  // separate form field: entering COMPLETED stamps it (unless already set,
  // e.g. re-saving without changing status), leaving COMPLETED clears it.
  const completedAt =
    status === ProjectStatus.COMPLETED
      ? (existing.completedAt ?? new Date())
      : null;

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { name, clientId, description, status, priority, progress, startDate, dueDate, completedAt },
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

"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import { createFolderSchema, renameFolderSchema } from "@/lib/validations/file";

export type FolderActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

async function assertAdmin() {
  const user = await getCurrentUser();
  return user && user.role === "ADMIN" ? user : null;
}

export async function createFolderAction(
  _prevState: FolderActionState,
  formData: FormData
): Promise<FolderActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const parsed = createFolderSchema.safeParse({
    name: formData.get("name"),
    clientId: formData.get("clientId"),
    projectId: formData.get("projectId"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, clientId, projectId } = parsed.data;

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

  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, clientId: true },
    });
    if (!project || project.clientId !== clientId) {
      return {
        error: "Selected project does not belong to this client.",
        fieldErrors: { projectId: ["Selected project does not belong to this client."] },
      };
    }
  }

  try {
    await prisma.fileFolder.create({
      data: { name, clientId, projectId: projectId ?? null },
    });
  } catch (err) {
    console.error("[admin/files] create folder failed:", err);
    return { error: "Failed to create folder. Please try again." };
  }

  revalidatePath("/admin/files/folders");
  revalidatePath("/admin/files");
  return {};
}

export async function renameFolderAction(
  _prevState: FolderActionState,
  formData: FormData
): Promise<FolderActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const folderId = formData.get("folderId");
  if (typeof folderId !== "string" || !folderId) {
    return { error: "Folder not found." };
  }

  const parsed = renameFolderSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.fileFolder.findUnique({
    where: { id: folderId },
    select: { id: true },
  });
  if (!existing) {
    return { error: "Folder not found." };
  }

  try {
    await prisma.fileFolder.update({
      where: { id: folderId },
      data: { name: parsed.data.name },
    });
  } catch (err) {
    console.error("[admin/files] rename folder failed:", err);
    return { error: "Failed to rename folder. Please try again." };
  }

  revalidatePath("/admin/files/folders");
  revalidatePath("/admin/files");
  return {};
}

export async function deleteFolderAction(
  folderId: string
): Promise<{ error?: string }> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const existing = await prisma.fileFolder.findUnique({
    where: { id: folderId },
    select: { id: true, _count: { select: { files: true } } },
  });
  if (!existing) {
    return { error: "Folder not found." };
  }
  if (existing._count.files > 0) {
    return {
      error: "This folder still contains files. Move or remove them first.",
    };
  }

  try {
    await prisma.fileFolder.delete({ where: { id: folderId } });
  } catch (err) {
    console.error("[admin/files] delete folder failed:", err);
    return { error: "Failed to delete folder. Please try again." };
  }

  revalidatePath("/admin/files/folders");
  revalidatePath("/admin/files");
  return {};
}

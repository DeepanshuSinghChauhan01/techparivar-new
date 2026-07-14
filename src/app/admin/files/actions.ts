"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import {
  uploadFileMetadataSchema,
  editFileMetadataSchema,
} from "@/lib/validations/file";
import { validateUploadedFile, sanitizeFileName } from "@/lib/file-security";
import {
  generateStorageKey,
  uploadObject,
  deleteObject,
  StorageError,
} from "@/lib/storage";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

async function assertAdmin() {
  const user = await getCurrentUser();
  return user && user.role === "ADMIN" ? user : null;
}

/**
 * Validates that projectId/folderId (if provided) belong to `clientId`, and
 * that a folder scoped to a project stays consistent with the file's own
 * project. Returns the resolved projectId to persist, or a field error.
 */
async function resolveProjectAndFolder(params: {
  clientId: string;
  projectId?: string;
  folderId?: string;
}): Promise<
  | { ok: true; projectId: string | null; folderId: string | null }
  | { ok: false; error: string; field: "projectId" | "folderId" }
> {
  const { clientId } = params;
  let projectId = params.projectId ?? null;
  const folderId = params.folderId ?? null;

  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, clientId: true },
    });
    if (!project || project.clientId !== clientId) {
      return {
        ok: false,
        error: "Selected project does not belong to this client.",
        field: "projectId",
      };
    }
  }

  if (folderId) {
    const folder = await prisma.fileFolder.findUnique({
      where: { id: folderId },
      select: { id: true, clientId: true, projectId: true },
    });
    if (!folder || folder.clientId !== clientId) {
      return {
        ok: false,
        error: "Selected folder does not belong to this client.",
        field: "folderId",
      };
    }
    if (folder.projectId) {
      if (!projectId) {
        projectId = folder.projectId;
      } else if (projectId !== folder.projectId) {
        return {
          ok: false,
          error: "Selected folder belongs to a different project.",
          field: "folderId",
        };
      }
    }
  }

  return { ok: true, projectId, folderId };
}

export async function uploadFileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return {
      error: "Please choose a file to upload.",
      fieldErrors: { file: ["Please choose a file to upload."] },
    };
  }

  const parsed = uploadFileMetadataSchema.safeParse({
    displayName: formData.get("displayName"),
    clientId: formData.get("clientId"),
    projectId: formData.get("projectId"),
    folderId: formData.get("folderId"),
    category: formData.get("category") || undefined,
    description: formData.get("description"),
    visibleToClient: formData.get("visibleToClient"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const validation = await validateUploadedFile(file);
  if (!validation.ok) {
    return { error: validation.error, fieldErrors: { file: [validation.error] } };
  }

  const {
    displayName,
    clientId,
    projectId: rawProjectId,
    folderId: rawFolderId,
    category,
    description,
    visibleToClient,
  } = parsed.data;

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

  const resolved = await resolveProjectAndFolder({
    clientId,
    projectId: rawProjectId,
    folderId: rawFolderId,
  });
  if (!resolved.ok) {
    return { error: resolved.error, fieldErrors: { [resolved.field]: [resolved.error] } };
  }

  const originalName = sanitizeFileName(file.name);
  const storageKey = generateStorageKey(clientId, validation.extension);

  try {
    await uploadObject({
      storageKey,
      file,
      contentType: validation.mimeType,
    });
  } catch (err) {
    console.error("[admin/files] upload to storage failed:", err);
    const message =
      err instanceof StorageError
        ? err.message
        : "Failed to upload file. Please try again.";
    return { error: message };
  }

  let createdId: string;
  try {
    const created = await prisma.managedFile.create({
      data: {
        displayName,
        originalName,
        storageKey,
        mimeType: validation.mimeType,
        sizeBytes: BigInt(file.size),
        category,
        visibleToClient,
        description,
        clientId,
        projectId: resolved.projectId,
        folderId: resolved.folderId,
        uploadedById: admin.id,
      },
      select: { id: true },
    });
    createdId = created.id;
  } catch (err) {
    console.error("[admin/files] DB write failed after storage upload:", err);
    // Compensate: remove the now-orphaned storage object since no DB row
    // references it.
    try {
      await deleteObject(storageKey);
    } catch (cleanupErr) {
      console.error(
        "[admin/files] cleanup of orphaned storage object failed:",
        cleanupErr
      );
    }
    return { error: "Failed to save file record. Please try again." };
  }

  revalidatePath("/admin/files");
  revalidatePath("/admin");
  redirect(`/admin/files/${createdId}`);
}

export async function updateFileMetadataAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const fileId = formData.get("fileId");
  if (typeof fileId !== "string" || !fileId) {
    return { error: "File not found." };
  }

  const parsed = editFileMetadataSchema.safeParse({
    displayName: formData.get("displayName"),
    projectId: formData.get("projectId"),
    folderId: formData.get("folderId"),
    category: formData.get("category"),
    description: formData.get("description"),
    visibleToClient: formData.get("visibleToClient"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.managedFile.findUnique({
    where: { id: fileId },
    select: { id: true, clientId: true },
  });
  if (!existing) {
    return { error: "File not found." };
  }

  const { displayName, projectId, folderId, category, description, visibleToClient } =
    parsed.data;

  const resolved = await resolveProjectAndFolder({
    clientId: existing.clientId,
    projectId,
    folderId,
  });
  if (!resolved.ok) {
    return { error: resolved.error, fieldErrors: { [resolved.field]: [resolved.error] } };
  }

  try {
    await prisma.managedFile.update({
      where: { id: fileId },
      data: {
        displayName,
        category,
        description,
        visibleToClient,
        projectId: resolved.projectId,
        folderId: resolved.folderId,
      },
    });
  } catch (err) {
    console.error("[admin/files] metadata update failed:", err);
    return { error: "Failed to update file. Please try again." };
  }

  revalidatePath("/admin/files");
  revalidatePath(`/admin/files/${fileId}`);
  redirect(`/admin/files/${fileId}`);
}

export async function archiveFileAction(
  fileId: string
): Promise<{ error?: string }> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const existing = await prisma.managedFile.findUnique({
    where: { id: fileId },
    select: { id: true },
  });
  if (!existing) {
    return { error: "File not found." };
  }

  try {
    await prisma.managedFile.update({
      where: { id: fileId },
      data: { status: "ARCHIVED" },
    });
  } catch (err) {
    console.error("[admin/files] archive failed:", err);
    return { error: "Failed to archive file. Please try again." };
  }

  revalidatePath("/admin/files");
  revalidatePath(`/admin/files/${fileId}`);
  return {};
}

export async function restoreFileAction(
  fileId: string
): Promise<{ error?: string }> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const existing = await prisma.managedFile.findUnique({
    where: { id: fileId },
    select: { id: true },
  });
  if (!existing) {
    return { error: "File not found." };
  }

  try {
    await prisma.managedFile.update({
      where: { id: fileId },
      data: { status: "ACTIVE" },
    });
  } catch (err) {
    console.error("[admin/files] restore failed:", err);
    return { error: "Failed to restore file. Please try again." };
  }

  revalidatePath("/admin/files");
  revalidatePath(`/admin/files/${fileId}`);
  return {};
}

export async function deleteFileAction(
  fileId: string
): Promise<{ error?: string }> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const existing = await prisma.managedFile.findUnique({
    where: { id: fileId },
    select: { id: true, storageKey: true },
  });
  if (!existing) {
    return { error: "File not found." };
  }

  try {
    await deleteObject(existing.storageKey);
  } catch (err) {
    console.error("[admin/files] storage delete failed:", err);
    return { error: "Failed to delete the stored file. Please try again." };
  }

  try {
    await prisma.managedFile.delete({ where: { id: fileId } });
  } catch (err) {
    // The storage object is already gone at this point but the database row
    // remains — this is a rare partial-failure state that needs manual
    // cleanup; it is logged with the file id for that purpose.
    console.error(
      `[admin/files] DB delete failed after storage delete succeeded for file ${fileId}:`,
      err
    );
    return {
      error: "File was removed from storage but the record could not be deleted. Please try again or contact support.",
    };
  }

  revalidatePath("/admin/files");
  revalidatePath("/admin");
  return {};
}

export async function replaceFileVersionAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const fileId = formData.get("fileId");
  if (typeof fileId !== "string" || !fileId) {
    return { error: "File not found." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return {
      error: "Please choose a replacement file to upload.",
      fieldErrors: { file: ["Please choose a replacement file to upload."] },
    };
  }

  const previous = await prisma.managedFile.findUnique({
    where: { id: fileId },
    select: {
      id: true,
      displayName: true,
      category: true,
      description: true,
      visibleToClient: true,
      clientId: true,
      projectId: true,
      folderId: true,
      version: true,
    },
  });
  if (!previous) {
    return { error: "File not found." };
  }

  const validation = await validateUploadedFile(file);
  if (!validation.ok) {
    return { error: validation.error, fieldErrors: { file: [validation.error] } };
  }

  const originalName = sanitizeFileName(file.name);
  const storageKey = generateStorageKey(previous.clientId, validation.extension);

  try {
    await uploadObject({ storageKey, file, contentType: validation.mimeType });
  } catch (err) {
    console.error("[admin/files] replacement upload failed:", err);
    const message =
      err instanceof StorageError
        ? err.message
        : "Failed to upload replacement file. Please try again.";
    return { error: message };
  }

  let newFileId: string;
  try {
    const created = await prisma.$transaction(async (tx) => {
      const newFile = await tx.managedFile.create({
        data: {
          displayName: previous.displayName,
          originalName,
          storageKey,
          mimeType: validation.mimeType,
          sizeBytes: BigInt(file.size),
          category: previous.category,
          visibleToClient: previous.visibleToClient,
          description: previous.description,
          clientId: previous.clientId,
          projectId: previous.projectId,
          folderId: previous.folderId,
          uploadedById: admin.id,
          version: previous.version + 1,
          replacesFileId: previous.id,
        },
        select: { id: true },
      });
      await tx.managedFile.update({
        where: { id: previous.id },
        data: { status: "ARCHIVED" },
      });
      return newFile;
    });
    newFileId = created.id;
  } catch (err) {
    console.error(
      "[admin/files] DB write failed after replacement upload:",
      err
    );
    try {
      await deleteObject(storageKey);
    } catch (cleanupErr) {
      console.error(
        "[admin/files] cleanup of orphaned replacement object failed:",
        cleanupErr
      );
    }
    return { error: "Failed to save the new version. Please try again." };
  }

  revalidatePath("/admin/files");
  revalidatePath(`/admin/files/${fileId}`);
  redirect(`/admin/files/${newFileId}`);
}

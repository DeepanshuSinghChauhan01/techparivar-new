import { z } from "zod";
import { FileCategory } from "@prisma/client";

const emptyToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

const optionalId = z.preprocess(emptyToUndefined, z.string().trim().optional());

const optionalTrimmedString = (max: number) =>
  z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());

/** FormData checkboxes only send a value when checked ("on"); absent means false. */
const checkboxBoolean = z.preprocess(
  (val) => val === "on" || val === "true" || val === true,
  z.boolean()
);

export const uploadFileMetadataSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required").max(200),
  clientId: z.string().trim().min(1, "Client is required"),
  projectId: optionalId,
  folderId: optionalId,
  category: z.nativeEnum(FileCategory).default(FileCategory.OTHER),
  description: optionalTrimmedString(2000),
  visibleToClient: checkboxBoolean,
});

export type UploadFileMetadataInput = z.infer<typeof uploadFileMetadataSchema>;

export const editFileMetadataSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required").max(200),
  projectId: optionalId,
  folderId: optionalId,
  category: z.nativeEnum(FileCategory),
  description: optionalTrimmedString(2000),
  visibleToClient: checkboxBoolean,
});

export type EditFileMetadataInput = z.infer<typeof editFileMetadataSchema>;

export const createFolderSchema = z.object({
  name: z.string().trim().min(1, "Folder name is required").max(120),
  clientId: z.string().trim().min(1, "Client is required"),
  projectId: optionalId,
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;

export const renameFolderSchema = z.object({
  name: z.string().trim().min(1, "Folder name is required").max(120),
});

export type RenameFolderInput = z.infer<typeof renameFolderSchema>;

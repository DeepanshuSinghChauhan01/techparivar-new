import { put, del, get } from "@vercel/blob";
import { randomUUID } from "crypto";

/**
 * Server-only storage abstraction over Vercel Blob (private access).
 * Application code (pages/actions/components) must never import
 * "@vercel/blob" directly — every storage operation goes through here so
 * provider-specific behavior (auth, error shapes, key layout) stays in one
 * place.
 */

export class StorageError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "StorageError";
  }
}

/**
 * Generates an unpredictable, collision-resistant storage key scoped under
 * the owning client. Never derive a storage key from user-supplied input
 * (original filename, form fields, etc.) — always call this instead, and
 * only ever pass the resulting key to the storage functions below.
 */
export function generateStorageKey(clientId: string, extension: string): string {
  const safeExt = extension
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 10);
  return `clients/${clientId}/${randomUUID()}${safeExt ? `.${safeExt}` : ""}`;
}

export async function uploadObject(params: {
  storageKey: string;
  file: Blob;
  contentType: string;
}): Promise<{ url: string }> {
  try {
    const result = await put(params.storageKey, params.file, {
      access: "private",
      contentType: params.contentType,
      addRandomSuffix: false,
      allowOverwrite: false,
    });
    return { url: result.url };
  } catch (err) {
    console.error(
      "[storage] upload failed:",
      err instanceof Error ? err.message : "unknown error"
    );
    throw new StorageError(
      "File storage is not available right now. Please try again later.",
      { cause: err }
    );
  }
}

export async function deleteObject(storageKey: string): Promise<void> {
  try {
    await del(storageKey);
  } catch (err) {
    console.error(
      "[storage] delete failed:",
      err instanceof Error ? err.message : "unknown error"
    );
    throw new StorageError(
      "Failed to delete the stored file. Please try again later.",
      { cause: err }
    );
  }
}

export type StoredObject = {
  stream: ReadableStream<Uint8Array>;
  contentType: string;
  size: number;
};

/** Returns null if the object doesn't exist in storage. */
export async function readObject(
  storageKey: string
): Promise<StoredObject | null> {
  try {
    const result = await get(storageKey, { access: "private" });
    if (!result || result.statusCode !== 200) return null;
    return {
      stream: result.stream,
      contentType: result.blob.contentType,
      size: result.blob.size,
    };
  } catch (err) {
    console.error(
      "[storage] read failed:",
      err instanceof Error ? err.message : "unknown error"
    );
    throw new StorageError(
      "Failed to read the stored file. Please try again later.",
      { cause: err }
    );
  }
}

/**
 * Server-only file upload security: an explicit MIME/extension allowlist,
 * lightweight magic-byte signature verification (never trust the browser's
 * reported Content-Type or the filename extension alone), size limits, and
 * filename sanitization.
 */

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

function bytesStartWith(bytes: Uint8Array, signature: number[]): boolean {
  if (bytes.length < signature.length) return false;
  return signature.every((byte, i) => bytes[i] === byte);
}

function isZipSignature(bytes: Uint8Array): boolean {
  // Local file header "PK\x03\x04", or empty-archive variants "PK\x05\x06"/"PK\x07\x08".
  return (
    bytesStartWith(bytes, [0x50, 0x4b, 0x03, 0x04]) ||
    bytesStartWith(bytes, [0x50, 0x4b, 0x05, 0x06]) ||
    bytesStartWith(bytes, [0x50, 0x4b, 0x07, 0x08])
  );
}

function isWebpSignature(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  return riff === "RIFF" && webp === "WEBP";
}

/** Plain-text/CSV have no magic number — reject anything that looks binary or HTML/script instead. */
function looksLikeSafeText(bytes: Uint8Array): boolean {
  if (bytes.includes(0)) return false; // null byte => binary content, not text
  const head = String.fromCharCode(...bytes.slice(0, 20)).trim().toLowerCase();
  return !(
    head.startsWith("<!doctype") ||
    head.startsWith("<html") ||
    head.startsWith("<script") ||
    head.startsWith("<?php") ||
    head.startsWith("#!")
  );
}

type AllowedType = {
  extensions: string[];
  checkSignature: (bytes: Uint8Array) => boolean;
};

export const ALLOWED_FILE_TYPES: Record<string, AllowedType> = {
  "application/pdf": {
    extensions: ["pdf"],
    checkSignature: (b) => bytesStartWith(b, [0x25, 0x50, 0x44, 0x46]),
  },
  "image/png": {
    extensions: ["png"],
    checkSignature: (b) =>
      bytesStartWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  },
  "image/jpeg": {
    extensions: ["jpg", "jpeg"],
    checkSignature: (b) => bytesStartWith(b, [0xff, 0xd8, 0xff]),
  },
  "image/webp": {
    extensions: ["webp"],
    checkSignature: isWebpSignature,
  },
  "text/plain": {
    extensions: ["txt"],
    checkSignature: looksLikeSafeText,
  },
  "text/csv": {
    extensions: ["csv"],
    checkSignature: looksLikeSafeText,
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    extensions: ["docx"],
    checkSignature: isZipSignature,
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    extensions: ["xlsx"],
    checkSignature: isZipSignature,
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    {
      extensions: ["pptx"],
      checkSignature: isZipSignature,
    },
  "application/zip": {
    extensions: ["zip"],
    checkSignature: isZipSignature,
  },
  "application/x-zip-compressed": {
    extensions: ["zip"],
    checkSignature: isZipSignature,
  },
};

/** Strips directory components, control characters, and path traversal; caps length. */
export function sanitizeFileName(rawName: string): string {
  const basename = rawName.split(/[/\\]/).pop() ?? rawName;
  const cleaned = basename
    .replace(/[\x00-\x1f\x7f]/g, "")
    .replace(/\.\.+/g, ".")
    .trim();
  const safe = cleaned.slice(0, 150);
  return safe.length > 0 ? safe : "file";
}

function getExtension(fileName: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(fileName);
  return match ? match[1].toLowerCase() : "";
}

export type FileValidationResult =
  | { ok: true; mimeType: string; extension: string }
  | { ok: false; error: string };

/**
 * Validates an uploaded file end to end: size, MIME/extension allowlist
 * cross-check, and a magic-byte signature check on the actual bytes. Never
 * trust `file.type` or the filename extension in isolation — this is the
 * only function that should decide whether an upload is acceptable.
 */
export async function validateUploadedFile(
  file: File
): Promise<FileValidationResult> {
  if (file.size <= 0) {
    return { ok: false, error: "The uploaded file is empty." };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: `File is too large. Maximum size is ${Math.floor(MAX_FILE_SIZE_BYTES / (1024 * 1024))} MB.`,
    };
  }

  const claimedType = file.type.toLowerCase();
  const allowed = ALLOWED_FILE_TYPES[claimedType];
  if (!allowed) {
    return { ok: false, error: "This file type is not allowed." };
  }

  const extension = getExtension(sanitizeFileName(file.name));
  if (!allowed.extensions.includes(extension)) {
    return {
      ok: false,
      error: "The file extension does not match its content type.",
    };
  }

  const head = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  if (!allowed.checkSignature(head)) {
    return {
      ok: false,
      error: "The file content does not match its declared type.",
    };
  }

  return { ok: true, mimeType: claimedType, extension };
}

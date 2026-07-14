import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import { assertOwnsClientRecord } from "@/lib/ownership";
import { readObject, StorageError } from "@/lib/storage";

/**
 * Secure, authorization-gated file download.
 *
 * request -> authenticate -> fetch metadata -> authorize (ADMIN or owning
 * CLIENT with visibleToClient && ACTIVE) -> stream from private storage.
 *
 * Never accepts a storageKey from the browser — only ever resolved from the
 * database row after authorization succeeds. Any failure (not found, wrong
 * owner, hidden, archived-for-client) responds identically with 404 so a
 * CLIENT can never distinguish "doesn't exist" from "not yours".
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = await prisma.managedFile.findUnique({
    where: { id: fileId },
    select: {
      id: true,
      clientId: true,
      storageKey: true,
      mimeType: true,
      originalName: true,
      visibleToClient: true,
      status: true,
    },
  });

  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  const owns = await assertOwnsClientRecord(user, file.clientId);
  if (!owns) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (user.role === "CLIENT") {
    if (!file.visibleToClient || file.status !== "ACTIVE") {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  let stored;
  try {
    stored = await readObject(file.storageKey);
  } catch (err) {
    console.error("[api/files/download] storage read failed:", err);
    const message =
      err instanceof StorageError
        ? err.message
        : "Failed to download file. Please try again.";
    return new NextResponse(message, { status: 502 });
  }

  if (!stored) {
    return new NextResponse("Not found", { status: 404 });
  }

  const safeFileName = file.originalName.replace(/["\r\n]/g, "");

  return new NextResponse(stored.stream, {
    status: 200,
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": `attachment; filename="${safeFileName}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}

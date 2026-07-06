import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser, type SessionUser } from "@/lib/auth-helpers";

/** Returns the ClientProfile id for a CLIENT session user, or null (ADMIN, or a CLIENT with no profile). */
export async function getMyClientProfileId(
  user: SessionUser
): Promise<string | null> {
  if (user.role !== "CLIENT") return null;
  const profile = await prisma.clientProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  return profile?.id ?? null;
}

/**
 * For portal pages that only make sense for a CLIENT viewing their own data
 * (project/ticket list, ticket creation). An authenticated ADMIN visiting
 * these is sent to their own dashboard rather than treated as an error,
 * since ADMIN has no personal ClientProfile to scope "mine" to. A CLIENT
 * session with no ClientProfile (data integrity issue) is treated as an
 * invalid session and sent to re-authenticate.
 */
export async function requireClientProfileId(): Promise<{
  user: SessionUser;
  clientProfileId: string;
}> {
  const user = await requireUser();
  if (user.role === "ADMIN") {
    redirect("/admin");
  }
  const clientProfileId = await getMyClientProfileId(user);
  if (!clientProfileId) {
    redirect("/login");
  }
  return { user, clientProfileId };
}

/**
 * Whether `user` may access a record that belongs to `recordClientId`.
 * ADMIN: always. CLIENT: only their own ClientProfile's records.
 *
 * Callers must call this immediately after fetching a record (selecting at
 * least its `clientId`) and BEFORE using/rendering anything else from it —
 * on a false result, respond with notFound() (or an equivalent safe denial)
 * without exposing any other field from the record.
 */
export async function assertOwnsClientRecord(
  user: SessionUser,
  recordClientId: string
): Promise<boolean> {
  if (user.role === "ADMIN") return true;
  const myClientProfileId = await getMyClientProfileId(user);
  return myClientProfileId !== null && myClientProfileId === recordClientId;
}

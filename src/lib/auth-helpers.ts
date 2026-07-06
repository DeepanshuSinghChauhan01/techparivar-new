import { redirect } from "next/navigation";

import { auth } from "@/auth";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: "ADMIN" | "CLIENT";
};

/**
 * Returns the current session user, or null if unauthenticated OR if the
 * session/user shape is malformed (missing id, missing/invalid role — e.g. a
 * stale cookie or a deleted user). Never trusts the declared type alone.
 * No redirects.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  const user = session?.user;

  if (
    !user ||
    typeof user.id !== "string" ||
    !user.id ||
    (user.role !== "ADMIN" && user.role !== "CLIENT")
  ) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

/** For Server Components/pages: requires any authenticated user, else redirects to /login. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * For Server Components/pages: requires an authenticated ADMIN.
 * Unauthenticated -> /login. Authenticated non-admin -> /portal/dashboard.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/portal/dashboard");
  }
  return user;
}

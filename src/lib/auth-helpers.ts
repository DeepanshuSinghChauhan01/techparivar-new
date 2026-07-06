import { redirect } from "next/navigation";

import { auth } from "@/auth";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: "ADMIN" | "CLIENT";
};

/** Returns the current session user, or null if unauthenticated. No redirects. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  return session?.user ?? null;
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

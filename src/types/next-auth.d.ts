import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    // Optional: a decoded JWT is not guaranteed to carry a valid id/role
    // (e.g. a stale cookie issued before role-based auth existed, or a
    // deleted user). Consumers must validate this before trusting it —
    // see src/lib/auth-helpers.ts.
    user?: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}

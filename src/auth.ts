import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string" ||
          !credentials.email.trim() ||
          !credentials.password
        ) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Fresh sign-in: authorize() already validated this user against the DB.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        return token;
      }

      const hasValidClaims =
        typeof token.id === "string" &&
        (token.role === "ADMIN" || token.role === "CLIENT");

      // Self-heal tokens that predate role-based auth (or otherwise never
      // got id/role persisted) by re-deriving them from the database once,
      // using the standard JWT `sub` claim. After this the encoded cookie
      // carries valid claims, so this only runs for a token's first request.
      // A failed lookup (deleted user, or a transient DB error) must never
      // throw here — this is a best-effort repair, not a required step, and
      // an uncaught exception in this callback takes down the entire auth
      // flow (Auth.js surfaces it as a generic configuration error).
      if (!hasValidClaims && typeof token.sub === "string") {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { id: true, role: true },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          } else {
            // User no longer exists: cannot recover.
            token.id = undefined;
            token.role = undefined;
          }
        } catch (err) {
          console.error("[auth] jwt self-heal lookup failed:", err);
          token.id = undefined;
          token.role = undefined;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (
        session.user &&
        typeof token.id === "string" &&
        (token.role === "ADMIN" || token.role === "CLIENT")
      ) {
        session.user.id = token.id;
        session.user.role = token.role;
        return session;
      }

      // Never expose a half-populated user: treat as unauthenticated so
      // callers uniformly redirect to /login instead of crashing on
      // missing fields. Returned as a fresh object rather than mutating
      // `session.user` in place, since Auth.js's internal callback param
      // type requires `user` to exist going in, even though the publicly
      // exposed Session type (see src/types/next-auth.d.ts) makes it optional.
      return { ...session, user: undefined };
    },
  },
});
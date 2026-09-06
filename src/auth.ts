import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
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

        // No local password (e.g. a Google-only account) — credentials
        // sign-in must fail closed rather than compare against null.
        if (!user || !user.password) {
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
    Google,
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") {
        // Credentials: authorize() already validated this user.
        return true;
      }

      const email = user.email?.toLowerCase();
      if (!email) return false;

      // Google only ever asserts email_verified=true for addresses it has
      // actually confirmed ownership of. Requiring it here is what makes
      // "sign in with Google using the same email as an existing account"
      // safe — without it, anyone could claim an unverified address that
      // happens to match an existing TechParivar user and take over their
      // account. Reject anything else rather than guess.
      if (profile?.email_verified !== true) {
        console.warn(`[auth] rejected Google sign-in for unverified email: ${email}`);
        return false;
      }

      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existing) {
        // Existing account (however it was originally created) — link by
        // email and let them in. Role is never touched here.
        return true;
      }

      // Brand-new user via Google. Always CLIENT — never trust an OAuth
      // profile to grant ADMIN. A ClientProfile is required for the portal
      // to treat this account as valid (see src/lib/ownership.ts), so one
      // is created with a placeholder company name the client/admin can
      // edit later.
      try {
        await prisma.user.create({
          data: {
            name: user.name ?? email,
            email,
            password: null,
            role: "CLIENT",
            clientProfile: {
              create: { companyName: user.name ?? email },
            },
          },
        });
        return true;
      } catch (err) {
        console.error("[auth] failed to create user from Google sign-in:", err);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user && account?.provider === "credentials") {
        // Fresh sign-in: authorize() already validated this user against the DB.
        token.id = user.id;
        token.role = user.role;
        return token;
      }

      if (user && account?.provider === "google") {
        // `user.id` here is Google's subject id, not ours, and the OAuth
        // profile carries no role — look our own record up by email. The
        // signIn callback above already guarantees it exists at this point.
        const email = user.email?.toLowerCase();
        const dbUser = email
          ? await prisma.user.findUnique({
              where: { email },
              select: { id: true, role: true },
            })
          : null;

        token.id = dbUser?.id;
        token.role = dbUser?.role;
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

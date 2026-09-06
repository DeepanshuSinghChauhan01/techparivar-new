"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { requestPasswordResetSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { sendPasswordResetEmail } from "@/lib/email";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  success?: boolean;
  message?: string;
};

const RESET_TOKEN_TTL_MS = 45 * 60 * 1000; // 45 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute — cheap protection against request spam

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function getAppUrl(): string {
  return (process.env.AUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

// Always returned verbatim regardless of whether the email exists, is
// unconfirmed, is Google-only, or anything else — this is the one message
// every caller of requestPasswordResetAction sees, by design (Feature 5/11).
const GENERIC_RESET_MESSAGE =
  "If an account exists with this email address, you will receive a password reset link shortly.";

export async function requestPasswordResetAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = requestPasswordResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      error: "Please enter a valid email address.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (user) {
      const recentToken = await prisma.passwordResetToken.findFirst({
        where: { userId: user.id, createdAt: { gt: new Date(Date.now() - RESEND_COOLDOWN_MS) } },
        select: { id: true },
      });

      // Silently no-op on rapid repeat requests — still return the generic
      // message so this is indistinguishable from a fresh request.
      if (!recentToken) {
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = hashToken(rawToken);

        // Only one live reset link per user at a time.
        await prisma.passwordResetToken.deleteMany({
          where: { userId: user.id, usedAt: null },
        });
        await prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            tokenHash,
            expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
          },
        });

        const resetUrl = `${getAppUrl()}/reset-password?token=${rawToken}`;
        console.log(`[auth] password reset requested for user ${user.id}`);

        try {
          await sendPasswordResetEmail({ name: user.name, email: user.email, resetUrl });
        } catch (err) {
          console.error("[auth] password reset email failed:", err);
        }
      }
    }
  } catch (err) {
    // Never let a lookup/DB error leak which branch failed — log and still
    // return the generic message.
    console.error("[auth] password reset request failed:", err);
  }

  return { success: true, message: GENERIC_RESET_MESSAGE };
}

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { token, password } = parsed.data;
  const tokenHash = hashToken(token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, expiresAt: true, usedAt: true },
  });

  const invalidResponse: ActionState = {
    error: "This reset link is invalid or has expired. Please request a new one.",
  };

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return invalidResponse;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { password: passwordHash },
      }),
      // Mark this token used and invalidate any other outstanding tokens
      // for the same user in one go.
      prisma.passwordResetToken.updateMany({
        where: { userId: record.userId, usedAt: null },
        data: { usedAt: new Date() },
      }),
    ]);
  } catch (err) {
    console.error("[auth] password reset failed:", err);
    return { error: "Something went wrong resetting your password. Please try again." };
  }

  console.log(`[auth] password successfully reset for user ${record.userId}`);
  return { success: true };
}

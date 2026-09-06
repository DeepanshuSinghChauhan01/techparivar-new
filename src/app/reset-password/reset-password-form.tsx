"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Lock, Zap, CheckCircle2, AlertCircle } from "lucide-react";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { Card } from "@/components/portal-ui/card";
import { resetPasswordAction, type ActionState } from "@/lib/auth-actions";

const initialState: ActionState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_rgba(255,92,0,0.35)]">
        <Zap className="size-7" />
      </span>
      <h1 className="mt-5 font-portal-display text-2xl font-bold">Reset Password</h1>
      <p className="mt-1 text-sm text-on-surface-variant">Choose a new password for your account.</p>

      <Card className="mt-8 w-full gap-5 border-border/80 p-6 text-left">
        {!token ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <AlertCircle className="size-8 text-red-500" />
            <p className="text-sm text-on-surface-variant">
              This reset link is missing its token. Please request a new one.
            </p>
            <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
              Request a new link
            </Link>
          </div>
        ) : state.success ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="size-8 text-mint-green" />
            <p className="text-sm text-on-surface-variant">
              Your password has been reset. You can now sign in with your new password.
            </p>
            <Link href="/login">
              <Button size="lg" className="mt-2">
                Go to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="token" value={token} />

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
              {state.fieldErrors?.password && (
                <p className="text-xs text-red-500">{state.fieldErrors.password[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
              {state.fieldErrors?.confirmPassword && (
                <p className="text-xs text-red-500">{state.fieldErrors.confirmPassword[0]}</p>
              )}
            </div>

            {state.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

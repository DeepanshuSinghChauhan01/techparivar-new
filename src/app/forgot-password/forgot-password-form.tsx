"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, Zap, ArrowLeft, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/portal-ui/button";
import { Input } from "@/components/portal-ui/input";
import { Label } from "@/components/portal-ui/label";
import { Card } from "@/components/portal-ui/card";
import { requestPasswordResetAction, type ActionState } from "@/lib/auth-actions";

const initialState: ActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);

  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_rgba(255,92,0,0.35)]">
        <Zap className="size-7" />
      </span>
      <h1 className="mt-5 font-portal-display text-2xl font-bold">Forgot Password</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <Card className="mt-8 w-full gap-5 border-border/80 p-6 text-left">
        {state.success ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="size-8 text-mint-green" />
            <p className="text-sm text-on-surface-variant">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10"
                  required
                />
              </div>
              {state.fieldErrors?.email && (
                <p className="text-xs text-red-500">{state.fieldErrors.email[0]}</p>
              )}
            </div>

            {state.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </Card>

      <Link
        href="/login"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to Sign In
      </Link>
    </div>
  );
}

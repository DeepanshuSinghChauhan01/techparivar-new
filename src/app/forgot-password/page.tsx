import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { noindexMetadata } from "@/lib/seo";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | TechParivar",
  ...noindexMetadata,
};

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === "ADMIN" ? "/admin" : "/portal/dashboard");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
      <div className="relative z-10 mx-auto w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}

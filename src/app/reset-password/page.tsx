import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import { noindexMetadata } from "@/lib/seo";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | TechParivar",
  ...noindexMetadata,
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === "ADMIN" ? "/admin" : "/portal/dashboard");
  }

  const { token } = await searchParams;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" />
      <div className="relative z-10 mx-auto w-full max-w-sm">
        <ResetPasswordForm token={token ?? ""} />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import LoginView from "./login-view";

export const metadata: Metadata = {
  title: "Client Login",
  description: "Sign in to the TechParivar Client Portal to view projects, files, and support tickets.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/portal/dashboard");
  }

  return <LoginView />;
}
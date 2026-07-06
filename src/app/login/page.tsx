import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-helpers";
import LoginView from "./login-view";

export const metadata: Metadata = {
  title: "Client Login | TechParivar",
  description: "Enter the TechParivar Client Portal ecosystem.",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/portal/dashboard");
  }

  return <LoginView />;
}
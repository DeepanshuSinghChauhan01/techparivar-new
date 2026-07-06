import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LoginView from "./login-view";

export const metadata: Metadata = {
  title: "Client Login | TechParivar",
  description: "Enter the TechParivar Client Portal ecosystem.",
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/portal/dashboard");
  }

  return <LoginView />;
}
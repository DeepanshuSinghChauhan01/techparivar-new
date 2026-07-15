"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import { createClientSchema, updateClientSchema } from "@/lib/validations/client";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

async function assertAdmin() {
  const user = await getCurrentUser();
  return user && user.role === "ADMIN" ? user : null;
}

function isUniqueConstraintError(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"
  );
}

export async function createClientAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const parsed = createClientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    companyName: formData.get("companyName"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    website: formData.get("website"),
    notes: formData.get("notes"),
    status: formData.get("status") || undefined,
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, companyName, password, phone, website, notes, status } =
    parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return { error: "A user with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let createdId: string;
  try {
    const created = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: "CLIENT",
        clientProfile: {
          create: { companyName, phone, website, notes, status },
        },
      },
      select: { id: true },
    });
    createdId = created.id;
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { error: "A user with this email already exists." };
    }
    console.error("[admin/clients] create failed:", err);
    return { error: "Failed to create client. Please try again." };
  }

  revalidatePath("/admin/clients");
  revalidatePath("/admin");
  redirect(`/admin/clients/${createdId}`);
}

export async function updateClientAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const clientId = formData.get("clientId");
  if (typeof clientId !== "string" || !clientId) {
    return { error: "Client not found." };
  }

  const parsed = updateClientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    companyName: formData.get("companyName"),
    phone: formData.get("phone"),
    website: formData.get("website"),
    notes: formData.get("notes"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const target = await prisma.user.findUnique({
    where: { id: clientId },
    select: { id: true, role: true },
  });
  if (!target || target.role !== "CLIENT") {
    return { error: "Client not found." };
  }

  const { name, email, companyName, phone, website, notes, status } =
    parsed.data;

  try {
    await prisma.user.update({
      where: { id: clientId },
      data: {
        name,
        email,
        clientProfile: {
          upsert: {
            create: { companyName, phone, website, notes, status },
            update: { companyName, phone, website, notes, status },
          },
        },
      },
    });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { error: "A user with this email already exists." };
    }
    console.error("[admin/clients] update failed:", err);
    return { error: "Failed to update client. Please try again." };
  }

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin");
  redirect(`/admin/clients/${clientId}`);
}

export async function deleteClientAction(
  clientId: string
): Promise<{ error?: string }> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  if (admin.id === clientId) {
    return { error: "You cannot delete your own account here." };
  }

  const target = await prisma.user.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      role: true,
      clientProfile: {
        select: { _count: { select: { engagements: true } } },
      },
    },
  });
  if (!target) {
    return { error: "Client not found." };
  }
  if (target.role !== "CLIENT") {
    return { error: "Only client accounts can be deleted here." };
  }

  if (target.clientProfile && target.clientProfile._count.engagements > 0) {
    return {
      error:
        "This client has service engagements on record and cannot be deleted. Set their status to Inactive instead to preserve their history, or cancel/remove their engagements first.",
    };
  }

  try {
    await prisma.user.delete({ where: { id: clientId } });
  } catch (err) {
    console.error("[admin/clients] delete failed:", err);
    return { error: "Failed to delete client. Please try again." };
  }

  revalidatePath("/admin/clients");
  revalidatePath("/admin");
  return {};
}

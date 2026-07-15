"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import {
  createServiceCategorySchema,
  updateServiceCategorySchema,
} from "@/lib/validations/service-category";
import { createServiceSchema, updateServiceSchema } from "@/lib/validations/service";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

async function assertAdmin() {
  const user = await getCurrentUser();
  return user && user.role === "ADMIN" ? user : null;
}

// ============================================================
// ServiceCategory
// ============================================================

export async function createServiceCategoryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const parsed = createServiceCategorySchema.safeParse({
    key: formData.get("key"),
    name: formData.get("name"),
    description: formData.get("description"),
    kpiTemplateKey: formData.get("kpiTemplateKey"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { key, name, description, kpiTemplateKey, sortOrder, isActive } = parsed.data;

  const existing = await prisma.serviceCategory.findUnique({
    where: { key },
    select: { id: true },
  });
  if (existing) {
    return {
      error: "A category with this key already exists.",
      fieldErrors: { key: ["A category with this key already exists."] },
    };
  }

  try {
    await prisma.serviceCategory.create({
      data: { key, name, description, kpiTemplateKey, sortOrder, isActive },
    });
  } catch (err) {
    console.error("[admin/services] create category failed:", err);
    return { error: "Failed to create category. Please try again." };
  }

  revalidatePath("/admin/services/categories");
  revalidatePath("/admin/services");
  return {};
}

export async function updateServiceCategoryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const categoryId = formData.get("categoryId");
  if (typeof categoryId !== "string" || !categoryId) {
    return { error: "Category not found." };
  }

  const parsed = updateServiceCategorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    kpiTemplateKey: formData.get("kpiTemplateKey"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.serviceCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!existing) {
    return { error: "Category not found." };
  }

  const { name, description, kpiTemplateKey, sortOrder, isActive } = parsed.data;

  try {
    await prisma.serviceCategory.update({
      where: { id: categoryId },
      data: { name, description, kpiTemplateKey, sortOrder, isActive },
    });
  } catch (err) {
    console.error("[admin/services] update category failed:", err);
    return { error: "Failed to update category. Please try again." };
  }

  revalidatePath("/admin/services/categories");
  revalidatePath("/admin/services");
  return {};
}

export async function deleteServiceCategoryAction(
  categoryId: string
): Promise<{ error?: string }> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const existing = await prisma.serviceCategory.findUnique({
    where: { id: categoryId },
    select: { id: true, _count: { select: { services: true } } },
  });
  if (!existing) {
    return { error: "Category not found." };
  }
  if (existing._count.services > 0) {
    return {
      error: "This category still has services. Reassign or remove them first.",
    };
  }

  try {
    await prisma.serviceCategory.delete({ where: { id: categoryId } });
  } catch (err) {
    console.error("[admin/services] delete category failed:", err);
    return { error: "Failed to delete category. Please try again." };
  }

  revalidatePath("/admin/services/categories");
  revalidatePath("/admin/services");
  return {};
}

// ============================================================
// Service (never hard-deleted through the application — only
// deactivated via updateServiceAction's isActive field)
// ============================================================

export async function createServiceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const parsed = createServiceSchema.safeParse({
    key: formData.get("key"),
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    description: formData.get("description"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { key, name, categoryId, description, isActive } = parsed.data;

  // Never trust a browser-supplied categoryId: confirm it's a real category.
  const category = await prisma.serviceCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) {
    return {
      error: "Selected category does not exist.",
      fieldErrors: { categoryId: ["Selected category does not exist."] },
    };
  }

  const existing = await prisma.service.findUnique({
    where: { key },
    select: { id: true },
  });
  if (existing) {
    return {
      error: "A service with this key already exists.",
      fieldErrors: { key: ["A service with this key already exists."] },
    };
  }

  let createdId: string;
  try {
    const created = await prisma.service.create({
      data: { key, name, categoryId, description, isActive },
      select: { id: true },
    });
    createdId = created.id;
  } catch (err) {
    console.error("[admin/services] create service failed:", err);
    return { error: "Failed to create service. Please try again." };
  }

  revalidatePath("/admin/services");
  redirect(`/admin/services/${createdId}`);
}

export async function updateServiceAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const serviceId = formData.get("serviceId");
  if (typeof serviceId !== "string" || !serviceId) {
    return { error: "Service not found." };
  }

  const parsed = updateServiceSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    description: formData.get("description"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true },
  });
  if (!existing) {
    return { error: "Service not found." };
  }

  const { name, categoryId, description, isActive } = parsed.data;

  const category = await prisma.serviceCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) {
    return {
      error: "Selected category does not exist.",
      fieldErrors: { categoryId: ["Selected category does not exist."] },
    };
  }

  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: { name, categoryId, description, isActive },
    });
  } catch (err) {
    console.error("[admin/services] update service failed:", err);
    return { error: "Failed to update service. Please try again." };
  }

  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${serviceId}`);
  redirect(`/admin/services/${serviceId}`);
}

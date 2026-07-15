"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import {
  createServicePlanSchema,
  updateServicePlanSchema,
} from "@/lib/validations/service-plan";
import {
  createPlanFeatureSchema,
  updatePlanFeatureSchema,
} from "@/lib/validations/plan-feature";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

async function assertAdmin() {
  const user = await getCurrentUser();
  return user && user.role === "ADMIN" ? user : null;
}

// ============================================================
// ServicePlan (never hard-deleted through the application — only
// deactivated via updateServicePlanAction's isActive field)
// ============================================================

export async function createServicePlanAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const parsed = createServicePlanSchema.safeParse({
    serviceId: formData.get("serviceId"),
    name: formData.get("name"),
    billingType: formData.get("billingType"),
    billingCycle: formData.get("billingCycle"),
    basePrice: formData.get("basePrice"),
    currency: formData.get("currency"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { serviceId, name, billingType, billingCycle, basePrice, currency, isActive } =
    parsed.data;

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true },
  });
  if (!service) {
    return {
      error: "Selected service does not exist.",
      fieldErrors: { serviceId: ["Selected service does not exist."] },
    };
  }

  const nameConflict = await prisma.servicePlan.findUnique({
    where: { serviceId_name: { serviceId, name } },
    select: { id: true },
  });
  if (nameConflict) {
    return {
      error: "A plan with this name already exists for this service.",
      fieldErrors: { name: ["A plan with this name already exists for this service."] },
    };
  }

  try {
    await prisma.servicePlan.create({
      data: {
        serviceId,
        name,
        billingType,
        billingCycle: billingCycle ?? null,
        basePrice,
        currency,
        isActive,
      },
    });
  } catch (err) {
    console.error("[admin/services] create plan failed:", err);
    return { error: "Failed to create plan. Please try again." };
  }

  revalidatePath(`/admin/services/${serviceId}`);
  return {};
}

export async function updateServicePlanAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const planId = formData.get("planId");
  if (typeof planId !== "string" || !planId) {
    return { error: "Plan not found." };
  }

  const parsed = updateServicePlanSchema.safeParse({
    name: formData.get("name"),
    billingType: formData.get("billingType"),
    billingCycle: formData.get("billingCycle"),
    basePrice: formData.get("basePrice"),
    currency: formData.get("currency"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.servicePlan.findUnique({
    where: { id: planId },
    select: { id: true, serviceId: true },
  });
  if (!existing) {
    return { error: "Plan not found." };
  }

  const { name, billingType, billingCycle, basePrice, currency, isActive } = parsed.data;

  const nameConflict = await prisma.servicePlan.findUnique({
    where: { serviceId_name: { serviceId: existing.serviceId, name } },
    select: { id: true },
  });
  if (nameConflict && nameConflict.id !== planId) {
    return {
      error: "A plan with this name already exists for this service.",
      fieldErrors: { name: ["A plan with this name already exists for this service."] },
    };
  }

  try {
    await prisma.servicePlan.update({
      where: { id: planId },
      data: { name, billingType, billingCycle: billingCycle ?? null, basePrice, currency, isActive },
    });
  } catch (err) {
    console.error("[admin/services] update plan failed:", err);
    return { error: "Failed to update plan. Please try again." };
  }

  revalidatePath(`/admin/services/${existing.serviceId}`);
  return {};
}

// ============================================================
// PlanFeature
// ============================================================

export async function createPlanFeatureAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const parsed = createPlanFeatureSchema.safeParse({
    planId: formData.get("planId"),
    label: formData.get("label"),
    description: formData.get("description"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { planId, label, description, sortOrder } = parsed.data;

  const plan = await prisma.servicePlan.findUnique({
    where: { id: planId },
    select: { id: true, serviceId: true },
  });
  if (!plan) {
    return {
      error: "Selected plan does not exist.",
      fieldErrors: { planId: ["Selected plan does not exist."] },
    };
  }

  try {
    await prisma.planFeature.create({
      data: { planId, label, description, sortOrder },
    });
  } catch (err) {
    console.error("[admin/services] create plan feature failed:", err);
    return { error: "Failed to add feature. Please try again." };
  }

  revalidatePath(`/admin/services/${plan.serviceId}`);
  return {};
}

export async function updatePlanFeatureAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const featureId = formData.get("featureId");
  if (typeof featureId !== "string" || !featureId) {
    return { error: "Feature not found." };
  }

  const parsed = updatePlanFeatureSchema.safeParse({
    label: formData.get("label"),
    description: formData.get("description"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.planFeature.findUnique({
    where: { id: featureId },
    select: { id: true, plan: { select: { serviceId: true } } },
  });
  if (!existing) {
    return { error: "Feature not found." };
  }

  const { label, description, sortOrder } = parsed.data;

  try {
    await prisma.planFeature.update({
      where: { id: featureId },
      data: { label, description, sortOrder },
    });
  } catch (err) {
    console.error("[admin/services] update plan feature failed:", err);
    return { error: "Failed to update feature. Please try again." };
  }

  revalidatePath(`/admin/services/${existing.plan.serviceId}`);
  return {};
}

export async function deletePlanFeatureAction(
  featureId: string
): Promise<{ error?: string }> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const existing = await prisma.planFeature.findUnique({
    where: { id: featureId },
    select: { id: true, plan: { select: { serviceId: true } } },
  });
  if (!existing) {
    return { error: "Feature not found." };
  }

  try {
    await prisma.planFeature.delete({ where: { id: featureId } });
  } catch (err) {
    console.error("[admin/services] delete plan feature failed:", err);
    return { error: "Failed to delete feature. Please try again." };
  }

  revalidatePath(`/admin/services/${existing.plan.serviceId}`);
  return {};
}

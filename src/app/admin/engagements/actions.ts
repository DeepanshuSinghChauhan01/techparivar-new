"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { EngagementStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import {
  createEngagementSchema,
  updateEngagementSchema,
} from "@/lib/validations/engagement";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  duplicateWarning?: string;
  /** Echoes back whatever the browser submitted so the form can restore its
   * selections after a non-redirecting round trip. React's form actions
   * reset the underlying DOM elements once the action settles, which can
   * desync controlled `<select>`s whose in-memory state didn't change —
   * re-applying these values via effect keeps the UI consistent. */
  submitted?: Record<string, string>;
};

function echoFormData(formData: FormData): Record<string, string> {
  return Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, String(value)])
  );
}

async function assertAdmin() {
  const user = await getCurrentUser();
  return user && user.role === "ADMIN" ? user : null;
}

/** Status transition matrix — CANCELLED and EXPIRED are terminal. Staying
 * on the same status (a plain field edit with no status change) is always
 * allowed and checked separately from this table. */
const ALLOWED_TRANSITIONS: Record<EngagementStatus, EngagementStatus[]> = {
  PENDING: [EngagementStatus.ACTIVE, EngagementStatus.CANCELLED],
  ACTIVE: [
    EngagementStatus.PAUSED,
    EngagementStatus.CANCELLED,
    EngagementStatus.EXPIRED,
  ],
  PAUSED: [EngagementStatus.ACTIVE, EngagementStatus.CANCELLED],
  CANCELLED: [],
  EXPIRED: [],
};

export async function createEngagementAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const parsed = createEngagementSchema.safeParse({
    clientId: formData.get("clientId"),
    serviceId: formData.get("serviceId"),
    planId: formData.get("planId"),
    name: formData.get("name"),
    billingType: formData.get("billingType"),
    billingCycle: formData.get("billingCycle"),
    price: formData.get("price"),
    currency: formData.get("currency"),
    discountType: formData.get("discountType") || undefined,
    discountValue: formData.get("discountValue"),
    taxRate: formData.get("taxRate"),
    paymentTermsDays: formData.get("paymentTermsDays"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    renewalDate: formData.get("renewalDate"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      submitted: echoFormData(formData),
    };
  }

  const {
    clientId,
    serviceId,
    planId,
    name,
    billingType,
    billingCycle,
    price,
    currency,
    discountType,
    discountValue,
    taxRate,
    paymentTermsDays,
    startDate,
    endDate,
    renewalDate,
  } = parsed.data;

  // Never trust browser-supplied IDs: verify the client, the service, and
  // (if provided) that the plan actually belongs to the selected service.
  const client = await prisma.clientProfile.findUnique({
    where: { id: clientId },
    select: { id: true },
  });
  if (!client) {
    return {
      error: "Selected client does not exist.",
      fieldErrors: { clientId: ["Selected client does not exist."] },
      submitted: echoFormData(formData),
    };
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true, name: true, isActive: true },
  });
  if (!service) {
    return {
      error: "Selected service does not exist.",
      fieldErrors: { serviceId: ["Selected service does not exist."] },
      submitted: echoFormData(formData),
    };
  }
  if (!service.isActive) {
    return {
      error: "This service is inactive and cannot be used for new engagements.",
      fieldErrors: { serviceId: ["This service is inactive."] },
      submitted: echoFormData(formData),
    };
  }

  let planName: string | null = null;
  if (planId) {
    const plan = await prisma.servicePlan.findUnique({
      where: { id: planId },
      select: { id: true, name: true, serviceId: true, isActive: true },
    });
    if (!plan || plan.serviceId !== serviceId) {
      return {
        error: "Selected plan does not belong to this service.",
        fieldErrors: { planId: ["Selected plan does not belong to this service."] },
        submitted: echoFormData(formData),
      };
    }
    if (!plan.isActive) {
      return {
        error: "This plan is inactive and cannot be used for new engagements.",
        fieldErrors: { planId: ["This plan is inactive."] },
        submitted: echoFormData(formData),
      };
    }
    planName = plan.name;
  }

  // Duplicate-active-engagement — a warning, not a hard block (a client can
  // legitimately have two engagements for the same service). The client
  // must explicitly confirm before this is created.
  const confirmDuplicate = formData.get("confirmDuplicate") === "true";
  if (!confirmDuplicate) {
    const duplicate = await prisma.clientServiceEngagement.findFirst({
      where: {
        clientId,
        serviceId,
        status: { in: [EngagementStatus.ACTIVE, EngagementStatus.PENDING] },
      },
      select: { id: true, name: true, status: true },
    });
    if (duplicate) {
      return {
        duplicateWarning: `This client already has ${duplicate.status === "ACTIVE" ? "an active" : "a pending"} engagement for ${service.name} ("${duplicate.name}"). Continue anyway?`,
        submitted: echoFormData(formData),
      };
    }
  }

  const resolvedName = name ?? (planName ? `${service.name} — ${planName}` : undefined);
  if (!resolvedName) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: { name: ["Name is required for custom engagements."] },
      submitted: echoFormData(formData),
    };
  }

  let createdId: string;
  try {
    const created = await prisma.clientServiceEngagement.create({
      data: {
        clientId,
        serviceId,
        planId: planId ?? null,
        name: resolvedName,
        billingType,
        billingCycle: billingCycle ?? null,
        price,
        currency,
        discountType,
        discountValue: discountValue ?? null,
        taxRate: taxRate ?? null,
        paymentTermsDays,
        status: EngagementStatus.PENDING,
        startDate: startDate ?? null,
        endDate: endDate ?? null,
        renewalDate: renewalDate ?? null,
        createdById: admin.id,
      },
      select: { id: true },
    });
    createdId = created.id;
  } catch (err) {
    console.error("[admin/engagements] create failed:", err);
    return { error: "Failed to create engagement. Please try again.", submitted: echoFormData(formData) };
  }

  revalidatePath("/admin/engagements");
  revalidatePath(`/admin/clients/${clientId}`);
  redirect(`/admin/engagements/${createdId}`);
}

export async function updateEngagementAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await assertAdmin();
  if (!admin) {
    return { error: "You are not authorized to perform this action." };
  }

  const engagementId = formData.get("engagementId");
  if (typeof engagementId !== "string" || !engagementId) {
    return { error: "Engagement not found." };
  }

  const parsed = updateEngagementSchema.safeParse({
    planId: formData.get("planId"),
    name: formData.get("name"),
    billingType: formData.get("billingType"),
    billingCycle: formData.get("billingCycle"),
    price: formData.get("price"),
    currency: formData.get("currency"),
    discountType: formData.get("discountType") || undefined,
    discountValue: formData.get("discountValue"),
    taxRate: formData.get("taxRate"),
    paymentTermsDays: formData.get("paymentTermsDays"),
    status: formData.get("status"),
    cancellationReason: formData.get("cancellationReason"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    renewalDate: formData.get("renewalDate"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      submitted: echoFormData(formData),
    };
  }

  const existing = await prisma.clientServiceEngagement.findUnique({
    where: { id: engagementId },
    select: {
      id: true,
      clientId: true,
      serviceId: true,
      status: true,
      cancelledAt: true,
      service: { select: { name: true } },
    },
  });
  if (!existing) {
    return { error: "Engagement not found." };
  }

  const {
    planId,
    name,
    billingType,
    billingCycle,
    price,
    currency,
    discountType,
    discountValue,
    taxRate,
    paymentTermsDays,
    status,
    cancellationReason,
    startDate,
    endDate,
    renewalDate,
  } = parsed.data;

  // Status transitions are only legal along the approved matrix. Staying
  // on the same status (an ordinary field edit) is always allowed.
  if (
    status !== existing.status &&
    !ALLOWED_TRANSITIONS[existing.status].includes(status)
  ) {
    return {
      error: `Cannot change status from ${existing.status} to ${status}.`,
      fieldErrors: { status: [`Cannot change status from ${existing.status} to ${status}.`] },
      submitted: echoFormData(formData),
    };
  }

  let planName: string | null = null;
  if (planId) {
    // The service itself is immutable on update — a plan may only be
    // swapped for another plan of the SAME service, never a different one.
    const plan = await prisma.servicePlan.findUnique({
      where: { id: planId },
      select: { id: true, name: true, serviceId: true },
    });
    if (!plan || plan.serviceId !== existing.serviceId) {
      return {
        error: "Selected plan does not belong to this engagement's service.",
        fieldErrors: { planId: ["Selected plan does not belong to this engagement's service."] },
        submitted: echoFormData(formData),
      };
    }
    planName = plan.name;
  }

  const resolvedName =
    name ?? (planName ? `${existing.service.name} — ${planName}` : undefined);
  if (!resolvedName) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: { name: ["Name is required for custom engagements."] },
      submitted: echoFormData(formData),
    };
  }

  // cancelledAt is always server-computed, never accepted from form input;
  // it is stamped once on transition into CANCELLED and cleared otherwise.
  const cancelledAt =
    status === EngagementStatus.CANCELLED
      ? (existing.cancelledAt ?? new Date())
      : null;
  const resolvedCancellationReason =
    status === EngagementStatus.CANCELLED ? cancellationReason : null;

  try {
    await prisma.clientServiceEngagement.update({
      where: { id: engagementId },
      data: {
        planId: planId ?? null,
        name: resolvedName,
        billingType,
        billingCycle: billingCycle ?? null,
        price,
        currency,
        discountType,
        discountValue: discountValue ?? null,
        taxRate: taxRate ?? null,
        paymentTermsDays,
        status,
        cancelledAt,
        cancellationReason: resolvedCancellationReason,
        startDate: startDate ?? null,
        endDate: endDate ?? null,
        renewalDate: renewalDate ?? null,
      },
    });
  } catch (err) {
    console.error("[admin/engagements] update failed:", err);
    return { error: "Failed to update engagement. Please try again.", submitted: echoFormData(formData) };
  }

  revalidatePath("/admin/engagements");
  revalidatePath(`/admin/engagements/${engagementId}`);
  revalidatePath(`/admin/clients/${existing.clientId}`);
  redirect(`/admin/engagements/${engagementId}`);
}

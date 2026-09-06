import { resend, EMAIL_FROM } from "./client";
import {
  welcomeEmail,
  newTicketAdminEmail,
  ticketUpdatedClientEmail,
  passwordResetEmail,
} from "./templates";

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

/**
 * Fire-and-forget-safe email send. Never throws — every caller (ticket
 * creation, client creation, password reset) must keep working even if
 * email delivery is broken or unconfigured. Failures are logged, not
 * surfaced to the end user or the calling action's return value.
 */
async function sendEmail({ to, subject, html }: SendArgs): Promise<void> {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not configured — skipping email "${subject}" to ${to}`);
    return;
  }

  try {
    const result = await resend.emails.send({ from: EMAIL_FROM, to, subject, html });
    if (result.error) {
      console.error(`[email] send failed ("${subject}" to ${to}):`, result.error.message);
      return;
    }
    console.log(`[email] sent "${subject}" to ${to} (id: ${result.data?.id ?? "unknown"})`);
  } catch (err) {
    console.error(`[email] send threw ("${subject}" to ${to}):`, err);
  }
}

export async function sendWelcomeEmail(params: { name: string; email: string }): Promise<void> {
  const { subject, html } = welcomeEmail(params);
  await sendEmail({ to: params.email, subject, html });
}

/** Alias for sendWelcomeEmail — kept as a distinct name since "client created" is the trigger admins think in terms of, but it must never fire a second, separate email for the same event. */
export const sendClientCreatedEmail = sendWelcomeEmail;

export async function sendNewTicketEmail(params: {
  adminEmail: string;
  ticketId: string;
  subject: string;
  description: string;
  priority: string;
  clientName: string;
  clientEmail: string;
}): Promise<void> {
  const { adminEmail, ...rest } = params;
  const { subject, html } = newTicketAdminEmail(rest);
  await sendEmail({ to: adminEmail, subject, html });
}

export async function sendTicketUpdateEmail(params: {
  clientEmail: string;
  ticketId: string;
  subject: string;
  status: string;
  priority: string;
}): Promise<void> {
  const { clientEmail, ...rest } = params;
  const { subject, html } = ticketUpdatedClientEmail(rest);
  await sendEmail({ to: clientEmail, subject, html });
}

export async function sendPasswordResetEmail(params: {
  name: string;
  email: string;
  resetUrl: string;
}): Promise<void> {
  const { subject, html } = passwordResetEmail(params);
  await sendEmail({ to: params.email, subject, html });
}

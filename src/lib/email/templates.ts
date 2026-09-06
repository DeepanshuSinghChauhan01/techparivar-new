import { siteConfig } from "@/lib/site-config";
import { renderEmailLayout, escapeHtml } from "./layout";

/** Base URL for links inside emails. AUTH_URL is already required by Auth.js and reflects the deployed app's real origin, so it's reused here rather than adding a redundant env var. */
function getAppUrl(): string {
  return (process.env.AUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export interface EmailContent {
  subject: string;
  html: string;
}

export function welcomeEmail(params: { name: string; email: string }): EmailContent {
  const loginUrl = `${getAppUrl()}/login`;
  return {
    subject: `Welcome to the ${siteConfig.name} Client Portal`,
    html: renderEmailLayout({
      preheader: `Your ${siteConfig.name} client portal account is ready.`,
      heading: `Welcome, ${params.name.split(" ")[0]}`,
      bodyHtml: `
        <p style="margin:0 0 12px;">Your ${escapeHtml(siteConfig.name)} client portal account has been created for <strong>${escapeHtml(params.email)}</strong>.</p>
        <p style="margin:0 0 12px;">From the portal you can track project progress, view files and deliverables, and open support tickets whenever you need us.</p>
        <p style="margin:0;">If you don't yet have a password, or would like to set a new one, use the "Forgot Password" link on the sign-in page.</p>
      `,
      button: { label: "Go to Client Portal", url: loginUrl },
    }),
  };
}

export function newTicketAdminEmail(params: {
  ticketId: string;
  subject: string;
  description: string;
  priority: string;
  clientName: string;
  clientEmail: string;
}): EmailContent {
  const ticketUrl = `${getAppUrl()}/admin/tickets/${params.ticketId}`;
  const shortDescription =
    params.description.length > 240 ? `${params.description.slice(0, 240)}…` : params.description;

  return {
    subject: `New Support Ticket — #${params.ticketId.slice(-8)}`,
    html: renderEmailLayout({
      preheader: `${params.clientName} opened a new support ticket: ${params.subject}`,
      heading: "New Support Ticket",
      bodyHtml: `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <tr><td style="padding:4px 0;color:#6b7280;width:110px;">Client</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(params.clientName)}</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280;">Email</td><td style="padding:4px 0;">${escapeHtml(params.clientEmail)}</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280;">Priority</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(params.priority)}</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280;">Ticket ID</td><td style="padding:4px 0;font-family:monospace;">#${escapeHtml(params.ticketId.slice(-8))}</td></tr>
        </table>
        <p style="margin:0 0 6px;font-weight:600;color:#111827;">${escapeHtml(params.subject)}</p>
        <p style="margin:0;color:#6b7280;">${escapeHtml(shortDescription)}</p>
      `,
      button: { label: "View Ticket", url: ticketUrl },
    }),
  };
}

export function ticketUpdatedClientEmail(params: {
  ticketId: string;
  subject: string;
  status: string;
  priority: string;
}): EmailContent {
  const ticketUrl = `${getAppUrl()}/portal/support/${params.ticketId}`;

  return {
    subject: `Ticket Updated — ${params.subject}`,
    html: renderEmailLayout({
      preheader: `Your support ticket "${params.subject}" was updated.`,
      heading: "Your Support Ticket Was Updated",
      bodyHtml: `
        <p style="margin:0 0 16px;">There's an update on your support ticket:</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:4px 0;color:#6b7280;width:110px;">Ticket</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(params.subject)}</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280;">Status</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(params.status)}</td></tr>
          <tr><td style="padding:4px 0;color:#6b7280;">Priority</td><td style="padding:4px 0;">${escapeHtml(params.priority)}</td></tr>
        </table>
      `,
      button: { label: "View Ticket", url: ticketUrl },
    }),
  };
}

export function passwordResetEmail(params: { name: string; resetUrl: string }): EmailContent {
  return {
    subject: `Reset your ${siteConfig.name} password`,
    html: renderEmailLayout({
      preheader: "Reset your password — this link expires in 45 minutes.",
      heading: `Reset your password, ${params.name.split(" ")[0]}`,
      bodyHtml: `
        <p style="margin:0 0 12px;">We received a request to reset your ${escapeHtml(siteConfig.name)} client portal password.</p>
        <p style="margin:0 0 12px;">This link is valid for 45 minutes and can only be used once. If you didn't request this, you can safely ignore this email — your password won't change.</p>
      `,
      button: { label: "Reset Password", url: params.resetUrl },
    }),
  };
}

import { siteConfig } from "@/lib/site-config";

/** Escapes text interpolated into the HTML email body to prevent injection via user-supplied content (names, ticket subjects, etc). */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface EmailButton {
  label: string;
  url: string;
}

interface RenderEmailOptions {
  /** Shown as the inbox preview snippet; not visible in the opened email. */
  preheader: string;
  heading: string;
  /** Pre-escaped HTML paragraphs/blocks — build these with `escapeHtml()` around any dynamic values. */
  bodyHtml: string;
  button?: EmailButton;
}

/**
 * Shared branded wrapper for all transactional emails. Table-based layout
 * with inline styles for maximum email-client compatibility (Outlook,
 * Gmail, Apple Mail) — this is intentional, not legacy code style.
 */
export function renderEmailLayout({ preheader, heading, bodyHtml, button }: RenderEmailOptions): string {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(siteConfig.name)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="background-color:#06090f;padding:24px 32px;">
              <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.01em;">${escapeHtml(siteConfig.name)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:#111827;font-weight:700;">${escapeHtml(heading)}</h1>
              <div style="font-size:14px;line-height:1.6;color:#374151;">
                ${bodyHtml}
              </div>
              ${
                button
                  ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td style="border-radius:8px;background-color:#5b8def;">
                    <a href="${escapeHtml(button.url)}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">${escapeHtml(button.label)}</a>
                  </td>
                </tr>
              </table>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;">
                ${escapeHtml(siteConfig.legalName)} &middot; Need help? <a href="mailto:${escapeHtml(siteConfig.email)}" style="color:#6b7280;">${escapeHtml(siteConfig.email)}</a>
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">&copy; ${year} ${escapeHtml(siteConfig.name)}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

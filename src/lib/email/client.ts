import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

// Lazily constructed so a missing key doesn't crash module import (e.g. at
// build time, or in environments where email isn't configured yet). Callers
// go through sendEmail() in ./send.ts, which handles the null case.
export const resend = apiKey ? new Resend(apiKey) : null;

export const EMAIL_FROM = process.env.EMAIL_FROM ?? "TechParivar <onboarding@resend.dev>";

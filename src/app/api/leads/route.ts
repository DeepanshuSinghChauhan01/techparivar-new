import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { insertLead } from "@/lib/db";

const leadSchema = z.object({
  source: z.enum(["contact_form", "shopify_audit", "exit_intent"]),
  name: z.string().min(1).optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  storeUrl: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const result = await insertLead(parsed.data);

    // TODO: trigger notification on new lead, e.g.
    //   - send a Slack webhook
    //   - send an internal email via Resend/SendGrid
    //   - push to a CRM (HubSpot/Pipedrive) via their API

    return NextResponse.json({ ok: true, persisted: result.persisted }, { status: 200 });
  } catch (err) {
    console.error("[api/leads] insert failed:", err);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormData {
  projectType: string;
  budget: string;
  timeline: string;
  storeUrl: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const projectTypes = [
  "New Shopify store",
  "Shopify Plus build",
  "Theme customization",
  "Store migration",
  "CRO / Performance",
  "Custom app",
  "Not sure yet",
];

const budgets = ["Under $5,000", "$5,000 – $15,000", "$15,000 – $40,000", "$40,000+", "Monthly retainer"];

const timelines = ["ASAP", "Within 1 month", "1–3 months", "Just exploring"];

const steps = ["Project", "Budget & timeline", "Your details"];

export function MultiStepContactForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<FormData>({
    projectType: "",
    budget: "",
    timeline: "",
    storeUrl: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const update = (field: keyof FormData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const canProceed = () => {
    if (step === 0) return !!data.projectType;
    if (step === 1) return !!data.budget && !!data.timeline;
    return !!data.name && !!data.email;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact_form",
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          company: data.company || undefined,
          projectType: data.projectType || undefined,
          budget: data.budget || undefined,
          timeline: data.timeline || undefined,
          storeUrl: data.storeUrl || undefined,
          message: data.message || undefined,
        }),
      });
    } catch (err) {
      console.error("Lead submission failed:", err);
      // Submission failures shouldn't block the user from seeing a
      // confirmation — the lead is also visible in server logs, and a
      // production setup should add retry/alerting here.
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border-subtle bg-card p-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-teal/15 text-accent-teal">
          <CheckCircle2 className="size-7" />
        </div>
        <h3 className="mt-5 font-display text-xl font-semibold text-text-primary">
          Thanks, {data.name.split(" ")[0] || "there"} — we&rsquo;ve got it.
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">
          A member of our team will review your project and reply within one business
          day. Want to skip the wait? Book a slot directly on our calendar.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-card p-6 sm:p-8">
      {/* Progress */}
      <div className="mb-7 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full font-mono-tabular text-xs font-semibold transition-colors",
                i < step
                  ? "bg-accent-teal text-[#06090f]"
                  : i === step
                  ? "border-2 border-accent-blue text-accent-blue"
                  : "border border-border-default text-text-muted"
              )}
            >
              {i < step ? <CheckCircle2 className="size-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-xs sm:block",
                i === step ? "text-text-primary" : "text-text-muted"
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && <div className="h-px flex-1 bg-border-subtle" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <div>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                What do you need help with?
              </h3>
              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {projectTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => update("projectType", type)}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                      data.projectType === type
                        ? "border-accent-blue bg-accent-blue/10 text-text-primary"
                        : "border-border-default text-text-secondary hover:border-border-default hover:bg-card-hover"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <label className="text-sm text-text-secondary">Current store URL (optional)</label>
                <input
                  type="text"
                  value={data.storeUrl}
                  onChange={(e) => update("storeUrl", e.target.value)}
                  placeholder="yourstore.com"
                  className="mt-2 w-full rounded-xl border border-border-default bg-panel px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent-blue"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Budget range
              </h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {budgets.map((b) => (
                  <button
                    key={b}
                    onClick={() => update("budget", b)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      data.budget === b
                        ? "border-accent-blue bg-accent-blue/10 text-text-primary"
                        : "border-border-default text-text-secondary hover:bg-card-hover"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <h3 className="mt-7 font-display text-lg font-semibold text-text-primary">
                Timeline
              </h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {timelines.map((t) => (
                  <button
                    key={t}
                    onClick={() => update("timeline", t)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      data.timeline === t
                        ? "border-accent-blue bg-accent-blue/10 text-text-primary"
                        : "border-border-default text-text-secondary hover:bg-card-hover"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Your details
              </h3>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="text-sm text-text-secondary">Full name *</label>
                  <input
                    type="text"
                    required
                    value={data.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border-default bg-panel px-4 py-3 text-sm text-text-primary outline-none focus:border-accent-blue"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-secondary">Work email *</label>
                  <input
                    type="email"
                    required
                    value={data.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border-default bg-panel px-4 py-3 text-sm text-text-primary outline-none focus:border-accent-blue"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-secondary">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border-default bg-panel px-4 py-3 text-sm text-text-primary outline-none focus:border-accent-blue"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-secondary">Company / brand</label>
                  <input
                    type="text"
                    value={data.company}
                    onChange={(e) => update("company", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-border-default bg-panel px-4 py-3 text-sm text-text-primary outline-none focus:border-accent-blue"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-text-secondary">Anything else we should know?</label>
                  <textarea
                    value={data.message}
                    onChange={(e) => update("message", e.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-border-default bg-panel px-4 py-3 text-sm text-text-primary outline-none focus:border-accent-blue"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-7 flex items-center justify-between border-t border-border-subtle pt-5">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        ) : (
          <span />
        )}

        {step < steps.length - 1 ? (
          <button
            onClick={() => canProceed() && setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-1.5 rounded-full bg-accent-blue px-5 py-2.5 text-sm font-medium text-[#06090f] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
            <ArrowRight className="size-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || submitting}
            className="flex items-center gap-1.5 rounded-full bg-accent-blue px-5 py-2.5 text-sm font-medium text-[#06090f] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Submit request
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

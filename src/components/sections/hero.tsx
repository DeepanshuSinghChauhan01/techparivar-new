"use client";

import { motion } from "framer-motion";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-heading";
import { siteConfig } from "@/lib/site-config";

const metrics = [
  { label: "LCP", value: "1.4s", target: "< 2.5s", pct: 92, status: "good" as const },
  { label: "INP", value: "98ms", target: "< 200ms", pct: 88, status: "good" as const },
  { label: "CLS", value: "0.02", target: "< 0.1", pct: 96, status: "good" as const },
  { label: "Conversion lift", value: "+31%", target: "vs. baseline", pct: 78, status: "accent" as const },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="bg-noise bg-spotlight relative overflow-hidden border-b border-border-subtle bg-grid">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-accent-blue/10 blur-[120px]" />
      <Container className="relative pb-12 pt-8 lg:pb-28 lg:pt-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
              <Eyebrow>
                <span className="sm:hidden">Shopify Plus Partner · 6 countries</span>
                <span className="hidden sm:inline">
                  Shopify &amp; Shopify Plus Partner · US · UK · CA · AU · UAE · IN
                </span>
              </Eyebrow>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={1}
              className="mt-5 font-display text-[1.75rem] font-semibold leading-[1.12] tracking-tight text-text-primary sm:mt-6 sm:text-[2.25rem] sm:leading-[1.08] lg:text-[3.4rem]"
            >
              Shopify development that&rsquo;s built to{" "}
              <span className="text-gradient-accent">scale revenue</span>, not just ship pages.
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={2}
              className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg"
            >
              TechParivar is a Shopify Plus development partner for D2C brands across
              the US, UK, Canada, Australia, UAE, and India — combining custom
              development, CRO, and performance engineering into one accountable team.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={3}
              className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
            >
              <Button href={siteConfig.calendlyUrl} variant="primary" size="lg" showArrow className="w-full sm:w-auto">
                Book Free Consultation
              </Button>
              <Button href="/portfolio" variant="secondary" size="lg" className="w-full sm:w-auto">
                <PlayCircle className="size-4.5" />
                View Portfolio
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={4}
              className="mt-7 flex flex-col gap-2 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3"
            >
              {["Official Shopify Partner", "320+ stores shipped", "9+ years on Shopify"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-text-secondary">
                  <CheckCircle2 className="size-4 text-accent-teal" />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Signature element: live store diagnostic readout */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="surface-card relative rounded-2xl p-5 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.7)] sm:p-7">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-accent-teal" />
                  <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-secondary">
                    Store diagnostic — live audit
                  </span>
                </div>
                <span className="hidden font-mono text-[11px] text-text-muted sm:inline">store.techparivar.com</span>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:gap-4">
                {metrics.map((m, i) => (
                  <div key={m.label}>
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="text-sm text-text-secondary">{m.label}</span>
                      <span
                        className={`font-mono-tabular text-sm font-semibold ${
                          m.status === "accent" ? "text-accent-blue" : "text-accent-teal"
                        }`}
                      >
                        {m.value}
                        <span className="ml-1.5 font-sans text-xs font-normal text-text-muted">
                          {m.target}
                        </span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-subtle">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.pct}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.12, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          m.status === "accent" ? "bg-accent-blue" : "bg-accent-teal"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-panel px-4 py-3 sm:mt-6">
                <span className="text-xs text-text-secondary">Avg. result across 320+ audits</span>
                <span className="font-mono-tabular text-sm font-semibold text-accent-teal">
                  Performance score: 96/100
                </span>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-border-default bg-panel px-4 py-3 shadow-xl sm:block">
              <div className="font-mono-tabular text-lg font-bold text-text-primary">$42M+</div>
              <div className="text-xs text-text-muted">GMV processed on Plus</div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import { CheckCircle2, Gauge, TrendingUp, Search, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { MultiStepContactForm } from "@/components/sections/multi-step-contact-form";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";

export const metadata: Metadata = {
  title: "Free Shopify Audit — Find What's Costing You Conversions",
  description:
    "Get a free, no-obligation Shopify store audit covering Core Web Vitals, conversion funnel, theme code, and SEO health — delivered with prioritized fixes.",
  alternates: { canonical: "/shopify-audit" },
};

const auditAreas = [
  {
    icon: Gauge,
    title: "Performance & Core Web Vitals",
    description: "LCP, INP, and CLS scores, with the exact culprits slowing your store down.",
  },
  {
    icon: TrendingUp,
    title: "Conversion funnel",
    description: "Cart, checkout, and PDP friction points benchmarked against your category.",
  },
  {
    icon: Search,
    title: "SEO & technical health",
    description: "Crawlability, structured data, and on-page issues holding back organic traffic.",
  },
  {
    icon: ShieldCheck,
    title: "Theme & app code quality",
    description: "Bloated apps, render-blocking scripts, and technical debt in your theme.",
  },
];

const included = [
  "Full Core Web Vitals breakdown (mobile + desktop)",
  "Conversion funnel review with benchmark comparison",
  "App stack audit — what to keep, fix, or remove",
  "Prioritized action list, ranked by impact",
  "30-minute walkthrough call with a senior developer",
];

export default function ShopifyAuditPage() {
  return (
    <>
      <section className="bg-noise bg-spotlight relative overflow-hidden border-b border-border-subtle bg-grid">
        <Container className="relative py-10 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
            <div className="order-2 lg:order-1">
              <Eyebrow>Free · No obligation · Delivered in 48 hours</Eyebrow>
              <h1 className="mt-5 font-display text-[1.65rem] font-semibold leading-[1.15] tracking-tight text-text-primary sm:mt-6 sm:text-4xl lg:text-5xl">
                Find out exactly what&rsquo;s costing you conversions —{" "}
                <span className="text-gradient-accent">before you spend another dollar on ads.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary sm:mt-5 sm:text-lg">
                Our team reviews your Shopify store&rsquo;s speed, conversion funnel, and
                technical health, then sends back a prioritized report — free, with
                zero obligation to work with us.
              </p>

              <ul className="mt-6 flex flex-col gap-3 sm:mt-8">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent-teal" />
                    <span className="text-sm text-text-secondary sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 sm:grid-cols-4">
                {auditAreas.map((area) => (
                  <div key={area.title} className="rounded-xl border border-border-subtle bg-card p-4">
                    <area.icon className="size-5 text-accent-blue" />
                    <div className="mt-2.5 text-xs font-semibold text-text-primary">{area.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div id="audit-form" className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="mb-4 text-center font-mono text-xs uppercase tracking-[0.1em] text-text-muted">
                Request your free audit
              </div>
              <MultiStepContactForm />
            </div>
          </div>
        </Container>
      </section>

      <Testimonials />
      <FAQ />
    </>
  );
}

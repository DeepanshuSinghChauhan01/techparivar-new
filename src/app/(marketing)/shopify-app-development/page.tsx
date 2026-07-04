import type { Metadata } from "next";
import { Blocks, Webhook, ShieldCheck, Store } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { FAQ } from "@/components/sections/faq";
import { ContactCTA } from "@/components/sections/contact-cta";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Shopify App Development",
  description:
    "Custom and public Shopify app development — embedded admin apps, Storefront API extensions, webhooks, and App Store submission support.",
  alternates: { canonical: "/shopify-app-development" },
};

const offerings = [
  {
    icon: Blocks,
    title: "Embedded admin apps",
    description: "Built with Remix and Polaris, matching Shopify's native admin design language exactly.",
  },
  {
    icon: Store,
    title: "Public App Store apps",
    description: "From spec to App Store review — billing, OAuth, and Shopify's app review requirements handled end to end.",
  },
  {
    icon: Webhook,
    title: "Webhooks & backend services",
    description: "Reliable event-driven architecture for inventory sync, order processing, and third-party integrations.",
  },
  {
    icon: ShieldCheck,
    title: "Maintenance & API upgrades",
    description: "Ongoing support to keep your app compliant as Shopify ships new API versions each quarter.",
  },
];

const process = [
  "Scope the workflow your app needs to solve — and confirm Shopify doesn't already cover it",
  "Architect the app: embedded admin, storefront extension, or backend service",
  "Build on the latest Admin/Storefront API version with full test coverage",
  "Submit to the Shopify App Store (for public apps) and handle review feedback",
  "Maintain and upgrade as Shopify's API evolves",
];

export default function AppDevelopmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Custom App Development"
        title="When off-the-shelf Shopify apps don't fit, we build one that does"
        description="Embedded admin apps, Storefront API extensions, and backend services — built on Shopify's current architecture, not deprecated APIs."
      >
        <div className="mt-8">
          <Button href={siteConfig.calendlyUrl} variant="primary" showArrow>
            Discuss your app idea
          </Button>
        </div>
      </PageHero>

      <section className="section-py border-b border-border-subtle bg-base">
        <Container>
          <SectionHeading eyebrow="What we build" title="Apps that fit Shopify's architecture, not around it" />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {offerings.map((o) => (
              <div key={o.title} className="rounded-2xl border border-border-subtle bg-card p-7">
                <div className="flex size-11 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
                  <o.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-text-primary">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{o.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-py border-b border-border-subtle bg-panel">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="How we work" title="From idea to a live app" align="center" className="mx-auto" />
          <ol className="mt-10 flex flex-col gap-5">
            {process.map((step, i) => (
              <li key={step} className="flex items-start gap-4 rounded-xl border border-border-subtle bg-card p-5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent-blue font-mono-tabular text-xs font-bold text-accent-blue">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-text-secondary">{step}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <FAQ />
      <ContactCTA />
    </>
  );
}

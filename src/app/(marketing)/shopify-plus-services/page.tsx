import type { Metadata } from "next";
import { CheckCircle2, Crown, Network, Workflow, Globe2, Lock } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { CaseStudiesSection } from "@/components/sections/case-studies-section";
import { FAQ } from "@/components/sections/faq";
import { ContactCTA } from "@/components/sections/contact-cta";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Shopify Plus Development Services",
  description:
    "Enterprise Shopify Plus development: Checkout Extensibility, Shopify Functions, B2B on Shopify, multi-store architecture, and Flow automation for high-volume brands.",
  alternates: { canonical: "/shopify-plus-services" },
};

const capabilities = [
  {
    icon: Lock,
    title: "Checkout Extensibility & Functions",
    description:
      "Custom checkout UI extensions and server-side Shopify Functions for discounts, shipping logic, and payment customization — without checkout.liquid.",
  },
  {
    icon: Network,
    title: "B2B on Shopify",
    description:
      "Company-specific catalogs, tiered pricing, and self-serve wholesale ordering built natively on Shopify Plus's B2B framework.",
  },
  {
    icon: Globe2,
    title: "Multi-store & multi-currency",
    description:
      "Expansion-ready architecture across regions, currencies, and languages — with shared inventory and centralized reporting where needed.",
  },
  {
    icon: Workflow,
    title: "Shopify Flow automation",
    description:
      "Automate fulfillment routing, fraud flags, loyalty triggers, and customer segmentation without custom backend infrastructure.",
  },
];

const whoItsFor = [
  "Brands doing $2M+ in annual GMV outgrowing standard Shopify",
  "Wholesale and B2B brands needing custom pricing logic",
  "Multi-brand or multi-region operators needing centralized architecture",
  "Enterprises migrating off Magento Commerce, Salesforce, or SAP Commerce",
];

export default function ShopifyPlusPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Shopify Plus Development",
    provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    areaServed: siteConfig.markets.map((m) => m.name),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        eyebrow="Shopify Plus"
        title="Enterprise architecture for brands that have outgrown standard Shopify"
        description="When checkout customization, B2B wholesale, or multi-region complexity demands more than themes can deliver, we build on Shopify Plus's full enterprise toolkit."
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href={siteConfig.calendlyUrl} variant="primary" showArrow>
            Book Free Consultation
          </Button>
          <div className="flex items-center gap-2 font-mono-tabular text-sm text-text-secondary">
            <Crown className="size-4 text-accent-blue" />
            $42M+ GMV processed across Plus builds
          </div>
        </div>
      </PageHero>

      <section className="section-py border-b border-border-subtle bg-base">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="Built on Shopify Plus's enterprise toolkit, end to end"
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {capabilities.map((cap) => (
              <div key={cap.title} className="rounded-2xl border border-border-subtle bg-card p-7">
                <div className="flex size-11 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
                  <cap.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-text-primary">
                  {cap.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{cap.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-py border-b border-border-subtle bg-panel">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading eyebrow="Who this is for" title="Is Shopify Plus the right move for you?" />
              <ul className="mt-7 flex flex-col gap-4">
                {whoItsFor.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent-teal" />
                    <span className="text-base text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-text-muted">
                Not sure yet? A free audit call will tell you honestly whether Plus
                is worth the investment for your current scale — or whether a
                well-built standard Shopify store still has room to grow.
              </p>
            </div>
            <div className="surface-card rounded-2xl p-8">
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Typical Plus engagement
              </h3>
              <div className="mt-6 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <span className="text-sm text-text-secondary">Starting investment</span>
                  <span className="font-mono-tabular text-sm font-semibold text-text-primary">$18,000+</span>
                </div>
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <span className="text-sm text-text-secondary">Typical timeline</span>
                  <span className="font-mono-tabular text-sm font-semibold text-text-primary">10–16 weeks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Post-launch support</span>
                  <span className="font-mono-tabular text-sm font-semibold text-text-primary">Retainer-based</span>
                </div>
              </div>
              <Button href={siteConfig.calendlyUrl} variant="primary" className="mt-7 w-full" showArrow>
                Discuss your Plus project
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <CaseStudiesSection />
      <FAQ />
      <ContactCTA />
    </>
  );
}

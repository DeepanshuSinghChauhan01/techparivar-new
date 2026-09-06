import type { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Process } from "@/components/sections/process";
import { ContactCTA } from "@/components/sections/contact-cta";
import { PricingGrid } from "@/components/sections/pricing-grid";
import { services, PRICING_SERVICE_SLUGS } from "@/content/services";
import { siteConfig } from "@/lib/site-config";
import { withSocialMetadata } from "@/lib/seo";

const description =
  "Starting prices for landing pages, business websites, e-commerce, Shopify development, custom apps, and ongoing maintenance and SEO — transparent, with a custom quote based on your exact requirements.";

export const metadata: Metadata = {
  title: "Pricing & Services",
  description,
  alternates: { canonical: "/services" },
  ...withSocialMetadata({ title: "Pricing & Services", description, path: "/services" }),
};

// Larger, custom-scoped engagements not shown in the starting-price grid —
// still fully real services with their own detail pages, just priced per
// engagement rather than from a fixed floor.
const pricingSlugSet: readonly string[] = PRICING_SERVICE_SLUGS;
const enterpriseServices = services.filter((s) => !pricingSlugSet.includes(s.slug));

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Transparent Pricing. Powerful Digital Solutions."
        description="Professional websites, Shopify stores, custom development and ongoing support — built around your business goals."
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="/contact" variant="primary" showArrow>
            Get a Free Quote
          </Button>
          <Button href={siteConfig.calendlyUrl} variant="secondary">
            Discuss Your Project
          </Button>
        </div>
      </PageHero>

      <PricingGrid />

      <section className="section-py border-b border-border-subtle bg-base">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-text-primary sm:text-3xl">
            Enterprise &amp; ongoing engagements
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
            Larger builds and continuous support programs, scoped and priced around your specific
            requirements.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5">
            {enterpriseServices.map((service) => {
              const Icon =
                (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] ?? Icons.Store;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex flex-col gap-6 rounded-2xl border border-border-subtle bg-card p-7 transition-colors hover:border-accent-blue/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-panel text-accent-blue">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-text-primary">
                        {service.name}
                      </h3>
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-text-secondary">
                        {service.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4">
                        <span className="font-mono text-xs text-text-muted">
                          From {service.startingAt}
                        </span>
                        <span className="font-mono-tabular text-xs font-semibold text-accent-teal">
                          {service.metric.value} · {service.metric.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="size-5 shrink-0 text-text-muted transition-all group-hover:translate-x-1 group-hover:text-accent-blue" />
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <Process />
      <ContactCTA />
    </>
  );
}

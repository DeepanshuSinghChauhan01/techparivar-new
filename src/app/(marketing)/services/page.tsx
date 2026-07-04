import type { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Process } from "@/components/sections/process";
import { ContactCTA } from "@/components/sections/contact-cta";
import { services } from "@/content/services";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Shopify Development Services",
  description:
    "Shopify store development, Shopify Plus, theme customization, custom apps, migration, CRO, performance optimization, headless commerce, and retainer support.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Every Shopify capability your brand needs, under one team"
        description="From a first store launch to enterprise Shopify Plus architecture — pick a single service or combine several into one accountable engagement."
      >
        <div className="mt-8">
          <Button href={siteConfig.calendlyUrl} variant="primary" showArrow>
            Book Free Consultation
          </Button>
        </div>
      </PageHero>

      <section className="section-py border-b border-border-subtle bg-base">
        <Container>
          <div className="grid grid-cols-1 gap-5">
            {services.map((service) => {
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
                      <h2 className="font-display text-xl font-semibold text-text-primary">
                        {service.name}
                      </h2>
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

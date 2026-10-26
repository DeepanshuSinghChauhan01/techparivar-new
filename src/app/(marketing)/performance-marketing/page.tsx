import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactCTA } from "@/components/sections/contact-cta";
import { ServiceCard } from "@/components/service-pages/service-card";
import { ServiceFAQ } from "@/components/service-pages/service-faq";
import { ServiceIcon } from "@/components/service-pages/service-icon";
import { MetricGrid } from "@/components/service-pages/metric-grid";
import {
  performanceAudiences,
  performanceFaqs,
  performanceMetrics,
  performancePlatformGroups,
  performanceProcess,
  performanceServices,
} from "@/content/performance-marketing";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl, withSocialMetadata } from "@/lib/seo";

const description =
  "Meta Ads, Google Ads, ad creative, conversion tracking, retargeting and reporting for D2C brands, e-commerce businesses and lead-generation companies.";

export const metadata: Metadata = {
  title: "Performance Marketing",
  description,
  alternates: { canonical: "/performance-marketing" },
  ...withSocialMetadata({ title: "Performance Marketing", description, path: "/performance-marketing" }),
};

export default function PerformanceMarketingPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Performance Marketing Services",
    itemListElement: performanceServices.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: absoluteUrl(`/performance-marketing/${s.slug}`),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        eyebrow="Performance Marketing"
        title={
          <>
            Paid growth you can measure,{" "}
            <span className="text-gradient-accent">explain and scale.</span>
          </>
        }
        description="Meta and Google Ads managed by specialists — built on reliable tracking, tested creative and honest reporting, for D2C brands, e-commerce businesses and lead-generation companies."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button href={siteConfig.calendlyUrl} variant="primary" size="lg" showArrow className="w-full sm:w-auto">
            <Calendar className="size-4.5" aria-hidden="true" />
            Book a Consultation
          </Button>
          <Button href="#services" variant="secondary" size="lg" className="w-full sm:w-auto">
            Explore Our Services
          </Button>
        </div>
      </PageHero>

      <section className="border-b border-border-subtle bg-panel py-10 sm:py-12" aria-labelledby="audiences-heading">
        <Container>
          <h2 id="audiences-heading" className="sr-only">
            Who we work with
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {performanceAudiences.map((a) => (
              <li key={a.title} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
                  <ServiceIcon name={a.icon} className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">{a.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{a.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="services" className="section-py scroll-mt-20 border-b border-border-subtle bg-base">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Six services, one accountable paid media team"
            description="Engage us for a single channel or the full program — every service connects to the same tracking, reporting and targets."
          />
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {performanceServices.map((service) => (
              <li key={service.slug}>
                <ServiceCard
                  service={service}
                  basePath="/performance-marketing"
                  tags={service.platforms?.slice(0, 3)}
                  tagsLabel="Platforms"
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section-py border-b border-border-subtle bg-panel">
        <Container>
          <SectionHeading
            eyebrow="Platforms & channels"
            title="Where we run and measure campaigns"
          />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {performancePlatformGroups.map((group) => (
              <div key={group.title} className="surface-card rounded-2xl p-6">
                <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-text-muted">{group.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border-default px-3 py-1 text-xs text-text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-text-muted">
            Platform names are trademarks of their respective owners. Listing them does not imply an
            official partnership.
          </p>
        </Container>
      </section>

      <section className="section-py border-b border-border-subtle bg-base">
        <Container>
          <SectionHeading
            eyebrow="Our process"
            title="How we manage campaigns"
            description="The same structured routine for every account, so you always know what's being done and why."
          />
          <ol className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {performanceProcess.map((step, i) => (
              <li key={step.title} className="surface-card rounded-2xl p-6">
                <span className="font-mono-tabular text-xs font-semibold text-accent-teal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <MetricGrid
        metrics={performanceMetrics}
        title="The numbers we report on"
        description="Every engagement is measured against these metrics. Targets are agreed with you after the audit — we don't promise figures before we've seen your data."
        className="bg-panel"
      />

      <section className="border-b border-border-subtle bg-base py-12 sm:py-16">
        <Container>
          <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="font-display text-lg font-semibold text-text-primary sm:text-xl">
                Want to know how your current campaigns stack up?
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Book a consultation and we&rsquo;ll walk through your accounts, tracking and next steps.
              </p>
            </div>
            <Button href={siteConfig.calendlyUrl} variant="primary" showArrow className="w-full sm:w-auto">
              Book a Consultation
            </Button>
          </div>
          <Link
            href="/ecommerce-services"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-blue hover:underline"
          >
            Selling on Amazon, Flipkart, Myntra or Meesho? See our E-commerce Services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Container>
      </section>

      <ServiceFAQ title="Questions about performance marketing" faqs={performanceFaqs} />
      <ContactCTA />
    </>
  );
}

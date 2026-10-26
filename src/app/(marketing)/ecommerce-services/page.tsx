import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactCTA } from "@/components/sections/contact-cta";
import { EcommerceServicesExplorer } from "@/components/ecommerce/ecommerce-services-explorer";
import { ServiceFAQ } from "@/components/service-pages/service-faq";
import { ecommerceCategories, ecommerceFaqs, ecommerceServices } from "@/content/ecommerce-services";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl, withSocialMetadata } from "@/lib/seo";

const description =
  "E-commerce account management, marketplace and advertising management, website development, SEO and analytics for brands selling on Amazon, Flipkart, Myntra, Meesho, Shopify and WooCommerce.";

export const metadata: Metadata = {
  title: "E-commerce Services",
  description,
  alternates: { canonical: "/ecommerce-services" },
  ...withSocialMetadata({ title: "E-commerce Services", description, path: "/ecommerce-services" }),
};

const channels = ["Amazon", "Flipkart", "Myntra", "Meesho", "Shopify", "WooCommerce"];

const engagementSteps = [
  {
    title: "Audit",
    description: "We review your accounts, listings, ads, store and data to see where things stand today.",
  },
  {
    title: "Plan",
    description: "You get a written scope with priorities, owners, the KPIs we'll track and a reporting cadence.",
  },
  {
    title: "Execute",
    description: "Our specialists run the agreed work day to day, with a shared tracker your team can see.",
  },
  {
    title: "Review",
    description: "Regular reviews against targets, and the plan is adjusted based on what the numbers show.",
  },
];

export default function EcommerceServicesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "E-commerce Services",
    itemListElement: ecommerceServices.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: absoluteUrl(`/ecommerce-services/${s.slug}`),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        eyebrow="E-commerce Services"
        title={
          <>
            Run, grow and scale your e-commerce business with{" "}
            <span className="text-gradient-accent">one accountable team.</span>
          </>
        }
        description="From marketplace account health and advertising to storefront builds, SEO and reporting — 18 specialist services across 5 practice areas, scoped around your channels and targets."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button href={siteConfig.calendlyUrl} variant="primary" size="lg" showArrow className="w-full sm:w-auto">
            <Calendar className="size-4.5" aria-hidden="true" />
            Book a Consultation
          </Button>
          <Button href="/contact" variant="secondary" size="lg" className="w-full sm:w-auto">
            Tell Us About Your Business
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
            Channels we manage
          </span>
          {channels.map((c) => (
            <span
              key={c}
              className="rounded-full border border-border-subtle bg-card px-2.5 py-1 font-mono text-[11px] text-text-secondary"
            >
              {c}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="section-py border-b border-border-subtle bg-base" aria-label="E-commerce services by category">
        <Container>
          <EcommerceServicesExplorer />
        </Container>
      </section>

      <section className="section-py border-b border-border-subtle bg-panel">
        <Container>
          <SectionHeading
            eyebrow="How engagements start"
            title="A clear plan before any work begins"
            description={`Whether you need one service or all ${ecommerceCategories.length} practice areas, every engagement follows the same four steps.`}
          />
          <ol className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {engagementSteps.map((step, i) => (
              <li key={step.title} className="surface-card rounded-2xl p-6">
                <span className="font-mono-tabular text-xs font-semibold text-accent-teal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-border-subtle bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Not sure which services you need?
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Tell us your channels and targets — we&rsquo;ll recommend where to start.
              </p>
            </div>
            <Button href={siteConfig.calendlyUrl} variant="primary" showArrow className="w-full sm:w-auto">
              Book a Consultation
            </Button>
          </div>
        </Container>
      </section>

      <ServiceFAQ title="How our e-commerce engagements work" faqs={ecommerceFaqs} />
      <ContactCTA />
    </>
  );
}

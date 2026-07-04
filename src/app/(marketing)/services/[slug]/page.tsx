import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as Icons from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { CaseStudiesSection } from "@/components/sections/case-studies-section";
import { ContactCTA } from "@/components/sections/contact-cta";
import { services, getServiceBySlug } from "@/content/services";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.name,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: `${service.name} — ${siteConfig.name}`, description: service.description },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] ?? Icons.Store;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.name,
    provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    description: service.description,
    areaServed: siteConfig.markets.map((m) => m.name),
    offers: { "@type": "Offer", priceCurrency: "USD", price: service.startingAt.replace(/[^0-9.]/g, "") },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero eyebrow={service.shortName} title={service.name} description={service.description}>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href={siteConfig.calendlyUrl} variant="primary" showArrow>
            Book Free Consultation
          </Button>
          <span className="font-mono text-sm text-text-muted">
            Starting at <span className="text-text-primary">{service.startingAt}</span>
          </span>
        </div>
      </PageHero>

      <section className="section-py border-b border-border-subtle bg-base">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionHeading eyebrow="What's included" title="Deliverables for this engagement" />
              <ul className="mt-7 flex flex-col gap-4">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent-teal" />
                    <span className="text-base text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl border border-border-subtle bg-card p-6">
                <h3 className="font-display text-base font-semibold text-text-primary">
                  Ideal for
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{service.idealFor}</p>
              </div>
            </div>

            <div className="surface-card flex flex-col gap-6 rounded-2xl p-7">
              <div className="flex size-12 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
                <Icon className="size-6" />
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.1em] text-text-muted">
                  Typical result
                </div>
                <div className="mt-2 font-display text-3xl font-bold text-accent-teal">
                  {service.metric.value}
                </div>
                <div className="mt-1 text-sm text-text-secondary">{service.metric.label}</div>
              </div>
              <div className="border-t border-border-subtle pt-5">
                <div className="font-mono text-xs uppercase tracking-[0.1em] text-text-muted">
                  Starting at
                </div>
                <div className="mt-2 font-display text-2xl font-bold text-text-primary">
                  {service.startingAt}
                </div>
              </div>
              <Button href={siteConfig.calendlyUrl} variant="primary" className="w-full" showArrow>
                Get a custom quote
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <CaseStudiesSection />
      <ContactCTA />
    </>
  );
}

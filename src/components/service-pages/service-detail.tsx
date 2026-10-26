import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactCTA } from "@/components/sections/contact-cta";
import { ServiceIcon } from "./service-icon";
import { ServiceCard } from "./service-card";
import type { ManagedService } from "@/content/service-types";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/seo";

interface LinkItem {
  label: string;
  href: string;
}

/** Title, description, canonical and social tags for a managed-service detail page. */
export function serviceDetailMetadata(service: ManagedService, path: string): Metadata {
  return {
    title: service.name,
    description: service.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      title: `${service.name} — ${siteConfig.name}`,
      description: service.description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} — ${siteConfig.name}`,
      description: service.description,
    },
  };
}

function ChipList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-text-muted">{label}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-border-default px-3 py-1 text-xs text-text-secondary"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Full detail page for a managed service: hero, breadcrumb, scope and
 * deliverables, sidebar CTA, optional extra content (`children`), related
 * service cards and cross-section links. Shared by E-commerce Services and
 * Performance Marketing so both stay visually and structurally consistent.
 */
export function ServiceDetail({
  service,
  path,
  eyebrow,
  serviceType,
  breadcrumbs,
  related,
  relatedBasePath,
  relatedTags,
  moreLink,
  crossLinks = [],
  children,
}: {
  service: ManagedService;
  /** Canonical path of this page. */
  path: string;
  eyebrow: string;
  /** schema.org `serviceType` — the section or category name. */
  serviceType: string;
  /** Visible breadcrumb trail before the current page. Hash links are left out of the JSON-LD. */
  breadcrumbs: LinkItem[];
  related: ManagedService[];
  relatedBasePath: string;
  relatedTags?: (s: ManagedService) => string[] | undefined;
  moreLink: LinkItem;
  crossLinks?: { heading: string; links: LinkItem[] }[];
  children?: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType,
    provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    description: service.description,
    areaServed: siteConfig.markets.map((m) => m.name),
    url: absoluteUrl(path),
  };

  const schemaCrumbs = [...breadcrumbs.filter((c) => !c.href.includes("#")), { label: service.name, href: path }];
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaCrumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: c.href === "/" ? siteConfig.url : absoluteUrl(c.href),
    })),
  };

  const visibleCrossLinks = crossLinks.filter((group) => group.links.length > 0);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <PageHero eyebrow={eyebrow} title={service.name} description={service.description}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button href={siteConfig.calendlyUrl} variant="primary" size="lg" showArrow className="w-full sm:w-auto">
            <Calendar className="size-4.5" aria-hidden="true" />
            Book a Consultation
          </Button>
          <Button href="/contact" variant="secondary" size="lg" className="w-full sm:w-auto">
            Request a Proposal
          </Button>
        </div>
      </PageHero>

      <nav aria-label="Breadcrumb" className="border-b border-border-subtle bg-panel">
        <Container>
          <ol className="flex flex-wrap items-center gap-1.5 py-3 text-xs text-text-muted">
            {breadcrumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                <Link href={crumb.href} className="hover:text-text-primary">
                  {crumb.label}
                </Link>
                <ChevronRight className="size-3" aria-hidden="true" />
              </li>
            ))}
            <li aria-current="page" className="text-text-secondary">
              {service.name}
            </li>
          </ol>
        </Container>
      </nav>

      <section className="section-py border-b border-border-subtle bg-base">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="flex flex-col gap-12">
              <div>
                <SectionHeading eyebrow="Scope" title="What we handle" />
                <ul className="mt-7 flex flex-col gap-4">
                  {service.scope.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent-teal" aria-hidden="true" />
                      <span className="text-base text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary">
                  What you receive
                </h2>
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="rounded-xl border border-border-subtle bg-card px-4 py-3 text-sm text-text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="surface-card flex flex-col gap-6 rounded-2xl p-7 lg:sticky lg:top-24">
              <div className="flex size-12 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
                <ServiceIcon name={service.icon} className="size-6" />
              </div>
              {service.kpis && <ChipList label="Metrics we track" items={service.kpis} />}
              {service.platforms && <ChipList label="Platforms" items={service.platforms} />}
              <div className="border-t border-border-subtle pt-5">
                <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-text-muted">Ideal for</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{service.idealFor}</p>
              </div>
              <Button href={siteConfig.calendlyUrl} variant="primary" className="w-full" showArrow>
                Book a Consultation
              </Button>
              <p className="-mt-3 text-center text-xs text-text-muted">
                Scoped and quoted per engagement after a free call.
              </p>
            </aside>
          </div>
        </Container>
      </section>

      {children}

      {related.length > 0 && (
        <section className="section-py border-b border-border-subtle bg-panel">
          <Container>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading eyebrow="Works well with" title="Related services" />
              <Link
                href={moreLink.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-blue hover:underline"
              >
                {moreLink.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {related.map((s) => (
                <li key={s.slug}>
                  <ServiceCard service={s} basePath={relatedBasePath} tags={relatedTags?.(s) ?? s.kpis?.slice(0, 3)} />
                </li>
              ))}
            </ul>

            {visibleCrossLinks.map((group) => (
              <div key={group.heading} className="mt-10 border-t border-border-subtle pt-8">
                <h3 className="font-display text-base font-semibold text-text-primary">{group.heading}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border-default px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent-blue/60 hover:text-text-primary"
                      >
                        {l.label}
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Container>
        </section>
      )}

      <ContactCTA />
    </>
  );
}

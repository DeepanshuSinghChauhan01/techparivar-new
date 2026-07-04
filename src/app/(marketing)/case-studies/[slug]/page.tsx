import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Quote, Star } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ContactCTA } from "@/components/sections/contact-cta";
import { caseStudies, getCaseStudyBySlug } from "@/content/case-studies";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return {};

  return {
    title: `${cs.client} Case Study`,
    description: cs.challenge,
    alternates: { canonical: `/case-studies/${cs.slug}` },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${cs.client} Shopify Case Study`,
    about: cs.industry,
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        eyebrow={`${cs.industry} · ${cs.country}`}
        title={`How ${cs.client} achieved ${cs.heroStat.value.toLowerCase()} ${cs.heroStat.label}`}
      >
        <div className="mt-8 flex flex-wrap gap-2">
          {cs.services.map((s) => (
            <span key={s} className="rounded-full border border-border-default px-3 py-1.5 text-xs text-text-secondary">
              {s}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="border-b border-border-subtle bg-base py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cs.results.map((r) => (
              <div key={r.label} className="rounded-2xl border border-border-subtle bg-card p-6">
                <div className="font-mono-tabular text-2xl font-bold text-accent-teal">{r.value}</div>
                <div className="mt-1.5 text-sm text-text-secondary">{r.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-xl font-semibold text-text-primary">The challenge</h2>
              <p className="mt-4 text-base leading-relaxed text-text-secondary">{cs.challenge}</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-text-primary">The solution</h2>
              <p className="mt-4 text-base leading-relaxed text-text-secondary">{cs.solution}</p>
            </div>
          </div>

          <div className="surface-card mt-14 rounded-2xl p-8 sm:p-10">
            <Quote className="size-7 text-accent-blue" />
            <p className="mt-4 font-display text-xl font-medium leading-snug text-text-primary sm:text-2xl">
              &ldquo;{cs.testimonialQuote}&rdquo;
            </p>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-text-primary">{cs.testimonialAuthor}</div>
                <div className="text-xs text-text-muted">{cs.testimonialRole}</div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-accent-amber text-accent-amber" />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border-subtle bg-card p-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Want results like {cs.client}&rsquo;s?
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Start with a free audit — we&rsquo;ll show you exactly where to begin.
              </p>
            </div>
            <Button href={siteConfig.calendlyUrl} variant="primary" showArrow>
              Book Free Consultation
            </Button>
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}

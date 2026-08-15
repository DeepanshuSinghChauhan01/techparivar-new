import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { ContactCTA } from "@/components/sections/contact-cta";
import { caseStudies } from "@/content/case-studies";
import { withSocialMetadata } from "@/lib/seo";

const description =
  "Shopify and Shopify Plus stores designed and built by TechParivar for D2C brands across fashion, beauty, jewelry, electronics, home decor, and wellness.";

export const metadata: Metadata = {
  title: "Portfolio",
  description,
  alternates: { canonical: "/portfolio" },
  ...withSocialMetadata({ title: "Portfolio", description, path: "/portfolio" }),
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Stores we've designed, built, and scaled"
        description="A selection of Shopify and Shopify Plus projects across fashion, beauty, jewelry, electronics, home decor, and wellness brands worldwide."
      />

      <section className="section-py border-b border-border-subtle bg-base">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-card transition-all hover:-translate-y-1 hover:border-accent-blue/50"
              >
                <div className="bg-grid relative flex aspect-[4/3] items-center justify-center border-b border-border-subtle bg-panel">
                  <span className="font-display text-5xl font-bold text-text-muted/30">
                    {cs.logoInitial}
                  </span>
                  <ArrowUpRight className="absolute right-4 top-4 size-5 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold text-text-primary">
                      {cs.client}
                    </h2>
                    <span className="font-mono-tabular text-sm font-semibold text-accent-teal">
                      {cs.heroStat.value}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">
                    {cs.industry} · {cs.country}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm text-text-secondary">{cs.heroStat.label}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-text-secondary">
            Want the full story behind the numbers?{" "}
            <Link href="/case-studies" className="text-accent-blue underline underline-offset-2">
              Read the detailed case studies →
            </Link>
          </p>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}

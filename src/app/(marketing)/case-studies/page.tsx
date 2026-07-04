import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { ContactCTA } from "@/components/sections/contact-cta";
import { caseStudies } from "@/content/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Detailed Shopify and Shopify Plus case studies covering client challenges, solutions, and measured revenue and performance impact.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="The challenge, the solution, and the numbers"
        description="Every engagement starts with a documented problem and ends with measured results. Here's the full story behind six of them."
      />

      <section className="section-py border-b border-border-subtle bg-base">
        <Container>
          <div className="flex flex-col gap-6">
            {caseStudies.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="group grid grid-cols-1 gap-6 rounded-2xl border border-border-subtle bg-card p-7 transition-colors hover:border-accent-blue/50 lg:grid-cols-[1fr_auto] lg:items-center"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-panel font-display text-sm font-bold text-accent-blue">
                      {cs.logoInitial}
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-semibold text-text-primary">
                        {cs.client}
                      </h2>
                      <p className="text-xs text-text-muted">
                        {cs.industry} · {cs.country}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary">
                    {cs.challenge}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cs.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border-subtle px-2.5 py-1 text-xs text-text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6 lg:flex-col lg:items-end lg:gap-2">
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold text-accent-teal">
                      {cs.heroStat.value}
                    </div>
                    <div className="text-xs text-text-muted">{cs.heroStat.label}</div>
                  </div>
                  <ArrowRight className="size-5 text-text-muted transition-all group-hover:translate-x-1 group-hover:text-accent-blue" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}

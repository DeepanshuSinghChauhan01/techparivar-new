"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/content/case-studies";

export function CaseStudiesSection() {
  const featured = caseStudies.slice(0, 3);

  return (
    <section className="section-py border-b border-border-subtle bg-panel">
      <Container>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6">
          <SectionHeading
            eyebrow="Proof, not promises"
            title="Real engagements. Real revenue impact."
            description="Each project starts with a documented challenge and ends with measured results — not just a redesign."
          />
          <Button href="/case-studies" variant="secondary" showArrow className="w-full sm:w-auto">
            All case studies
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-3">
          {featured.map((cs, i) => (
            <motion.div
              key={cs.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.16) }}
            >
              <Link
                href={`/case-studies/${cs.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border-subtle bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent-blue/50 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-panel font-display text-sm font-bold text-accent-blue">
                      {cs.logoInitial}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{cs.client}</div>
                      <div className="text-xs text-text-muted">
                        {cs.industry} · {cs.country}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="size-4 text-text-muted opacity-40 transition-opacity sm:opacity-0 sm:group-hover:opacity-100" />
                </div>

                <div className="mt-6 font-display text-3xl font-bold text-accent-teal">
                  {cs.heroStat.value}
                </div>
                <div className="mt-1 text-sm text-text-secondary">{cs.heroStat.label}</div>

                <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                  {cs.challenge}
                </p>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-border-subtle pt-5">
                  {cs.services.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border-subtle px-2.5 py-1 text-xs text-text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

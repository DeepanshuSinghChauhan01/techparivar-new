"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { industries } from "@/content/site-data";

export function Industries() {
  return (
    <section className="section-py border-b border-border-subtle bg-base">
      <Container>
        <SectionHeading
          eyebrow="Industries"
          title="Domain experience that shapes the build"
          description="Commerce isn't generic — a jewelry PDP and a supplement subscription flow need fundamentally different decisions. We've shipped across each of these verticals."
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {industries.map((industry, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[industry.icon] ?? Icons.Store;
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: Math.min((i % 4) * 0.04, 0.12) }}
                className="group flex flex-col gap-2 rounded-2xl border border-border-subtle bg-card p-4 transition-colors hover:border-accent-teal/40 sm:gap-3 sm:p-6"
              >
                <Icon className="size-6 text-accent-teal" />
                <h3 className="font-display text-base font-semibold text-text-primary">
                  {industry.name}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {industry.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

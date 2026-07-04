"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { whyChooseUs } from "@/content/site-data";

export function WhyChooseUs() {
  return (
    <section className="section-py border-b border-border-subtle bg-panel">
      <Container>
        <SectionHeading
          eyebrow="Why TechParivar"
          title="What working with us actually feels like"
          align="center"
          className="mx-auto"
        />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
          {whyChooseUs.map((item, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[item.icon] ?? Icons.Star;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: Math.min((i % 3) * 0.05, 0.1) }}
                className="rounded-2xl border border-border-subtle bg-card p-5 sm:p-7"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-text-primary sm:mt-5 sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

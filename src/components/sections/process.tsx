"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/content/site-data";

export function Process() {
  return (
    <section className="section-py border-b border-border-subtle bg-base">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title="A repeatable process, refined across 320+ builds"
          description="Structure removes guesswork. Every project moves through the same seven stages, so you always know what's next and why."
          align="center"
          className="mx-auto"
        />

        <div className="relative mt-8 sm:mt-16">
          <div className="absolute left-0 right-0 top-[26px] hidden h-px bg-border-default lg:block" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-y-10 lg:grid-cols-7">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.12) }}
                className="relative flex flex-col"
              >
                <div className="relative z-10 mb-3 flex size-10 items-center justify-center rounded-full border-2 border-accent-blue bg-base font-mono-tabular text-xs font-bold text-accent-blue sm:mb-4 sm:size-[52px] sm:text-sm">
                  {step.number}
                </div>
                <h3 className="font-display text-base font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary sm:line-clamp-none">
                  {step.description}
                </p>
                <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted">
                  {step.duration}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

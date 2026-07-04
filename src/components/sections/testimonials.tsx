"use client";

import { motion } from "framer-motion";
import { Star, PlayCircle, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/content/testimonials";

export function Testimonials() {
  return (
    <section className="section-py border-b border-border-subtle bg-panel">
      <Container>
        <SectionHeading
          eyebrow="Client success"
          title="Trusted by D2C brands across six markets"
          description="Founders and ecommerce leads on what it's actually like to work with TechParivar."
          align="center"
          className="mx-auto"
        />

        <div className="-mx-6 mt-8 flex gap-4 overflow-x-auto px-6 pb-2 snap-x snap-mandatory sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: Math.min((i % 3) * 0.05, 0.1) }}
              className="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl border border-border-subtle bg-card p-6 sm:w-auto sm:shrink"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="size-3.5 fill-accent-amber text-accent-amber" />
                  ))}
                </div>
                {t.hasVideo && (
                  <span className="flex items-center gap-1 rounded-full bg-panel px-2.5 py-1 text-[11px] text-accent-blue">
                    <PlayCircle className="size-3.5" />
                    Video
                  </span>
                )}
              </div>

              <Quote className="mt-4 size-5 text-border-default" />
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-5 flex items-center gap-3 border-t border-border-subtle pt-4">
                <div className="flex size-9 items-center justify-center rounded-full bg-panel font-display text-xs font-bold text-accent-blue">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">{t.author}</div>
                  <div className="text-xs text-text-muted">
                    {t.role}, {t.company} · {t.country}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

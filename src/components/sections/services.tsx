"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <section className="section-py border-b border-border-subtle bg-base">
      <Container>
        <SectionHeading
          eyebrow="What we build"
          title="Full-stack Shopify expertise, under one accountable team"
          description="From a first store launch to enterprise Shopify Plus architecture — every engagement is scoped, measured, and delivered by senior developers."
        />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] ?? Icons.Store;
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: Math.min((i % 3) * 0.05, 0.1) }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border border-border-subtle bg-card p-6 transition-all duration-300",
                    "hover:-translate-y-1 hover:border-accent-blue/50 hover:bg-card-hover"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-panel text-accent-blue">
                      <Icon className="size-5" />
                    </div>
                    <ArrowRight className="size-4 text-text-muted opacity-40 transition-all duration-300 sm:opacity-0 sm:group-hover:translate-x-0.5 sm:group-hover:opacity-100" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-text-primary">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {service.summary}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-4">
                    <span className="font-mono text-xs text-text-muted">From {service.startingAt}</span>
                    <span className="font-mono-tabular text-xs font-semibold text-accent-teal">
                      {service.metric.value}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

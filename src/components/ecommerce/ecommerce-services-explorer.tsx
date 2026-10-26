"use client";

import { useState } from "react";
import { ServiceIcon } from "@/components/service-pages/service-icon";
import { ServiceCard } from "@/components/service-pages/service-card";
import {
  ecommerceCategories,
  getEcommerceServicesByCategory,
  type EcommerceCategorySlug,
} from "@/content/ecommerce-services";
import { cn } from "@/lib/utils";

type Filter = "all" | EcommerceCategorySlug;

/**
 * Category filter + grouped service grid. Every category section is rendered
 * with an `id` in the default "all" view, so `/ecommerce-services#<category>`
 * links (from detail pages) scroll to the right group even before hydration.
 */
export function EcommerceServicesExplorer() {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleCategories =
    filter === "all" ? ecommerceCategories : ecommerceCategories.filter((c) => c.slug === filter);
  const visibleCount = visibleCategories.reduce(
    (sum, c) => sum + getEcommerceServicesByCategory(c.slug).length,
    0
  );

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All services" },
    ...ecommerceCategories.map((c) => ({ value: c.slug, label: c.shortName })),
  ];

  return (
    <div>
      <div
        role="group"
        aria-label="Filter services by category"
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {filters.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.value)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-accent-blue bg-accent-blue/15 text-text-primary"
                  : "border-border-default text-text-secondary hover:border-accent-blue/60 hover:text-text-primary"
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visibleCount} services
      </p>

      <div className="mt-10 flex flex-col gap-14 sm:mt-12 sm:gap-20">
        {visibleCategories.map((category) => {
          const items = getEcommerceServicesByCategory(category.slug);
          const headingId = `${category.slug}-heading`;
          return (
            <section
              key={category.slug}
              id={category.slug}
              aria-labelledby={headingId}
              className="scroll-mt-24"
            >
              <div className="flex flex-col gap-4 border-b border-border-subtle pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
                    <ServiceIcon name={category.icon} className="size-6" />
                  </div>
                  <div>
                    <h2
                      id={headingId}
                      className="font-display text-xl font-semibold tracking-tight text-text-primary sm:text-2xl"
                    >
                      {category.name}
                    </h2>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
                      {category.summary}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
                  {items.length} {items.length === 1 ? "service" : "services"}
                </span>
              </div>

              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {items.map((service) => (
                  <li key={service.slug}>
                    <ServiceCard service={service} basePath="/ecommerce-services" />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

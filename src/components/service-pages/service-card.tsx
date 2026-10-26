import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "./service-icon";
import type { ManagedService } from "@/content/service-types";

/**
 * Card linking to a managed-service detail page. `tags` defaults to the
 * service's first three KPIs; sections where every service tracks the same
 * metrics pass something more distinguishing (e.g. platforms) instead.
 */
export function ServiceCard({
  service,
  basePath,
  tags = service.kpis?.slice(0, 3),
  tagsLabel = "Metrics tracked",
}: {
  service: ManagedService;
  basePath: string;
  tags?: string[];
  tagsLabel?: string;
}) {
  return (
    <Link
      href={`${basePath}/${service.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border-subtle bg-card p-6 transition-colors duration-200 hover:border-accent-blue/50 hover:bg-card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex size-11 items-center justify-center rounded-xl bg-panel text-accent-blue">
          <ServiceIcon name={service.icon} className="size-5" />
        </div>
        <ArrowRight
          className="size-4 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-blue"
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-text-primary">
        {service.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{service.summary}</p>
      {tags && tags.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label={tagsLabel}>
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border-subtle px-2.5 py-1 font-mono text-[11px] text-text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}

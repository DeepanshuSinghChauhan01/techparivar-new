import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PerformanceMetric } from "@/content/performance-marketing";

/** Definitions of the metrics an engagement is measured against — no benchmark values. */
export function MetricGrid({
  metrics,
  eyebrow = "Metrics we monitor",
  title,
  description,
  className = "bg-base",
}: {
  metrics: PerformanceMetric[];
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={`section-py border-b border-border-subtle ${className}`}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <dl className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.abbr} className="surface-card rounded-2xl p-6">
              <dt>
                <span className="font-mono-tabular text-2xl font-semibold text-accent-teal">{m.abbr}</span>
                <span className="mt-1 block font-display text-sm font-semibold text-text-primary">{m.name}</span>
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{m.definition}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

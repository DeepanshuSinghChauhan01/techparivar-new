import Link from "next/link";
import * as Icons from "lucide-react";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { getServiceBySlug, PRICING_SERVICE_SLUGS, type Service } from "@/content/services";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "web", label: "Web Development" },
  { key: "shopify", label: "Shopify" },
  { key: "maintenance", label: "Maintenance" },
  { key: "growth", label: "Growth" },
] as const;

function PricingCard({ service }: { service: Service }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] ?? Icons.Store;

  return (
    <div
      className={cn(
        "group flex flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-card-hover sm:p-7",
        service.featured ? "border-accent-blue/30 hover:border-accent-blue/60" : "border-border-subtle hover:border-accent-blue/50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-panel text-accent-blue">
          <Icon className="size-5" />
        </div>
        {service.featured && (
          <span className="rounded-full border border-accent-teal/40 bg-accent-teal/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent-teal">
            Most Requested
          </span>
        )}
      </div>

      <h4 className="mt-5 font-display text-lg font-semibold text-text-primary">
        <Link href={`/services/${service.slug}`} className="transition-colors hover:text-accent-blue">
          {service.pricingLabel ?? service.name}
        </Link>
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{service.summary}</p>

      <div className="mt-5 border-t border-border-subtle pt-5">
        <p className="text-xs text-text-muted">Starting from</p>
        <div className="mt-1 font-mono-tabular text-2xl font-bold text-text-primary sm:text-3xl">
          {service.startingAt}
        </div>
      </div>

      <ul className="mt-5 flex flex-1 flex-col gap-2.5">
        {service.deliverables.slice(0, 5).map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
            <Check className="mt-0.5 size-4 shrink-0 text-accent-teal" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Button href="/contact" variant="secondary" className="mt-6 w-full justify-center">
        Get a Quote
      </Button>
    </div>
  );
}

export function PricingGrid() {
  const pricingServices = PRICING_SERVICE_SLUGS.map((slug) => getServiceBySlug(slug)).filter(
    (s): s is Service => Boolean(s)
  );

  return (
    <section className="section-py border-b border-border-subtle bg-base">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Transparent Pricing. Powerful Digital Solutions."
          description="Professional websites, Shopify stores, custom development and ongoing support — built around your business goals."
        />

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Every project is different. Our starting prices give you a clear idea of investment, while
          your final quote is based on your exact requirements.
        </p>

        <div className="mt-10 flex flex-col gap-12 sm:mt-14">
          {CATEGORIES.map(({ key, label }) => {
            const items = pricingServices.filter((s) => s.category === key);
            if (items.length === 0) return null;
            return (
              <div key={key}>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent-teal">
                  {label}
                </h3>
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {items.map((service) => (
                    <PricingCard key={service.slug} service={service} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-card p-8 text-center sm:p-10">
          <p className="max-w-lg text-base text-text-secondary">
            Need something more specific? Tell us what you&rsquo;re building and we&rsquo;ll provide a
            custom quote.
          </p>
          <Button href="/contact" variant="primary" showArrow>
            Get Your Free Quote
          </Button>
        </div>
      </Container>
    </section>
  );
}


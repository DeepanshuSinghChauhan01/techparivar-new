import { Container } from "@/components/ui/container";
import { CountUp } from "@/components/ui/count-up";
import { trustStats } from "@/lib/site-config";

export function TrustStats() {
  return (
    <section className="border-b border-border-subtle bg-panel">
      <Container className="py-8 sm:py-12">
        <div className="grid grid-cols-2 gap-5 sm:gap-8 sm:grid-cols-4">
          {trustStats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1.5">
              <div className="font-mono-tabular text-3xl font-bold text-text-primary sm:text-4xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

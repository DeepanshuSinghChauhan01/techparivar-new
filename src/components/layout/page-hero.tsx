import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-noise bg-spotlight relative overflow-hidden border-b border-border-subtle bg-grid">
      <Container className="relative py-10 sm:py-16 lg:py-24">
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="mt-5 font-display text-[1.65rem] font-semibold leading-[1.15] tracking-tight text-text-primary sm:mt-6 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-text-secondary sm:mt-5 sm:text-lg">{description}</p>
          )}
          {children}
        </div>
      </Container>
    </section>
  );
}

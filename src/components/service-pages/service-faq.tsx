import { Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ServiceFaq as ServiceFaqItem } from "@/content/service-types";

// Native <details>/<summary> — keyboard and screen-reader accessible with no
// client JS, which keeps this section out of the hydration bundle.
export function ServiceFAQ({ title, faqs }: { title: string; faqs: ServiceFaqItem[] }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="section-py border-b border-border-subtle bg-base">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title={title} align="center" className="mx-auto" />

        <div className="mt-6 flex flex-col gap-3 sm:mt-10">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group overflow-hidden rounded-2xl border border-border-subtle bg-card"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                <span className="font-display text-base font-medium text-text-primary">{faq.question}</span>
                <Plus
                  className="size-5 shrink-0 text-accent-blue transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-6 pb-5 text-sm leading-relaxed text-text-secondary">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

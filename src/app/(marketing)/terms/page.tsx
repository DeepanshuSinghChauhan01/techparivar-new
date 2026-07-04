import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <section className="bg-base py-16 lg:py-20">
        <Container className="max-w-3xl">
          <div className="flex flex-col gap-6 text-sm leading-relaxed text-text-secondary">
            <p>
              <em>
                Placeholder content — replace with terms drafted by qualified legal
                counsel before launch, covering scope-of-work agreements, IP
                ownership on delivered code, and liability limitations appropriate
                for a multi-country client base.
              </em>
            </p>
            <p>
              These Terms of Service govern your use of the {siteConfig.name}{" "}
              website and any services engaged through it. By using this site or
              engaging our services, you agree to these terms and any
              project-specific Statement of Work signed separately.
            </p>
            <p>
              All custom code, designs, and deliverables become the property of
              the client upon full payment, except for any pre-existing
              TechParivar tools, libraries, or frameworks incorporated into the
              work, which remain our property and are licensed for the client&rsquo;s
              use.
            </p>
            <p>
              For questions about these terms, contact{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-accent-blue">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

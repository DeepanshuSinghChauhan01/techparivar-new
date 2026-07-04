import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="bg-base py-16 lg:py-20">
        <Container className="max-w-3xl">
          <div className="flex flex-col gap-6 text-sm leading-relaxed text-text-secondary">
            <p>
              <em>
                Placeholder content — replace with a policy reviewed by qualified
                legal counsel before launch, with specific attention to GDPR (UK/EU
                clients), CCPA (US clients), and India&rsquo;s DPDP Act.
              </em>
            </p>
            <p>
              {siteConfig.legalName} (&ldquo;TechParivar,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) collects information
              you provide directly — such as through our contact and audit request
              forms — including your name, email, phone number, company name, and
              project details. We also collect standard analytics data such as IP
              address, browser type, and pages visited.
            </p>
            <p>
              We use this information to respond to inquiries, deliver requested
              audits, and improve our services. We do not sell personal data to
              third parties. Data may be shared with service providers (such as
              our CRM, email, and scheduling tools) strictly to deliver our
              services.
            </p>
            <p>
              Depending on your jurisdiction, you may have rights to access,
              correct, or delete your personal data. Contact{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-accent-blue">
                {siteConfig.email}
              </a>{" "}
              to exercise these rights.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

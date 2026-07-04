import { Hero } from "@/components/sections/hero";
import { TrustStats } from "@/components/sections/trust-stats";
import { Services } from "@/components/sections/services";
import { CaseStudiesSection } from "@/components/sections/case-studies-section";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/sections/testimonials";
import { Industries } from "@/components/sections/industries";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { FAQ } from "@/components/sections/faq";
import { ContactCTA } from "@/components/sections/contact-cta";
import { siteConfig } from "@/lib/site-config";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  areaServed: siteConfig.markets.map((m) => m.name),
  address: siteConfig.offices.map((o) => ({
    "@type": "PostalAddress",
    addressLocality: o.city,
    addressCountry: o.country,
  })),
  sameAs: Object.values(siteConfig.social),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Hero />
      <TrustStats />
      <Services />
      <CaseStudiesSection />
      <Process />
      <Testimonials />
      <Industries />
      <WhyChooseUs />
      <FAQ />
      <ContactCTA />
    </>
  );
}

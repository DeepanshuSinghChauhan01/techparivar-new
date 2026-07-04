import type { Metadata } from "next";
import { Mail, MapPin, Calendar, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { MultiStepContactForm } from "@/components/sections/multi-step-contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with TechParivar for Shopify and Shopify Plus development. Book a free consultation or send us your project details.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us about your project"
        description="Fill out the form and we'll get back within one business day — or book a slot directly on our calendar if you'd rather talk it through."
      />

      <section className="border-b border-border-subtle bg-base py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_0.7fr]">
            <MultiStepContactForm />

            <div className="flex flex-col gap-5">
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-2xl border border-border-subtle bg-card p-6 transition-colors hover:border-accent-blue/50"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    Book a free consultation
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    30 minutes, synced to your time zone via Calendly.
                  </p>
                </div>
              </a>

              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-2xl border border-border-subtle bg-card p-6 transition-colors hover:border-accent-blue/50"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-teal/15 text-accent-teal">
                  <MessageCircle className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    Chat on WhatsApp
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    Fastest way to reach us for quick questions.
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4 rounded-2xl border border-border-subtle bg-card p-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-panel text-text-secondary">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">Email</h3>
                  <a href={`mailto:${siteConfig.email}`} className="mt-1 block text-sm text-accent-blue">
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border-subtle bg-card p-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-panel text-text-secondary">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">Offices</h3>
                  <ul className="mt-1 flex flex-col gap-0.5 text-sm text-text-secondary">
                    {siteConfig.offices.map((o) => (
                      <li key={o.city}>
                        {o.city}, {o.country} {o.isHQ && <span className="text-text-muted">(HQ)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

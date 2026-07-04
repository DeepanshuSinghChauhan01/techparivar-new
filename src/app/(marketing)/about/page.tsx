import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { TrustStats } from "@/components/sections/trust-stats";
import { ContactCTA } from "@/components/sections/contact-cta";
import { siteConfig } from "@/lib/site-config";
import { Target, Eye, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "TechParivar is a Shopify and Shopify Plus development agency built by engineers, for D2C brands across the US, UK, Canada, Australia, UAE, and India.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Target,
    title: "Outcomes over output",
    description:
      "We don't measure success by tickets closed or pages shipped. We measure it in conversion rate, AOV, and load time — the numbers that actually move your business.",
  },
  {
    icon: Eye,
    title: "Radical transparency",
    description:
      "Every project runs on a shared board. You see exactly what's being worked on, what's blocked, and what's next — no status-update theater.",
  },
  {
    icon: ShieldCheck,
    title: "Built to last",
    description:
      "We write code the way we'd want to inherit it: documented, on Shopify's native architecture, with no fragile hacks that break on the next update.",
  },
];

const leadership = [
  { name: "Deepanshu Singh Chauhan", role: "Founder & Technical Director", focus: "Shopify Plus architecture" },
  { name: "Ananya Iyer", role: "Head of Design", focus: "Conversion-led UX" },
  { name: "Daniel Cole", role: "Director of Client Partnerships, UK/EU", focus: "Enterprise onboarding" },
  { name: "Vikram Shah", role: "Lead Backend Engineer", focus: "Custom apps & integrations" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About TechParivar"
        title="We build the commerce infrastructure ambitious brands grow on."
        description="TechParivar started in 2017 as a two-person Shopify theme shop in Gurugram. Today we're a distributed team of senior developers, designers, and strategists working with D2C brands across six countries — still run with the same obsession over performance and craft that got us our first client."
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href={siteConfig.calendlyUrl} variant="primary" showArrow>
            Book Free Consultation
          </Button>
          <Button href="/portfolio" variant="secondary">
            View Our Work
          </Button>
        </div>
      </PageHero>

      <TrustStats />

      <section className="section-py border-b border-border-subtle bg-base">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Our story"
                title="From a two-person theme shop to a six-country delivery team"
              />
              <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-text-secondary">
                <p>
                  We started by fixing other agencies&rsquo; broken Shopify themes. That work
                  taught us more about what breaks at scale than any greenfield build
                  ever could — and it shaped how we still work today: defensively,
                  with an obsession over what happens when traffic spikes or an app
                  update ships at the worst possible time.
                </p>
                <p>
                  As our client base grew from Indian D2C brands into the US, UK,
                  Canada, Australia, and the UAE, we built a delivery model around
                  overlapping working hours and async documentation — so a brand in
                  Austin or London never feels like they&rsquo;re working with an
                  overseas vendor at arm&rsquo;s length.
                </p>
                <p>
                  Today, TechParivar is a Shopify Plus-capable partner team of
                  senior developers, conversion strategists, and designers. No
                  juniors learning on your dime, no outsourced &ldquo;black box&rdquo; work —
                  just the same accountable team from kickoff to launch.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="flex gap-4 rounded-2xl border border-border-subtle bg-card p-6"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-blue/15 text-accent-blue">
                    <v.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-text-primary">
                      {v.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                      {v.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-py border-b border-border-subtle bg-panel">
        <Container>
          <SectionHeading
            eyebrow="Leadership"
            title="The team setting the standard for every build"
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((person) => (
              <div
                key={person.name}
                className="rounded-2xl border border-border-subtle bg-card p-6 text-center"
              >
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-panel font-display text-xl font-bold text-accent-blue">
                  {person.name.charAt(0)}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-text-primary">
                  {person.name}
                </h3>
                <p className="mt-1 text-sm text-accent-teal">{person.role}</p>
                <p className="mt-2 text-xs text-text-muted">{person.focus}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}

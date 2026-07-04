import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { siteConfig, navLinks } from "@/lib/site-config";
import { LinkedinIcon, TwitterXIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/social-icons";

const serviceLinks = navLinks.find((l) => l.label === "Services")?.children ?? [];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-panel">
      <Container className="py-10 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-secondary">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: LinkedinIcon, href: siteConfig.social.linkedin, label: "LinkedIn" },
                { icon: TwitterXIcon, href: siteConfig.social.twitter, label: "Twitter" },
                { icon: InstagramIcon, href: siteConfig.social.instagram, label: "Instagram" },
                { icon: YoutubeIcon, href: siteConfig.social.youtube, label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border-default text-text-secondary transition-colors hover:border-accent-blue hover:text-accent-blue"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:contents">
            <div>
              <h3 className="font-display text-sm font-semibold text-text-primary">Services</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {serviceLinks.slice(0, 6).map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="text-sm text-text-secondary hover:text-accent-blue">
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-sm font-semibold text-text-primary">Company</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  { label: "About", href: "/about" },
                  { label: "Portfolio", href: "/portfolio" },
                  { label: "Case Studies", href: "/case-studies" },
                  { label: "Blog", href: "/blog" },
                  { label: "Free Shopify Audit", href: "/shopify-audit" },
                  { label: "Contact", href: "/contact" },
                  { label: "Client Portal", href: "/login" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-text-secondary hover:text-accent-blue">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-text-primary">Get in touch</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-text-secondary">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent-blue" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-accent-blue">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent-blue" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-accent-blue">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent-blue" />
                <span>
                  {siteConfig.offices.map((o) => o.city).join(" · ")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-border-subtle pt-6 sm:mt-14 sm:pt-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
            Markets served
          </span>
          {siteConfig.markets.map((m) => (
            <span
              key={m.code}
              className="rounded-full border border-border-subtle px-2.5 py-1 font-mono text-[11px] text-text-secondary"
            >
              <span className="sm:hidden">{m.code}</span>
              <span className="hidden sm:inline">{m.name}</span>
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-border-subtle pt-6 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="text-xs text-text-muted hover:text-text-secondary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-text-muted hover:text-text-secondary">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

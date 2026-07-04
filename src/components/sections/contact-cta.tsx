import { Calendar, MessageCircle, FileSearch } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function ContactCTA() {
  return (
    <section className="section-py relative overflow-hidden border-b border-border-subtle bg-panel">
      <div className="bg-spotlight pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="surface-card rounded-3xl p-6 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-3xl lg:text-4xl">
                Let&rsquo;s find out exactly where your store is leaving revenue on the table.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-text-secondary">
                Book a free 30-minute consultation — we&rsquo;ll review your store, flag the
                highest-impact fixes, and tell you honestly whether we&rsquo;re the right fit.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
                <Button href={siteConfig.calendlyUrl} variant="primary" size="lg" showArrow className="w-full sm:w-auto">
                  <Calendar className="size-4.5" />
                  Book Free Consultation
                </Button>
                <Button href="/shopify-audit" variant="secondary" size="lg" className="w-full sm:w-auto">
                  <FileSearch className="size-4.5" />
                  Get a Free Audit
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl bg-panel p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-accent-blue/15 text-accent-blue">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">Pick a time that works</div>
                  <div className="text-xs text-text-muted">Synced to your time zone, no back-and-forth</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-accent-teal/15 text-accent-teal">
                  <MessageCircle className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">Or message us directly</div>
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
                    className="text-xs text-accent-blue hover:underline"
                  >
                    Chat on WhatsApp →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

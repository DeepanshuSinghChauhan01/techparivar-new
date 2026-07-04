"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, ArrowUpRight, LayoutDashboard } from "lucide-react";
import { Logo } from "./logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { navLinks, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border-subtle bg-base/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container className="flex h-14 items-center justify-between lg:h-[72px]">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) =>
            "children" in link && link.children ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                  aria-expanded={servicesOpen}
                >
                  {link.label}
                  <ChevronDown className={cn("size-3.5 transition-transform", servicesOpen && "rotate-180")} />
                </button>
                {servicesOpen && (
                  <div className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3">
                    <div className="surface-card grid grid-cols-2 gap-1 rounded-2xl p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="rounded-xl px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-card-hover hover:text-text-primary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary",
                  link.href === "/login" &&
                    "border border-border-default text-vibrant-orange hover:border-vibrant-orange/60 hover:text-vibrant-orange"
                )}
              >
                {link.href === "/login" && <LayoutDashboard className="size-3.5" />}
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex lg:hidden">
            <Button
              href={siteConfig.calendlyUrl}
              variant="primary"
              size="sm"
              className="px-3 py-2 text-xs"
            >
              Book Call
            </Button>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <Button href={siteConfig.calendlyUrl} variant="primary" size="sm" showArrow>
              Book Free Consultation
            </Button>
          </div>

          <button
            className="flex items-center justify-center rounded-lg p-2 text-text-primary lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <div className="fixed inset-x-0 top-14 z-30 h-[calc(100vh-3.5rem)] overflow-y-auto bg-base lg:hidden">
          <Container className="flex flex-col gap-1 py-6">
            {navLinks.map((link) => (
              <div key={link.href} className="border-b border-border-subtle py-3">
                <Link
                  href={link.href}
                  className={cn(
                    "block text-lg font-medium text-text-primary",
                    link.href === "/login" && "text-vibrant-orange"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {"children" in link && link.children && (
                  <div className="mt-3 flex flex-col gap-1 pl-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center justify-between py-2.5 text-sm text-text-secondary"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Button href={siteConfig.calendlyUrl} variant="primary" className="mt-6 w-full">
              Book Free Consultation
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}

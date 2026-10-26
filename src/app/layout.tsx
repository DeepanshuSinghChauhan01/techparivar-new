import type { Metadata } from "next";
// Self-hosted instead of next/font/google so production builds don't depend
// on reaching Google Fonts — see src/app/fonts/fonts.css.
import "./fonts/fonts.css";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Shopify & Shopify Plus Development Agency`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Shopify development agency",
    "Shopify Plus agency",
    "Shopify Plus development",
    "ecommerce CRO agency",
    "Shopify migration agency",
    "headless Shopify development",
    "Shopify app development",
  ],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: `${siteConfig.name} — Shopify & Shopify Plus Development Agency`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    site: "@techparivar",
    title: `${siteConfig.name} — Shopify & Shopify Plus Development Agency`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

// Sitewide entity identity, rendered on every page. Distinct from the richer
// ProfessionalService schema on the homepage — this just establishes who
// TechParivar is for pages deeper in the site (services, blog, case studies)
// that don't otherwise carry organization-level markup.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  sameAs: Object.values(siteConfig.social),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-base text-text-primary font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}

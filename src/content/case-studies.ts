export interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  country: string;
  logoInitial: string;
  heroStat: { value: string; label: string };
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  services: string[];
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialRole: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "lumina-skincare",
    client: "Lumina Skincare",
    industry: "Beauty",
    country: "United States",
    logoInitial: "L",
    heroStat: { value: "+118%", label: "revenue in 6 months" },
    challenge:
      "Lumina was running on a heavily customized Shopify theme that broke on every app update. Mobile conversion sat at 0.9% against a 38,000-session monthly average, and the checkout abandoned at 71%.",
    solution:
      "We rebuilt the storefront on a clean OS 2.0 theme architecture, restructured the PDP around a subscription-first purchase flow, and ran a 10-week CRO program targeting cart and checkout friction.",
    results: [
      { label: "Revenue growth", value: "+118%" },
      { label: "Mobile conversion rate", value: "0.9% → 2.6%" },
      { label: "Page load (LCP)", value: "4.1s → 1.6s" },
      { label: "Cart abandonment", value: "71% → 54%" },
    ],
    services: ["Theme Customization", "CRO Optimization", "Performance Optimization"],
    testimonialQuote:
      "TechParivar didn't just rebuild our site — they rebuilt how we think about conversion. Every recommendation came with data behind it.",
    testimonialAuthor: "Sarah Chen",
    testimonialRole: "Founder, Lumina Skincare",
  },
  {
    slug: "vantage-electronics",
    client: "Vantage Electronics",
    industry: "Electronics",
    country: "United Kingdom",
    logoInitial: "V",
    heroStat: { value: "$3.2M", label: "GMV in first year on Plus" },
    challenge:
      "Vantage was outgrowing standard Shopify with a 40,000-SKU catalog, B2B wholesale customers, and a checkout that couldn't support their tiered pricing logic.",
    solution:
      "We migrated Vantage to Shopify Plus, built a custom B2B wholesale portal with company-specific catalogs and pricing, and implemented Shopify Functions for complex discount logic at checkout.",
    results: [
      { label: "Year-1 GMV on Plus", value: "$3.2M" },
      { label: "B2B order processing time", value: "-64%" },
      { label: "Checkout completion rate", value: "+22%" },
      { label: "Catalog load time", value: "-58%" },
    ],
    services: ["Shopify Plus Development", "Store Migration", "Custom Shopify Apps"],
    testimonialQuote:
      "We needed a team that understood enterprise commerce, not just Shopify themes. TechParivar delivered exactly that.",
    testimonialAuthor: "James Whitfield",
    testimonialRole: "VP Ecommerce, Vantage Electronics",
  },
  {
    slug: "aura-jewels",
    client: "Aura Jewels",
    industry: "Jewelry",
    country: "United Arab Emirates",
    logoInitial: "A",
    heroStat: { value: "+64%", label: "AOV after PDP redesign" },
    challenge:
      "Aura's luxury jewelry line needed a storefront that matched its in-store experience, but the existing site loaded slowly on mobile and lacked the visual merchandising to justify premium pricing.",
    solution:
      "We designed a custom Shopify theme with 360° product visualization, optimized the image pipeline for near-instant load on 4G, and restructured collections around gifting occasions.",
    results: [
      { label: "Average order value", value: "+64%" },
      { label: "Mobile LCP", value: "3.8s → 1.4s" },
      { label: "Organic traffic (6 mo.)", value: "+87%" },
      { label: "Return customer rate", value: "+29%" },
    ],
    services: ["Shopify Store Development", "Performance Optimization"],
    testimonialQuote:
      "Our new site finally feels as premium as our product. The team understood luxury retail, not just ecommerce.",
    testimonialAuthor: "Layla Haddad",
    testimonialRole: "Creative Director, Aura Jewels",
  },
  {
    slug: "northfield-home",
    client: "Northfield Home",
    industry: "Home Decor",
    country: "Canada",
    logoInitial: "N",
    heroStat: { value: "-71%", label: "page load time" },
    challenge:
      "Northfield's WooCommerce store couldn't handle Black Friday traffic and crashed twice during peak season, costing an estimated $180K in lost sales.",
    solution:
      "We executed a zero-downtime migration to Shopify with full SEO redirect mapping, rebuilt the storefront for performance, and load-tested for 5x projected Black Friday traffic.",
    results: [
      { label: "Page load time", value: "-71%" },
      { label: "Black Friday uptime", value: "100%" },
      { label: "Organic traffic retained", value: "100%" },
      { label: "Conversion rate", value: "+44%" },
    ],
    services: ["Store Migration", "Performance Optimization", "Retainer Support"],
    testimonialQuote:
      "Last Black Friday nearly broke our business. This year, with TechParivar, it was our best sales day ever — without a single outage.",
    testimonialAuthor: "Michael Torres",
    testimonialRole: "COO, Northfield Home",
  },
  {
    slug: "everline-wellness",
    client: "Everline Wellness",
    industry: "Health & Wellness",
    country: "Australia",
    logoInitial: "E",
    heroStat: { value: "+92%", label: "subscriber retention" },
    challenge:
      "Everline's supplement subscription business had a clunky subscription management experience, leading to high churn and frequent support tickets about plan changes.",
    solution:
      "We built a custom subscription management portal integrated with their subscription app's API, redesigned the post-purchase flow, and added proactive churn-prevention flows via Shopify Flow.",
    results: [
      { label: "Subscriber retention", value: "+92%" },
      { label: "Support tickets (subscriptions)", value: "-58%" },
      { label: "Subscription LTV", value: "+37%" },
      { label: "Plan-change completion rate", value: "+81%" },
    ],
    services: ["Custom Shopify Apps", "CRO Optimization"],
    testimonialQuote:
      "Our subscribers finally have a self-serve experience that doesn't generate a support ticket every time. That alone paid for the project.",
    testimonialAuthor: "Priya Nair",
    testimonialRole: "Head of Growth, Everline Wellness",
  },
  {
    slug: "stellar-apparel",
    client: "Stellar Apparel Co.",
    industry: "Fashion",
    country: "India",
    logoInitial: "S",
    heroStat: { value: "+156%", label: "organic traffic in 8 months" },
    challenge:
      "Stellar was a fast-growing Indian fashion label whose Shopify store had no SEO architecture, slow collection pages, and a checkout not optimized for India's high-COD-preference market.",
    solution:
      "We rebuilt their information architecture for SEO, implemented programmatic landing pages for category and size-specific search terms, and optimized checkout flows for both prepaid and COD customers.",
    results: [
      { label: "Organic traffic (8 mo.)", value: "+156%" },
      { label: "Checkout conversion rate", value: "+38%" },
      { label: "COD return rate", value: "-21%" },
      { label: "Indexed landing pages", value: "1,200+" },
    ],
    services: ["Shopify Store Development", "CRO Optimization"],
    testimonialQuote:
      "TechParivar understood both the global Shopify playbook and what actually works for Indian shoppers. That combination is rare.",
    testimonialAuthor: "Arjun Mehta",
    testimonialRole: "Founder, Stellar Apparel Co.",
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

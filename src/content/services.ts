export interface Service {
  slug: string;
  name: string;
  shortName: string;
  icon: string; // lucide-react icon name
  summary: string;
  description: string;
  deliverables: string[];
  idealFor: string;
  startingAt: string;
  metric: { value: string; label: string };
}

export const services: Service[] = [
  {
    slug: "shopify-development",
    name: "Shopify Store Development",
    shortName: "Store Development",
    icon: "Store",
    summary: "Custom-built Shopify stores designed to convert from day one.",
    description:
      "We design and build Shopify stores from the ground up — structured for conversion, fast on every device, and built on a codebase your team can actually maintain. No bloated page builders, no inherited tech debt.",
    deliverables: [
      "Custom theme architecture (OS 2.0 / sections everywhere)",
      "Conversion-led UX and information architecture",
      "Mobile-first responsive build",
      "App and integration setup",
      "Pre-launch QA across devices and browsers",
    ],
    idealFor: "Brands launching new or rebuilding outdated stores.",
    startingAt: "$6,500",
    metric: { value: "4.2x", label: "avg. mobile speed improvement" },
  },
  {
    slug: "shopify-plus",
    name: "Shopify Plus Development",
    shortName: "Shopify Plus",
    icon: "Crown",
    summary: "Enterprise builds for high-volume brands on Shopify Plus.",
    description:
      "For brands outgrowing standard Shopify, we architect on Plus — custom checkout extensions, Functions, multi-currency, B2B, and Flow automation built to handle volume without breaking under load.",
    deliverables: [
      "Checkout Extensibility & Shopify Functions",
      "B2B on Shopify wholesale portals",
      "Multi-store / multi-currency architecture",
      "Shopify Flow automation",
      "Launch-day load readiness",
    ],
    idealFor: "High-volume brands and enterprises on Shopify Plus.",
    startingAt: "$18,000",
    metric: { value: "$42M+", label: "GMV processed across Plus builds" },
  },
  {
    slug: "theme-customization",
    name: "Theme Customization",
    shortName: "Theme Customization",
    icon: "Paintbrush",
    summary: "Tailor an existing theme into something distinctly yours.",
    description:
      "Already have a theme you like the bones of? We customize it section by section — custom layouts, brand-true styling, and merchandising logic — without the cost of a full rebuild.",
    deliverables: [
      "Custom sections and blocks",
      "Brand-matched design system",
      "Liquid + JS customization",
      "Metafield-driven merchandising",
      "Cross-browser QA",
    ],
    idealFor: "Brands wanting a faster path to a distinctive storefront.",
    startingAt: "$3,200",
    metric: { value: "2–4 wks", label: "typical delivery window" },
  },
  {
    slug: "app-development",
    name: "Custom Shopify Apps",
    shortName: "Custom Apps",
    icon: "Blocks",
    summary: "Public or private apps for workflows Shopify doesn't cover.",
    description:
      "When off-the-shelf apps don't fit, we build custom Shopify apps — embedded in the admin, built on the latest API versions, and engineered for App Store review or internal-only use.",
    deliverables: [
      "Embedded admin apps (Remix / Polaris)",
      "Custom storefront APIs & extensions",
      "Webhooks and backend services",
      "App Store submission support",
      "Ongoing maintenance & version upgrades",
    ],
    idealFor: "Brands and agencies needing functionality Shopify lacks natively.",
    startingAt: "$9,500",
    metric: { value: "15+", label: "apps shipped to production" },
  },
  {
    slug: "migration",
    name: "Store Migration",
    shortName: "Migration",
    icon: "ArrowRightLeft",
    summary: "Move to Shopify without losing SEO, data, or revenue.",
    description:
      "Migrating from Magento, WooCommerce, BigCommerce, or a custom platform is high-risk if done wrong. We handle data, SEO redirects, and design with zero-downtime cutovers.",
    deliverables: [
      "Product, customer & order data migration",
      "301 redirect mapping for SEO preservation",
      "Design parity or upgrade",
      "Parallel staging & rollback plan",
      "Post-migration traffic monitoring",
    ],
    idealFor: "Brands moving off Magento, WooCommerce, or legacy platforms.",
    startingAt: "$7,800",
    metric: { value: "0%", label: "avg. organic traffic loss post-migration" },
  },
  {
    slug: "cro",
    name: "CRO Optimization",
    shortName: "CRO",
    icon: "TrendingUp",
    summary: "Turn existing traffic into more revenue, methodically.",
    description:
      "We run structured conversion programs — heuristic audits, funnel analysis, and A/B testing — so every design decision is backed by data, not opinion.",
    deliverables: [
      "Full-funnel CRO audit",
      "Heatmap & session recording analysis",
      "A/B and multivariate testing roadmap",
      "PDP, cart & checkout optimization",
      "Monthly performance reporting",
    ],
    idealFor: "Brands with steady traffic but flat conversion rates.",
    startingAt: "$2,500/mo",
    metric: { value: "+31%", label: "avg. conversion rate lift" },
  },
  {
    slug: "performance",
    name: "Performance Optimization",
    shortName: "Performance",
    icon: "Gauge",
    summary: "Faster stores rank higher and convert better.",
    description:
      "We optimize Core Web Vitals at the source — image pipelines, JS execution, third-party scripts, and render-blocking resources — not just front-end band-aids.",
    deliverables: [
      "Core Web Vitals audit (LCP, INP, CLS)",
      "Image and asset pipeline optimization",
      "Third-party script auditing",
      "Theme code performance refactor",
      "Ongoing speed monitoring",
    ],
    idealFor: "Stores with slow load times hurting SEO and conversion.",
    startingAt: "$2,200",
    metric: { value: "<1.8s", label: "avg. LCP after optimization" },
  },
  {
    slug: "headless-commerce",
    name: "Headless Commerce",
    shortName: "Headless",
    icon: "Layers",
    summary: "Hydrogen and custom frontends on Shopify's commerce engine.",
    description:
      "For brands that need full creative and technical control of the frontend, we build headless storefronts on Hydrogen/Oxygen or custom Next.js, backed by the Shopify Storefront API.",
    deliverables: [
      "Hydrogen / Next.js storefront build",
      "Storefront API architecture",
      "Custom design system implementation",
      "Multi-region / multi-language setup",
      "Edge deployment & caching strategy",
    ],
    idealFor: "Enterprise and high-growth brands needing full frontend control.",
    startingAt: "$24,000",
    metric: { value: "<1s", label: "avg. TTFB on edge-deployed builds" },
  },
  {
    slug: "retainer-support",
    name: "Retainer Support",
    shortName: "Retainer Support",
    icon: "LifeBuoy",
    summary: "An on-call Shopify dev team without the hiring overhead.",
    description:
      "Monthly retainers give you a dedicated Shopify team for ongoing builds, bug fixes, seasonal campaigns, and proactive monitoring — without managing freelancers.",
    deliverables: [
      "Dedicated developer hours each month",
      "Priority bug fixes & SLA response times",
      "Seasonal campaign builds",
      "Proactive uptime & performance monitoring",
      "Monthly strategy & reporting calls",
    ],
    idealFor: "Brands needing continuous Shopify support post-launch.",
    startingAt: "$1,800/mo",
    metric: { value: "<4hrs", label: "avg. critical bug response time" },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

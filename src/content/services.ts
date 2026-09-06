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
  /** Used to group entries on the pricing page. Optional — only set on services shown there. */
  category?: "web" | "shopify" | "maintenance" | "growth";
  /** Shows a subtle "Most Requested" badge on the pricing page. Use sparingly. */
  featured?: boolean;
  /**
   * Card title used only on the pricing page, when it should read differently
   * from the full service `name` used as this service's actual page H1 (e.g.
   * "Speed Optimization" as a punchier pricing label for the existing
   * "Performance Optimization" service, without touching that page's
   * already-indexed title/H1/JSON-LD). Falls back to `name` when unset.
   */
  pricingLabel?: string;
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
    startingAt: "$799",
    metric: { value: "4.2x", label: "avg. mobile speed improvement" },
    category: "shopify",
    featured: true,
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
    startingAt: "$299",
    metric: { value: "2–4 wks", label: "typical delivery window" },
    category: "shopify",
    pricingLabel: "Shopify Customization",
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
    startingAt: "$1,499",
    metric: { value: "15+", label: "apps shipped to production" },
    category: "shopify",
    featured: true,
    pricingLabel: "Shopify App Development",
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
    startingAt: "$199",
    metric: { value: "<1.8s", label: "avg. LCP after optimization" },
    category: "growth",
    pricingLabel: "Speed Optimization",
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

  // ============================================================
  // Starting-price catalog — added for the public pricing section.
  // See PRICING_SERVICE_SLUGS below for display order/grouping.
  // ============================================================
  {
    slug: "landing-page",
    name: "Landing Page Design & Development",
    shortName: "Landing Pages",
    icon: "Rocket",
    summary: "A focused, high-converting landing page built to launch fast and drive a single clear action.",
    description:
      "Whether you're validating an idea, running a campaign, or launching a product, we design and build landing pages optimized for one goal: getting visitors to act. Clean, fast, and built on solid code — not a bloated page builder.",
    deliverables: [
      "Single-page responsive design",
      "Conversion-focused layout",
      "Contact / lead capture form",
      "Basic on-page SEO setup",
      "Fast, mobile-first build",
    ],
    idealFor: "Businesses launching a campaign, product, or offer that needs a dedicated, fast landing page.",
    startingAt: "$299",
    metric: { value: "3–5 days", label: "typical delivery window" },
    category: "web",
  },
  {
    slug: "business-website",
    name: "Business Website Design & Development",
    shortName: "Business Websites",
    icon: "Globe",
    summary: "A professional multi-page website that represents your business and builds trust with visitors.",
    description:
      "A well-structured, professional website for businesses that need more than a single page — service pages, an about page, and a clear way for visitors to get in touch. Built to be easy to update and fast to load.",
    deliverables: [
      "Multi-page responsive website (up to 5 pages)",
      "Custom design matched to your brand",
      "Contact form & business information",
      "Mobile-first, cross-browser build",
      "Basic on-page SEO setup",
    ],
    idealFor: "Small and medium businesses needing a professional online presence.",
    startingAt: "$599",
    metric: { value: "1–2 wks", label: "typical delivery window" },
    category: "web",
  },
  {
    slug: "ecommerce-website",
    name: "E-commerce Website Development",
    shortName: "E-commerce Websites",
    icon: "ShoppingCart",
    summary: "A complete online store built to showcase your products and process orders reliably.",
    description:
      "For businesses selling products online outside the Shopify ecosystem, we build e-commerce websites with a product catalog, cart and checkout flow, and payment processing — structured to grow with your catalog.",
    deliverables: [
      "Product catalog & category structure",
      "Shopping cart & checkout flow",
      "Payment gateway integration",
      "Responsive, mobile-first design",
      "Basic on-page SEO setup",
    ],
    idealFor: "Businesses launching an online store outside the Shopify platform.",
    startingAt: "$799",
    metric: { value: "2–3 wks", label: "typical delivery window" },
    category: "web",
  },
  {
    slug: "custom-shopify-theme",
    name: "Custom Shopify Theme Development",
    shortName: "Custom Theme",
    icon: "Palette",
    summary: "A fully custom Shopify theme built from scratch around your brand, not a template.",
    description:
      "For brands that need a storefront that looks nothing like a template, we design and build a custom Shopify theme from the ground up — your layouts, your merchandising logic, your brand, built on OS 2.0 sections for easy management.",
    deliverables: [
      "Custom theme design (no template base)",
      "OS 2.0 section-based architecture",
      "Product & collection page design",
      "Mobile-first responsive build",
      "Pre-launch cross-device QA",
    ],
    idealFor: "Brands wanting a fully bespoke storefront rather than a customized existing theme.",
    startingAt: "$999",
    metric: { value: "3–4 wks", label: "typical delivery window" },
    category: "shopify",
    featured: true,
  },
  {
    slug: "website-maintenance",
    name: "Website Maintenance",
    shortName: "Website Maintenance",
    icon: "Wrench",
    summary: "Ongoing updates, monitoring, and support so your website stays secure and running smoothly.",
    description:
      "Websites need upkeep — software updates, backups, uptime monitoring, and small content changes. Our maintenance plans handle the ongoing work so your site stays secure and functional without you having to think about it.",
    deliverables: [
      "Regular software & security updates",
      "Uptime monitoring",
      "Scheduled backups",
      "Minor content updates each month",
      "Email support",
    ],
    idealFor: "Business website owners who want ongoing upkeep without hiring in-house.",
    startingAt: "$99/mo",
    metric: { value: "Monthly", label: "updates & monitoring" },
    category: "maintenance",
  },
  {
    slug: "shopify-maintenance",
    name: "Shopify Maintenance",
    shortName: "Shopify Maintenance",
    icon: "ShieldCheck",
    summary: "Ongoing Shopify store upkeep — updates, monitoring, and small fixes handled for you.",
    description:
      "Keep your Shopify store running smoothly with ongoing monitoring, app and theme update checks, and small fixes — without needing a full development retainer.",
    deliverables: [
      "Theme & app update monitoring",
      "Store uptime & performance checks",
      "Minor bug fixes",
      "Monthly store health report",
      "Email support",
    ],
    idealFor: "Shopify store owners needing ongoing upkeep without a full dev retainer.",
    startingAt: "$149/mo",
    metric: { value: "Monthly", label: "health checks & reporting" },
    category: "maintenance",
  },
  {
    slug: "seo",
    name: "SEO Services",
    shortName: "SEO",
    icon: "Search",
    summary: "Ongoing on-page and technical SEO work to help your site get found.",
    description:
      "We handle the technical and on-page SEO fundamentals — site structure, metadata, page speed factors, and content optimization — as an ongoing monthly engagement, with clear reporting on what's been done.",
    deliverables: [
      "Technical SEO audit & fixes",
      "On-page metadata optimization",
      "Site structure & internal linking review",
      "Monthly reporting",
      "Ongoing optimization",
    ],
    idealFor: "Businesses wanting consistent, ongoing SEO fundamentals handled for them.",
    startingAt: "$199/mo",
    metric: { value: "Monthly", label: "reporting & optimization" },
    category: "growth",
  },
  {
    slug: "custom-web-app",
    name: "Custom Web Application Development",
    shortName: "Custom Web Apps",
    icon: "Code",
    summary: "A custom-built web application designed around your exact business workflow.",
    description:
      "When off-the-shelf software doesn't fit how your business actually works, we design and build custom web applications — internal tools, customer portals, or platforms — on a modern, maintainable stack.",
    deliverables: [
      "Requirements & architecture planning",
      "Custom UI/UX design",
      "Full-stack development",
      "Database design & integration",
      "Deployment & handover documentation",
    ],
    idealFor: "Businesses needing custom software beyond what off-the-shelf tools provide.",
    startingAt: "$1,999",
    metric: { value: "4–8 wks", label: "typical delivery window" },
    category: "web",
    featured: true,
  },
];

/** Ordered slugs shown on the public pricing section, grouped by category. */
export const PRICING_SERVICE_SLUGS = [
  "landing-page",
  "business-website",
  "ecommerce-website",
  "custom-web-app",
  "shopify-development",
  "theme-customization",
  "custom-shopify-theme",
  "app-development",
  "website-maintenance",
  "shopify-maintenance",
  "performance",
  "seo",
] as const;

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export interface Industry {
  name: string;
  icon: string;
  description: string;
}

export const industries: Industry[] = [
  { name: "Fashion", icon: "Shirt", description: "Size-driven catalogs, lookbooks, and seasonal drops." },
  { name: "Beauty", icon: "Sparkles", description: "Subscription models, bundles, and ingredient-led merchandising." },
  { name: "Jewelry", icon: "Gem", description: "High-AOV visual merchandising and trust-building UX." },
  { name: "Electronics", icon: "Cpu", description: "Complex variants, specs, and warranty/support flows." },
  { name: "Home Decor", icon: "Sofa", description: "Large catalogs, room-based browsing, and freight logistics." },
  { name: "Luxury Brands", icon: "Crown", description: "White-glove UX, editorial storytelling, and exclusivity." },
  { name: "Health & Wellness", icon: "HeartPulse", description: "Subscriptions, compliance, and retention-first design." },
];

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  duration: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We audit your current store, traffic, and goals to understand exactly where revenue is being left on the table.",
    duration: "3–5 days",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "A scoped roadmap with technical architecture, timeline, and success metrics — agreed before a line of code is written.",
    duration: "1 week",
  },
  {
    number: "03",
    title: "Design",
    description:
      "Wireframes and high-fidelity UI built around your brand and conversion goals, reviewed with you at every stage.",
    duration: "2–3 weeks",
  },
  {
    number: "04",
    title: "Development",
    description:
      "Clean, documented builds on Shopify's latest architecture — sections, blocks, and metafields done right.",
    duration: "3–6 weeks",
  },
  {
    number: "05",
    title: "QA",
    description:
      "Cross-browser, cross-device testing plus performance and accessibility checks before anything goes live.",
    duration: "1 week",
  },
  {
    number: "06",
    title: "Launch",
    description:
      "Coordinated go-live with rollback plans, monitoring, and a team on standby for the first 48 hours.",
    duration: "1–2 days",
  },
  {
    number: "07",
    title: "Support",
    description:
      "Post-launch monitoring, retainer support, or a clean handoff with full documentation — your call.",
    duration: "Ongoing",
  },
];

export interface WhyChooseItem {
  icon: string;
  title: string;
  description: string;
}

export const whyChooseUs: WhyChooseItem[] = [
  {
    icon: "Users",
    title: "Dedicated Shopify Experts",
    description:
      "Your project is staffed by senior Shopify developers and strategists — not a rotating bench of generalists.",
  },
  {
    icon: "MessageCircle",
    title: "Transparent Communication",
    description:
      "Weekly updates, shared project boards, and direct Slack/WhatsApp access. You always know exactly where things stand.",
  },
  {
    icon: "Zap",
    title: "Fast Delivery",
    description:
      "Fixed-scope projects ship on the timeline we quote — backed by a proven build process refined across 320+ stores.",
  },
  {
    icon: "LifeBuoy",
    title: "Ongoing Support",
    description:
      "Launch day isn't the finish line. Retainer plans keep your store fast, secure, and evolving after go-live.",
  },
  {
    icon: "BarChart3",
    title: "Proven Results",
    description:
      "Every engagement is measured against real commerce metrics — conversion rate, AOV, LCP — not vanity deliverables.",
  },
  {
    icon: "Globe",
    title: "Global + Local Expertise",
    description:
      "We've shipped for brands across six countries, balancing global best practice with local market nuance.",
  },
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: "How much does a Shopify development project cost?",
    answer:
      "Most theme customization projects start around $3,200, full custom builds from $6,500, and Shopify Plus enterprise builds from $18,000. The exact cost depends on scope, integrations, and timeline. A free audit call gives you a firm quote within 48 hours.",
  },
  {
    question: "How long does it take to build or migrate a Shopify store?",
    answer:
      "Theme customizations typically take 2–4 weeks. Full custom builds take 6–10 weeks. Shopify Plus and headless builds range from 10–16 weeks depending on integration complexity. Migrations are usually completed in 4–8 weeks with zero downtime.",
  },
  {
    question: "Do you work with brands outside India?",
    answer:
      "Yes — the majority of our clients are based in the US, UK, Canada, Australia, and the UAE. We run on overlapping hours with all six markets we serve and use async updates so time zones are never a bottleneck.",
  },
  {
    question: "Can you migrate our store from Magento, WooCommerce, or BigCommerce?",
    answer:
      "Yes. We've migrated stores from Magento, WooCommerce, BigCommerce, and custom-built platforms onto Shopify and Shopify Plus, with full product, customer, and order data migration plus SEO redirect mapping to protect organic rankings.",
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer:
      "Yes. Most clients move to a monthly retainer after launch, covering bug fixes, feature requests, seasonal campaign builds, and proactive monitoring. Retainers start at $1,800/month with response-time SLAs.",
  },
  {
    question: "What's included in the free Shopify audit?",
    answer:
      "A full review of your store's Core Web Vitals, conversion funnel, theme code quality, and app stack — delivered as a written report with prioritized recommendations, plus a 30-minute walkthrough call.",
  },
  {
    question: "Do you build on Shopify Plus and Hydrogen/headless?",
    answer:
      "Yes — our team has deep, hands-on experience building on Shopify Plus, and we build headless storefronts on Hydrogen/Oxygen and custom Next.js frontends using the Storefront API for brands that need full frontend control.",
  },
  {
    question: "How do you ensure projects stay on budget and on time?",
    answer:
      "Every project starts with a fixed-scope proposal after discovery — no open-ended hourly billing. You get a milestone-based timeline, weekly check-ins, and a shared project board so scope changes are flagged and approved before they affect cost.",
  },
];

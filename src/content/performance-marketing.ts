/**
 * Performance Marketing — the /performance-marketing hub and its
 * /performance-marketing/[slug] detail pages are rendered entirely from this
 * file. Like E-commerce Services, these are ongoing engagements scoped and
 * quoted per account, so there are no prices, result figures or guarantees
 * here. Platform names describe where we work — they don't imply an official
 * partnership.
 */

import type { ManagedService, ServiceFaq, ServiceIconName } from "./service-types";

export interface PerformanceService extends ManagedService {
  /** /ecommerce-services/[slug] pages that pair well with this one. */
  relatedEcommerce?: string[];
}

export interface PerformanceMetric {
  abbr: string;
  name: string;
  definition: string;
}

/** Tracked on every engagement — definitions, not benchmarks or targets. */
export const performanceMetrics: PerformanceMetric[] = [
  { abbr: "ROAS", name: "Return on ad spend", definition: "Revenue attributed to ads divided by ad spend." },
  { abbr: "CPA", name: "Cost per acquisition", definition: "Ad spend divided by the number of conversions, such as purchases or leads." },
  { abbr: "CAC", name: "Customer acquisition cost", definition: "Total cost of acquiring a new customer, including media and related costs." },
  { abbr: "CTR", name: "Click-through rate", definition: "The share of ad impressions that result in a click." },
  { abbr: "CPC", name: "Cost per click", definition: "Average amount paid for each click on an ad." },
  { abbr: "CPM", name: "Cost per mille", definition: "Cost of 1,000 ad impressions — a measure of how expensive reach is." },
  { abbr: "CVR", name: "Conversion rate", definition: "The share of clicks or sessions that complete the goal action." },
];

const METRICS = ["ROAS", "CPA", "CAC", "CTR", "CPC", "CPM", "Conversion rate"];

export const performanceServices: PerformanceService[] = [
  {
    slug: "meta-ads-management",
    name: "Meta Ads Management",
    icon: "Smartphone",
    summary: "Facebook and Instagram campaigns built around clear audience, creative and budget strategy.",
    description:
      "We plan, launch and manage Meta advertising across Facebook and Instagram — campaign structure, audiences, catalogue ads, budgets and creative testing — with every decision tied to the metrics your business cares about.",
    scope: [
      "Ad account audit and campaign structure planning",
      "Sales, lead and catalogue campaigns, including Advantage+ where it fits",
      "Audience strategy across broad, interest, custom and lookalike audiences",
      "Dynamic product ads from your Shopify or WooCommerce catalogue",
      "Budget allocation, bid strategy and pacing",
      "Structured creative and copy testing",
      "Coordination with Pixel and Conversions API tracking",
    ],
    deliverables: [
      "Account audit with prioritized fixes",
      "Campaign and audience plan",
      "Live campaigns with a documented testing roadmap",
      "Weekly optimization notes and a monthly performance report",
    ],
    kpis: METRICS,
    platforms: ["Facebook", "Instagram", "Meta Ads Manager", "Meta Pixel & Conversions API", "Commerce Manager"],
    idealFor:
      "D2C and e-commerce brands selling online, and lead-generation businesses using Meta lead forms or landing pages.",
    related: ["retargeting-customer-acquisition", "ad-creatives-campaign-strategy", "conversion-tracking-analytics"],
    relatedEcommerce: ["analytics-tracking-bi", "product-content-a-plus-content"],
    relatedCoreServices: ["cro"],
  },
  {
    slug: "google-ads-management",
    name: "Google Ads Management",
    icon: "Search",
    summary: "Search, Shopping, Performance Max and YouTube campaigns managed against your targets.",
    description:
      "We manage Google Ads across Search, Shopping, Performance Max, YouTube and Display — from keyword research and product feeds to bidding and search-term management — so spend goes toward the queries and audiences most likely to convert.",
    scope: [
      "Keyword research, match-type strategy and negative keyword management",
      "Shopping campaigns and product feed setup in Google Merchant Center",
      "Performance Max asset groups, audience signals and feed segmentation",
      "Responsive search ads and ad assets (sitelinks, callouts, structured snippets)",
      "Smart bidding setup — target CPA, target ROAS or maximize conversions",
      "YouTube, Display and Demand Gen campaigns where they suit the funnel",
      "Regular search terms and placement reviews",
    ],
    deliverables: [
      "Account audit with prioritized fixes",
      "Keyword and campaign structure plan",
      "Merchant Center feed review for e-commerce accounts",
      "Weekly optimization notes and a monthly performance report",
    ],
    kpis: METRICS,
    platforms: ["Google Search", "Shopping", "Performance Max", "YouTube", "Display & Demand Gen", "Google Merchant Center"],
    idealFor:
      "E-commerce stores with a product catalogue, and lead-generation businesses whose customers search for their services.",
    related: ["conversion-tracking-analytics", "performance-optimization-reporting", "ad-creatives-campaign-strategy"],
    relatedEcommerce: ["ecommerce-seo-cro", "product-listing-catalogue-management"],
    relatedCoreServices: ["cro"],
  },
  {
    slug: "ad-creatives-campaign-strategy",
    name: "Ad Creatives & Campaign Strategy",
    icon: "Clapperboard",
    summary: "Channel strategy, messaging and ad creatives designed to be tested, not guessed.",
    description:
      "We define where your budget should go, who you're speaking to and what to say — then produce static, video and carousel ad creatives and copy, with a testing plan that shows what's actually working.",
    scope: [
      "Channel, funnel and budget allocation strategy",
      "Audience and messaging research, including reviews and competitor ads",
      "Creative briefs for static, video, carousel and UGC-style ads",
      "Ad copy, headlines and hooks for each platform and placement",
      "Creative testing framework and refresh cadence",
      "Landing page and offer alignment with ad messaging",
    ],
    deliverables: [
      "Campaign strategy document",
      "Messaging and angle matrix",
      "Ad creative sets sized for each platform and placement",
      "Monthly creative performance review",
    ],
    kpis: METRICS,
    platforms: ["Meta Ads", "Google Ads", "YouTube"],
    idealFor:
      "Brands whose ads have plateaued, are launching new products or offers, or need a steady supply of fresh creative.",
    related: ["meta-ads-management", "google-ads-management", "retargeting-customer-acquisition"],
    relatedEcommerce: ["product-content-a-plus-content"],
    relatedCoreServices: ["landing-page", "cro"],
  },
  {
    slug: "conversion-tracking-analytics",
    name: "Conversion Tracking & Analytics",
    icon: "Activity",
    summary: "Accurate conversion data, so ad platforms optimize for the right outcomes.",
    description:
      "We audit and implement conversion tracking across your website and ad platforms — GA4, Google Tag Manager, Meta Pixel and Conversions API, and Google Ads conversions — so reporting is trustworthy and bidding algorithms learn from real results.",
    scope: [
      "Tracking audit across website, GA4 and ad accounts",
      "Event and conversion plan for purchases, leads, calls and key actions",
      "Google Tag Manager implementation and QA",
      "Meta Conversions API and Google Ads Enhanced Conversions setup",
      "Consent mode configuration where required",
      "Offline conversion import from your CRM for lead-generation funnels",
      "UTM conventions and attribution review",
    ],
    deliverables: [
      "Tracking plan document",
      "Implemented and tested tags and events",
      "Tracking QA report",
      "Reporting dashboard connected to clean data",
    ],
    kpis: METRICS,
    platforms: ["GA4", "Google Tag Manager", "Meta Pixel & Conversions API", "Google Ads conversions", "Shopify", "WooCommerce", "Looker Studio"],
    idealFor:
      "Any advertiser whose platform numbers don't match their store or CRM, or who is about to scale spend.",
    related: ["performance-optimization-reporting", "google-ads-management", "meta-ads-management"],
    relatedEcommerce: ["analytics-tracking-bi", "reporting-team-management"],
  },
  {
    slug: "retargeting-customer-acquisition",
    name: "Retargeting & Customer Acquisition",
    icon: "UserPlus",
    summary: "Reach new customers efficiently and bring back people who already showed interest.",
    description:
      "We build full-funnel audience programs — prospecting to find new customers, and retargeting for site visitors, cart abandoners, leads and past buyers — with exclusions and frequency controls so you don't overspend on the same people.",
    scope: [
      "Prospecting strategy for new-customer acquisition",
      "Audience segmentation: visitors, product viewers, cart abandoners, leads and past customers",
      "Dynamic retargeting with product catalogue ads",
      "Remarketing lists for Search and YouTube",
      "Consented customer-list audiences and lookalikes",
      "Exclusions and frequency management across campaigns",
      "Reporting new vs. returning customer acquisition separately",
    ],
    deliverables: [
      "Audience and funnel map",
      "Configured prospecting and retargeting campaigns",
      "Exclusion and frequency rules",
      "Monthly acquisition and retargeting report",
    ],
    kpis: METRICS,
    platforms: ["Meta Ads", "Google Ads", "YouTube", "GA4 audiences"],
    idealFor:
      "D2C and e-commerce brands focused on growing new customers, and lead-gen businesses with long consideration cycles.",
    related: ["meta-ads-management", "google-ads-management", "ad-creatives-campaign-strategy"],
    relatedEcommerce: ["sales-revenue-growth"],
    relatedCoreServices: ["cro"],
  },
  {
    slug: "performance-optimization-reporting",
    name: "Performance Optimization & Reporting",
    icon: "SlidersHorizontal",
    summary: "Ongoing optimization and clear reporting on what changed, why, and what's next.",
    description:
      "We run a regular optimization routine across your ad accounts — budgets, bids, audiences, creatives and landing pages — and report on it in plain language, with dashboards that connect ad spend to business results.",
    scope: [
      "Weekly optimization routine across active campaigns",
      "Budget pacing against monthly plans",
      "Bid, audience and placement adjustments",
      "Creative fatigue monitoring and refresh recommendations",
      "Landing page and conversion rate recommendations",
      "Blended reporting across channels alongside platform-reported results",
      "Monthly review calls with clear next actions",
    ],
    deliverables: [
      "Live performance dashboard",
      "Weekly optimization log",
      "Monthly performance report and review call",
      "Quarterly plan for budget and channel mix",
    ],
    kpis: METRICS,
    platforms: ["Meta Ads Manager", "Google Ads", "GA4", "Looker Studio", "Google Sheets"],
    idealFor:
      "Advertisers who already run campaigns but need consistent optimization and reporting they can act on.",
    related: ["conversion-tracking-analytics", "meta-ads-management", "google-ads-management"],
    relatedEcommerce: ["advertising-performance", "sales-target-achievement"],
    relatedCoreServices: ["cro", "performance"],
  },
];

export function getPerformanceServiceBySlug(slug: string): PerformanceService | undefined {
  return performanceServices.find((s) => s.slug === slug);
}

export const performanceAudiences: { icon: ServiceIconName; title: string; description: string }[] = [
  {
    icon: "ShoppingBag",
    title: "D2C brands",
    description: "Building direct demand and new-customer growth beyond marketplaces.",
  },
  {
    icon: "Store",
    title: "E-commerce businesses",
    description: "Driving profitable sales from catalogue, Shopping and retargeting campaigns.",
  },
  {
    icon: "PhoneCall",
    title: "Lead-generation companies",
    description: "Generating qualified enquiries, calls and form fills — measured through to your CRM.",
  },
];

export const performancePlatformGroups: { title: string; items: string[] }[] = [
  {
    title: "Advertising",
    items: ["Facebook", "Instagram", "Google Search", "Google Shopping", "Performance Max", "YouTube", "Display & Demand Gen"],
  },
  {
    title: "Tracking & analytics",
    items: ["GA4", "Google Tag Manager", "Meta Pixel & Conversions API", "Google Ads conversions", "Google Merchant Center"],
  },
  {
    title: "Stores & reporting",
    items: ["Shopify", "WooCommerce", "Custom storefronts", "Looker Studio", "Google Sheets"],
  },
];

export const performanceProcess: { title: string; description: string }[] = [
  { title: "Discovery", description: "We learn your products, margins, customers, targets and what's been tried before." },
  { title: "Audit", description: "We review ad accounts, tracking and landing pages to find what's working and what isn't." },
  { title: "Tracking", description: "We fix or set up conversion tracking so decisions are based on reliable data." },
  { title: "Strategy & creative", description: "We agree channels, budgets, audiences and messaging, and produce the first creatives." },
  { title: "Launch & optimize", description: "Campaigns go live and follow a regular optimization routine." },
  { title: "Report & plan", description: "Clear reporting against agreed metrics, and a plan for what to do next." },
];

/** Hub-page FAQs — about how engagements work; no outcome guarantees. */
export const performanceFaqs: ServiceFaq[] = [
  {
    question: "Do you guarantee a specific ROAS or cost per lead?",
    answer:
      "No. Results depend on your product, pricing, margins, offer, website and market, so no honest agency can guarantee them up front. We agree realistic targets with you after the audit, and report transparently against them.",
  },
  {
    question: "Which advertising platforms do you manage?",
    answer:
      "We manage Meta (Facebook and Instagram) and Google Ads, including Search, Shopping, Performance Max, YouTube, Display and Demand Gen. Tracking work covers GA4, Google Tag Manager, Meta Pixel and Conversions API, and Google Ads conversions.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "Every engagement is scoped and quoted after a consultation, based on the channels, ad budget and services involved. Your advertising budget is separate from our management fee. You'll receive a written scope and quote before any work begins.",
  },
  {
    question: "Who owns the ad accounts and data?",
    answer:
      "We recommend that campaigns run in ad accounts owned by your business, with our team given access. That way your accounts, audiences and historical data stay with you.",
  },
  {
    question: "How often will we get reports?",
    answer:
      "The reporting cadence is agreed in the scope — usually short weekly updates plus a monthly report and review call, with a live dashboard you can check any time.",
  },
  {
    question: "Do you also help with marketplaces like Amazon or Flipkart?",
    answer:
      "Yes — marketplace advertising and account management are covered in our E-commerce Services, and the two can be run together.",
  },
];

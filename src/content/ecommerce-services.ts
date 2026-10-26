/**
 * E-commerce operations & growth services — the /ecommerce-services hub and
 * its /ecommerce-services/[slug] detail pages are rendered entirely from this
 * file. Kept separate from `services.ts` because these are managed/ongoing
 * engagements scoped per account, so they intentionally carry no starting
 * price or "typical result" metric.
 */

import type { ManagedService, ServiceFaq, ServiceIconName } from "./service-types";

export type EcommerceCategorySlug =
  | "account-management"
  | "marketplace-advertising"
  | "website-development"
  | "seo-growth"
  | "analytics-operations";

export interface EcommerceCategory {
  slug: EcommerceCategorySlug;
  name: string;
  /** Compact label for filter tabs. */
  shortName: string;
  icon: ServiceIconName;
  summary: string;
}

export interface EcommerceService extends ManagedService {
  category: EcommerceCategorySlug;
}

export const ecommerceCategories: EcommerceCategory[] = [
  {
    slug: "account-management",
    name: "E-commerce Account Management",
    shortName: "Account Management",
    icon: "UserCog",
    summary:
      "Day-to-day ownership of your seller accounts — health, listings, stock, returns and marketplace support.",
  },
  {
    slug: "marketplace-advertising",
    name: "Marketplace & Advertising Management",
    shortName: "Marketplace & Ads",
    icon: "Megaphone",
    summary:
      "Marketplace operations, sponsored ads, promotions and listing content run as one coordinated program.",
  },
  {
    slug: "website-development",
    name: "E-commerce Website Development",
    shortName: "Website Development",
    icon: "MonitorSmartphone",
    summary:
      "Storefronts on Shopify, WooCommerce or a custom stack, connected to the payment, shipping and ERP tools you run on.",
  },
  {
    slug: "seo-growth",
    name: "SEO & Growth Marketing",
    shortName: "SEO & Growth",
    icon: "Rocket",
    summary:
      "Organic visibility, conversion optimization and revenue planning tied to the targets your business is held to.",
  },
  {
    slug: "analytics-operations",
    name: "Analytics & Business Operations",
    shortName: "Analytics & Ops",
    icon: "ChartPie",
    summary:
      "Orders, payments, reporting and tracking — the operational backbone that keeps numbers reliable.",
  },
];

const MARKETPLACES = ["Amazon", "Flipkart", "Myntra", "Meesho"];

export const ecommerceServices: EcommerceService[] = [
  // ------------------------------------------------------------
  // E-commerce Account Management
  // ------------------------------------------------------------
  {
    slug: "account-health-management",
    name: "Account Health Management",
    category: "account-management",
    icon: "ShieldCheck",
    summary: "Keep seller accounts compliant, in good standing and free of avoidable suspensions.",
    description:
      "We monitor seller performance metrics and policy compliance across your marketplace accounts, resolve violations before they escalate, and prepare appeals and plans of action when something does go wrong.",
    scope: [
      "Daily monitoring of account health dashboards and performance notifications",
      "Tracking order defect rate, late dispatch, cancellation and valid tracking rates",
      "Handling policy warnings, listing suppressions and IP or authenticity complaints",
      "Drafting appeals and plans of action for deactivated listings or accounts",
      "Preventive SOPs for dispatch, packaging and customer communication",
    ],
    deliverables: [
      "Weekly account health summary",
      "Issue log with root cause and resolution status",
      "Appeal and plan-of-action documentation when required",
      "Compliance checklist tailored to each marketplace",
    ],
    kpis: ["Order defect rate", "Late dispatch rate", "Cancellation rate", "Policy violations open"],
    platforms: MARKETPLACES,
    idealFor: "Sellers who have faced warnings or suspensions, or want to avoid them as volume grows.",
    related: ["ticket-resolution-poc-coordination", "order-processing-fulfilment", "marketplace-management"],
  },
  {
    slug: "product-listing-catalogue-management",
    name: "Product Listing & Catalogue Management",
    category: "account-management",
    icon: "LayoutList",
    summary: "Accurate, complete and searchable listings across every channel you sell on.",
    description:
      "We create, update and maintain your product catalogue across marketplaces and your own store — correct categories, attributes, variations and keywords — so products are discoverable and stay live.",
    scope: [
      "New product listing creation, including bulk flat-file uploads",
      "Category mapping, attribute completion and variation (parent/child) setup",
      "Keyword research for titles, bullet points and backend search terms",
      "Fixing suppressed, inactive or incomplete listings",
      "Catalogue consistency across marketplaces and your website",
    ],
    deliverables: [
      "Live listings with completed mandatory and recommended attributes",
      "Master catalogue sheet as a single source of truth",
      "Monthly listing quality audit",
    ],
    kpis: ["Listing quality score", "Suppressed listings", "Search impressions", "Catalogue coverage"],
    platforms: [...MARKETPLACES, "Shopify", "WooCommerce"],
    idealFor: "Brands launching new SKUs or managing large catalogues across multiple channels.",
    related: ["product-content-a-plus-content", "inventory-stock-availability", "marketplace-management"],
    relatedCoreServices: ["ecommerce-website"],
  },
  {
    slug: "inventory-stock-availability",
    name: "Inventory & Stock Availability",
    category: "account-management",
    icon: "Boxes",
    summary: "Fewer stock-outs and less dead stock through planned replenishment.",
    description:
      "We keep stock levels synchronized across channels, plan replenishment against sales velocity, and manage inbound shipments to marketplace warehouses so your best sellers stay available.",
    scope: [
      "Cross-channel stock synchronization to prevent overselling",
      "Sales velocity tracking and reorder point planning",
      "Inbound shipment planning for FBA, Flipkart Smart Fulfilment and similar programs",
      "Aged and slow-moving inventory identification",
      "Stock-out alerts for priority SKUs",
    ],
    deliverables: [
      "Replenishment plan by SKU and warehouse",
      "Weekly stock health report",
      "Aged inventory action list",
    ],
    kpis: ["In-stock rate", "Days of cover", "Stock-out incidents", "Aged inventory value"],
    platforms: MARKETPLACES,
    idealFor: "Sellers losing sales to stock-outs or carrying too much slow-moving inventory.",
    related: ["order-processing-fulfilment", "payment-shipping-erp-integrations", "product-listing-catalogue-management"],
  },
  {
    slug: "returns-claims-reimbursements",
    name: "Returns, Claims & Reimbursements",
    category: "account-management",
    icon: "RotateCcw",
    summary: "Recover money owed for lost, damaged and wrongly returned items.",
    description:
      "We track every return and claim window, file reimbursement claims with the right evidence, and identify return patterns that point to listing, packaging or quality issues.",
    scope: [
      "Return and RTO (return to origin) tracking across marketplaces",
      "Filing claims for lost, damaged or incorrectly returned inventory",
      "SAFE-T claims and equivalent programs within their filing windows",
      "Evidence collection: images, invoices, packaging and dispatch proof",
      "Return reason analysis to reduce future returns",
    ],
    deliverables: [
      "Claims tracker with status and amounts filed",
      "Monthly reimbursement summary",
      "Return reason analysis with recommended fixes",
    ],
    kpis: ["Return rate", "Claims filed vs. approved", "Amount recovered", "Claims missed by deadline"],
    platforms: MARKETPLACES,
    idealFor: "Sellers with meaningful return volume who don't have time to chase every claim.",
    related: ["payment-reconciliation", "ticket-resolution-poc-coordination", "account-health-management"],
  },
  {
    slug: "ticket-resolution-poc-coordination",
    name: "Ticket Resolution & POC Coordination",
    category: "account-management",
    icon: "Headset",
    summary: "One accountable point of contact for marketplace support cases and escalations.",
    description:
      "We raise, follow up and escalate seller support tickets, coordinate with marketplace account managers, and act as a single point of contact between your team and each platform.",
    scope: [
      "Raising and following up on seller support cases",
      "Escalation to marketplace account managers where available",
      "Coordinating with logistics partners, brand registry and catalogue teams",
      "Maintaining a shared ticket log your team can see",
      "Regular sync calls with your internal stakeholders",
    ],
    deliverables: [
      "Ticket log with owner, status and next action",
      "Escalation matrix per marketplace",
      "Weekly coordination update",
    ],
    kpis: ["Open tickets", "Average resolution time", "Escalations raised"],
    platforms: MARKETPLACES,
    idealFor: "Brands whose team is spending hours each week chasing marketplace support.",
    related: ["account-health-management", "reporting-team-management", "returns-claims-reimbursements"],
  },

  // ------------------------------------------------------------
  // Marketplace & Advertising Management
  // ------------------------------------------------------------
  {
    slug: "marketplace-management",
    name: "Amazon, Flipkart, Myntra & Meesho Marketplace Management",
    category: "marketplace-advertising",
    icon: "Store",
    summary: "End-to-end management of your marketplace storefronts, from onboarding to scale.",
    description:
      "We run your marketplace business across Amazon, Flipkart, Myntra and Meesho — account setup, brand registry, listings, pricing, advertising and operations — with one team accountable for performance on each channel.",
    scope: [
      "Seller account onboarding, brand registry and storefront setup",
      "Channel-specific listing, pricing and Buy Box strategy",
      "Coordinating advertising, promotions and catalogue work",
      "Competitor and category monitoring",
      "Monthly business reviews per marketplace",
    ],
    deliverables: [
      "Channel plan with priorities for each marketplace",
      "Monthly performance review per marketplace",
      "Documented SOPs your team can follow",
    ],
    kpis: ["Revenue by channel", "Buy Box share", "Conversion rate", "Advertising cost of sale"],
    platforms: MARKETPLACES,
    idealFor: "Brands expanding to marketplaces or consolidating several agencies into one team.",
    related: ["advertising-performance", "marketplace-promotions-campaigns", "account-health-management"],
  },
  {
    slug: "advertising-performance",
    name: "Advertising Performance: ROAS, ACOS, TACoS",
    category: "marketplace-advertising",
    icon: "Target",
    summary: "Sponsored ads managed against profitability, not just clicks.",
    description:
      "We plan, launch and optimize sponsored product, brand and display campaigns, with bids and budgets managed against agreed ROAS, ACOS and TACoS targets so ad spend supports overall profitability.",
    scope: [
      "Campaign structure by product, keyword intent and match type",
      "Keyword harvesting and negative keyword management",
      "Bid and budget optimization against agreed targets",
      "Sponsored Products, Sponsored Brands and Display campaigns",
      "Separating branded, competitor and category spend for clearer reporting",
    ],
    deliverables: [
      "Advertising strategy and target-setting document",
      "Weekly optimization log",
      "Monthly ROAS, ACOS and TACoS report by campaign and product",
    ],
    kpis: ["ROAS", "ACOS", "TACoS", "Cost per click", "Ad-attributed sales"],
    platforms: ["Amazon Ads", "Flipkart Ads", "Myntra Ads", "Meesho Ads"],
    idealFor: "Sellers spending on ads without clear visibility into profitability.",
    related: ["marketplace-promotions-campaigns", "marketplace-management", "sales-revenue-growth"],
  },
  {
    slug: "marketplace-promotions-campaigns",
    name: "Marketplace Promotions & Campaign Management",
    category: "marketplace-advertising",
    icon: "BadgePercent",
    summary: "Sale events, deals and coupons planned around margin and stock.",
    description:
      "We plan and execute participation in marketplace sale events, lightning deals, coupons and price promotions — aligned with your inventory, margins and advertising so events drive profitable volume.",
    scope: [
      "Annual sale-event calendar (e.g. Prime Day, Big Billion Days, End of Reason Sale)",
      "Deal, coupon and discount setup and nomination",
      "Margin checks before committing to promotional pricing",
      "Coordinating stock and ad budgets ahead of events",
      "Post-event performance review",
    ],
    deliverables: [
      "Promotions calendar",
      "Pre-event readiness checklist",
      "Post-event report with learnings",
    ],
    kpis: ["Event revenue", "Units sold", "Promotional margin", "Deal conversion rate"],
    platforms: MARKETPLACES,
    idealFor: "Brands that want sale events to be planned rather than last-minute.",
    related: ["advertising-performance", "inventory-stock-availability", "sales-target-achievement"],
  },
  {
    slug: "product-content-a-plus-content",
    name: "Product Content, Listing Creatives & A+ Content",
    category: "marketplace-advertising",
    icon: "ImagePlus",
    summary: "Listing images, copy and A+ content that answer buyer questions.",
    description:
      "We produce product copy, listing images, infographics and A+ / Enhanced Brand Content that meet each marketplace's guidelines and help shoppers understand your products quickly.",
    scope: [
      "Title, bullet point and description copywriting",
      "Main images, lifestyle images and infographics to marketplace specs",
      "A+ Content and Brand Store design",
      "Comparison charts and size or usage guides",
      "Refreshing content based on reviews and return reasons",
    ],
    deliverables: [
      "Listing copy per SKU",
      "Image sets sized for each marketplace",
      "A+ Content modules ready to publish",
    ],
    kpis: ["Conversion rate", "Image compliance", "Return rate for content-related reasons"],
    platforms: [...MARKETPLACES, "Shopify"],
    idealFor: "Brands with thin or inconsistent listing content across channels.",
    related: ["product-listing-catalogue-management", "ecommerce-seo-cro", "marketplace-management"],
  },

  // ------------------------------------------------------------
  // E-commerce Website Development
  // ------------------------------------------------------------
  {
    slug: "shopify-woocommerce-custom-development",
    name: "Shopify, WooCommerce & Custom E-commerce Development",
    category: "website-development",
    icon: "CodeXml",
    summary: "Fast, maintainable storefronts on the platform that fits your business.",
    description:
      "We design and build e-commerce websites on Shopify, WooCommerce or a custom stack — choosing the platform around your catalogue, operations and budget, and building it to be fast and easy for your team to manage.",
    scope: [
      "Platform recommendation based on catalogue, operations and budget",
      "Conversion-focused UX and responsive design",
      "Theme development or custom front-end builds",
      "Product, collection, cart and checkout setup",
      "Launch QA, analytics setup and handover training",
    ],
    deliverables: [
      "Production-ready storefront",
      "Admin and content management walkthrough",
      "Technical documentation and handover",
    ],
    platforms: ["Shopify", "Shopify Plus", "WooCommerce", "Next.js / headless"],
    idealFor: "D2C brands launching a store or replacing one that's slow or hard to manage.",
    related: ["payment-shipping-erp-integrations", "ecommerce-seo-cro", "analytics-tracking-bi"],
    relatedCoreServices: ["shopify-development", "ecommerce-website", "headless-commerce", "migration"],
  },
  {
    slug: "payment-shipping-erp-integrations",
    name: "Payment, Shipping, ERP & Inventory Integrations",
    category: "website-development",
    icon: "Workflow",
    summary: "Connect your store to the systems that run your business.",
    description:
      "We integrate your store with payment gateways, shipping aggregators, ERP and inventory systems, so orders, stock and payments flow between tools without manual re-entry.",
    scope: [
      "Payment gateway setup (e.g. Razorpay, PayU, Stripe, PayPal, COD rules)",
      "Shipping aggregator integration (e.g. Shiprocket, Delhivery, ShipStation)",
      "ERP and accounting connections (e.g. Tally, Zoho, NetSuite, Unicommerce)",
      "Multi-channel inventory sync across store and marketplaces",
      "Webhook and API-based custom integrations where no app exists",
    ],
    deliverables: [
      "Integration architecture diagram",
      "Configured and tested integrations",
      "Error-handling and monitoring setup",
    ],
    idealFor: "Growing brands whose team is copying orders and stock data between systems by hand.",
    related: ["shopify-woocommerce-custom-development", "inventory-stock-availability", "order-processing-fulfilment"],
    relatedCoreServices: ["app-development", "custom-web-app"],
  },

  // ------------------------------------------------------------
  // SEO & Growth Marketing
  // ------------------------------------------------------------
  {
    slug: "sales-revenue-growth",
    name: "Sales & Revenue Growth",
    category: "seo-growth",
    icon: "TrendingUp",
    summary: "A clear growth plan across channels, pricing, assortment and ads.",
    description:
      "We review where your revenue comes from today, identify the levers with the most headroom — channels, pricing, assortment, advertising and conversion — and run a prioritized growth plan with you.",
    scope: [
      "Revenue breakdown by channel, category and SKU",
      "Identifying high-potential products and underperformers",
      "Pricing and bundling recommendations",
      "Channel expansion planning",
      "Quarterly growth roadmap with owners and timelines",
    ],
    deliverables: [
      "Growth opportunity assessment",
      "Prioritized quarterly roadmap",
      "Monthly progress review",
    ],
    kpis: ["Revenue", "Average order value", "Repeat purchase rate", "Contribution margin"],
    idealFor: "Brands whose growth has plateaued and who want a structured plan, not ad hoc tactics.",
    related: ["sales-target-achievement", "advertising-performance", "ecommerce-seo-cro"],
    relatedCoreServices: ["cro"],
  },
  {
    slug: "sales-target-achievement",
    name: "Sales Target Achievement",
    category: "seo-growth",
    icon: "Goal",
    summary: "Monthly targets broken down into channel and SKU-level plans.",
    description:
      "We translate your monthly and quarterly sales targets into channel, category and SKU-level goals, track pacing every week, and adjust ads, promotions and stock to close any gap.",
    scope: [
      "Breaking targets down by channel, category and SKU",
      "Weekly pacing against target",
      "Gap analysis and corrective action plans",
      "Aligning stock, ads and promotions with the target",
      "Month-end review and next-month planning",
    ],
    deliverables: [
      "Target breakdown sheet",
      "Weekly pacing tracker",
      "Month-end performance review",
    ],
    kpis: ["Target vs. actual", "Run rate", "Channel contribution"],
    idealFor: "Teams with committed sales targets that need weekly visibility and course correction.",
    related: ["sales-revenue-growth", "marketplace-promotions-campaigns", "reporting-team-management"],
  },
  {
    slug: "ecommerce-seo-cro",
    name: "E-commerce SEO & Conversion Rate Optimization",
    category: "seo-growth",
    icon: "SearchCheck",
    summary: "More qualified organic traffic, and more of it turning into orders.",
    description:
      "We improve how your store ranks for the searches your buyers make, and how well product, collection and checkout pages convert — combining technical SEO, content and structured testing.",
    scope: [
      "Technical SEO audit: crawlability, indexation, site speed, structured data",
      "Collection and product page keyword targeting",
      "Internal linking and site architecture",
      "Funnel analysis and conversion audits",
      "A/B testing of product pages, cart and checkout",
    ],
    deliverables: [
      "SEO and CRO audit with prioritized fixes",
      "Implemented on-page and technical improvements",
      "Testing roadmap and monthly results summary",
    ],
    kpis: ["Organic sessions", "Keyword rankings", "Conversion rate", "Checkout completion rate"],
    platforms: ["Shopify", "WooCommerce", "Custom storefronts"],
    idealFor: "Stores with steady traffic that want more organic reach and better conversion.",
    related: ["analytics-tracking-bi", "product-content-a-plus-content", "sales-revenue-growth"],
    relatedCoreServices: ["seo", "cro", "performance"],
  },

  // ------------------------------------------------------------
  // Analytics & Business Operations
  // ------------------------------------------------------------
  {
    slug: "order-processing-fulfilment",
    name: "Order Processing & Fulfilment",
    category: "analytics-operations",
    icon: "Truck",
    summary: "Orders confirmed, packed and dispatched on time, every day.",
    description:
      "We manage daily order processing across your store and marketplaces — confirmation, label generation, dispatch and tracking — and set up the SOPs that keep dispatch metrics healthy.",
    scope: [
      "Daily order confirmation and processing",
      "Shipping label and manifest generation",
      "Courier pickup coordination and tracking updates",
      "Handling delayed, stuck or undelivered shipments",
      "Packaging and dispatch SOPs for your warehouse team",
    ],
    deliverables: [
      "Daily dispatch summary",
      "Exception report for delayed or failed shipments",
      "Fulfilment SOP documentation",
    ],
    kpis: ["On-time dispatch rate", "Order cycle time", "RTO rate", "Cancellation rate"],
    platforms: [...MARKETPLACES, "Shopify", "WooCommerce"],
    idealFor: "Sellers handling self-fulfilled orders who need dependable daily execution.",
    related: ["inventory-stock-availability", "account-health-management", "payment-shipping-erp-integrations"],
  },
  {
    slug: "payment-reconciliation",
    name: "Payment Reconciliation",
    category: "analytics-operations",
    icon: "Receipt",
    summary: "Know that every order was paid correctly — and recover what wasn't.",
    description:
      "We reconcile marketplace settlements and payment gateway payouts against your orders, flag incorrect fees, commissions and deductions, and raise disputes for discrepancies.",
    scope: [
      "Matching settlements and payouts to orders",
      "Verifying commissions, shipping fees, TCS / TDS and other deductions",
      "Identifying short payments, double charges and missing payouts",
      "Raising disputes with marketplaces and gateways",
      "Monthly reconciliation hand-off for your accounts team",
    ],
    deliverables: [
      "Monthly reconciliation report",
      "Discrepancy and dispute tracker",
      "Fee and commission breakdown by channel",
    ],
    kpis: ["Unreconciled orders", "Discrepancy value", "Disputes resolved"],
    platforms: [...MARKETPLACES, "Payment gateways"],
    idealFor: "Brands that aren't sure their marketplace payouts add up.",
    related: ["returns-claims-reimbursements", "reporting-team-management", "analytics-tracking-bi"],
  },
  {
    slug: "reporting-team-management",
    name: "Reporting & Team Management",
    category: "analytics-operations",
    icon: "ClipboardList",
    summary: "Consistent reporting and a well-run e-commerce team, in-house or ours.",
    description:
      "We set up the reporting cadence your leadership needs, and manage the day-to-day e-commerce team — our specialists, your in-house staff, or both — with clear responsibilities and SOPs.",
    scope: [
      "Daily, weekly and monthly reporting templates",
      "Defining roles, responsibilities and handoffs",
      "Task tracking and SOP documentation",
      "Training in-house team members on marketplace processes",
      "Leadership reviews with clear actions",
    ],
    deliverables: [
      "Reporting pack (daily, weekly, monthly)",
      "Team responsibility matrix",
      "SOP library",
    ],
    idealFor: "Founders and managers who want e-commerce operations to run without daily firefighting.",
    related: ["analytics-tracking-bi", "sales-target-achievement", "ticket-resolution-poc-coordination"],
  },
  {
    slug: "analytics-tracking-bi",
    name: "Analytics, Conversion Tracking & Business Intelligence",
    category: "analytics-operations",
    icon: "ChartLine",
    summary: "Accurate tracking and dashboards you can make decisions from.",
    description:
      "We set up and audit analytics and conversion tracking across your store and ad platforms, then bring store, marketplace and advertising data together into dashboards built around the decisions you need to make.",
    scope: [
      "GA4 and Google Tag Manager setup or audit",
      "Ecommerce event and conversion tracking (Meta, Google Ads, marketplaces)",
      "Server-side tracking and consent configuration where needed",
      "Combining store, marketplace and ad data into one view",
      "Dashboards in Looker Studio, Power BI or similar",
    ],
    deliverables: [
      "Tracking plan and implementation",
      "Tracking QA report",
      "Business dashboards with documentation",
    ],
    platforms: ["GA4", "Google Tag Manager", "Meta Pixel / CAPI", "Looker Studio", "Power BI"],
    idealFor: "Brands that don't trust their numbers or spend hours stitching reports together.",
    related: ["reporting-team-management", "ecommerce-seo-cro", "advertising-performance"],
  },
];

export function getEcommerceServiceBySlug(slug: string): EcommerceService | undefined {
  return ecommerceServices.find((s) => s.slug === slug);
}

export function getEcommerceCategory(slug: EcommerceCategorySlug): EcommerceCategory {
  const category = ecommerceCategories.find((c) => c.slug === slug);
  if (!category) throw new Error(`Unknown e-commerce category: ${slug}`);
  return category;
}

export function getEcommerceServicesByCategory(slug: EcommerceCategorySlug): EcommerceService[] {
  return ecommerceServices.filter((s) => s.category === slug);
}

/** Hub-page FAQs — kept factual about how engagements work, no outcome claims. */
export const ecommerceFaqs: ServiceFaq[] = [
  {
    question: "Can we engage you for just one or two of these services?",
    answer:
      "Yes. Many clients start with a single service — for example advertising management or account health — and add more once the first engagement is running well. We scope each engagement around what you actually need.",
  },
  {
    question: "Which marketplaces and platforms do you work with?",
    answer:
      "We work with Amazon, Flipkart, Myntra and Meesho on the marketplace side, and with Shopify, WooCommerce and custom-built stores for websites. If you sell on another channel, ask us — we'll tell you honestly whether it's a fit.",
  },
  {
    question: "Do you work alongside our in-house team?",
    answer:
      "Yes. We can run operations end to end, or work alongside your team with clearly defined responsibilities, shared trackers and regular review calls.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "Ongoing management is typically a monthly retainer based on the number of channels, SKUs and services involved. Website development and integrations are quoted per project. We share a written scope and quote after the consultation.",
  },
  {
    question: "What do you need from us to get started?",
    answer:
      "Access to the relevant seller accounts, store admin and ad accounts, your current targets, and a point of contact on your side. We begin with an audit so the plan is based on your real data.",
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  content: string[];
}

export const blogCategories = [
  "Shopify Plus",
  "CRO",
  "Performance",
  "Migration",
  "App Development",
  "Industry Insights",
] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "shopify-plus-vs-shopify-when-to-upgrade",
    title: "Shopify Plus vs. Shopify: When Does Upgrading Actually Make Sense?",
    excerpt:
      "GMV thresholds, checkout customization needs, and B2B requirements that signal it's time to move to Plus — and the ones that don't.",
    category: "Shopify Plus",
    author: "Deepanshu Singh Chauhan",
    publishedAt: "2026-05-12",
    readingTime: "8 min read",
    content: [
      "Most brands ask the Shopify Plus question too early or too late. Too early, and you're paying enterprise pricing for problems a well-built standard store could solve. Too late, and checkout limitations are already costing you wholesale deals or international expansion.",
      "The signal isn't revenue alone. We've seen $800K/year brands genuinely need Plus because of complex B2B pricing tiers, and $5M/year brands that don't need it at all because their checkout requirements are simple.",
      "The real triggers are checkout customization (discount stacking, custom shipping logic, payment method restrictions), B2B wholesale with company-specific catalogs, and multi-store requirements across regions or brands sharing inventory.",
      "If none of those apply yet, the money is usually better spent on conversion optimization and performance work on standard Shopify — which is exactly the audit we run before recommending Plus to anyone.",
    ],
  },
  {
    slug: "core-web-vitals-shopify-2026-guide",
    title: "Core Web Vitals on Shopify in 2026: What Actually Moves the Needle",
    excerpt:
      "INP replaced FID as the responsiveness metric. Here's what's actually slowing down Shopify stores in 2026 and how to fix it without a full rebuild.",
    category: "Performance",
    author: "Vikram Shah",
    publishedAt: "2026-04-28",
    readingTime: "11 min read",
    content: [
      "Interaction to Next Paint (INP) has fully replaced First Input Delay in Google's Core Web Vitals, and it's exposed a problem most Shopify stores have been quietly accumulating for years: third-party app scripts that block the main thread.",
      "In our audits across 40+ stores this quarter, the single biggest INP offender wasn't theme code — it was review apps, upsell widgets, and tracking pixels loading synchronously on every page, regardless of whether they were needed.",
      "The fix isn't removing every app. It's auditing what fires on load versus on interaction, deferring non-critical scripts, and in several cases, replacing bloated all-in-one apps with lighter single-purpose alternatives.",
      "LCP issues, on the other hand, are still overwhelmingly an image problem — oversized hero images and product photos served without proper responsive sizing or modern formats like WebP/AVIF.",
    ],
  },
  {
    slug: "magento-to-shopify-migration-checklist",
    title: "The Magento to Shopify Migration Checklist We Use on Every Project",
    excerpt:
      "Data migration, SEO redirect mapping, and the testing window that prevents a launch-day disaster — the exact checklist from 40+ migrations.",
    category: "Migration",
    author: "Ananya Iyer",
    publishedAt: "2026-04-10",
    readingTime: "9 min read",
    content: [
      "Every failed Shopify migration we've been asked to fix after the fact failed for one of three reasons: incomplete data migration, missing SEO redirects, or no real load testing before launch.",
      "Data migration needs to cover more than products — customer accounts, order history, and metafield-equivalent custom data all need a mapping plan before a single record moves.",
      "SEO redirect mapping is the step most agencies rush. Every indexed Magento URL needs a 301 to its Shopify equivalent, not just a blanket redirect to the homepage — that's how brands lose 40-60% of organic traffic in a migration.",
      "Finally, run the new store in parallel on a staging environment under simulated peak traffic before cutover. It's the difference between a quiet Tuesday launch and a Black Friday outage.",
    ],
  },
  {
    slug: "cro-checklist-shopify-pdp",
    title: "The 14-Point CRO Checklist We Run on Every Shopify Product Page",
    excerpt:
      "From above-the-fold trust signals to mobile sticky add-to-cart placement — the exact heuristic audit we use before any A/B test.",
    category: "CRO",
    author: "Deepanshu Singh Chauhan",
    publishedAt: "2026-03-22",
    readingTime: "7 min read",
    content: [
      "Before we run a single A/B test, every PDP goes through the same 14-point heuristic checklist — because testing a page with obvious usability problems wastes traffic you can't get back.",
      "The highest-impact items consistently are: image quality and zoom functionality, trust signals positioned above the fold (not buried in footer badges), and mobile sticky add-to-cart bars that don't cover critical content.",
      "Shipping and return policy visibility matters more than most brands assume — burying it in a footer link measurably increases cart abandonment versus stating it clearly near the buy box.",
      "Once the heuristic issues are fixed, that's when A/B testing starts paying off — testing against a clean baseline instead of confounding results with usability bugs.",
    ],
  },
  {
    slug: "b2b-on-shopify-wholesale-guide",
    title: "B2B on Shopify: Building a Wholesale Portal Without Custom Backend Infrastructure",
    excerpt:
      "How Shopify Plus's native B2B framework replaces what used to require a separate wholesale platform entirely.",
    category: "Shopify Plus",
    author: "Daniel Cole",
    publishedAt: "2026-03-05",
    readingTime: "10 min read",
    content: [
      "For years, brands selling both D2C and wholesale ran two separate platforms — Shopify for consumers, a clunky B2B portal or spreadsheet-based ordering for wholesale accounts.",
      "Shopify Plus's native B2B framework changes that calculus. Company-specific catalogs, custom price lists per account, and self-serve ordering now live in the same admin as your consumer store.",
      "The migration work isn't trivial — payment terms, tax exemptions, and minimum order quantities all need careful configuration — but the result is one platform, one inventory source, and one team managing both channels.",
      "We've now built four of these for clients moving off dedicated wholesale platforms, and in every case the ROI showed up first in reduced order-processing time, not just lower software costs.",
    ],
  },
  {
    slug: "headless-shopify-when-it-makes-sense",
    title: "Headless Shopify: When It's Worth the Complexity (and When It Isn't)",
    excerpt:
      "Hydrogen and custom frontends solve real problems for some brands — and create unnecessary overhead for most others.",
    category: "Performance",
    author: "Vikram Shah",
    publishedAt: "2026-02-18",
    readingTime: "9 min read",
    content: [
      "Headless commerce gets pitched as a universal upgrade. It isn't. For most Shopify brands, a well-optimized theme outperforms headless on time-to-market, maintenance cost, and even raw performance once properly tuned.",
      "Headless earns its complexity when you need frontend experiences Shopify's theme architecture genuinely can't deliver — fully custom checkout flows pre-Checkout Extensibility, multi-brand frontends sharing one commerce backend, or deep integration with a separate content platform.",
      "The maintenance cost is real: you're now responsible for frontend hosting, deployment pipelines, and keeping pace with Shopify's Storefront API changes — work your theme previously handled for you.",
      "Our rule of thumb: if you can't name the specific frontend constraint a theme can't solve, you probably don't need headless yet.",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

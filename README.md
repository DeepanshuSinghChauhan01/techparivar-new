# TechParivar — Shopify Development Agency Website

A premium, conversion-focused marketing site for TechParivar, a Shopify & Shopify Plus
development agency serving D2C brands across the US, UK, Canada, Australia, UAE, and India.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Framer Motion.
CMS (Sanity) and database (PostgreSQL) integrations are wired with clear stubs — the
site runs fully on static content out of the box and upgrades cleanly once you connect
real services.

## Stack

| Layer            | Choice                                      |
|-------------------|----------------------------------------------|
| Framework         | Next.js 16 (App Router, TypeScript)         |
| Styling           | Tailwind CSS v4 (CSS-variable token system) |
| Animation         | Framer Motion                               |
| Icons             | lucide-react                                |
| Content (static)  | `src/content/*.ts` — typed, ready to swap for CMS |
| CMS (optional)    | Sanity (client stubbed in `src/lib/sanity`) |
| Database (optional)| PostgreSQL via `pg` (stubbed in `src/lib/db.ts`) |
| Forms             | React state + `/api/leads` route            |
| Deployment target | Vercel                                      |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional to start
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/                      Routes (App Router)
    page.tsx                Homepage
    about/, contact/, portfolio/, case-studies/, blog/, services/
    shopify-audit/          Free audit lead-gen landing page
    shopify-plus-services/  Dedicated Shopify Plus page
    shopify-app-development/
    api/leads/route.ts      Lead form submission endpoint
    sitemap.ts, robots.ts   Dynamic SEO files
  components/
    layout/                 Header, Footer, Logo, PageHero
    sections/                Hero, Services, Testimonials, FAQ, CTA, forms, etc.
    ui/                      Button, Container, SectionHeading, CountUp, etc.
  content/                  Typed static content: services, case studies, blog,
                            testimonials, industries, process, FAQ
  lib/
    site-config.ts          Brand info, nav, contact details, markets served
    sanity/client.ts        Sanity client + setup instructions
    db.ts                   Postgres pool + leads schema + setup instructions
    utils.ts                cn() class merger
```

## Content model — moving to Sanity CMS

Every piece of editable content (services, case studies, blog posts, testimonials,
FAQs) lives in typed arrays under `src/content/`. This was deliberate: it means the
entire site works and is fully type-checked with zero external dependencies, and
migrating to Sanity is a contained, low-risk change rather than a rewrite.

To connect Sanity:

1. `npx sanity@latest init` in a sibling `/studio` folder (or use Sanity's hosted
   Studio). Define schemas for `post` and `caseStudy` matching the shapes in
   `src/content/blog.ts` and `src/content/case-studies.ts`.
2. Fill in `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in
   `.env.local`.
3. In each page that currently imports from `src/content/*.ts` (e.g.
   `src/app/blog/page.tsx`), swap the static import for a call to
   `sanityClient.fetch(queries.allPosts)`. The shape is designed to match 1:1, so
   no component code should need to change — only the data source.

## Lead capture — moving to PostgreSQL

The multi-step contact form (`src/components/sections/multi-step-contact-form.tsx`)
and the exit-intent capture (`src/components/sections/exit-intent-capture.tsx`) both
POST to `/api/leads`, which calls `insertLead()` in `src/lib/db.ts`.

Until `DATABASE_URL` is set, submissions are logged to the server console instead of
persisted, so nothing breaks in local development — you'll just see a console warning.

To connect Postgres:

1. Provision a database (Vercel Postgres, Neon, Supabase, or RDS all work fine with
   the plain `pg` driver used here — no ORM lock-in).
2. Run the schema in the comment block at the top of `src/lib/db.ts` once against
   your database.
3. Set `DATABASE_URL` in your environment (and in Vercel's project settings for
   production).

From there, every form submission is persisted with a `source` field
(`contact_form` | `shopify_audit` | `exit_intent`) so you can segment leads by
which page or moment captured them.

**Next step to wire up:** add a notification on insert (Slack webhook, email via
Resend/SendGrid, or a CRM push to HubSpot/Pipedrive) — there's a `TODO` marking
exactly where in `src/app/api/leads/route.ts`.

## Integrations to finish before launch

- **Calendly** — `siteConfig.calendlyUrl` in `src/lib/site-config.ts` points to a
  placeholder URL. Replace with your real scheduling link. For a fully embedded
  (not redirect) experience, swap the `Book Free Consultation` buttons for
  Calendly's inline embed widget.
- **WhatsApp** — `siteConfig.whatsapp` drives both the floating WhatsApp button and
  the `/contact` page link. Update to your real WhatsApp Business number.
- **Google Fonts** — this build ships with system-font fallbacks (`Inter`-first
  stack) because the development sandbox this was built in has no network access
  to `fonts.googleapis.com`. On Vercel (which has full internet access), restore
  `next/font/google` for pixel-perfect Inter/Geist rendering:

  ```tsx
  // src/app/layout.tsx
  import { Inter, Geist, JetBrains_Mono } from "next/font/google";
  // ...apply as variable classes on <html>, matching the --font-display /
  // --font-body / --font-mono variables already defined in globals.css
  ```

  No other code needs to change — the CSS variables are already named to match.
- **Analytics** — add Google Analytics / Plausible / PostHog in `src/app/layout.tsx`.
- **Real testimonial videos** — `hasVideo: true` testimonials currently just show a
  "Video" badge; wire to actual hosted video (Vimeo/YouTube/Mux) when available.
- **OG image** — `/public/og-image.jpg` is referenced in metadata but not included;
  add a 1200×630 branded image before launch.

## SEO

- Per-page metadata via Next's `generateMetadata` (services, case studies, blog
  posts all have unique titles/descriptions/canonicals).
- JSON-LD schema: `ProfessionalService` (homepage), `Service` (each service page),
  `Article` (blog posts, case studies), `FAQPage` (FAQ section).
- `sitemap.ts` and `robots.ts` generate dynamically from the same content arrays
  used to render pages — no sitemap drift.
- All marketing pages are statically generated (`○` or `●` in the build output)
  for fast TTFB and strong Core Web Vitals out of the box.
- **Programmatic SEO**: the service and case-study detail pages already use
  `generateStaticParams` against typed arrays — the pattern to extend for
  larger-scale programmatic pages (e.g. "Shopify development for [industry]" or
  "[city] Shopify agency") is to add a new content array and a new
  `app/[segment]/[slug]/page.tsx` following the same shape as
  `app/services/[slug]/page.tsx`.

## Mobile optimization pass

This codebase has been through a dedicated mobile UX/CRO audit and fix pass (320–430px
viewports). Key changes worth knowing about if you're extending the site:

- **`.section-py` utility** (`globals.css`) — the standard vertical rhythm for full-width
  sections: `3rem` mobile → `4rem` at `sm:` → `7rem` at `lg:`. Use this instead of writing
  `py-20 lg:py-28` on new sections, so mobile padding scales down automatically instead of
  matching desktop 1:1.
- **`Button` component** — the base class now only applies `whitespace-nowrap` from `sm:`
  up (`sm:whitespace-nowrap`), not unconditionally. Two buttons in a `flex` row will wrap
  text gracefully on narrow screens instead of overflowing. When placing two buttons
  side-by-side, give each `className="w-full sm:w-auto"` and wrap them in
  `flex flex-col gap-3 sm:flex-row` so they stack cleanly below `sm:`.
- **Header** — the primary CTA is now visible at every breakpoint (a compact "Book Call"
  pill on mobile, the full button at `lg:`), not hidden until the hamburger drawer opens.
  Mobile header height is `h-14` (56px) vs. `h-[72px]` on desktop.
- **Process & Testimonials sections** — restructured for mobile scroll length: Process
  goes straight to a 2-column grid with `line-clamp-2` descriptions instead of stacking 7
  full-height items; Testimonials uses a horizontal `scroll-snap` row on mobile instead of
  stacking all 6 cards vertically.
- **Shopify Audit landing page** — the lead form uses `order-1 lg:order-2` so it appears
  immediately after the headline on mobile (before the marketing copy), since this page's
  entire job is form completion. Desktop keeps the original side-by-side layout.
- **Animation stagger** — per-card `whileInView` delays are capped (`Math.min(...)`)
  across all grid sections so mobile scrolling doesn't trigger a long, visible "trickle in"
  effect on 6-9 item grids.

If you add a new full-width section, the pattern to copy is: `section-py` for padding,
`Math.min(i * step, cap)` for any stagger delay, and check button/text sizing at exactly
320px before considering it done.



1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import into Vercel.
3. Add environment variables from `.env.example` in Vercel's project settings.
4. Deploy — no build configuration changes needed (`next build` is the default).

## Design system reference

All tokens live in `src/app/globals.css` as CSS variables, then exposed to
Tailwind via `@theme inline`. Key tokens:

- Surfaces: `--bg-base`, `--bg-panel`, `--bg-card`
- Text: `--text-primary`, `--text-secondary`, `--text-muted`
- Accents: `--accent-blue` (primary CTA/links), `--accent-teal` (data/metrics),
  `--accent-amber` (ratings)
- Fonts: `--font-display`, `--font-body`, `--font-mono` (used for all numeric
  stats — `.font-mono-tabular` utility class)

Utility classes worth knowing: `.bg-grid` (subtle background grid),
`.bg-spotlight` (radial glow), `.surface-card` (standard card border+bg),
`.text-gradient-accent` (blue→teal gradient text for headline emphasis).

# TechParivar — v2.0 Merge Notes

This document records exactly what changed when the premium Stitch UI and
Client Portal were merged into the existing TechParivar production
website. **The old website is the source of truth** — this merge is
additive on top of it.

## ✅ Nothing was removed

- All 15 original pages still exist at their original URLs (Home, About,
  Services + 9 service detail pages, Shopify App Development, Shopify
  Audit, Shopify Plus Services, Portfolio, Case Studies + detail, Blog +
  detail, Contact, Privacy Policy, Terms).
- All original components (`Header`, `Footer`, `Logo`, `Button`,
  `Container`, `Hero`, `Services`, `Process`, `Testimonials`,
  `Industries`, `WhyChooseUs`, `FAQ`, `ContactCTA`,
  `MultiStepContactForm`, `ExitIntentCapture`, `WhatsAppButton`, etc.)
  are untouched.
- All original navigation items are still present, in the same order.
- SEO is fully intact: metadata, Open Graph/Twitter cards, JSON-LD
  schema, `sitemap.ts`, `robots.ts` (only addition: `/portal` and
  `/login` are now disallowed from indexing, since they're a private
  client area).
- `/api/leads`, the Sanity client stub, and the Postgres stub are
  untouched.

## What changed structurally (and why it's safe)

**Route groups, not new URLs.** Every existing page was moved into a
`src/app/(marketing)/` route group. Parenthesized folders are a Next.js
organizational feature — **they never appear in the URL**. `/about` is
still `/about`. The only effect: the marketing chrome (`Header`,
`Footer`, `WhatsAppButton`, `ExitIntentCapture`) now lives in
`(marketing)/layout.tsx` instead of the root layout, so the new Client
Portal can have its own sidebar/topbar shell instead of the marketing
header stacking on top of it.

## What was imported from the Stitch design

**Design tokens (additive):** `globals.css` gained a second, clearly
labeled block of CSS variables (`--surface*`, `--on-surface*`,
`--vibrant-orange`, `--electric-blue`, `--mint-green`, plus shadcn-style
aliases like `--color-primary`, `--color-card-foreground`, etc.). None of
the *existing* variable names or values were changed, so every current
page renders pixel-identical to before. These new tokens power the
Client Portal and are available anywhere else you want to use them.

**Typography:** Hanken Grotesk (display) and JetBrains Mono (data/labels)
were added as new fonts (`font-portal-display` / `font-portal-data`
utility classes), used throughout the new portal. The site's existing
Inter-based `font-display`/`font-body` are untouched.

**New Button variant:** `<Button variant="accent">` (vibrant orange, used
for the header's Client Portal link) was added alongside the existing
`primary` / `secondary` / `ghost` / `outline` variants — all of which
render exactly as before.

**Navigation:** one new item, "Client Portal" → `/login`, appended to
`navLinks` (both desktop dropdown nav and mobile drawer) and to the
footer's Company column. It's styled distinctly (outlined, orange text)
so it reads as a separate action, not a marketing page.

## New Client Portal features (all requested items)

| Feature | Route |
|---|---|
| Client Login (Google / email / magic link) | `/login` |
| Dashboard | `/portal/dashboard` |
| Project Dashboard (list + detail w/ tabs) | `/portal/projects`, `/portal/projects/[id]` |
| Ticket System / Ticket Tracking (Kanban + table) | `/portal/support` |
| Meeting Booking | `/portal/meetings` |
| Team Collaboration | `/portal/team` |
| File Manager | `/portal/files` |
| Notifications | `/portal/notifications` |
| Knowledge Base | `/portal/knowledge-base` |
| Invoice Center | `/portal/invoices` |
| Store Health | `/portal/store-health` |
| Account Settings | `/portal/settings` |

All portal data is realistic dummy data in `src/data/portal.ts` — swap
for real API/DB calls (you already have the `pg` and Sanity client stubs
wired in `src/lib/`) when ready.

## Files added

```
src/app/(marketing)/                  ← every existing page, moved (not renamed)
src/app/(marketing)/layout.tsx        ← NEW: marketing chrome extracted from root layout
src/app/login/page.tsx                ← NEW
src/app/portal/**                     ← NEW (13 routes)
src/components/portal-ui/*            ← NEW: Radix-based premium UI kit (namespaced, zero collision with src/components/ui)
src/components/portal/*               ← NEW: sidebar, topbar, project tabs, ticket board
src/data/portal.ts                    ← NEW: dummy data for the whole portal
```

## Files modified

```
src/app/layout.tsx           simplified to html/body/fonts/metadata; added 2 new fonts
src/app/globals.css          additive token block + utility classes appended
src/app/robots.ts             added /portal and /login to disallow list
src/lib/site-config.ts        added "Client Portal" nav entry
src/components/layout/header.tsx   added distinct styling for the Client Portal link
src/components/layout/footer.tsx   added Client Portal link to Company column
src/components/ui/button.tsx  added new "accent" variant (existing variants unchanged)
package.json                  added Radix + class-variance-authority + tw-animate-css (all existing deps kept)
```

## Verification performed

- `tsc --noEmit` — 0 errors
- `eslint` — 0 errors
- `next build` — all **34 routes** (15 original + 1 marketing group root +
  13 new portal/login + API/sitemap/robots) compiled and prerendered
  successfully with no regressions.

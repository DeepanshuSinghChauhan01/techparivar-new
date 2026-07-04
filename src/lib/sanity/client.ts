import { createClient } from "@sanity/client";

/**
 * Sanity CMS client.
 *
 * SETUP:
 * 1. Run `npx sanity@latest init` in a separate `/studio` directory (or use
 *    Sanity's hosted Studio) to create your project and get a projectId.
 * 2. Add to `.env.local`:
 *      NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
 *      NEXT_PUBLIC_SANITY_DATASET=production
 *      SANITY_API_TOKEN=your_write_token   (only needed for mutations)
 * 3. Define schemas for `post` (blog) and `caseStudy` matching the shape in
 *    src/content/blog.ts and src/content/case-studies.ts, so you can swap the
 *    static arrays in those files for live `sanityClient.fetch(...)` calls
 *    without changing any page component.
 *
 * Until Sanity is configured, the site runs entirely on the static data in
 * `src/content/*.ts` — nothing here is required for the site to build or run.
 */
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export const isSanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

// Example query helpers — wire these up once schemas exist in Sanity Studio.
export const queries = {
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    title, "slug": slug.current, excerpt, category, author, publishedAt, readingTime, content
  }`,
  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    title, "slug": slug.current, excerpt, category, author, publishedAt, readingTime, content
  }`,
  allCaseStudies: `*[_type == "caseStudy"] | order(publishedAt desc)`,
};

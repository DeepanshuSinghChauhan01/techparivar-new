import type { Metadata } from "next";
import { siteConfig } from "./site-config";

/** Resolve a site-relative path (e.g. "/about") to an absolute URL. */
export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

/**
 * Open Graph + Twitter metadata for a static/listing page. Adds an
 * absolute, page-specific `og:url` (rather than letting it inherit the
 * root layout's homepage URL) and mirrors the page's own title/description
 * into the social tags instead of the generic sitewide defaults.
 */
export function withSocialMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const url = absoluteUrl(path);
  const socialTitle = `${title} — ${siteConfig.name}`;

  return {
    openGraph: {
      type: "website",
      url,
      title: socialTitle,
      description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  };
}

/**
 * Metadata for a dynamic-route page whose slug didn't match any content
 * (services/[slug], blog/[slug], case-studies/[slug]). Explicitly noindexes
 * the response and clears `alternates`/`openGraph` so the 404 doesn't
 * inherit the parent layout's indexable homepage canonical or generic
 * social metadata.
 */
export function notFoundMetadata(entity: string): Metadata {
  const title = `${entity} Not Found`;
  const description = `This ${entity.toLowerCase()} page could not be found.`;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    alternates: {},
    openGraph: { title, description },
    twitter: { title, description },
  };
}

/** Metadata for sections that must never be indexed (auth-gated areas). */
export const noindexMetadata: Metadata = {
  robots: { index: false, follow: false },
};

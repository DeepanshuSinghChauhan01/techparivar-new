import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ContactCTA } from "@/components/sections/contact-cta";
import { blogPosts, getBlogPostBySlug } from "@/content/blog";
import { getServiceBySlug } from "@/content/services";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl, notFoundMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

// Maps each post to the service page(s) most relevant to its topic, so
// readers researching a specific problem can get straight to the related
// service instead of the post being a dead end.
const relatedServiceSlugs: Record<string, string[]> = {
  "shopify-plus-vs-shopify-when-to-upgrade": ["shopify-plus"],
  "core-web-vitals-shopify-2026-guide": ["performance"],
  "magento-to-shopify-migration-checklist": ["migration"],
  "cro-checklist-shopify-pdp": ["cro"],
  "b2b-on-shopify-wholesale-guide": ["shopify-plus"],
  "headless-shopify-when-it-makes-sense": ["headless-commerce"],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return notFoundMetadata("Blog Post");

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/blog/${post.slug}`),
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedServices = (relatedServiceSlugs[post.slug] ?? [])
    .map((s) => getServiceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="border-b border-border-subtle bg-base py-16 lg:py-20">
        <Container className="max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent-blue"
          >
            <ArrowLeft className="size-3.5" />
            Back to blog
          </Link>

          <span className="mt-6 block font-mono text-xs uppercase tracking-[0.1em] text-accent-teal">
            {post.category}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-5 flex items-center gap-4 border-b border-border-subtle pb-6 text-sm text-text-muted">
            <span>{post.author}</span>
            <span>·</span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {post.readingTime}
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-5">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-text-secondary">
                {paragraph}
              </p>
            ))}
          </div>

          {relatedServices.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border-subtle pt-6 text-sm text-text-secondary">
              <span>Related:</span>
              {relatedServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="rounded-full border border-border-default px-3 py-1.5 text-accent-blue transition-colors hover:border-accent-blue/60"
                >
                  {service.name}
                </Link>
              ))}
              <Link
                href="/case-studies"
                className="rounded-full border border-border-default px-3 py-1.5 text-accent-blue transition-colors hover:border-accent-blue/60"
              >
                See client results
              </Link>
            </div>
          )}
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}

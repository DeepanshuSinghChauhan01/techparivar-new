import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ContactCTA } from "@/components/sections/contact-cta";
import { blogPosts, getBlogPostBySlug } from "@/content/blog";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
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

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

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
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}

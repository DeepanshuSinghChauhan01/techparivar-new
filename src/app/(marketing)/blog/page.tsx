import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { blogPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Shopify Plus, CRO, performance, and migration insights from the TechParivar engineering and strategy team.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Shopify insights from the team building on it daily"
        description="Practical, technical writing on Shopify Plus, CRO, performance, and migrations — no recycled listicles."
      />

      <section className="section-py border-b border-border-subtle bg-base">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-border-subtle bg-card p-7 transition-colors hover:border-accent-blue/50"
              >
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-accent-teal">
                  {post.category}
                </span>
                <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-text-primary">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4">
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {post.readingTime}
                    </span>
                  </div>
                  <ArrowRight className="size-4 text-text-muted transition-all group-hover:translate-x-1 group-hover:text-accent-blue" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <section className="section-py bg-base">
      <Container className="max-w-xl text-center">
        <h1 className="font-display text-4xl font-semibold text-text-primary">Page not found</h1>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="primary">
            Back to home
          </Button>
          <Link href="/services" className="text-sm text-accent-blue hover:underline">
            Browse services →
          </Link>
        </div>
      </Container>
    </section>
  );
}

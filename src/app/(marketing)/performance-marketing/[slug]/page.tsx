import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail, serviceDetailMetadata } from "@/components/service-pages/service-detail";
import { MetricGrid } from "@/components/service-pages/metric-grid";
import {
  getPerformanceServiceBySlug,
  performanceMetrics,
  performanceServices,
  type PerformanceService,
} from "@/content/performance-marketing";
import { getEcommerceServiceBySlug } from "@/content/ecommerce-services";
import { getServiceBySlug } from "@/content/services";
import { notFoundMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return performanceServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getPerformanceServiceBySlug(slug);
  if (!service) return notFoundMetadata("Service");
  return serviceDetailMetadata(service, `/performance-marketing/${service.slug}`);
}

export default async function PerformanceServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getPerformanceServiceBySlug(slug);
  if (!service) notFound();

  const related = service.related
    .map(getPerformanceServiceBySlug)
    .filter((s): s is PerformanceService => Boolean(s));
  const ecommerceLinks = (service.relatedEcommerce ?? [])
    .map(getEcommerceServiceBySlug)
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.name, href: `/ecommerce-services/${s.slug}` }));
  const coreLinks = (service.relatedCoreServices ?? [])
    .map(getServiceBySlug)
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ label: s.name, href: `/services/${s.slug}` }));

  return (
    <ServiceDetail
      service={service}
      path={`/performance-marketing/${service.slug}`}
      eyebrow="Performance Marketing"
      serviceType="Performance Marketing"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Performance Marketing", href: "/performance-marketing" },
      ]}
      related={related}
      relatedBasePath="/performance-marketing"
      relatedTags={(s) => s.platforms?.slice(0, 3)}
      moreLink={{ label: "All performance marketing services", href: "/performance-marketing#services" }}
      crossLinks={[
        { heading: "Related e-commerce services", links: ecommerceLinks },
        { heading: "Related development services", links: coreLinks },
      ]}
    >
      <MetricGrid
        metrics={performanceMetrics}
        title="How this service is measured"
        description="We report on these metrics throughout the engagement, with targets agreed after the initial audit."
      />
    </ServiceDetail>
  );
}

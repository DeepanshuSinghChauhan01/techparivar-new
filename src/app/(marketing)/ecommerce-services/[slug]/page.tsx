import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail, serviceDetailMetadata } from "@/components/service-pages/service-detail";
import {
  ecommerceServices,
  getEcommerceCategory,
  getEcommerceServiceBySlug,
  type EcommerceService,
} from "@/content/ecommerce-services";
import { getServiceBySlug } from "@/content/services";
import { notFoundMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return ecommerceServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getEcommerceServiceBySlug(slug);
  if (!service) return notFoundMetadata("Service");
  return serviceDetailMetadata(service, `/ecommerce-services/${service.slug}`);
}

export default async function EcommerceServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getEcommerceServiceBySlug(slug);
  if (!service) notFound();

  const category = getEcommerceCategory(service.category);
  const related = service.related
    .map(getEcommerceServiceBySlug)
    .filter((s): s is EcommerceService => Boolean(s));
  const coreServices = (service.relatedCoreServices ?? [])
    .map(getServiceBySlug)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <ServiceDetail
      service={service}
      path={`/ecommerce-services/${service.slug}`}
      eyebrow={category.shortName}
      serviceType={category.name}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "E-commerce Services", href: "/ecommerce-services" },
        { label: category.shortName, href: `/ecommerce-services#${category.slug}` },
      ]}
      related={related}
      relatedBasePath="/ecommerce-services"
      moreLink={{ label: `More in ${category.shortName}`, href: `/ecommerce-services#${category.slug}` }}
      crossLinks={[
        {
          heading: "Related development services",
          links: coreServices.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
        },
      ]}
    />
  );
}

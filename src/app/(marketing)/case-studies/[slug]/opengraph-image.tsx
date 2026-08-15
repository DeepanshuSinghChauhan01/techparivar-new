import { renderOgImage, ogImageSize, ogImageContentType } from "@/app/opengraph-image-shared";
import { getCaseStudyBySlug } from "@/content/case-studies";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);

  return renderOgImage({
    eyebrow: cs ? `Case Study · ${cs.industry}` : undefined,
    headline: cs?.client,
    subheadline: cs ? `${cs.heroStat.value} ${cs.heroStat.label}` : undefined,
  });
}

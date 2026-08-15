import { renderOgImage, ogImageSize, ogImageContentType } from "@/app/opengraph-image-shared";
import { getBlogPostBySlug } from "@/content/blog";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  return renderOgImage({
    eyebrow: post?.category,
    headline: post?.title,
    subheadline: post?.excerpt,
    headlineFontSize: 44,
  });
}

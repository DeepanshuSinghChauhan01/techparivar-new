import { renderOgImage, ogImageSize, ogImageContentType } from "./opengraph-image-shared";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "TechParivar — Shopify & Shopify Plus Development Agency";

export default function Image() {
  return renderOgImage();
}

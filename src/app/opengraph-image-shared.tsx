import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

interface RenderOgImageOptions {
  /** Small uppercase label above the headline (e.g. a category or "Case Study"). */
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  /** Lower this for longer, variable-length titles (e.g. blog post headlines) to avoid overflow. */
  headlineFontSize?: number;
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export function renderOgImage({
  eyebrow,
  headline = "Shopify & Shopify Plus Development Agency",
  subheadline = "Build, migrate, and scale high-performing Shopify stores.",
  headlineFontSize = 56,
}: RenderOgImageOptions = {}) {
  const displayHeadline = truncate(headline, 100);
  const displaySubheadline = subheadline ? truncate(subheadline, 140) : subheadline;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #06090f 0%, #0d1420 100%)",
          color: "#f5f7fa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#5b8def",
              display: "flex",
            }}
          />
          TechParivar
        </div>
        {eyebrow && (
          <div
            style={{
              marginTop: 32,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#5b8def",
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            marginTop: eyebrow ? 16 : 40,
            fontSize: headlineFontSize,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {displayHeadline}
        </div>
        {displaySubheadline && (
          <div style={{ marginTop: 28, fontSize: 28, color: "#9aa4b2", maxWidth: 820, lineHeight: 1.3 }}>
            {displaySubheadline}
          </div>
        )}
      </div>
    ),
    { ...ogImageSize }
  );
}

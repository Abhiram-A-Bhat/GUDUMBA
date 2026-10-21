import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!siteUrl) return [];
  const paths = ["/", "/shop", "/collections", "/our-story", "/privacy", "/terms", "/refund-policy", "/shipping", "/cookie-policy", "/contact"];
  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.6,
  }));
}

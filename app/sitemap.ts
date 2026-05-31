import type { MetadataRoute } from "next";
import { allDocPages } from "@/lib/docs-nav";
import { absoluteUrl, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = allDocPages().map((page) => ({
    url: absoluteUrl(page.href),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page.href === "/docs/quick-start" ? 0.9 : 0.7,
  }));

  return [
    { url: site.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/try"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    ...docs,
  ];
}

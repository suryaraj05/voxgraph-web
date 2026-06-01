import type { Metadata } from "next";
import { absoluteUrl, site } from "@/lib/site";

type PageSeoOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

/** Shared metadata fields for indexable pages */
export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
}: PageSeoOptions): Metadata {
  const canonical = absoluteUrl(path);
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;

  return {
    title,
    description,
    keywords: [...site.keywords, ...keywords],
    authors: [{ name: site.author, url: site.authorUrl }],
    creator: site.author,
    publisher: site.author,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: site.name,
      title: fullTitle,
      description,
      images: [
        {
          url: absoluteUrl("/opengraph-image.png"),
          width: 1200,
          height: 630,
          alt: `${site.name} — ${site.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl("/twitter-image.png")],
    },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export function rootMetadata(): Metadata {
  const verification: Metadata["verification"] = {};
  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  }
  if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
    verification.other = {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    };
  }

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.tagline} by ${site.author}`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    keywords: [...site.keywords],
    authors: [{ name: site.author, url: site.authorUrl }],
    creator: site.author,
    publisher: site.author,
    category: "technology",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: site.url,
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
      images: [
        {
          url: absoluteUrl("/opengraph-image.png"),
          width: 1200,
          height: 630,
          alt: `${site.name} — open-source voice AI starter kit`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
      images: [absoluteUrl("/twitter-image.png")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: site.url,
    },
    verification: Object.keys(verification).length > 0 ? verification : undefined,
  };
}

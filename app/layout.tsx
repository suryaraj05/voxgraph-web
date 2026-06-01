import type { Viewport } from "next";
import { Inter, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { GlowBackground } from "@/components/GlowBackground";
import { StructuredData } from "@/components/StructuredData";
import { rootMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["500", "600"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = rootMetadata();

export const viewport: Viewport = {
  themeColor: "#050d1a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="author" href={site.authorUrl} />
        <link rel="me" href={site.authorLinkedIn} />
        <link rel="me" href={site.authorUrl} />
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${dmSans.variable} ${jetbrains.variable} min-h-screen font-sans`}>
        <GlowBackground />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "../globals.css";
import { SITE, jsonLdScript, siteJsonLd } from "@/lib/jyxdi";
import SiteNav from "./jyxdi/_components/SiteNav";
import SiteFooter from "./jyxdi/_components/SiteFooter";

// Root layout for the Art by Jyxdi storefront (jyxdi.modevz.ca). It's a
// separate root layout from the MoDevz site so none of the MoDevz header,
// footer, analytics or structured data appears on the client's store.

const FONTS = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: { default: `${SITE.brand} | Digital art, canvas paintings and live event painting`, template: `%s | ${SITE.brand}` },
  description: SITE.description,
  applicationName: SITE.brand,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  keywords: ["digital art", "canvas paintings", "art commissions", "live painting", "live wedding painter", "event painter", "custom artwork"],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE.siteUrl,
    siteName: SITE.brand,
    title: SITE.brand,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: SITE.brand, description: SITE.description },
};

export const viewport: Viewport = {
  themeColor: "#f7f1ea",
};

export default function JyxdiLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href={FONTS} />
        {/* Brand colours live here so the whole palette can be matched to
            the Instagram feed in one place. */}
        <style>{`
          :root {
            --jx-bg: #f7f1ea;
            --jx-surface: #fffaf4;
            --jx-ink: #241c18;
            --jx-muted: #6f625a;
            --jx-line: #e7dbcf;
            --jx-accent: #b4532a;
            --jx-accent-soft: #f1d9c8;
            --jx-sage: #7d8b6a;
          }
          .jx-serif { font-family: Fraunces, Georgia, serif; }
        `}</style>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(siteJsonLd()) }} />
      </head>
      <body
        className="min-h-screen bg-[var(--jx-bg)] text-[var(--jx-ink)] antialiased"
        style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
      >
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

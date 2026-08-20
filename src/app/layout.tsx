import type { Metadata } from "next";
import { GoogleTagManager } from '@next/third-parties/google'
import "./globals.css";
import { Providers } from './providers'
import Header from './components/Header';
import Footer from "./components/Footer";

const anton = "https://fonts.googleapis.com/css2?family=Anton&display=swap";

export const metadata: Metadata = {
  title: { default: "MoDevz | Technical Consulting for Growing Businesses", template: "%s | MoDevz" },
  description: "Technical consulting, custom software, automation, cybersecurity, and digital strategy for small and growing businesses in Canada and the United States.",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  authors: [{ name: "Joshua Xavier", url: "https://josh.modevz.ca" }],
  creator: "Joshua Xavier",
  publisher: "MoDevz",
  keywords: ["technical consulting", "software development", "business automation", "cybersecurity consulting", "digital transformation", "small business technology consulting"],
  generator: "Next.js",
  applicationName: "MoDevz",
  metadataBase: new URL("https://modevz.ca"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "en_CA", url: "https://modevz.ca", siteName: "MoDevz",
    title: "MoDevz | Technical Consulting for Growing Businesses",
    description: "Practical technology strategy and implementation for businesses that need to modernize, automate, and grow.",
    images: [{ url: "/mo.svg", alt: "MoDevz" }],
  },
  twitter: {
    card: "summary_large_image", title: "MoDevz | Technical Consulting for Growing Businesses",
    description: "Practical technology strategy and implementation for businesses that need to modernize, automate, and grow.", images: ["/mo.svg"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href={anton} />
      </head>
      <body style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <Header />
      <GoogleTagManager gtmId="G-BSBPSM99P8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization", "@id": "https://modevz.ca/#organization",
                name: "MoDevz", alternateName: "MoConsultantz", url: "https://modevz.ca",
                logo: "https://modevz.ca/mo.svg", email: "josh@modevz.ca",
                founder: { "@type": "Person", name: "Joshua Xavier", url: "https://josh.modevz.ca" },
                sameAs: ["https://www.linkedin.com/company/75720064/", "https://github.com/joxavier", "https://www.youtube.com/channel/UCas-owpj6LrZcLNESKiPKLA"]
              },
              {
                "@type": "WebSite", "@id": "https://modevz.ca/#website", url: "https://modevz.ca",
                name: "MoDevz", publisher: { "@id": "https://modevz.ca/#organization" }, inLanguage: "en-CA"
              }
            ]
          }).replace(/</g, "\\u003c") }}
        />
        <Providers>
          {children}
        </Providers>
      <Footer />  
      </body>
    </html>
  );
}

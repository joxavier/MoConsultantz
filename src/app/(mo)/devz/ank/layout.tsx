import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ank | The Business Account for Canadian Small Businesses",
  description: "Ank is a digital business account built for Canadian small business owners: payments, cards, invoicing, and tax-ready books in one place.",
  alternates: { canonical: "https://ank.modevz.ca" },
  openGraph: {
    title: "Ank | The Business Account for Canadian Small Businesses",
    description: "Run your business money from one app. Built in Canada for small business owners.",
    url: "https://ank.modevz.ca",
    siteName: "Ank",
  },
  // Keep out of search results until launch.
  robots: { index: false, follow: false },
};

export default function AnkLayout({ children }: { children: React.ReactNode }) {
  return children;
}

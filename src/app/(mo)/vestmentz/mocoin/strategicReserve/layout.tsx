import type { Metadata } from "next";

// Metadata only: the page is a client component and renders its own
// structured data (breadcrumbs, FAQ).
export const metadata: Metadata = {
  title: "MoCoin Strategic Reserve: Live Holdings & Market Cap",
  description:
    "Live holdings of the MoCoin Strategic Reserve: stocks, crypto and cash at live prices, MoCoin's market cap, reserve backing and related news, in CAD, USD or BTC.",
  alternates: { canonical: "/vestmentz/mocoin/strategicReserve" },
  keywords: ["MoCoin Strategic Reserve", "MoCoin market cap", "MoCoin treasury", "crypto treasury", "reserve backing", "MoDevz"],
  openGraph: {
    title: "MoCoin Strategic Reserve: Live Holdings & Market Cap",
    description: "Every asset backing MoCoin at live prices, with MoCoin's market cap and reserve backing.",
    url: "https://modevz.ca/vestmentz/mocoin/strategicReserve",
    images: [{ url: "/mo-dark.png", alt: "MoCoin Strategic Reserve" }],
  },
};

export default function StrategicReserveLayout({ children }: { children: React.ReactNode }) {
  return children;
}

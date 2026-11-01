import type { Metadata } from "next";

// Metadata only: the MoCoin page is a client component. Its structured data
// (breadcrumbs, FAQ) is rendered by the page itself.
export const metadata: Metadata = {
  title: "MoCoin: Solana Token Backed by a Strategic Reserve",
  description:
    "MoCoin is MoDevz's Solana token: live price and market cap, contract address, how to buy on Raydium, MoPass tiers and the Strategic Reserve that backs it.",
  alternates: { canonical: "/vestmentz/mocoin" },
  keywords: ["MoCoin", "MoCoin price", "MoCoin market cap", "Solana token", "MoDevz", "Strategic Reserve", "MoPass"],
  openGraph: {
    title: "MoCoin: Solana Token Backed by a Strategic Reserve",
    description: "Live MoCoin price and market cap, contract address, MoPass tiers and the reserve behind it.",
    url: "https://modevz.ca/vestmentz/mocoin",
    images: [{ url: "/mo-dark.png", alt: "MoCoin" }],
  },
};

export default function MoCoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}

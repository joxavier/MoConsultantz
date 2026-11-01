import treasuryConfig from "@/data/treasuryConfig.json";

// Breadcrumbs, FAQs and structured data for the MoCoin page and the
// Strategic Reserve page. The same FAQ text is shown on the page and sent as
// FAQPage JSON-LD, so search engines and AI assistants read what visitors see.

export const SITE_URL = "https://modevz.ca";
export const MOCOIN_MINT = treasuryConfig.mocoin.mintAddress;
export const MOCOIN_POOL = treasuryConfig.mocoin.poolAddress;
export const RAYDIUM_SWAP_URL = `https://raydium.io/swap/?inputMint=sol&outputMint=${MOCOIN_MINT}`;

export type Crumb = { name: string; path: string };
export type Faq = { question: string; answer: string };

export const MOCOIN_CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "MoVestmentz", path: "/vestmentz" },
  { name: "MoCoin", path: "/vestmentz/mocoin" },
];

export const RESERVE_CRUMBS: Crumb[] = [...MOCOIN_CRUMBS, { name: "Strategic Reserve", path: "/vestmentz/mocoin/strategicReserve" }];

type ConfigAsset = { name: string; kind: string; category: string };

// "stocks such as Enbridge, NexGen Energy, …": built from the config so the
// answer stays true when holdings change.
function reserveHoldingsSummary() {
  const assets = treasuryConfig.assets as ConfigAsset[];
  const groups = new Map<string, string[]>();
  for (const asset of assets) {
    if (asset.kind === "onchain") continue;
    const list = groups.get(asset.category) ?? [];
    list.push(asset.name.replace(/\s*\(.*?\)/g, ""));
    groups.set(asset.category, list);
  }
  return Array.from(groups, ([category, names]) => `${category}: ${names.join(", ")}`).join("; ");
}

export const MOCOIN_FAQS: Faq[] = [
  {
    question: "What is MoCoin?",
    answer:
      "MoCoin is MoDevz's token on the Solana blockchain. It can be used to pay for MoDevz consulting plans, unlocks MoPass membership tiers, and is backed by the MoCoin Strategic Reserve.",
  },
  {
    question: "What is the MoCoin contract address?",
    answer: `MoCoin's Solana token mint address is ${MOCOIN_MINT}. Its main liquidity pool is ${MOCOIN_POOL} on Raydium.`,
  },
  {
    question: "How do I buy MoCoin?",
    answer:
      "Swap SOL for MoCoin on Raydium (raydium.io) using the mint address above, from a Solana wallet such as Phantom or Solflare. Always check the mint address before swapping.",
  },
  {
    question: "What backs MoCoin?",
    answer:
      "The MoCoin Strategic Reserve: a treasury of stocks, crypto, cash and private investments. Its holdings, live value and how much of MoCoin's market cap it covers are published at modevz.ca/vestmentz/mocoin/strategicReserve.",
  },
  {
    question: "What are the MoPass tiers?",
    answer:
      "Holding MoCoin unlocks MoPass tiers: Pioneer (10,000 MoCoin) for governance voting and community access, Builder (50,000 MoCoin) for launchpad allocations and priority support, and Executive (250,000 MoCoin) for the highest allocation multiplier and revenue share from the Strategic Reserve.",
  },
  {
    question: "Can I pay for MoDevz services with MoCoin?",
    answer:
      "Yes. MoDevz consulting plans are priced in MoCoin: the Technical Clarity Sprint is 5,000 MoCoin, the Growth Systems Build 10,000 MoCoin and the Digital Transformation Partnership 20,000 MoCoin.",
  },
];

export const RESERVE_FAQS: Faq[] = [
  {
    question: "What is the MoCoin Strategic Reserve?",
    answer:
      "The Strategic Reserve is the treasury that backs MoCoin. This page tracks every holding at live prices and compares the reserve's total value with MoCoin's market cap.",
  },
  {
    question: "What assets does the Strategic Reserve hold?",
    answer: `${reserveHoldingsSummary()}. It also holds MoCoin and MoCoin liquidity pool positions on Solana.`,
  },
  {
    question: "How is MoCoin's market cap calculated?",
    answer:
      "MoCoin's price comes from its Solana liquidity pools (via DexScreener). Market cap is that price times the circulating supply, which, as on CoinMarketCap, leaves out the MoCoin held by the treasury.",
  },
  {
    question: "What does Reserve Backing mean?",
    answer:
      "Reserve Backing is the reserve's total value as a percentage of MoCoin's market cap. At 100% the reserve is worth as much as every circulating MoCoin combined.",
  },
  {
    question: "How often are prices updated?",
    answer:
      "Prices refresh every five minutes while the page is open: stocks and crypto from Yahoo Finance, MoCoin from its Solana pools, and the USD/CAD rate live. Values can be shown in Canadian dollars, US dollars or bitcoin.",
  },
  {
    question: "Is this investment advice?",
    answer:
      "No. The Strategic Reserve page is a transparency report. Projections compound the last month's return and are illustrations, not forecasts.",
  },
];

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

// Escapes "<" so text can't close the <script> tag it is embedded in.
export const jsonLdScript = (data: object) => JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c");

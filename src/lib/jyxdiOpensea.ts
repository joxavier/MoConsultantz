import { SITE } from "@/lib/jyxdi";

// Jyxdi's Spirit Gates NFTs, read from the OpenSea API for the Art Catalog.
// Needs OPENSEA_API_KEY (free from OpenSea's developer portal). Without it, or
// if OpenSea is unreachable, the catalog just links to the collection and
// profile on OpenSea.
const OPENSEA_API = "https://api.opensea.io/api/v2";
const MAX_ITEMS = 12;

export type OpenSeaItem = {
  name: string;
  image: string;
  url: string;
};

type OpenSeaNft = {
  identifier?: string;
  name?: string | null;
  image_url?: string | null;
  display_image_url?: string | null;
  opensea_url?: string | null;
  is_disabled?: boolean;
  is_nsfw?: boolean;
};

const isHttps = (value?: string | null): value is string => Boolean(value && value.startsWith("https://"));

export function toOpenSeaItems(nfts: OpenSeaNft[]): OpenSeaItem[] {
  return nfts
    .filter((nft) => !nft.is_disabled && !nft.is_nsfw)
    .map((nft) => ({
      name: nft.name || `Spirit Gates #${nft.identifier ?? ""}`.trim(),
      image: nft.display_image_url || nft.image_url || "",
      url: nft.opensea_url || SITE.opensea.collection,
    }))
    .filter((item) => isHttps(item.image) && isHttps(item.url))
    .slice(0, MAX_ITEMS);
}

export async function getSpiritGatesNfts(): Promise<OpenSeaItem[]> {
  const apiKey = process.env.OPENSEA_API_KEY;
  if (!apiKey) return [];
  try {
    const response = await fetch(`${OPENSEA_API}/collection/${SITE.opensea.collectionSlug}/nfts?limit=${MAX_ITEMS * 2}`, {
      headers: { Accept: "application/json", "x-api-key": apiKey },
      // New mints don't need to appear instantly; refresh hourly.
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`OpenSea responded ${response.status}`);
    const payload = await response.json();
    return toOpenSeaItems(payload.nfts || []);
  } catch (error: any) {
    console.error("OpenSea fetch error:", error.message);
    return [];
  }
}

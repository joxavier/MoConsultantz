import treasuryConfig from "@/data/treasuryConfig.json";
import type { DiscoveredPool } from "@/lib/treasury/types";

// Pool discovery: finds every Solana pool containing MoCoin, then every pool
// for the tokens MoCoin is paired with (one hop out), so pairs like MP/MoCoin
// and then MP/Blot are picked up without hard-coding their addresses.
const DEXSCREENER_TOKENS_URL = "https://api.dexscreener.com/latest/dex/tokens";
const RAYDIUM_POOL_IDS_URL = "https://api-v3.raydium.io/pools/info/ids";
// DexScreener accepts up to 30 comma-separated token addresses per request.
const MAX_TOKENS_PER_REQUEST = 30;
const MAX_POOLS = 30;

// Quote tokens almost everything pairs with; following them out a hop would
// pull in thousands of unrelated pools.
const COMMON_QUOTE_MINTS = new Set([
  "So11111111111111111111111111111111111111112", // wrapped SOL
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
]);

type DexScreenerToken = { address: string; symbol: string; name?: string };
type DexScreenerPair = {
  chainId: string;
  dexId: string;
  url?: string;
  pairAddress: string;
  baseToken: DexScreenerToken;
  quoteToken: DexScreenerToken;
  priceUsd?: string;
  liquidity?: { usd?: number; base?: number; quote?: number };
};

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

async function fetchPairsForTokens(mints: string[]): Promise<DexScreenerPair[]> {
  const batches = await Promise.all(
    chunk(mints, MAX_TOKENS_PER_REQUEST).map(async (batch) => {
      const response = await fetch(`${DEXSCREENER_TOKENS_URL}/${batch.join(",")}`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`DexScreener token lookup failed with ${response.status}`);
      }
      const payload = await response.json();
      return (payload.pairs || []) as DexScreenerPair[];
    })
  );
  return batches.flat().filter((pair) => pair.chainId === "solana");
}

// Raydium is the only DEX here whose pool info exposes an LP mint, which is
// what lets the treasury's share of a pool be read from its wallet. Pools on
// other DEXes, and Raydium concentrated-liquidity pools (positions are NFTs),
// are still listed but can't be valued this way.
async function fetchRaydiumLpMints(poolIds: string[]): Promise<Record<string, string>> {
  if (!poolIds.length) return {};

  const response = await fetch(`${RAYDIUM_POOL_IDS_URL}?ids=${poolIds.join(",")}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Raydium pool lookup failed with ${response.status}`);
  }

  const payload = await response.json();
  const lpMints: Record<string, string> = {};
  for (const pool of payload.data || []) {
    if (pool?.id && pool?.type === "Standard" && pool?.lpMint?.address) {
      lpMints[pool.id] = pool.lpMint.address;
    }
  }
  return lpMints;
}

function toPool(pair: DexScreenerPair, hop: 0 | 1): DiscoveredPool {
  return {
    pairAddress: pair.pairAddress,
    dexId: pair.dexId,
    url: pair.url || `https://dexscreener.com/solana/${pair.pairAddress}`,
    label: `${pair.baseToken.symbol}/${pair.quoteToken.symbol}`,
    baseToken: { address: pair.baseToken.address, symbol: pair.baseToken.symbol },
    quoteToken: { address: pair.quoteToken.address, symbol: pair.quoteToken.symbol },
    liquidityUsd: pair.liquidity?.usd || 0,
    priceUsd: Number(pair.priceUsd) || 0,
    hop,
    lpMint: null,
  };
}

export async function discoverPools(): Promise<DiscoveredPool[]> {
  const moCoinMint = treasuryConfig.mocoin.mintAddress;
  const extraMints: string[] = treasuryConfig.poolScan.extraTokenMints;

  const firstHop = await fetchPairsForTokens([moCoinMint, ...extraMints]);

  const counterpartMints = new Set<string>();
  for (const pair of firstHop) {
    for (const token of [pair.baseToken, pair.quoteToken]) {
      if (token.address !== moCoinMint && !COMMON_QUOTE_MINTS.has(token.address)) {
        counterpartMints.add(token.address);
      }
    }
  }
  extraMints.forEach((mint) => counterpartMints.delete(mint));

  const secondHop = counterpartMints.size ? await fetchPairsForTokens(Array.from(counterpartMints)) : [];

  const pools = new Map<string, DiscoveredPool>();
  firstHop.forEach((pair) => pools.set(pair.pairAddress, toPool(pair, 0)));
  secondHop.forEach((pair) => {
    if (!pools.has(pair.pairAddress)) pools.set(pair.pairAddress, toPool(pair, 1));
  });

  const sorted = Array.from(pools.values())
    .sort((a, b) => a.hop - b.hop || b.liquidityUsd - a.liquidityUsd)
    .slice(0, MAX_POOLS);

  const raydiumIds = sorted.filter((pool) => pool.dexId === "raydium").map((pool) => pool.pairAddress);
  const lpMints = await fetchRaydiumLpMints(raydiumIds).catch((error) => {
    console.error("Raydium LP mint lookup failed:", error.message);
    return {} as Record<string, string>;
  });

  const configuredPool = treasuryConfig.mocoin.poolAddress;
  const configuredLpMint = treasuryConfig.mocoin.lpMintAddress;

  return sorted.map((pool) => ({
    ...pool,
    lpMint: (pool.pairAddress === configuredPool && configuredLpMint) || lpMints[pool.pairAddress] || null,
  }));
}

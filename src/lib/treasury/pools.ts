import treasuryConfig from "@/data/treasuryConfig.json";
import { getTrackedPools } from "@/lib/trackedPools";
import type { DiscoveredPool } from "@/lib/treasury/types";

// Pool discovery: finds every Solana pool containing MoCoin, then every pool
// for the tokens MoCoin is paired with (one hop out), so pairs like MP/MoCoin
// and then MP/Blot are picked up without hard-coding their addresses.
//
// Sources: DexScreener (by token), GeckoTerminal (MoCoin's pools, which can
// include pools DexScreener hasn't indexed) and the always-tracked list
// ("MoCoin Pools" sheet tab), looked up by address on both.
const DEXSCREENER_TOKENS_URL = "https://api.dexscreener.com/latest/dex/tokens";
const DEXSCREENER_PAIRS_URL = "https://api.dexscreener.com/latest/dex/pairs/solana";
const GECKO_BASE_URL = "https://api.geckoterminal.com/api/v2/networks/solana";
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

async function fetchPairsByAddress(addresses: string[]): Promise<DexScreenerPair[]> {
  const batches = await Promise.all(
    chunk(addresses, MAX_TOKENS_PER_REQUEST).map(async (batch) => {
      const response = await fetch(`${DEXSCREENER_PAIRS_URL}/${batch.join(",")}`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`DexScreener pair lookup failed with ${response.status}`);
      const payload = await response.json();
      return ((payload.pairs || (payload.pair ? [payload.pair] : [])) as DexScreenerPair[]).filter(Boolean);
    })
  );
  return batches.flat().filter((pair) => pair.chainId === "solana");
}

// ---------- GeckoTerminal ----------

type GeckoPool = {
  attributes?: { address?: string; name?: string; reserve_in_usd?: string; base_token_price_usd?: string };
  relationships?: {
    base_token?: { data?: { id?: string } };
    quote_token?: { data?: { id?: string } };
    dex?: { data?: { id?: string } };
  };
};

const geckoMint = (id?: string) => (id || "").replace(/^solana_/, "");

// GeckoTerminal names pools like "MOCOIN / SOL" or "MOCOIN / SOL 0.25%".
function geckoSymbols(name = "") {
  const [base = "?", quote = "?"] = name.split(" / ").map((part) => part.trim().split(" ")[0]);
  return { base, quote };
}

function geckoToPool(pool: GeckoPool, hop: 0 | 1): DiscoveredPool | null {
  const address = pool.attributes?.address;
  if (!address) return null;
  const symbols = geckoSymbols(pool.attributes?.name);
  return {
    pairAddress: address,
    dexId: (pool.relationships?.dex?.data?.id || "unknown").replace(/[-_]/g, " "),
    url: `https://www.geckoterminal.com/solana/pools/${address}`,
    label: `${symbols.base}/${symbols.quote}`,
    baseToken: { address: geckoMint(pool.relationships?.base_token?.data?.id), symbol: symbols.base },
    quoteToken: { address: geckoMint(pool.relationships?.quote_token?.data?.id), symbol: symbols.quote },
    liquidityUsd: Number(pool.attributes?.reserve_in_usd) || 0,
    priceUsd: Number(pool.attributes?.base_token_price_usd) || 0,
    hop,
    lpMint: null,
    source: "geckoterminal",
  };
}

async function fetchGecko(path: string): Promise<GeckoPool[]> {
  const response = await fetch(`${GECKO_BASE_URL}${path}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`GeckoTerminal lookup failed with ${response.status}`);
  const payload = await response.json();
  return (payload.data || []) as GeckoPool[];
}

const settled = <T,>(promise: Promise<T>, fallback: T, label: string) =>
  promise.catch((error) => {
    console.error(`${label}:`, error?.message || error);
    return fallback;
  });

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
    source: "dexscreener",
  };
}

export async function discoverPools(): Promise<DiscoveredPool[]> {
  const moCoinMint = treasuryConfig.mocoin.mintAddress;
  const extraMints: string[] = treasuryConfig.poolScan.extraTokenMints;
  const tracked = await getTrackedPools();

  // DexScreener's token search is the main source; if it fails, the others
  // still run, and it only fails the whole scan when nothing else answered.
  let dexError: unknown = null;
  const [firstHop, geckoPools, trackedPairs] = await Promise.all([
    fetchPairsForTokens([moCoinMint, ...extraMints]).catch((error) => {
      dexError = error;
      return [] as DexScreenerPair[];
    }),
    settled(fetchGecko(`/tokens/${moCoinMint}/pools?page=1`), [] as GeckoPool[], "GeckoTerminal MoCoin pools"),
    tracked.length ? settled(fetchPairsByAddress(tracked), [] as DexScreenerPair[], "DexScreener tracked pools") : Promise.resolve([] as DexScreenerPair[]),
  ]);

  const containsMoCoin = (pool: { baseToken: { address: string }; quoteToken: { address: string } }) =>
    pool.baseToken.address === moCoinMint || pool.quoteToken.address === moCoinMint;

  const pools = new Map<string, DiscoveredPool>();
  firstHop.forEach((pair) => pools.set(pair.pairAddress, toPool(pair, 0)));
  trackedPairs.forEach((pair) => {
    if (!pools.has(pair.pairAddress)) pools.set(pair.pairAddress, toPool(pair, containsMoCoin(pair) ? 0 : 1));
  });
  geckoPools.forEach((raw) => {
    const pool = geckoToPool(raw, 0);
    if (pool && !pools.has(pool.pairAddress)) pools.set(pool.pairAddress, pool);
  });

  // Tracked pools neither search returned: ask GeckoTerminal by address.
  const missing = tracked.filter((address) => !pools.has(address));
  if (missing.length) {
    const found = await settled(fetchGecko(`/pools/multi/${missing.slice(0, 30).join(",")}`), [] as GeckoPool[], "GeckoTerminal tracked pools");
    for (const raw of found) {
      const pool = geckoToPool(raw, 0);
      if (pool && !pools.has(pool.pairAddress)) pools.set(pool.pairAddress, { ...pool, hop: containsMoCoin(pool) ? 0 : 1 });
    }
  }

  // One hop out: pools of the tokens MoCoin (or a tracked pool) pairs with.
  const counterpartMints = new Set<string>();
  for (const pool of Array.from(pools.values())) {
    for (const token of [pool.baseToken, pool.quoteToken]) {
      if (token.address && token.address !== moCoinMint && !COMMON_QUOTE_MINTS.has(token.address)) {
        counterpartMints.add(token.address);
      }
    }
  }
  extraMints.forEach((mint) => counterpartMints.delete(mint));
  const secondHop = counterpartMints.size
    ? await settled(fetchPairsForTokens(Array.from(counterpartMints)), [] as DexScreenerPair[], "DexScreener paired tokens")
    : [];
  secondHop.forEach((pair) => {
    if (!pools.has(pair.pairAddress)) pools.set(pair.pairAddress, toPool(pair, 1));
  });

  if (dexError && pools.size === 0 && !tracked.length) throw dexError;

  const trackedSet = new Set(tracked);
  const all = Array.from(pools.values()).map((pool) => ({ ...pool, tracked: trackedSet.has(pool.pairAddress) }));
  // Tracked pools nobody has data for still show, so they're never silently lost.
  for (const address of tracked) {
    if (!pools.has(address)) {
      all.push({
        pairAddress: address,
        dexId: "unknown",
        url: `https://dexscreener.com/solana/${address}`,
        label: `${address.slice(0, 4)}…${address.slice(-4)}`,
        baseToken: { address: "", symbol: "?" },
        quoteToken: { address: "", symbol: "?" },
        liquidityUsd: 0,
        priceUsd: 0,
        hop: 0,
        lpMint: null,
        tracked: true,
        source: "none",
      });
    }
  }

  // Tracked and MoCoin pools first, then by liquidity; tracked ones are never cut.
  const sorted = all.sort((a, b) => Number(Boolean(b.tracked)) - Number(Boolean(a.tracked)) || a.hop - b.hop || b.liquidityUsd - a.liquidityUsd);
  const kept = [...sorted.filter((pool) => pool.tracked), ...sorted.filter((pool) => !pool.tracked).slice(0, Math.max(0, MAX_POOLS - tracked.length))]
    .sort((a, b) => a.hop - b.hop || Number(Boolean(b.tracked)) - Number(Boolean(a.tracked)) || b.liquidityUsd - a.liquidityUsd);

  const raydiumIds = kept.filter((pool) => pool.dexId === "raydium").map((pool) => pool.pairAddress);
  const lpMints = await fetchRaydiumLpMints(raydiumIds).catch((error) => {
    console.error("Raydium LP mint lookup failed:", error.message);
    return {} as Record<string, string>;
  });

  const configuredPool = treasuryConfig.mocoin.poolAddress;
  const configuredLpMint = treasuryConfig.mocoin.lpMintAddress;

  return kept.map((pool) => ({
    ...pool,
    lpMint: (pool.pairAddress === configuredPool && configuredLpMint) || lpMints[pool.pairAddress] || null,
  }));
}

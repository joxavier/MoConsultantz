import type { Session } from "next-auth";
import clientsData from "@/data/clients.json";
import treasuryConfig from "@/data/treasuryConfig.json";
import { isTreasuryManagerSession } from "@/lib/treasury/access";
import { getPoolReserves } from "@/lib/treasury/raydium";
import { discoverPools } from "@/lib/treasury/pools";
import type { BaseCurrency } from "@/lib/treasury/types";

// Required env var: CLIENT_ACCOUNT_EMAILS — comma-separated `clientId=email`
// pairs (e.g. "tacticalGrape=someone@gmail.com") naming the Google account
// that may see each client's balances. Kept out of the repo because it's
// public. Treasury managers (TREASURY_MANAGER_EMAILS) see every client.

export type TokenName = keyof typeof clientsData.tokens;

export type ClientDeposit = { token: TokenName; quantity: number; date: string };

export type ClientConfig = {
  id: string;
  name: string;
  preferredCurrency: BaseCurrency;
  deposits: ClientDeposit[];
};

export type PricedDeposit = ClientDeposit & {
  symbol: string;
  priceUsd: number | null;
  valueUsd: number | null;
  priceError?: string;
};

export type ClientView = Omit<ClientConfig, "deposits"> & {
  deposits: PricedDeposit[];
  totalUsd: number;
};

// Shape returned by GET /api/clients.
export type ClientsResponse = {
  isManager: boolean;
  clients: ClientView[];
  usdCadRate: number;
  usdCadRateIsFallback: boolean;
  pricedAt: string;
};

const clients = clientsData.clients as ClientConfig[];

function getAccountMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const entry of (process.env.CLIENT_ACCOUNT_EMAILS || "").split(",")) {
    const [clientId, email] = entry.split("=").map((part) => part?.trim());
    if (!clientId || !email) continue;
    const key = email.toLowerCase();
    map[key] = [...(map[key] || []), clientId];
  }
  return map;
}

export function getVisibleClients(session: Session | null): { isManager: boolean; clients: ClientConfig[] } {
  if (isTreasuryManagerSession(session)) return { isManager: true, clients };

  const email = session?.user?.email?.toLowerCase();
  const allowedIds = email ? getAccountMap()[email] || [] : [];
  return { isManager: false, clients: clients.filter((client) => allowedIds.includes(client.id)) };
}

const DEXSCREENER_TOKENS_URL = "https://api.dexscreener.com/latest/dex/tokens";
const YAHOO_USDCAD_URL = "https://query1.finance.yahoo.com/v8/finance/chart/CAD=X?range=1d&interval=1d";
const FALLBACK_USD_CAD = 1.37;

// A token's USD price from its deepest Solana pool where it is the base token
// (DexScreener's priceUsd is always the base token's price).
async function getTokenPriceUsd(mint: string): Promise<number> {
  const response = await fetch(`${DEXSCREENER_TOKENS_URL}/${mint}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`DexScreener token lookup failed with ${response.status}`);

  const payload = await response.json();
  const pairs: any[] = (payload.pairs || []).filter(
    (pair: any) => pair.chainId === "solana" && pair.baseToken?.address === mint && Number(pair.priceUsd) > 0
  );
  if (!pairs.length) throw new Error(`No priced pool found for ${mint}`);

  pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0));
  return Number(pairs[0].priceUsd);
}

// Tokens without a configured mint are looked up by symbol among the pools
// paired directly with MoCoin, so only MoCoin-ecosystem tokens can match.
async function resolveMint(token: TokenName): Promise<string> {
  const { symbol, mintAddress } = clientsData.tokens[token];
  if (mintAddress) return mintAddress;

  const pools = await discoverPools();
  for (const pool of pools.filter((p) => p.hop === 0)) {
    for (const side of [pool.baseToken, pool.quoteToken]) {
      if (side.symbol.toUpperCase() === symbol.toUpperCase()) return side.address;
    }
  }
  throw new Error(`No mint configured for ${token} and no ${symbol} pool paired with MoCoin was found`);
}

async function getPriceUsd(token: TokenName): Promise<number> {
  // Same source the Strategic Reserve uses for MoCoin, so the two agree.
  if (clientsData.tokens[token].mintAddress === treasuryConfig.mocoin.mintAddress) {
    const { moCoinPriceUsd } = await getPoolReserves(treasuryConfig.mocoin.poolAddress);
    if (moCoinPriceUsd > 0) return moCoinPriceUsd;
  }
  return getTokenPriceUsd(await resolveMint(token));
}

async function getUsdCadRate(): Promise<{ rate: number; isFallback: boolean }> {
  try {
    const response = await fetch(YAHOO_USDCAD_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
    const data = await response.json();
    const rate = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    if (typeof rate === "number" && rate > 0) return { rate, isFallback: false };
  } catch (error: any) {
    console.error("USD/CAD rate fetch error:", error.message);
  }
  return { rate: FALLBACK_USD_CAD, isFallback: true };
}

// Prices move slowly relative to page loads; cache briefly in module memory.
const CACHE_TTL_MS = 60_000;
let cached: { prices: Record<string, { priceUsd: number | null; error?: string }>; fx: { rate: number; isFallback: boolean }; pricedAt: string; expiresAt: number } | null = null;

async function getPricing() {
  if (cached && cached.expiresAt > Date.now()) return cached;

  const tokens = Object.keys(clientsData.tokens) as TokenName[];
  const [results, fx] = await Promise.all([
    Promise.all(
      tokens.map(async (token) => {
        try {
          return [token, { priceUsd: await getPriceUsd(token) }] as const;
        } catch (error: any) {
          console.error(`Client pricing error for ${token}:`, error.message);
          return [token, { priceUsd: null, error: error.message }] as const;
        }
      })
    ),
    getUsdCadRate(),
  ]);

  cached = { prices: Object.fromEntries(results), fx, pricedAt: new Date().toISOString(), expiresAt: Date.now() + CACHE_TTL_MS };
  return cached;
}

export async function priceClients(visible: ClientConfig[]) {
  const { prices, fx, pricedAt } = await getPricing();

  const views: ClientView[] = visible.map((client) => {
    const deposits = client.deposits.map((deposit): PricedDeposit => {
      const { priceUsd, error } = prices[deposit.token] || { priceUsd: null, error: "Unknown token" };
      return {
        ...deposit,
        symbol: clientsData.tokens[deposit.token].symbol,
        priceUsd,
        valueUsd: priceUsd === null ? null : priceUsd * deposit.quantity,
        priceError: error,
      };
    });
    return { ...client, deposits, totalUsd: deposits.reduce((sum, d) => sum + (d.valueUsd || 0), 0) };
  });

  return { clients: views, usdCadRate: fx.rate, usdCadRateIsFallback: fx.isFallback, pricedAt };
}

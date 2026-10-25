import type { Session } from "next-auth";
import clientsData from "@/data/clients.json";
import treasuryConfig from "@/data/treasuryConfig.json";
import { isTreasuryManagerSession } from "@/lib/treasury/access";
import { getPoolReserves } from "@/lib/treasury/raydium";
import { discoverPools } from "@/lib/treasury/pools";
import { getAllTokenBalances, getSolBalance } from "@/lib/treasury/solana";
import type { BaseCurrency } from "@/lib/treasury/types";

// Required env var: CLIENT_ACCOUNT_EMAILS — comma-separated `clientId=email`
// pairs (e.g. "tacticalGrape=someone@gmail.com") naming the Google account
// that may see each client's balances. Kept out of the repo because it's
// public. Treasury managers (TREASURY_MANAGER_EMAILS) see every client.

export type TokenName = keyof typeof clientsData.tokens;

export type ClientDeposit = { token: TokenName; quantity: number; date: string };

// A client is valued from recorded deposits, a scan of a Solana wallet, or both.
export type ClientConfig = {
  id: string;
  name: string;
  preferredCurrency: BaseCurrency;
  deposits?: ClientDeposit[];
  walletAddress?: string;
};

export type Holding = {
  source: "deposit" | "wallet";
  label: string;
  symbol: string;
  quantity: number;
  // Deposit month (YYYY-MM); absent for live wallet balances.
  date?: string;
  mint?: string;
  priceUsd: number | null;
  valueUsd: number | null;
  priceError?: string;
};

export type ClientView = Omit<ClientConfig, "deposits"> & {
  holdings: Holding[];
  totalUsd: number;
  walletError?: string;
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
const WRAPPED_SOL_MINT = "So11111111111111111111111111111111111111112";
// DexScreener accepts up to 30 comma-separated token addresses per request.
const MAX_TOKENS_PER_REQUEST = 30;

type TokenQuote = { priceUsd: number; symbol: string };

// USD price and symbol for each mint, from its deepest Solana pool where it is
// the base token (DexScreener's priceUsd is always the base token's price).
// Mints with no such pool are left out.
async function getTokenQuotes(mints: string[]): Promise<Record<string, TokenQuote>> {
  const quotes: Record<string, TokenQuote & { liquidity: number }> = {};

  for (let i = 0; i < mints.length; i += MAX_TOKENS_PER_REQUEST) {
    const batch = mints.slice(i, i + MAX_TOKENS_PER_REQUEST);
    const response = await fetch(`${DEXSCREENER_TOKENS_URL}/${batch.join(",")}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`DexScreener token lookup failed with ${response.status}`);

    const payload = await response.json();
    for (const pair of payload.pairs || []) {
      const mint = pair.baseToken?.address;
      const priceUsd = Number(pair.priceUsd);
      const liquidity = pair.liquidity?.usd || 0;
      if (pair.chainId !== "solana" || !batch.includes(mint) || !(priceUsd > 0)) continue;
      if (!quotes[mint] || liquidity > quotes[mint].liquidity) {
        quotes[mint] = { priceUsd, symbol: pair.baseToken.symbol, liquidity };
      }
    }
  }

  return Object.fromEntries(Object.entries(quotes).map(([mint, { priceUsd, symbol }]) => [mint, { priceUsd, symbol }]));
}

// MoCoin is priced from the same Raydium pool the Strategic Reserve uses, so
// the two pages agree.
async function getMoCoinPriceUsd(): Promise<number | null> {
  try {
    const { moCoinPriceUsd } = await getPoolReserves(treasuryConfig.mocoin.poolAddress);
    return moCoinPriceUsd > 0 ? moCoinPriceUsd : null;
  } catch (error: any) {
    console.error("MoCoin pool price error:", error.message);
    return null;
  }
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

// Prices and balances move slowly relative to page loads, and public Solana
// RPCs rate-limit hard; cache briefly in module memory.
const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { value: unknown; expiresAt: number }>();

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.value as T;
  const value = await load();
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}

type Price = { priceUsd: number | null; error?: string };

async function priceNamedTokens(): Promise<Record<TokenName, Price>> {
  const tokens = Object.keys(clientsData.tokens) as TokenName[];
  const entries = await Promise.all(
    tokens.map(async (token): Promise<[TokenName, Price]> => {
      try {
        const mint = await resolveMint(token);
        if (mint === treasuryConfig.mocoin.mintAddress) {
          const priceUsd = await getMoCoinPriceUsd();
          if (priceUsd !== null) return [token, { priceUsd }];
        }
        const quote = (await getTokenQuotes([mint]))[mint];
        return quote ? [token, { priceUsd: quote.priceUsd }] : [token, { priceUsd: null, error: `No priced pool found for ${mint}` }];
      } catch (error: any) {
        console.error(`Client pricing error for ${token}:`, error.message);
        return [token, { priceUsd: null, error: error.message }];
      }
    })
  );
  return Object.fromEntries(entries) as Record<TokenName, Price>;
}

function priced(holding: Omit<Holding, "valueUsd">): Holding {
  return { ...holding, valueUsd: holding.priceUsd === null ? null : holding.priceUsd * holding.quantity };
}

// Every non-zero balance in the wallet: native SOL plus each SPL / Token-2022
// token, priced from Solana pools where possible.
async function scanWallet(address: string): Promise<Holding[]> {
  const [sol, tokenBalances] = await Promise.all([getSolBalance(address), getAllTokenBalances(address)]);

  const held = Object.entries(tokenBalances).filter(([, amount]) => amount > 0);
  const [quotes, moCoinPriceUsd] = await Promise.all([
    getTokenQuotes([WRAPPED_SOL_MINT, ...held.map(([mint]) => mint)]),
    held.some(([mint]) => mint === treasuryConfig.mocoin.mintAddress) ? getMoCoinPriceUsd() : Promise.resolve(null),
  ]);

  const namedByMint = new Map(
    Object.entries(clientsData.tokens).filter(([, t]) => t.mintAddress).map(([name, t]) => [t.mintAddress as string, name])
  );

  const holdings: Holding[] = [];
  if (sol > 0) {
    const solPrice = quotes[WRAPPED_SOL_MINT]?.priceUsd ?? null;
    holdings.push(priced({ source: "wallet", label: "Solana", symbol: "SOL", quantity: sol, mint: WRAPPED_SOL_MINT, priceUsd: solPrice, priceError: solPrice === null ? "SOL price unavailable" : undefined }));
  }
  for (const [mint, quantity] of held) {
    const quote = quotes[mint];
    const priceUsd = mint === treasuryConfig.mocoin.mintAddress && moCoinPriceUsd !== null ? moCoinPriceUsd : quote?.priceUsd ?? null;
    const name = namedByMint.get(mint) as TokenName | undefined;
    const symbol = quote?.symbol || (name && clientsData.tokens[name].symbol) || `${mint.slice(0, 4)}…${mint.slice(-4)}`;
    holdings.push(priced({
      source: "wallet",
      label: name || symbol,
      symbol,
      quantity,
      mint,
      priceUsd,
      priceError: priceUsd === null ? "No priced Solana pool found for this token" : undefined,
    }));
  }

  return holdings.sort((a, b) => (b.valueUsd ?? -1) - (a.valueUsd ?? -1));
}

export async function priceClients(visible: ClientConfig[]) {
  const [prices, fx] = await Promise.all([
    visible.some((client) => client.deposits?.length) ? cached("named-prices", priceNamedTokens) : Promise.resolve({} as Record<TokenName, Price>),
    cached("usd-cad", getUsdCadRate),
  ]);

  const views = await Promise.all(
    visible.map(async ({ deposits = [], ...client }): Promise<ClientView> => {
      const holdings: Holding[] = deposits.map((deposit) => {
        const { priceUsd, error } = prices[deposit.token] || { priceUsd: null, error: "Unknown token" };
        return priced({
          source: "deposit",
          label: deposit.token,
          symbol: clientsData.tokens[deposit.token].symbol,
          quantity: deposit.quantity,
          date: deposit.date,
          priceUsd,
          priceError: error,
        });
      });

      let walletError: string | undefined;
      if (client.walletAddress) {
        const address = client.walletAddress;
        try {
          holdings.push(...(await cached(`wallet:${address}`, () => scanWallet(address))));
        } catch (error: any) {
          console.error(`Wallet scan error for ${client.id}:`, error.message);
          walletError = "Couldn't read on-chain balances right now.";
        }
      }

      return { ...client, holdings, walletError, totalUsd: holdings.reduce((sum, h) => sum + (h.valueUsd || 0), 0) };
    })
  );

  return { clients: views, usdCadRate: fx.rate, usdCadRateIsFallback: fx.isFallback, pricedAt: new Date().toISOString() };
}

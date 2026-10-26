import type { Session } from "next-auth";
import clientsData from "@/data/clients.json";
import treasuryConfig from "@/data/treasuryConfig.json";
import { isTreasuryManagerSession } from "@/lib/treasury/access";
import { getPoolReserves } from "@/lib/treasury/raydium";
import { discoverPools } from "@/lib/treasury/pools";
import { getAllTokenBalances, getSolBalance } from "@/lib/treasury/solana";
import type { BaseCurrency } from "@/lib/treasury/types";
import { readClientsSheet, readLedgerSheet, type LedgerEntry, type SheetClient } from "@/lib/clientsSheet";

// Client accounts (username, email, wallets) come from the "Clients" tab of
// the Google Sheet and their transactions from its "Ledger" tab — see
// clientsSheet.ts. A signed-in user sees the clients whose Clients row has
// their email; treasury managers (TREASURY_MANAGER_EMAILS) see every client.
// src/data/clients.json only names the tokens the ledger can refer to.

export type TokenName = keyof typeof clientsData.tokens;

// A client is valued from its ledger balance, scans of Solana wallets, or both.
export type ClientConfig = {
  id: string;
  name: string;
  preferredCurrency: BaseCurrency;
  transactions: LedgerEntry[];
  walletAddresses: string[];
};

export type Holding = {
  source: "ledger" | "wallet";
  label: string;
  symbol: string;
  quantity: number;
  mint?: string;
  wallet?: string;
  priceUsd: number | null;
  valueUsd: number | null;
  priceError?: string;
};

export type ClientView = ClientConfig & {
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

// Newest first; dates the sheet formats unusually keep their sheet order.
function sortByDateDesc(entries: LedgerEntry[]) {
  return entries
    .map((entry, index) => ({ entry, index, time: Date.parse(entry.date) }))
    .sort((a, b) => (Number.isNaN(b.time) || Number.isNaN(a.time) ? b.index - a.index : b.time - a.time || b.index - a.index))
    .map(({ entry }) => entry);
}

// Clients and ledger rows, joined on username (case-insensitive). A username
// can appear on several Clients rows (e.g. two people sharing a portfolio);
// its wallets are combined.
function buildClients(rows: SheetClient[], ledger: LedgerEntry[]): ClientConfig[] {
  const byId = new Map<string, ClientConfig>();
  const get = (id: string) => {
    const key = id.toLowerCase();
    if (!byId.has(key)) byId.set(key, { id, name: id, preferredCurrency: "CAD", transactions: [], walletAddresses: [] });
    return byId.get(key)!;
  };

  for (const row of rows) {
    const client = get(row.username);
    if (row.preferredCurrency) client.preferredCurrency = row.preferredCurrency;
    client.walletAddresses = Array.from(new Set([...client.walletAddresses, ...row.walletAddresses]));
  }
  for (const entry of ledger) get(entry.username).transactions.push(entry);
  byId.forEach((client) => (client.transactions = sortByDateDesc(client.transactions)));

  return Array.from(byId.values());
}

export async function getVisibleClients(session: Session | null): Promise<{ isManager: boolean; clients: ClientConfig[] }> {
  const [rows, ledger] = await Promise.all([cached("clients-sheet", readClientsSheet), cached("ledger-sheet", readLedgerSheet)]);
  const clients = buildClients(rows, ledger);

  if (isTreasuryManagerSession(session)) return { isManager: true, clients };

  const email = session?.user?.email?.toLowerCase();
  const allowedIds = new Set(rows.filter((row) => email && row.email === email).map((row) => row.username.toLowerCase()));
  return { isManager: false, clients: clients.filter((client) => allowedIds.has(client.id.toLowerCase())) };
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

const MINT_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

// A ledger "Token" cell: a configured token's name or symbol, or a raw mint.
function resolveLedgerToken(token: string): { name: TokenName } | { mint: string } | null {
  const wanted = token.trim().toLowerCase();
  const name = (Object.keys(clientsData.tokens) as TokenName[]).find(
    (key) => key.toLowerCase() === wanted || clientsData.tokens[key].symbol.toLowerCase() === wanted
  );
  if (name) return { name };
  return MINT_PATTERN.test(token.trim()) ? { mint: token.trim() } : null;
}

async function priceNamedToken(token: TokenName): Promise<Price & { mint?: string }> {
  try {
    const mint = await resolveMint(token);
    if (mint === treasuryConfig.mocoin.mintAddress) {
      const priceUsd = await getMoCoinPriceUsd();
      if (priceUsd !== null) return { priceUsd, mint };
    }
    const quote = (await getTokenQuotes([mint]))[mint];
    return quote ? { priceUsd: quote.priceUsd, mint } : { priceUsd: null, mint, error: `No priced pool found for ${mint}` };
  } catch (error: any) {
    console.error(`Client pricing error for ${token}:`, error.message);
    return { priceUsd: null, error: error.message };
  }
}

// Net ledger balance per token, priced. Tokens that net to zero are dropped.
async function ledgerHoldings(transactions: LedgerEntry[]): Promise<Holding[]> {
  const balances = new Map<string, { label: string; quantity: number }>();
  for (const entry of transactions) {
    const resolved = resolveLedgerToken(entry.token);
    const key = resolved ? ("name" in resolved ? `name:${resolved.name}` : `mint:${resolved.mint}`) : `raw:${entry.token.toLowerCase()}`;
    const current = balances.get(key) || { label: resolved && "name" in resolved ? resolved.name : entry.token, quantity: 0 };
    current.quantity += entry.quantity;
    balances.set(key, current);
  }

  const held = Array.from(balances.entries()).filter(([, b]) => Math.abs(b.quantity) > 1e-9);
  const mints = held.filter(([key]) => key.startsWith("mint:")).map(([key]) => key.slice(5));
  const quotes = mints.length ? await cached(`quotes:${mints.sort().join(",")}`, () => getTokenQuotes(mints)).catch(() => ({} as Record<string, TokenQuote>)) : {};

  return Promise.all(
    held.map(async ([key, { label, quantity }]): Promise<Holding> => {
      if (key.startsWith("name:")) {
        const name = key.slice(5) as TokenName;
        const { priceUsd, mint, error } = await cached(`named:${name}`, () => priceNamedToken(name));
        return priced({ source: "ledger", label: name, symbol: clientsData.tokens[name].symbol, quantity, mint, priceUsd, priceError: error });
      }
      if (key.startsWith("mint:")) {
        const mint = key.slice(5);
        const quote = quotes[mint];
        const symbol = quote?.symbol || `${mint.slice(0, 4)}…${mint.slice(-4)}`;
        return priced({ source: "ledger", label: symbol, symbol, quantity, mint, priceUsd: quote?.priceUsd ?? null, priceError: quote ? undefined : "No priced Solana pool found for this token" });
      }
      return priced({ source: "ledger", label, symbol: label, quantity, priceUsd: null, priceError: `"${label}" isn't a known token name or mint address` });
    })
  );
}

function priced(holding: Omit<Holding, "valueUsd">): Holding {
  return { ...holding, valueUsd: holding.priceUsd === null ? null : holding.priceUsd * holding.quantity };
}

// Every non-zero balance in the wallet: native SOL plus each SPL / Token-2022
// token, priced from Solana pools where possible.
async function scanWallet(address: string): Promise<Holding[]> {
  const wallet = address;
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
    holdings.push(priced({ source: "wallet", label: "Solana", symbol: "SOL", quantity: sol, mint: WRAPPED_SOL_MINT, wallet, priceUsd: solPrice, priceError: solPrice === null ? "SOL price unavailable" : undefined }));
  }
  for (const [mint, quantity] of held) {
    const quote = quotes[mint];
    const priceUsd = mint === treasuryConfig.mocoin.mintAddress && moCoinPriceUsd !== null ? moCoinPriceUsd : quote?.priceUsd ?? null;
    const name = namedByMint.get(mint) as TokenName | undefined;
    const symbol = quote?.symbol || (name && clientsData.tokens[name].symbol) || `${mint.slice(0, 4)}…${mint.slice(-4)}`;
    holdings.push(priced({
      source: "wallet",
      wallet,
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
  const fx = await cached("usd-cad", getUsdCadRate);

  const views = await Promise.all(
    visible.map(async (client): Promise<ClientView> => {
      const holdings = await ledgerHoldings(client.transactions);

      let walletError: string | undefined;
      const scans = await Promise.allSettled(
        client.walletAddresses.map((address) => cached(`wallet:${address}`, () => scanWallet(address)))
      );
      scans.forEach((scan, i) => {
        if (scan.status === "fulfilled") return holdings.push(...scan.value);
        console.error(`Wallet scan error for ${client.id} (${client.walletAddresses[i]}):`, scan.reason?.message);
        walletError = "Couldn't read some on-chain balances right now.";
      });

      return { ...client, holdings, walletError, totalUsd: holdings.reduce((sum, h) => sum + (h.valueUsd || 0), 0) };
    })
  );

  return { clients: views, usdCadRate: fx.rate, usdCadRateIsFallback: fx.isFallback, pricedAt: new Date().toISOString() };
}

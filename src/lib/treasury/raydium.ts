import treasuryConfig from "@/data/treasuryConfig.json";

const DEXSCREENER_PAIRS_URL = "https://api.dexscreener.com/latest/dex/pairs/solana";

export type PoolReserves = {
  solReserve: number;
  moCoinReserve: number;
  poolValueUsd: number;
  moCoinPriceUsd: number;
};

type DexScreenerToken = { address: string; symbol: string };
type DexScreenerPair = {
  baseToken: DexScreenerToken;
  quoteToken: DexScreenerToken;
  liquidity?: { usd?: number; base?: number; quote?: number };
};

function pickPair(payload: { pair?: DexScreenerPair; pairs?: DexScreenerPair[] }): DexScreenerPair | null {
  return payload.pair || payload.pairs?.[0] || null;
}

export async function getPoolReserves(poolAddress: string): Promise<PoolReserves> {
  const response = await fetch(`${DEXSCREENER_PAIRS_URL}/${poolAddress}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`DexScreener request failed for pool ${poolAddress} with ${response.status}`);
  }

  const payload = await response.json();
  const pair = pickPair(payload);

  if (!pair || !pair.liquidity) {
    throw new Error(`No liquidity data for pool ${poolAddress}`);
  }

  const moCoinMint = treasuryConfig.mocoin.mintAddress;
  const baseIsMoCoin = pair.baseToken.address === moCoinMint;

  const solReserve = baseIsMoCoin ? pair.liquidity.quote : pair.liquidity.base;
  const moCoinReserve = baseIsMoCoin ? pair.liquidity.base : pair.liquidity.quote;

  if (typeof solReserve !== "number" || typeof moCoinReserve !== "number") {
    throw new Error(`Incomplete reserve data for pool ${poolAddress}`);
  }

  const poolValueUsd = pair.liquidity.usd || 0;
  // Both sides of a constant-product pool hold equal USD value, so half the
  // pool's total USD liquidity divided by a side's reserve gives that side's
  // price — exact for this pool shape, and avoids depending on which token
  // DexScreener reports as "base" vs "quote".
  const moCoinPriceUsd = moCoinReserve > 0 ? poolValueUsd / 2 / moCoinReserve : 0;

  return {
    solReserve,
    moCoinReserve,
    poolValueUsd,
    moCoinPriceUsd,
  };
}

export function decomposeLpPosition(
  lpTokenBalance: number,
  reserves: PoolReserves,
  totalLpSupply: number
) {
  const poolShare = totalLpSupply > 0 ? lpTokenBalance / totalLpSupply : 0;

  return {
    poolShare,
    underlyingSol: poolShare * reserves.solReserve,
    underlyingMoCoin: poolShare * reserves.moCoinReserve,
    valueUsd: poolShare * reserves.poolValueUsd,
  };
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isTreasuryManagerSession } from "@/lib/treasury/access";
import { getAllTokenBalances, getSolBalance, getTokenSupply, getTreasuryWalletAddress } from "@/lib/treasury/solana";
import { getPoolReserves } from "@/lib/treasury/raydium";
import { discoverPools } from "@/lib/treasury/pools";
import type { DiscoveredPool, TreasuryLpPosition, TreasuryResponse } from "@/lib/treasury/types";
import treasuryConfig from "@/data/treasuryConfig.json";

// Public Solana RPCs rate-limit hard, and this data doesn't change fast
// enough to justify fetching it on every page load — cache briefly in
// module memory. Resets on redeploy/restart, which is fine for this use.
const CACHE_TTL_MS = 45_000;
let cached: { data: TreasuryData; expiresAt: number } | null = null;

type FieldResult<T> = { value: T; error?: string };

type TreasuryData = {
  pools: FieldResult<DiscoveredPool[]>;
  wallet:
    | { configured: false; error: string }
    | {
        configured: true;
        walletAddress: string;
        sol: FieldResult<number>;
        moCoin: FieldResult<number>;
        moCoinPriceUsd: number;
        lpPositions: TreasuryLpPosition[];
        lpError?: string;
      };
};

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<FieldResult<T>> {
  try {
    return { value: await fn() };
  } catch (error: any) {
    console.error("Treasury balances fetch error:", error.message);
    return { value: fallback, error: error.message };
  }
}

async function getLpPositions(pools: DiscoveredPool[], tokenBalances: Record<string, number>) {
  const held = pools.filter((pool) => pool.lpMint && (tokenBalances[pool.lpMint] || 0) > 0);

  return Promise.all(
    held.map(async (pool): Promise<TreasuryLpPosition> => {
      const lpTokenBalance = tokenBalances[pool.lpMint as string];
      const supply = await getTokenSupply(pool.lpMint as string);
      const poolShare = supply > 0 ? lpTokenBalance / supply : 0;
      return {
        pairAddress: pool.pairAddress,
        label: pool.label,
        lpTokenBalance,
        poolShare,
        valueUsd: poolShare * pool.liquidityUsd,
      };
    })
  );
}

async function loadTreasuryData(): Promise<TreasuryData> {
  const walletAddress = getTreasuryWalletAddress();
  const { mintAddress: moCoinMint, poolAddress } = treasuryConfig.mocoin;

  const pools = await safeFetch(discoverPools, [] as DiscoveredPool[]);

  if (!walletAddress) {
    return { pools, wallet: { configured: false, error: "TREASURY_WALLET_ADDRESS is not set" } };
  }

  const [sol, tokenBalances, reserves] = await Promise.all([
    safeFetch(() => getSolBalance(walletAddress), 0),
    safeFetch(() => getAllTokenBalances(walletAddress), {} as Record<string, number>),
    safeFetch(() => getPoolReserves(poolAddress), { solReserve: 0, moCoinReserve: 0, poolValueUsd: 0, moCoinPriceUsd: 0 }),
  ]);

  const lp = await safeFetch(() => getLpPositions(pools.value, tokenBalances.value), [] as TreasuryLpPosition[]);

  return {
    pools,
    wallet: {
      configured: true,
      walletAddress,
      sol,
      moCoin: { value: tokenBalances.value[moCoinMint] || 0, error: tokenBalances.error },
      moCoinPriceUsd: reserves.value.moCoinPriceUsd,
      lpPositions: lp.value,
      lpError: lp.error || tokenBalances.error || pools.error,
    },
  };
}

async function getTreasuryData() {
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const data = await loadTreasuryData();
  cached = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  return data;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const isManager = isTreasuryManagerSession(session);

  const { pools, wallet } = await getTreasuryData();

  // Pool addresses, liquidity and prices are public on-chain data, so the
  // scan results are shown to everyone.
  const base = { pools: pools.value, poolsError: pools.error };

  if (!wallet.configured) {
    return NextResponse.json<TreasuryResponse>({ ...base, configured: false, error: wallet.error });
  }

  const moCoinValueUsd = wallet.moCoin.value * wallet.moCoinPriceUsd;
  const lpValueUsd = wallet.lpPositions.reduce((sum, position) => sum + position.valueUsd, 0);

  // SOL's own USD value isn't computed here — the page already fetches a
  // SOL/USD price from /api/market-data for display, so the gated `sol`
  // balance below is priced there rather than duplicating that fetch.
  const publicShape: TreasuryResponse = {
    ...base,
    configured: true,
    totals: {
      moCoinValueUsd,
      lpValueUsd,
    },
  };

  if (!isManager) {
    return NextResponse.json(publicShape);
  }

  return NextResponse.json<TreasuryResponse>({
    ...publicShape,
    walletAddress: wallet.walletAddress,
    sol: { balance: wallet.sol.value, error: wallet.sol.error },
    moCoin: { balance: wallet.moCoin.value, priceUsd: wallet.moCoinPriceUsd, error: wallet.moCoin.error },
    lpPositions: wallet.lpPositions,
  });
}

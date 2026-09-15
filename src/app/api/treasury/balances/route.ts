import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isTreasuryManagerSession } from "@/lib/treasury/access";
import { getSolBalance, getTokenAccountBalance, getTokenSupply, getTreasuryWalletAddress } from "@/lib/treasury/solana";
import { decomposeLpPosition, getPoolReserves } from "@/lib/treasury/raydium";
import treasuryConfig from "@/data/treasuryConfig.json";

// Public Solana RPCs rate-limit hard, and this data doesn't change fast
// enough to justify fetching it on every page load — cache briefly in
// module memory. Resets on redeploy/restart, which is fine for this use.
const CACHE_TTL_MS = 45_000;
let cached: { data: any; expiresAt: number } | null = null;

type FieldResult<T> = { value: T; error?: string };

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<FieldResult<T>> {
  try {
    return { value: await fn() };
  } catch (error: any) {
    console.error("Treasury balances fetch error:", error.message);
    return { value: fallback, error: error.message };
  }
}

async function loadTreasuryData() {
  const walletAddress = getTreasuryWalletAddress();
  const { mintAddress: moCoinMint, poolAddress, lpMintAddress } = treasuryConfig.mocoin;

  if (!walletAddress) {
    return {
      configured: false,
      error: "TREASURY_WALLET_ADDRESS is not set",
    };
  }

  const [sol, moCoin, reserves] = await Promise.all([
    safeFetch(() => getSolBalance(walletAddress), 0),
    safeFetch(() => getTokenAccountBalance(walletAddress, moCoinMint), 0),
    safeFetch(() => getPoolReserves(poolAddress), { solReserve: 0, moCoinReserve: 0, poolValueUsd: 0, moCoinPriceUsd: 0 }),
  ]);

  let lp: FieldResult<{ poolShare: number; underlyingSol: number; underlyingMoCoin: number; valueUsd: number }> = {
    value: { poolShare: 0, underlyingSol: 0, underlyingMoCoin: 0, valueUsd: 0 },
    error: "lpMintAddress not configured",
  };

  if (lpMintAddress) {
    const [lpBalance, lpSupply] = await Promise.all([
      safeFetch(() => getTokenAccountBalance(walletAddress, lpMintAddress), 0),
      safeFetch(() => getTokenSupply(lpMintAddress), 0),
    ]);
    lp = {
      value: decomposeLpPosition(lpBalance.value, reserves.value, lpSupply.value),
      error: lpBalance.error || lpSupply.error || reserves.error,
    };
  }

  return {
    configured: true,
    walletAddress,
    sol,
    moCoin: { ...moCoin, priceUsd: reserves.value.moCoinPriceUsd },
    lp,
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

  const data = await getTreasuryData();

  if (!data.configured) {
    return NextResponse.json({ configured: false, error: data.error });
  }

  const moCoinValueUsd = data.moCoin.value * data.moCoin.priceUsd;
  const lpValueUsd = data.lp.value.valueUsd;

  // SOL's own USD value isn't computed here — the page already fetches a
  // SOL/USD price from /api/market-data for display, so the gated `sol`
  // balance below is priced there rather than duplicating that fetch.
  const publicShape = {
    configured: true,
    totals: {
      moCoinValueUsd,
      lpValueUsd,
    },
  };

  if (!isManager) {
    return NextResponse.json(publicShape);
  }

  return NextResponse.json({
    ...publicShape,
    walletAddress: data.walletAddress,
    sol: { balance: data.sol.value, error: data.sol.error },
    moCoin: { balance: data.moCoin.value, priceUsd: data.moCoin.priceUsd, error: data.moCoin.error },
    lp: { ...data.lp.value, error: data.lp.error },
  });
}

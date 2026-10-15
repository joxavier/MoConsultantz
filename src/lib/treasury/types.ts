export type BaseCurrency = 'USD' | 'CAD';
export type TimePeriod = '1h' | '4h' | '1d' | '7d' | '1m';
export type ChangeKey = 'change1h' | 'change4h' | 'change1d' | 'change7d' | 'change1m';

export type Asset = {
  symbol: string;
  category: string;
  targetAllocation: number;
  currentAllocation: number;
  price: number;
  value?: number;
  holdingQuantity?: number;
  holdingCurrency?: BaseCurrency;
  verifiedHolding?: string;
  isCustom?: boolean;
  isCash?: boolean;
  hasPriceError?: boolean;
  change1h: number;
  change4h: number;
  change1d: number;
  change7d: number;
  change1m: number;
  // True once this asset's holdingQuantity/value comes from a live on-chain read
  // (currently only SOL, MoCoin, and the LP position) rather than a manually
  // maintained number.
  isLive?: boolean;
  // True only for the two sides of the treasury a swap route (Jupiter) can
  // actually move — SOL and MoCoin. Everything else (equities on Wealthsimple,
  // BTC/ADA/FIL, cash, the LP position itself) can only ever produce a manual
  // instruction, never an automated trade.
  isOnChainExecutable?: boolean;
};

export type LpPosition = {
  poolAddress: string;
  lpMint: string;
  lpTokenBalance: number;
  poolShare: number;
  underlyingSol: number;
  underlyingMoCoin: number;
  valueUsd: number;
};

export type BaseCurrency = 'USD' | 'CAD';
export type TimePeriod = '1h' | '4h' | '1d' | '7d' | '1m';
export type ChangeKey = 'change1h' | 'change4h' | 'change1d' | 'change7d' | 'change1m';

// How an asset's value is worked out:
// - market:  quantity × live Yahoo price
// - cash:    quantity in its own currency, converted at the live USD/CAD rate
// - manual:  a dated valuation entered by hand (e.g. the pre-seed portfolio)
// - onchain: read from the treasury wallet via /api/treasury/balances
export type AssetKind = 'market' | 'cash' | 'manual' | 'onchain';

export type PricePoint = { t: number; c: number };

export type AssetConfig = {
  symbol: string;
  name: string;
  category: string;
  kind: AssetKind;
  targetAllocation: number;
  quantity?: number | null;
  currency?: BaseCurrency;
  holdingLabel?: string;
  // Only for kind "manual": value in `currency`, or null while not yet valued.
  manualValue?: number | null;
  // Only for kind "market", as an alternative to `quantity`: a position
  // recorded as money spent on a date. The share count is worked out from
  // that day's close. An explicit `quantity` takes precedence.
  purchase?: { amount: number; currency: BaseCurrency; date: string };
};

export type Asset = AssetConfig & {
  currentAllocation: number;
  price: number;
  value: number;
  // False for assets with a target but nothing actually held yet, so they
  // read as "not yet held" instead of a misleading $0 position.
  isHeld: boolean;
  hasPriceError?: boolean;
  history?: PricePoint[];
  // What was paid, in the display currency (for `purchase` positions).
  bookValue?: number;
  // For cash held in the other currency: the pair its change is measured
  // against, e.g. "USD/CAD" when viewing in CAD.
  fxPair?: string;
  change1h: number;
  change4h: number;
  change1d: number;
  change7d: number;
  change1m: number;
  // True once this asset's quantity/value comes from a live on-chain read
  // (currently MoCoin and the LP positions) rather than a manually maintained
  // number.
  isLive?: boolean;
  // True only for the two sides of the treasury a swap route (Jupiter) can
  // actually move — SOL and MoCoin. Everything else (equities on Wealthsimple,
  // BTC/ADA/FIL, cash, the LP position itself) can only ever produce a manual
  // instruction, never an automated trade.
  isOnChainExecutable?: boolean;
};

export type DiscoveredPool = {
  pairAddress: string;
  dexId: string;
  url: string;
  label: string;
  baseToken: { address: string; symbol: string };
  quoteToken: { address: string; symbol: string };
  liquidityUsd: number;
  priceUsd: number;
  // 0 = pool contains MoCoin; 1 = pool for a token MoCoin is paired with.
  hop: 0 | 1;
  // Raydium standard-AMM LP mint, when known — needed to value the
  // treasury's share of the pool.
  lpMint: string | null;
};

export type TreasuryLpPosition = {
  pairAddress: string;
  label: string;
  lpTokenBalance: number;
  poolShare: number;
  valueUsd: number;
};

// Shape returned by GET /api/treasury/balances. The manager-only fields are
// absent for everyone else.
export type TreasuryResponse = {
  configured: boolean;
  error?: string;
  pools: DiscoveredPool[];
  poolsError?: string;
  totals?: {
    moCoinValueUsd: number;
    lpValueUsd: number;
  };
  walletAddress?: string;
  sol?: { balance: number; error?: string };
  moCoin?: { balance: number; priceUsd: number; error?: string };
  lpPositions?: TreasuryLpPosition[];
};

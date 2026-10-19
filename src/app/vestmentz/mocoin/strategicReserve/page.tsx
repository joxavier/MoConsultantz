'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import treasuryConfig from '@/data/treasuryConfig.json';
import type {
  Asset,
  AssetConfig,
  BaseCurrency,
  ChangeKey,
  PricePoint,
  TimePeriod,
  TreasuryResponse,
} from '@/lib/treasury/types';

const MO_COLORS = {
  purple: '#8743f7',
  blue: '#3ca5de',
  purpleLight: '#a865ff',
  purpleDark: '#6b2fd6',
  blueLight: '#5dbef0',
  blueDark: '#2b8ab8',
  gray: '#6b7280',
  grayDark: '#374151',
  green: '#10b981',
  orange: '#f59e0b',
  pink: '#ec4899',
  cyan: '#06b6d4',
  yellow: '#eab308',
  red: '#ef4444',
  indigo: '#6366f1',
  teal: '#14b8a6',
  lime: '#84cc16',
  rose: '#fb7185',
};

const ASSET_CONFIG = treasuryConfig.assets as unknown as AssetConfig[];
const HOLDINGS_AS_OF = treasuryConfig.holdingsAsOf;
const MARKET_SYMBOLS = ASSET_CONFIG.filter((asset) => asset.kind === 'market').map((asset) => asset.symbol);
// Positions recorded as an amount spent on a date (no share count given).
const PURCHASES = Object.fromEntries(
  ASSET_CONFIG.filter((asset) => asset.kind === 'market' && asset.quantity == null && asset.purchase).map((asset) => [asset.symbol, asset.purchase]),
);
const REFRESH_MS = 5 * 60 * 1000;
const REBALANCE_PREVIEW = 6;

const CATEGORY_COLORS: Record<string, string> = {
  'Core Equities': MO_COLORS.blue,
  'Speculative Equities': MO_COLORS.purple,
  'Crypto Infrastructure & Altcoins': MO_COLORS.orange,
  'Fixed Income / Cash': MO_COLORS.green,
  'Pre-Seed': MO_COLORS.pink,
  'MoCoin Treasury': MO_COLORS.cyan,
};

const ASSET_COLORS = [
  MO_COLORS.blue, MO_COLORS.blueLight, MO_COLORS.cyan, MO_COLORS.blueDark,
  MO_COLORS.purple, MO_COLORS.purpleLight, MO_COLORS.indigo,
  MO_COLORS.orange, MO_COLORS.yellow, MO_COLORS.teal, MO_COLORS.lime,
  MO_COLORS.green, MO_COLORS.gray, MO_COLORS.pink, MO_COLORS.purpleDark, MO_COLORS.rose,
];

const PERIODS: { key: TimePeriod; label: string; description: string }[] = [
  { key: '1h', label: '1H', description: 'past hour' },
  { key: '4h', label: '4H', description: 'past 4 hours' },
  { key: '1d', label: '1D', description: 'past day' },
  { key: '7d', label: '1W', description: 'past week' },
  { key: '1m', label: '1M', description: 'past month' },
];

const CHANGE_KEYS: Record<TimePeriod, ChangeKey> = {
  '1h': 'change1h',
  '4h': 'change4h',
  '1d': 'change1d',
  '7d': 'change7d',
  '1m': 'change1m',
};

const PROJECTION_HORIZONS: { label: string; days: number }[] = [
  { label: 'Today', days: 0 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
];

const TOOLTIP_STYLE = {
  backgroundColor: '#111827',
  border: '1px solid #374151',
  borderRadius: '12px',
  color: '#fff',
  padding: '8px 12px',
};

type MarketQuote = {
  c?: number;
  price?: number;
  error?: string;
  usdCadRate?: number;
  usdCadRateIsFallback?: boolean;
  history?: PricePoint[];
  purchase?: { quantity: number; bookValue: number; priceOnDate: number } | { error: string };
  change1h?: number;
  change4h?: number;
  change1d?: number;
  change7d?: number;
  change1m?: number;
};
type MarketData = Record<string, MarketQuote>;

const ZERO_CHANGES = { change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 };

// ---------- pure helpers ----------

function getFxRate(marketData: MarketData | null) {
  const quote = marketData && Object.values(marketData).find((entry) => entry?.usdCadRate);
  return {
    usdCadRate: quote?.usdCadRate || 0,
    isFallback: !quote || Boolean(quote.usdCadRateIsFallback),
  };
}

function convert(amount: number, from: BaseCurrency, to: BaseCurrency, usdCadRate: number) {
  if (from === to || !usdCadRate) return amount;
  return to === 'CAD' ? amount * usdCadRate : amount / usdCadRate;
}

function buildAssets(
  marketData: MarketData | null,
  treasury: TreasuryResponse | null,
  currency: BaseCurrency,
): Asset[] {
  const { usdCadRate } = getFxRate(marketData);

  const assets: Asset[] = ASSET_CONFIG.map((config) => {
    const base = { ...config, ...ZERO_CHANGES, price: 0, value: 0, currentAllocation: 0, isHeld: false };

    switch (config.kind) {
      case 'market': {
        const quote = marketData?.[config.symbol];
        const resolved = quote?.purchase && !('error' in quote.purchase) ? quote.purchase : undefined;
        const quantity = config.quantity ?? resolved?.quantity ?? 0;
        // A dated purchase counts as held even before its share count is
        // known, so a failed lookup shows as an error rather than "not held".
        const isHeld = quantity > 0 || (config.quantity == null && Boolean(config.purchase));
        if (!quote || quote.error) {
          return { ...base, isHeld, hasPriceError: Boolean(marketData) };
        }
        const price = quote.c || quote.price || 0;
        const gain = resolved ? quantity * price - resolved.bookValue : 0;
        const holdingLabel = resolved
          ? `${resolved.quantity.toFixed(4)} shares · ${gain >= 0 ? '+' : ''}${formatMoneyFor(currency)(gain)}`
          : config.purchase && config.quantity == null
            ? 'Share count unavailable'
            : config.holdingLabel;
        return {
          ...base,
          holdingLabel,
          price,
          value: quantity * price,
          isHeld,
          hasPriceError: config.quantity == null && Boolean(config.purchase) && !resolved,
          bookValue: resolved?.bookValue,
          history: quote.history,
          change1h: quote.change1h || 0,
          change4h: quote.change4h || 0,
          change1d: quote.change1d || 0,
          change7d: quote.change7d || 0,
          change1m: quote.change1m || 0,
        };
      }
      case 'cash': {
        const quantity = config.quantity || 0;
        const price = convert(1, config.currency || 'USD', currency, usdCadRate);
        return { ...base, price, value: quantity * price, isHeld: quantity > 0 };
      }
      case 'manual': {
        if (config.manualValue == null) return base;
        return {
          ...base,
          value: convert(config.manualValue, config.currency || 'USD', currency, usdCadRate),
          isHeld: config.manualValue > 0,
        };
      }
      case 'onchain': {
        const totals = treasury?.totals;
        if (!totals) return base;
        const valueUsd = config.symbol === 'MoCoin' ? totals.moCoinValueUsd : totals.lpValueUsd;
        return { ...base, value: convert(valueUsd, 'USD', currency, usdCadRate), isHeld: valueUsd > 0, isLive: true };
      }
    }
  });

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  return assets.map((asset) => ({
    ...asset,
    currentAllocation: totalValue > 0 ? (asset.value / totalValue) * 100 : 0,
  }));
}

function weightedChange(assets: Asset[], changeKey: ChangeKey, weightKey: 'currentAllocation' | 'targetAllocation') {
  const totalWeight = assets.reduce((sum, asset) => sum + asset[weightKey], 0);
  if (totalWeight === 0) return 0;
  return assets.reduce((sum, asset) => sum + (asset[changeKey] * asset[weightKey]) / totalWeight, 0);
}

// Value of each asset at the start of the period is value / (1 + change), so
// summing the difference gives the reserve's actual money change.
function moneyChange(assets: Asset[], changeKey: ChangeKey) {
  return assets.reduce((sum, asset) => {
    const change = asset[changeKey];
    if (!asset.value || change <= -100) return sum;
    return sum + asset.value - asset.value / (1 + change / 100);
  }, 0);
}

const dayKey = (timestamp: number) => new Date(timestamp * 1000).toISOString().slice(0, 10);

// Reserve value per day over the last month, from real daily closes of the
// market assets actually held. Stocks don't trade on weekends, so each asset
// carries its last close forward. Cash, the pre-seed valuation and on-chain
// positions have no history here and are held at today's value.
function buildValueHistory(assets: Asset[]) {
  const held = assets.filter((asset) => asset.kind === 'market' && asset.isHeld);
  const flatValue = assets
    .filter((asset) => asset.kind !== 'market')
    .reduce((sum, asset) => sum + asset.value, 0);

  if (!held.length || held.some((asset) => !asset.history?.length)) return [];

  const closesByAsset = held.map((asset) => {
    const byDay = new Map<string, number>();
    asset.history!.forEach((point) => byDay.set(dayKey(point.t), point.c));
    return byDay;
  });

  const days = Array.from(new Set(held.flatMap((asset) => asset.history!.map((point) => dayKey(point.t))))).sort();
  const lastClose: (number | undefined)[] = held.map(() => undefined);

  const series: { day: string; value: number }[] = [];
  for (const day of days) {
    closesByAsset.forEach((byDay, index) => {
      if (byDay.has(day)) lastClose[index] = byDay.get(day);
    });
    // Skip leading days until every held asset has a price.
    if (lastClose.some((close) => close === undefined)) continue;
    const marketValue = held.reduce((sum, asset, index) => sum + (asset.quantity || 0) * (lastClose[index] as number), 0);
    series.push({ day, value: marketValue + flatValue });
  }

  // Pin the final point to the live value so the chart ends where the headline does.
  const liveTotal = assets.reduce((sum, asset) => sum + asset.value, 0);
  if (series.length) series[series.length - 1] = { ...series[series.length - 1], value: liveTotal };
  return series;
}

function formatMoneyFor(currency: BaseCurrency) {
  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = currency === 'CAD' ? 'C' : '';
  return (value: number) => {
    const formatted = formatter.format(Math.abs(value));
    return `${value < 0 ? '-' : ''}${prefix}${formatted}`;
  };
}

const formatPercent = (value: number, signed = true) =>
  `${signed && value > 0 ? '+' : ''}${value.toFixed(2)}%`;

const changeColor = (value: number) => (value > 0 ? 'text-emerald-400' : value < 0 ? 'text-red-400' : 'text-gray-400');

const formatDay = (day: string) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

// ---------- presentational pieces ----------

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
  size?: 'sm' | 'md';
}) {
  return (
    <div className="inline-flex rounded-full bg-white/[0.06] p-1">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          aria-pressed={value === option.key}
          className={`rounded-full font-medium transition-colors ${
            size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
          } ${value === option.key ? 'bg-white text-black' : 'text-gray-300 hover:text-white'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function AssetBadge({ symbol, color }: { symbol: string; color: string }) {
  const initials = symbol.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || symbol.slice(0, 2);
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
      style={{ backgroundColor: `${color}33`, color }}
    >
      {initials}
    </div>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`} />;
}

// ---------- page ----------

export default function StrategicReserve() {
  const [view, setView] = useState<'asset' | 'industry'>('asset');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7d');
  const [currency, setCurrency] = useState<BaseCurrency>('CAD');

  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [treasury, setTreasury] = useState<TreasuryResponse | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [showAllRebalance, setShowAllRebalance] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/market-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols: MARKET_SYMBOLS, baseCurrency: currency, purchases: PURCHASES }),
        });
        if (!response.ok) throw new Error(`Market data request failed (${response.status})`);
        const data = await response.json();
        if (cancelled) return;
        setMarketData(data);
        setMarketError(null);
        setLastUpdate(new Date());
      } catch (error: any) {
        if (!cancelled) setMarketError(error.message || 'Market data unavailable');
      }
    };

    setMarketData(null);
    fetchPrices();
    const interval = setInterval(fetchPrices, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [currency]);

  useEffect(() => {
    let cancelled = false;

    const fetchTreasury = async () => {
      try {
        const response = await fetch('/api/treasury/balances');
        if (!response.ok) throw new Error(`Treasury request failed (${response.status})`);
        const data: TreasuryResponse = await response.json();
        if (!cancelled) setTreasury(data);
      } catch (error: any) {
        if (!cancelled) setTreasury({ configured: false, error: error.message, pools: [] });
      }
    };

    fetchTreasury();
    const interval = setInterval(fetchTreasury, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const loading = !marketData && !marketError;
  const formatMoney = useMemo(() => formatMoneyFor(currency), [currency]);
  const changeKey = CHANGE_KEYS[timePeriod];
  const period = PERIODS.find((entry) => entry.key === timePeriod)!;

  const assets = useMemo(() => buildAssets(marketData, treasury, currency), [marketData, treasury, currency]);
  const fx = getFxRate(marketData);

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange = weightedChange(assets, changeKey, 'currentAllocation');
  const totalMoneyChange = moneyChange(assets, changeKey);
  const targetTotal = assets.reduce((sum, asset) => sum + asset.targetAllocation, 0);
  const unallocatedTarget = Math.max(0, 100 - targetTotal);

  const heldAssets = assets.filter((asset) => asset.isHeld);
  const notHeldAssets = assets.filter((asset) => !asset.isHeld && asset.targetAllocation > 0);

  const valueHistory = useMemo(() => buildValueHistory(assets), [assets]);

  const assetColor = (symbol: string) =>
    ASSET_COLORS[ASSET_CONFIG.findIndex((asset) => asset.symbol === symbol) % ASSET_COLORS.length];

  const categories = Array.from(new Set(ASSET_CONFIG.map((asset) => asset.category)));
  const categoryRows = categories.map((name) => {
    const members = assets.filter((asset) => asset.category === name);
    return {
      key: name,
      name,
      color: CATEGORY_COLORS[name] || MO_COLORS.gray,
      current: members.reduce((sum, asset) => sum + asset.currentAllocation, 0),
      target: members.reduce((sum, asset) => sum + asset.targetAllocation, 0),
      value: members.reduce((sum, asset) => sum + asset.value, 0),
      change: weightedChange(members, changeKey, 'currentAllocation'),
    };
  });
  const assetRows = assets.map((asset) => ({
    key: asset.symbol,
    name: asset.symbol,
    color: assetColor(asset.symbol),
    current: asset.currentAllocation,
    target: asset.targetAllocation,
    value: asset.value,
    change: asset[changeKey],
  }));
  const allocationRows = (view === 'industry' ? categoryRows : assetRows).filter((row) => row.current > 0 || row.target > 0);

  // Rebalance: compare each asset's weight to its target.
  const rebalanceActions = assets
    .filter((asset) => asset.targetAllocation > 0 || asset.currentAllocation > 0)
    .map((asset) => {
      const delta = asset.targetAllocation - asset.currentAllocation;
      const action = Math.abs(delta) < 0.5 ? 'Hold' : delta > 0 ? 'Add' : 'Reduce';
      return { ...asset, action, delta, estimatedValue: (totalValue * Math.abs(delta)) / 100 };
    })
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const maxRebalanceDelta = Math.max(...rebalanceActions.map((asset) => Math.abs(asset.delta)), 1);

  // Projection: compounds the trailing one-month return of each mix. The
  // selected period chip deliberately doesn't feed this — extending a single
  // hour or day out to a year turns noise into absurd numbers.
  const currentMonthly = weightedChange(assets, 'change1m', 'currentAllocation');
  const idealMonthly = weightedChange(assets, 'change1m', 'targetAllocation');
  const project = (monthlyPercent: number, days: number) => totalValue * Math.pow(1 + monthlyPercent / 100, days / 30);
  const projectionData = PROJECTION_HORIZONS.map((horizon) => ({
    horizon: horizon.label,
    'Current mix': project(currentMonthly, horizon.days),
    'Target mix': project(idealMonthly, horizon.days),
  }));
  const finalProjection = projectionData[projectionData.length - 1];
  const currentProjectedGain = finalProjection['Current mix'] - totalValue;
  const idealProjectedGain = finalProjection['Target mix'] - totalValue;
  const rebalanceUplift = idealProjectedGain - currentProjectedGain;

  const chartUp = valueHistory.length < 2 || valueHistory[valueHistory.length - 1].value >= valueHistory[0].value;
  const chartColor = chartUp ? MO_COLORS.green : MO_COLORS.red;

  return (
    <main className="min-h-screen bg-black pb-40 pt-28 text-white sm:pb-16 sm:pt-32">
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 sm:space-y-6 sm:px-6">
        {/* Balance header */}
        <header className="px-1 pb-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-gray-400">MoCoin Strategic Reserve</p>
            <Segmented
              size="sm"
              options={[{ key: 'CAD', label: 'CAD' }, { key: 'USD', label: 'USD' }]}
              value={currency}
              onChange={setCurrency}
            />
          </div>

          {loading ? (
            <div className="mt-3 space-y-2">
              <Skeleton className="h-11 w-56" />
              <Skeleton className="h-5 w-40" />
            </div>
          ) : (
            <>
              <h1 className="mt-2 text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl">
                {formatMoney(totalValue)}
              </h1>
              <p className={`mt-2 text-sm font-medium tabular-nums sm:text-base ${changeColor(totalMoneyChange)}`}>
                {totalMoneyChange >= 0 ? '▲' : '▼'} {formatMoney(Math.abs(totalMoneyChange))} ({formatPercent(totalChange)})
                <span className="ml-1 font-normal text-gray-400">{period.description}</span>
              </p>
            </>
          )}

          <p className="mt-2 text-xs text-gray-500">
            {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Loading live prices…'}
            {' · '}Refreshes every 5 min
          </p>

          {(marketError || (marketData && fx.isFallback)) && (
            <div className="mt-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {marketError
                ? `Live prices couldn't be loaded (${marketError}). Showing the last values received.`
                : `The live USD/CAD rate is unavailable, so conversions use a fallback rate of ${fx.usdCadRate.toFixed(2)}.`}
            </div>
          )}
        </header>

        {/* Value chart */}
        <Card className="px-2 pb-4 pt-4 sm:px-4">
          <div className="px-2 sm:px-2">
            <p className="text-sm text-gray-400">Reserve value · past 30 days</p>
          </div>
          {loading ? (
            <Skeleton className="mx-2 mt-4 h-48 sm:h-56" />
          ) : valueHistory.length > 1 ? (
            <div className="mt-2 h-48 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={valueHistory} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                  <defs>
                    <linearGradient id="reserveFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColor} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" hide />
                  <YAxis hide domain={['dataMin', 'dataMax']} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    labelStyle={{ color: '#9ca3af', marginBottom: 4 }}
                    labelFormatter={(day: any) => formatDay(String(day))}
                    formatter={(value: any) => [formatMoney(Number(value)), 'Value']}
                  />
                  <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} fill="url(#reserveFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="px-2 py-12 text-center text-sm text-gray-500">Price history unavailable right now.</p>
          )}

          <div className="mt-3 flex justify-center px-2">
            <Segmented
              options={PERIODS.map((entry) => ({ key: entry.key, label: entry.label }))}
              value={timePeriod}
              onChange={setTimePeriod}
            />
          </div>
          <p className="mt-3 px-2 text-center text-xs text-gray-500">
            Chart uses daily closes of the market assets held. Cash, pre-seed and on-chain positions are held at today&apos;s value.
          </p>
        </Card>

        {/* Holdings */}
        <Card>
          <SectionTitle title="Holdings" subtitle={`As of ${new Date(`${HOLDINGS_AS_OF}T12:00:00Z`).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`} />
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((index) => <Skeleton key={index} className="h-14" />)}
            </div>
          ) : (
            <ul className="-mx-2 divide-y divide-white/5">
              {heldAssets.map((asset) => (
                <li key={asset.symbol} className="flex items-center gap-3 px-2 py-3">
                  <AssetBadge symbol={asset.symbol} color={assetColor(asset.symbol)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-white">{asset.symbol}</span>
                      {asset.isLive && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                          Live
                        </span>
                      )}
                    </div>
                    <div className="truncate text-sm text-gray-400">{asset.holdingLabel || asset.name}</div>
                  </div>
                  <div className="shrink-0 text-right tabular-nums">
                    <div className="font-medium text-white">{formatMoney(asset.value)}</div>
                    <div className={`text-sm ${asset.hasPriceError ? 'text-amber-300' : changeColor(asset[changeKey])}`}>
                      {asset.hasPriceError
                        ? 'Price unavailable'
                        : asset.kind === 'market'
                          ? formatPercent(asset[changeKey])
                          : `${asset.currentAllocation.toFixed(1)}% of reserve`}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!loading && notHeldAssets.length > 0 && (
            <>
              <h3 className="mt-6 text-sm font-semibold text-gray-300">Targeted, not yet held</h3>
              <p className="mt-1 text-xs text-gray-500">
                These have a target allocation but no position yet, so they count as 0% of the reserve.
              </p>
              <ul className="-mx-2 mt-2 divide-y divide-white/5">
                {notHeldAssets.map((asset) => (
                  <li key={asset.symbol} className="flex items-center gap-3 px-2 py-3 opacity-80">
                    <AssetBadge symbol={asset.symbol} color={MO_COLORS.gray} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-white">{asset.symbol}</div>
                      <div className="truncate text-sm text-gray-500">
                        {asset.kind === 'manual' ? 'Valuation pending' : asset.kind === 'onchain' ? 'Wallet not connected' : asset.name}
                      </div>
                    </div>
                    <div className="shrink-0 text-right tabular-nums">
                      <div className="text-sm text-gray-300">Target {asset.targetAllocation.toFixed(2)}%</div>
                      {asset.kind === 'market' && !asset.hasPriceError && (
                        <div className={`text-sm ${changeColor(asset[changeKey])}`}>{formatPercent(asset[changeKey])}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        {/* Allocation */}
        <Card>
          <SectionTitle
            title="Allocation"
            subtitle="Current weight vs target"
            right={
              <Segmented
                size="sm"
                options={[{ key: 'asset', label: 'Asset' }, { key: 'industry', label: 'Category' }]}
                value={view}
                onChange={setView}
              />
            }
          />
          {loading ? (
            <Skeleton className="mx-auto h-52 w-52 rounded-full" />
          ) : (
            <div className="relative mx-auto h-52 w-full max-w-xs sm:h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationRows.filter((row) => row.current > 0)}
                    dataKey="current"
                    nameKey="name"
                    innerRadius="68%"
                    outerRadius="100%"
                    paddingAngle={2}
                    stroke="none"
                  >
                    {allocationRows.filter((row) => row.current > 0).map((row) => (
                      <Cell key={row.key} fill={row.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} itemStyle={{ color: '#fff' }} formatter={(value: any, name: any) => [`${Number(value).toFixed(2)}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-400">{heldAssets.length} held</span>
                <span className="text-lg font-semibold tabular-nums">{formatMoney(totalValue)}</span>
              </div>
            </div>
          )}

          <ul className="-mx-2 mt-4 divide-y divide-white/5">
            {allocationRows.map((row) => (
              <li key={row.key} className="flex items-center gap-3 px-2 py-3">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                <span className="min-w-0 flex-1 truncate text-sm text-white">{row.name}</span>
                <span className="w-16 text-right text-sm font-medium tabular-nums text-white">{row.current.toFixed(1)}%</span>
                <span className="w-20 text-right text-xs tabular-nums text-gray-500">of {row.target.toFixed(1)}%</span>
              </li>
            ))}
            {unallocatedTarget > 0.01 && (
              <li className="flex items-center gap-3 px-2 py-3">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-dashed border-gray-500" />
                <span className="min-w-0 flex-1 truncate text-sm text-gray-400">Unallocated target</span>
                <span className="w-16 text-right text-sm tabular-nums text-gray-500">—</span>
                <span className="w-20 text-right text-xs tabular-nums text-gray-500">{unallocatedTarget.toFixed(1)}%</span>
              </li>
            )}
          </ul>
        </Card>

        {/* Rebalance */}
        <Card>
          <SectionTitle title="Rebalance" subtitle="What it would take to reach each target" />
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((index) => <Skeleton key={index} className="h-12" />)}
            </div>
          ) : (
            <ul className="space-y-4">
              {(showAllRebalance ? rebalanceActions : rebalanceActions.slice(0, REBALANCE_PREVIEW)).map((asset) => {
                const isAdd = asset.action === 'Add';
                const isReduce = asset.action === 'Reduce';
                const barWidth = `${Math.min(50, (Math.abs(asset.delta) / maxRebalanceDelta) * 50)}%`;
                return (
                  <li key={asset.symbol}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm font-medium text-white">{asset.symbol}</span>
                      <span className={`shrink-0 text-sm font-semibold tabular-nums ${isAdd ? 'text-emerald-400' : isReduce ? 'text-red-400' : 'text-gray-400'}`}>
                        {asset.action === 'Hold' ? 'Hold' : `${asset.action} ${formatMoney(asset.estimatedValue)}`}
                      </span>
                    </div>
                    <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="absolute left-1/2 top-0 h-full w-px bg-white/20" />
                      <div
                        className={`absolute top-0 h-full rounded-full ${isAdd ? 'bg-emerald-500' : isReduce ? 'bg-red-500' : 'bg-gray-500'}`}
                        style={{ width: barWidth, left: isAdd ? '50%' : undefined, right: isReduce ? '50%' : undefined }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-xs tabular-nums text-gray-500">
                      <span>Now {asset.currentAllocation.toFixed(1)}%</span>
                      <span>Target {asset.targetAllocation.toFixed(1)}%</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {!loading && rebalanceActions.length > REBALANCE_PREVIEW && (
            <button
              type="button"
              onClick={() => setShowAllRebalance((value) => !value)}
              className="mt-4 w-full rounded-full bg-white/[0.06] py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-white/[0.1]"
            >
              {showAllRebalance ? 'Show less' : `Show all ${rebalanceActions.length}`}
            </button>
          )}
        </Card>

        {/* Projection */}
        <Card>
          <SectionTitle
            title="If the last month repeated"
            subtitle="Compounds each mix's trailing 1-month return. An illustration, not a forecast."
          />
          {loading ? (
            <Skeleton className="h-48" />
          ) : (
            <>
              <div className="h-48 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <XAxis dataKey="horizon" stroke="#6b7280" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: any, name: any) => [formatMoney(Number(value)), name]} />
                    <Line type="monotone" dataKey="Current mix" stroke={MO_COLORS.blue} strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Target mix" stroke={MO_COLORS.purpleLight} strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: 'Current mix, 1Y', value: currentProjectedGain, note: `${formatPercent(currentMonthly)} / month`, dot: MO_COLORS.blue },
                  { label: 'Target mix, 1Y', value: idealProjectedGain, note: `${formatPercent(idealMonthly)} / month`, dot: MO_COLORS.purpleLight },
                  { label: 'Rebalancing difference', value: rebalanceUplift, note: 'Target minus current', dot: MO_COLORS.gray },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3 sm:block">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stat.dot }} />
                      {stat.label}
                    </div>
                    <div className="text-right sm:mt-1 sm:text-left">
                      <div className={`font-semibold tabular-nums ${changeColor(stat.value)}`}>
                        {stat.value > 0 ? '+' : ''}{formatMoney(stat.value)}
                      </div>
                      <div className="text-xs tabular-nums text-gray-500">{stat.note}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Assumes the past month&apos;s return repeats every month. Ignores volatility, fees and changing markets. Not investment advice.
              </p>
            </>
          )}
        </Card>

        {/* Liquidity pools */}
        <Card>
          <SectionTitle title="Liquidity pools" subtitle="Pools containing MoCoin, and pools of the tokens it pairs with" />
          {!treasury ? (
            <div className="space-y-3">
              {[0, 1].map((index) => <Skeleton key={index} className="h-12" />)}
            </div>
          ) : treasury.pools.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              {treasury.poolsError ? `Pool scan unavailable (${treasury.poolsError}).` : 'No pools found.'}
            </p>
          ) : (
            <ul className="-mx-2 divide-y divide-white/5">
              {treasury.pools.map((pool) => {
                const position = treasury.lpPositions?.find((entry) => entry.pairAddress === pool.pairAddress);
                return (
                  <li key={pool.pairAddress}>
                    <a
                      href={pool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-white/[0.04]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-white">{pool.label}</div>
                        <div className="truncate text-xs text-gray-500">
                          <span className="capitalize">{pool.dexId}</span> · {pool.hop === 0 ? 'MoCoin pair' : 'Paired token'}
                        </div>
                      </div>
                      <div className="shrink-0 text-right tabular-nums">
                        <div className="text-sm text-white">{formatMoney(convert(pool.liquidityUsd, 'USD', currency, fx.usdCadRate))}</div>
                        <div className="text-xs text-gray-500">
                          {position ? `Treasury ${(position.poolShare * 100).toFixed(2)}%` : 'liquidity'}
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
          {treasury && !treasury.configured && (
            <p className="mt-3 text-xs text-gray-500">
              Treasury wallet not connected yet, so MoCoin and LP holdings aren&apos;t included in the totals.
            </p>
          )}
        </Card>

        <div className="pt-4 text-center">
          <a
            href="/vestmentz"
            className="inline-block rounded-full bg-gradient-to-r from-[#3ca5de] to-[#8743f7] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            ← Back to MoVestmentz
          </a>
        </div>
      </div>
    </main>
  );
}

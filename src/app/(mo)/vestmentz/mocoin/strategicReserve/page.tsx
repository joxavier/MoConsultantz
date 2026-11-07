'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Link from 'next/link';
import treasuryConfig from '@/data/treasuryConfig.json';
import { localNews, newsByAsset, substackNews, type NewsItem } from '@/lib/assetNews';
import { pinnedPosts, type SubstackPost } from '@/lib/substack';
import { RAYDIUM_SWAP_URL, RESERVE_CRUMBS, RESERVE_FAQS, breadcrumbJsonLd, faqJsonLd, jsonLdScript } from '@/lib/mocoinSeo';
import Breadcrumbs from '../../../components/Breadcrumbs';
import { WalletSignInButton, isHolder, shortAddress, signOutOfMo, useMoSession, type MoSessionInfo } from '../../../components/moId';
import type {
  Asset,
  AssetConfig,
  BaseCurrency,
  ChangeKey,
  PriceHistory,
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

// Holdings come from /api/treasury/config (the Google Sheet), never from a
// bundled file: MoCoin holders get targets and the watchlist, everyone else
// only the held positions.
type ReserveConfig = { holdingsAsOf: string; assets: AssetConfig[]; source: 'sheet' | 'file'; targetsVisible: boolean };

// What to ask /api/market-data for: every traded asset plus MoCoin's own
// market data, and positions recorded as an amount spent on a date.
function marketRequest(assets: AssetConfig[]) {
  const symbols = [...assets.filter((asset) => asset.kind === 'market').map((asset) => asset.symbol), 'MOCOIN'];
  const purchases = Object.fromEntries(
    assets.filter((asset) => asset.kind === 'market' && asset.quantity == null && asset.purchase).map((asset) => [asset.symbol, asset.purchase]),
  );
  return JSON.stringify({ symbols, purchases });
}
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

const PERIOD_SECONDS: Record<TimePeriod, number> = {
  '1h': 60 * 60,
  '4h': 4 * 60 * 60,
  '1d': 24 * 60 * 60,
  '7d': 7 * 24 * 60 * 60,
  '1m': 30 * 24 * 60 * 60,
};

// What the page can show values in. BTC isn't a currency the price API
// knows about: the page asks for USD and divides by BTC's own USD price.
type DisplayCurrency = BaseCurrency | 'BTC';
type Rates = { usdCad: number; btcUsd: number };

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
  currency?: BaseCurrency;
  c?: number;
  price?: number;
  error?: string;
  usdCadRate?: number;
  usdCadRateIsFallback?: boolean;
  history?: PriceHistory;
  purchase?: { quantity: number; bookValue: number; priceOnDate: number } | { error: string };
  market?: MoCoinMarket;
  change1h?: number;
  change4h?: number;
  change1d?: number;
  change7d?: number;
  change1m?: number;
};
type MarketData = Record<string, MarketQuote>;

// MoCoin's market figures from /api/market-data, in the display currency
// (supplies are in MoCoin).
type MoCoinMarket = {
  priceUsd: number;
  marketCap: number | null;
  fullyDilutedValue: number | null;
  volume24h: number | null;
  liquidity: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  treasuryHeld: number;
  pairUrl: string;
};

const ZERO_CHANGES = { change1h: 0, change4h: 0, change1d: 0, change7d: 0, change1m: 0 };

// ---------- pure helpers ----------

function getFxRate(marketData: MarketData | null) {
  const quote = marketData && Object.values(marketData).find((entry) => entry?.usdCadRate);
  return {
    usdCadRate: quote?.usdCadRate || 0,
    isFallback: !quote || Boolean(quote.usdCadRateIsFallback),
  };
}

function convert(amount: number, from: BaseCurrency, to: DisplayCurrency, rates: Rates) {
  if (from === to) return amount;
  if (to === 'BTC') {
    const usd = from === 'USD' || !rates.usdCad ? amount : amount / rates.usdCad;
    return rates.btcUsd ? usd / rates.btcUsd : 0;
  }
  if (!rates.usdCad) return amount;
  return to === 'CAD' ? amount * rates.usdCad : amount / rates.usdCad;
}

// Change of A measured in B, given both changes measured in USD.
const relativeChange = (a: number, b: number) => ((1 + a / 100) / (1 + b / 100) - 1) * 100;

// Price at time t from a series sorted by time: the last point at or before
// t, or undefined if the series starts after t.
function priceAt(series: PricePoint[] | undefined, t: number) {
  if (!series?.length || series[0].t > t) return undefined;
  let price = series[0].c;
  for (const point of series) {
    if (point.t > t) break;
    price = point.c;
  }
  return price;
}

const CHANGE_FIELDS = ['change1h', 'change4h', 'change1d', 'change7d', 'change1m'] as const;

// Re-expresses USD market data in BTC: prices and history divided by BTC's
// price at the same moment, changes taken relative to BTC's. Also adds
// `_cash_USD` / `_cash_CAD` quotes so both kinds of cash move against BTC.
function toBtcView(data: MarketData): { data: MarketData; btcUsd: number } | null {
  const btc = data.BTC;
  const btcUsd = btc && !btc.error ? btc.c || btc.price || 0 : 0;
  if (!btc || !btcUsd) return null;

  const divideHistory = (history: PriceHistory | undefined, invert = false): PriceHistory | undefined =>
    history &&
    Object.fromEntries(
      Object.entries(history).map(([period, points]) => [
        period,
        points!.map((point) => {
          const btcThen = priceAt(btc.history?.[period as TimePeriod], point.t) || btcUsd;
          return { t: point.t, c: (invert ? 1 : point.c) / btcThen };
        }),
      ]),
    );
  const relativeChanges = (quote: MarketQuote, invert = false) =>
    Object.fromEntries(CHANGE_FIELDS.map((key) => [key, relativeChange(invert ? 0 : quote[key] || 0, btc[key] || 0)]));

  const out: MarketData = {};
  for (const [symbol, quote] of Object.entries(data)) {
    if (symbol === '_fx' || !quote || quote.error) {
      out[symbol] = quote;
      continue;
    }
    const price = (quote.c || quote.price || 0) / btcUsd;
    const purchase =
      quote.purchase && !('error' in quote.purchase)
        ? { ...quote.purchase, bookValue: quote.purchase.bookValue / btcUsd, priceOnDate: quote.purchase.priceOnDate / btcUsd }
        : quote.purchase;
    const toBtc = (usd: number | null) => (usd == null ? null : usd / btcUsd);
    const market = quote.market && {
      ...quote.market,
      marketCap: toBtc(quote.market.marketCap),
      fullyDilutedValue: toBtc(quote.market.fullyDilutedValue),
      volume24h: toBtc(quote.market.volume24h),
      liquidity: toBtc(quote.market.liquidity),
    };
    out[symbol] = { ...quote, c: price, price, purchase, market, history: divideHistory(quote.history), ...relativeChanges(quote) };
  }

  // One USD is 1/BTC; one CAD is (CAD in USD)/BTC, using the USD-base FX quote.
  out._cash_USD = { history: divideHistory(btc.history, true), ...relativeChanges(btc, true) };
  const fx = data._fx;
  out._cash_CAD =
    fx && !fx.error && fx.currency === 'CAD'
      ? { history: divideHistory(fx.history), ...relativeChanges(fx) }
      : { error: 'USD/CAD unavailable' };

  return { data: out, btcUsd };
}

function buildAssets(
  assetConfig: AssetConfig[],
  marketData: MarketData | null,
  treasury: TreasuryResponse | null,
  currency: DisplayCurrency,
  rates: Rates,
): Asset[] {
  const assets: Asset[] = assetConfig.map((config) => {
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
        const cashCurrency = config.currency || 'USD';
        const price = convert(1, cashCurrency, currency, rates);
        const cash = { ...base, price, value: quantity * price, isHeld: quantity > 0 };
        if (cashCurrency === currency) return cash;

        // Foreign cash moves with the exchange rate, measured in the display
        // currency: the FX quote for USD/CAD, or the synthetic BTC-view quote.
        const fx = marketData?.[`_cash_${cashCurrency}`] ?? (marketData?._fx?.currency === cashCurrency ? marketData._fx : undefined);
        const fxPair = `${cashCurrency}/${currency}`;
        if (!fx || fx.error) {
          return { ...cash, fxPair, hasPriceError: Boolean(marketData) };
        }
        return {
          ...cash,
          fxPair,
          history: fx.history,
          change1h: fx.change1h || 0,
          change4h: fx.change4h || 0,
          change1d: fx.change1d || 0,
          change7d: fx.change7d || 0,
          change1m: fx.change1m || 0,
        };
      }
      case 'manual': {
        if (config.manualValue == null) return base;
        return {
          ...base,
          value: convert(config.manualValue, config.currency || 'USD', currency, rates),
          isHeld: config.manualValue > 0,
        };
      }
      case 'onchain': {
        const totals = treasury?.totals;
        if (!totals) return base;
        const valueUsd = config.symbol === 'MoCoin' ? totals.moCoinValueUsd : totals.lpValueUsd;
        // The treasury's MoCoin moves with MoCoin's own market price.
        const quote = config.symbol === 'MoCoin' ? marketData?.MOCOIN : undefined;
        const live = quote && !quote.error
          ? {
              price: quote.c || quote.price || 0,
              history: quote.history,
              change1h: quote.change1h || 0,
              change4h: quote.change4h || 0,
              change1d: quote.change1d || 0,
              change7d: quote.change7d || 0,
              change1m: quote.change1m || 0,
            }
          : {};
        return { ...base, ...live, value: convert(valueUsd, 'USD', currency, rates), isHeld: valueUsd > 0, isLive: true };
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

// Reserve value across the selected period, from real prices of what's held:
// market assets and foreign cash each have a price series for the period.
// Every series time becomes a point, and each asset carries its last price
// forward (stocks don't trade overnight or at weekends). The pre-seed
// valuation and on-chain positions have no history and stay at today's value.
// The last point is the live total, so the chart ends where the headline does.
function buildValueHistory(assets: Asset[], period: TimePeriod) {
  const now = Math.floor(Date.now() / 1000);
  const start = now - PERIOD_SECONDS[period];
  const liveTotal = assets.reduce((sum, asset) => sum + asset.value, 0);

  const tracked = assets.filter(
    (asset) => asset.value > 0 && asset.price > 0 && Boolean(asset.history?.[period]?.length),
  );
  if (!tracked.length) return [];

  const flatValue = liveTotal - tracked.reduce((sum, asset) => sum + asset.value, 0);
  const units = tracked.map((asset) => asset.value / asset.price);
  const times = Array.from(
    new Set([start, ...tracked.flatMap((asset) => asset.history![period]!.map((point) => point.t).filter((t) => t > start && t < now))]),
  ).sort((a, b) => a - b);

  const series: { t: number; value: number }[] = [];
  for (const t of times) {
    const prices = tracked.map((asset) => priceAt(asset.history![period], t));
    // Skip leading points until every tracked asset has a price.
    if (prices.some((price) => price === undefined)) continue;
    series.push({ t, value: flatValue + prices.reduce<number>((sum, price, index) => sum + (price as number) * units[index], 0) });
  }
  series.push({ t: now, value: liveTotal });
  return series;
}

function formatMoneyFor(currency: DisplayCurrency) {
  if (currency === 'BTC') {
    return (value: number) => {
      const abs = Math.abs(value);
      const digits = abs >= 100 ? 4 : abs >= 1 ? 6 : 8;
      return `${value < 0 ? '-' : ''}₿${abs.toFixed(digits)}`;
    };
  }
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

// Prices keep a few significant digits, so a coin worth $0.0001234 doesn't
// show as $0.00.
function formatPriceFor(currency: DisplayCurrency) {
  const money = formatMoneyFor(currency);
  return (value: number) => {
    const abs = Math.abs(value);
    if (!abs || abs >= 1) return money(value);
    const digits = Math.min(10, Math.max(2, 3 - Math.floor(Math.log10(abs))));
    const symbol = currency === 'BTC' ? '₿' : currency === 'CAD' ? 'C$' : '$';
    return `${value < 0 ? '-' : ''}${symbol}${abs.toFixed(digits)}`;
  };
}

// $383.78K, $2.58T and so on, as on CoinMarketCap.
function formatCompactFor(currency: DisplayCurrency) {
  if (currency === 'BTC') return formatMoneyFor('BTC');
  const formatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const symbol = currency === 'CAD' ? 'C$' : '$';
  return (value: number) => `${value < 0 ? '-' : ''}${symbol}${formatter.format(Math.abs(value))}`;
}

const formatCount = (value: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);

const formatPercent = (value: number, signed = true) =>
  `${signed && value > 0 ? '+' : ''}${value.toFixed(2)}%`;

const changeColor = (value: number) => (value > 0 ? 'text-emerald-400' : value < 0 ? 'text-red-400' : 'text-gray-400');

function formatPointTime(t: number, period: TimePeriod) {
  const date = new Date(t * 1000);
  if (period === '1h' || period === '4h' || period === '1d') {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  if (period === '7d') return date.toLocaleString([], { weekday: 'short', hour: 'numeric' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// ---------- presentational pieces ----------
// Laid out like CoinMarketCap's markets list (stat tiles, tabs, rows with
// green/red changes and sparklines). Dark by default, in the MoCoin page's
// black with blue/purple; the light theme is CoinMarketCap's palette. Colours
// are CSS variables set per theme on the page root (see THEME_CSS).

type Theme = 'dark' | 'light';
const THEME_STORAGE_KEY = 'strategicReserveTheme';

const CMC = {
  green: '#16c784',
  red: '#ea3943',
};

const THEME_CSS = `
.sr-root[data-theme='dark'] {
  color-scheme: dark;
  --sr-bg: #000000;
  --sr-card: #0b0e16;
  --sr-subtle: #121623;
  --sr-pill: #252b3d;
  --sr-line: #1d2233;
  --sr-ink: #ffffff;
  --sr-muted: #9ca3af;
  --sr-faint: #6b7280;
  --sr-blue: #3ca5de;
  --sr-blue-soft: rgba(60, 165, 222, 0.16);
  --sr-blue-line: rgba(60, 165, 222, 0.4);
  --sr-highlight: rgba(135, 67, 247, 0.1);
  --sr-warn-bg: rgba(234, 179, 8, 0.1);
  --sr-warn-line: rgba(234, 179, 8, 0.35);
  --sr-warn-ink: #fde68a;
  background-image: radial-gradient(ellipse at top, rgba(88, 28, 135, 0.28), transparent 55%),
    radial-gradient(ellipse at top right, rgba(30, 58, 138, 0.22), transparent 50%);
}
.sr-root[data-theme='light'] {
  color-scheme: light;
  --sr-bg: #f8fafd;
  --sr-card: #ffffff;
  --sr-subtle: #f8fafd;
  --sr-pill: #ffffff;
  --sr-line: #eff2f5;
  --sr-ink: #0d1421;
  --sr-muted: #58667e;
  --sr-faint: #a1a7bb;
  --sr-blue: #3861fb;
  --sr-blue-soft: rgba(56, 97, 251, 0.1);
  --sr-blue-line: rgba(56, 97, 251, 0.3);
  --sr-highlight: rgba(56, 97, 251, 0.04);
  --sr-warn-bg: #fffbeb;
  --sr-warn-line: #fcd34d;
  --sr-warn-ink: #78350f;
}
.sr-root[data-theme='dark'] .sr-title {
  background: linear-gradient(135deg, #3ca5de, #8743f7, #3ca5de);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
`;

const CHART_TOOLTIP = {
  backgroundColor: 'var(--sr-card)',
  border: '1px solid var(--sr-line)',
  borderRadius: 12,
  color: 'var(--sr-ink)',
};

function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={() => onChange(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--sr-line)] text-[var(--sr-ink)]"
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

const changeText = (value: number) => (value > 0 ? 'text-[#16c784]' : value < 0 ? 'text-[#ea3943]' : 'text-[var(--sr-muted)]');

function Change({ value, className = '' }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 font-semibold tabular-nums ${changeText(value)} ${className}`}>
      {value !== 0 && <span aria-hidden="true" className="text-[0.7em]">{value > 0 ? '▲' : '▼'}</span>}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

function Sparkline({ points, width = 72, height = 28 }: { points?: PricePoint[]; width?: number; height?: number }) {
  if (!points || points.length < 2) return <div style={{ width, height }} />;
  const values = points.map((point) => point.c);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const coords = values.map((value, index) => [
    (index / (values.length - 1)) * width,
    height - 2 - ((value - min) / span) * (height - 4),
  ]);
  const line = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const up = values[values.length - 1] >= values[0];
  const color = up ? CMC.green : CMC.red;
  const id = `spark-${up ? 'up' : 'down'}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${line} ${width},${height}`} fill={`url(#${id})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" />
    </svg>
  );
}

function StatTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-[9.5rem] flex-1 snap-start rounded-2xl border border-[var(--sr-line)] bg-[var(--sr-card)] px-4 py-3 shadow-sm">
      <p className="text-sm text-[var(--sr-muted)]">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

// Half-circle gauge, like CoinMarketCap's Fear & Greed dial: how much of
// MoCoin's market cap the reserve covers (the dial tops out at 100%).
function BackingGauge({ percent }: { percent: number | null }) {
  const clamped = percent == null ? 0 : Math.max(0, Math.min(100, percent));
  const angle = Math.PI * (1 - clamped / 100);
  const x = 40 + 30 * Math.cos(angle);
  const y = 40 - 30 * Math.sin(angle);
  return (
    <div className="relative mx-auto h-[46px] w-[80px]">
      <svg width="80" height="46" viewBox="0 0 80 46" aria-hidden="true">
        <defs>
          <linearGradient id="gauge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={CMC.red} />
            <stop offset="50%" stopColor="#f3d42f" />
            <stop offset="100%" stopColor={CMC.green} />
          </linearGradient>
        </defs>
        <path d="M10 40 A30 30 0 0 1 70 40" fill="none" stroke="url(#gauge)" strokeWidth="7" strokeLinecap="round" />
        {percent != null && <circle cx={x} cy={y} r="5" fill="white" stroke="#0d1421" strokeWidth="2" />}
      </svg>
      <span className="absolute inset-x-0 bottom-0 text-center text-lg font-bold tabular-nums text-[var(--sr-ink)]">
        {percent == null ? '—' : `${percent >= 1000 ? Math.round(percent) : percent.toFixed(0)}%`}
      </span>
    </div>
  );
}

function Pills<T extends string>({ options, value, onChange }: { options: { key: T; label: string }[]; value: T; onChange: (key: T) => void }) {
  return (
    <div className="inline-flex rounded-xl bg-[var(--sr-line)] p-1">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          aria-pressed={value === option.key}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            value === option.key ? 'bg-[var(--sr-pill)] text-[var(--sr-ink)] shadow-sm' : 'text-[var(--sr-muted)]'
          }`}
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
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: `${color}22`, color }}>
      {initials}
    </div>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-[var(--sr-line)] ${className}`} />;
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-[var(--sr-line)] bg-[var(--sr-card)] p-4 shadow-sm sm:p-6 ${className}`}>{children}</section>;
}

function NewsLink({ item, className = '' }: { item: NewsItem; className?: string }) {
  const inner = (
    <>
      <p className="text-xs text-[var(--sr-muted)]">
        {item.source} · {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
      <p className="mt-0.5 font-semibold leading-snug text-[var(--sr-ink)]">{item.title}</p>
    </>
  );
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={`block ${className}`}>{inner}</a>
  ) : (
    <Link href={item.href} className={`block ${className}`}>{inner}</Link>
  );
}

type Tab = 'holdings' | 'markets' | 'news' | 'watchlist' | 'overview';

// Shown in place of a holder-only tab until a MoCoin wallet is signed in.
function HolderGate({ session, loading }: { session: MoSessionInfo | null; loading: boolean }) {
  const holder = session?.holder;
  const buttonClass =
    'w-full rounded-xl bg-gradient-to-r from-[#3ca5de] to-[#8743f7] px-6 py-3 text-base font-bold text-white shadow-sm disabled:opacity-60 sm:w-auto';
  return (
    <section className="rounded-2xl border border-[var(--sr-line)] bg-[var(--sr-card)] px-5 py-8 text-center shadow-sm sm:px-8">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sr-blue-soft)] text-[var(--sr-blue)]" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-bold">For MoCoin holders</h2>
      {loading ? (
        <p className="mt-2 text-sm text-[var(--sr-muted)]">Checking your sign-in…</p>
      ) : !session?.configured ? (
        <p className="mt-2 text-sm text-[var(--sr-muted)]">Holder sign-in isn&apos;t available right now.</p>
      ) : !session.wallet ? (
        <>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--sr-muted)]">
            The Watchlist and Overview (targets, projections and rebalancing) are open to MoCoin holders. Sign in with the Solana wallet that holds your MoCoin. It&apos;s a signature, not a transaction, so it&apos;s free.
          </p>
          <div className="mt-5">
            <WalletSignInButton className={buttonClass} label="Connect wallet" errorClassName="mt-3 text-sm text-[#ea3943]" />
          </div>
        </>
      ) : holder && 'error' in holder ? (
        <p className="mt-2 text-sm text-[var(--sr-muted)]">{holder.error} Please try again in a minute.</p>
      ) : (
        <>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--sr-muted)]">
            {shortAddress(session.wallet)} holds {holder ? formatCount(holder.balance) : 0} MoCoin
            {holder && holder.minimum > 0 ? `; holder pages need ${formatCount(holder.minimum)}.` : '. Any amount unlocks these pages.'}
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={RAYDIUM_SWAP_URL} target="_blank" rel="noopener noreferrer" className={buttonClass}>
              Get MoCoin
            </a>
            <button type="button" onClick={() => signOutOfMo()} className="rounded-xl bg-[var(--sr-line)] px-6 py-3 text-sm font-semibold">
              Use another wallet
            </button>
          </div>
        </>
      )}
    </section>
  );
}

// Only MoCoin holders (checked on-chain via Mo ID) can open these tabs.
const HOLDER_TABS: Tab[] = ['watchlist', 'overview'];

const TABS: { key: Tab; label: string }[] = [
  { key: 'holdings', label: 'Holdings' },
  { key: 'markets', label: 'Markets' },
  { key: 'news', label: 'News' },
  { key: 'watchlist', label: 'Watchlist' },
  { key: 'overview', label: 'Overview' },
];

// The featured MoCoin market row, separate from the treasury's own MoCoin holding.
const MOCOIN_ROW = 'mocoin-market';

// ---------- page ----------

export default function StrategicReserve() {
  const [theme, setThemeState] = useState<Theme>('dark');
  const { session: moSession, loading: moLoading } = useMoSession();
  const holderAccess = isHolder(moSession);
  const [view, setView] = useState<'asset' | 'industry'>('asset');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('1d');
  const [currency, setCurrency] = useState<DisplayCurrency>('CAD');
  const [tab, setTab] = useState<Tab>('holdings');
  const [expanded, setExpanded] = useState<string | null>(null);
  // The BTC view is built from USD prices, so switching between USD and BTC
  // doesn't need a new request.
  const fetchCurrency: BaseCurrency = currency === 'BTC' ? 'USD' : currency;

  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [treasury, setTreasury] = useState<TreasuryResponse | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [showAllRebalance, setShowAllRebalance] = useState(false);
  const [substackPosts, setSubstackPosts] = useState<SubstackPost[]>(() => pinnedPosts());

  // The chosen theme is remembered in this browser only; dark is the default.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') setThemeState(saved);
    } catch {}
  }, []);
  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  };

  // Holdings, re-fetched when the signed-in wallet or its holder status
  // changes, since that decides whether targets and the watchlist come back.
  const [reserve, setReserve] = useState<ReserveConfig | null>(null);
  const [reserveError, setReserveError] = useState<string | null>(null);
  const holderKey = `${moSession?.wallet ?? ''}:${holderAccess}`;
  useEffect(() => {
    let cancelled = false;
    fetch('/api/treasury/config', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(`Holdings request failed (${response.status})`);
        return response.json();
      })
      .then((data: ReserveConfig) => {
        if (cancelled) return;
        setReserve(data);
        setReserveError(null);
      })
      .catch((error: any) => {
        if (!cancelled) setReserveError(error.message || 'Holdings unavailable');
      });
    return () => {
      cancelled = true;
    };
  }, [holderKey]);
  const assetConfig = useMemo(() => reserve?.assets ?? [], [reserve]);
  const targetsVisible = Boolean(reserve?.targetsVisible);
  const marketRequestKey = reserve ? marketRequest(reserve.assets) : null;

  useEffect(() => {
    if (!marketRequestKey) return;
    let cancelled = false;
    const { symbols, purchases } = JSON.parse(marketRequestKey);

    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/market-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols, baseCurrency: fetchCurrency, purchases }),
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
  }, [fetchCurrency, marketRequestKey]);

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

  // Vibes articles: the feed's own plus Substack posts, for the News tab
  // and the per-asset links.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/feed/substack')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { posts: SubstackPost[] } | null) => {
        if (!cancelled && data?.posts?.length) setSubstackPosts(data.posts);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const loading = (!reserve && !reserveError) || (Boolean(reserve) && !marketData && !marketError);
  const formatMoney = useMemo(() => formatMoneyFor(currency), [currency]);
  const changeKey = CHANGE_KEYS[timePeriod];
  const period = PERIODS.find((entry) => entry.key === timePeriod)!;

  const fx = getFxRate(marketData);
  const btcView = useMemo(() => (currency === 'BTC' && marketData ? toBtcView(marketData) : null), [currency, marketData]);
  const btcUnavailable = currency === 'BTC' && Boolean(marketData) && !btcView;
  const viewData = currency === 'BTC' ? btcView?.data ?? null : marketData;
  const rates: Rates = { usdCad: fx.usdCadRate, btcUsd: btcView?.btcUsd || 0 };

  const assets = useMemo(
    () => buildAssets(assetConfig, viewData, treasury, currency, rates),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetConfig, viewData, treasury, currency, rates.usdCad, rates.btcUsd],
  );

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const valueHistory = useMemo(() => buildValueHistory(assets, timePeriod), [assets, timePeriod]);
  // The headline change is the chart's own start-to-now change when there is
  // a chart, so the two always agree.
  const chartStart = valueHistory.length > 1 ? valueHistory[0].value : 0;
  const totalMoneyChange = chartStart > 0 ? totalValue - chartStart : moneyChange(assets, changeKey);
  const totalChange = chartStart > 0 ? (totalMoneyChange / chartStart) * 100 : weightedChange(assets, changeKey, 'currentAllocation');
  const targetTotal = assets.reduce((sum, asset) => sum + asset.targetAllocation, 0);
  const unallocatedTarget = Math.max(0, 100 - targetTotal);

  const heldAssets = assets.filter((asset) => asset.isHeld);
  const notHeldAssets = assets.filter((asset) => !asset.isHeld && asset.targetAllocation > 0);


  const assetColor = (symbol: string) =>
    ASSET_COLORS[assetConfig.findIndex((asset) => asset.symbol === symbol) % ASSET_COLORS.length];

  const categories = Array.from(new Set(assetConfig.map((asset) => asset.category)));
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
      held: members.filter((asset) => asset.isHeld).length,
      total: members.length,
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
  const pieRows = (view === 'industry' ? categoryRows : assetRows).filter((row) => row.current > 0);

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


  const formatPrice = useMemo(() => formatPriceFor(currency), [currency]);
  const formatCompact = useMemo(() => formatCompactFor(currency), [currency]);

  // MoCoin's own market data, in the display currency.
  const mocoin = viewData?.MOCOIN && !viewData.MOCOIN.error ? viewData.MOCOIN : null;
  const mocoinMarket = mocoin?.market ?? null;
  const mocoinPrice = mocoin ? mocoin.c || mocoin.price || 0 : 0;
  const backingPercent = mocoinMarket?.marketCap ? (totalValue / mocoinMarket.marketCap) * 100 : null;

  const newsItems = useMemo(() => [...localNews(), ...substackNews(substackPosts)], [substackPosts]);
  const newsMap = useMemo(() => newsByAsset(newsItems, assetConfig), [newsItems, assetConfig]);
  const relatedItems = useMemo(() => {
    const seen = new Map<string, { item: NewsItem; symbols: string[] }>();
    for (const [symbol, items] of Object.entries(newsMap)) {
      for (const item of items) {
        const entry = seen.get(item.id) ?? { item, symbols: [] };
        entry.symbols.push(symbol);
        seen.set(item.id, entry);
      }
    }
    return Array.from(seen.values()).sort((a, b) => Date.parse(b.item.date) - Date.parse(a.item.date));
  }, [newsMap]);

  const rankedHoldings = [...heldAssets].sort((a, b) => b.value - a.value);

  const openAsset = (symbol: string) => {
    const held = heldAssets.some((asset) => asset.symbol === symbol) || symbol === 'MoCoin';
    setTab(held ? 'holdings' : 'watchlist');
    setExpanded(symbol === 'MoCoin' ? MOCOIN_ROW : symbol);
  };

  const rowSubtitle = (asset: Asset) => {
    if (asset.hasPriceError) return asset.fxPair ? `${asset.fxPair} unavailable` : 'Price unavailable';
    return formatMoney(asset.value);
  };

  // One CoinMarketCap-style row; tapping it opens the details and related news.
  const renderRow = (options: {
    key: string;
    rank: React.ReactNode;
    badge: React.ReactNode;
    title: React.ReactNode;
    subtitle: React.ReactNode;
    price: string;
    change: number | null;
    points?: PricePoint[];
    newsCount: number;
    details: React.ReactNode;
    highlight?: boolean;
  }) => {
    const isOpen = expanded === options.key;
    return (
      <li key={options.key} className={options.highlight ? 'bg-[var(--sr-highlight)]' : ''}>
        <button
          type="button"
          onClick={() => setExpanded(isOpen ? null : options.key)}
          aria-expanded={isOpen}
          className="grid w-full grid-cols-[1.25rem_2.25rem_minmax(0,1fr)_auto_4.5rem] items-center gap-x-2 px-2.5 py-3 text-left sm:gap-x-3 sm:px-4"
        >
          <span className="text-center text-xs font-medium tabular-nums text-[var(--sr-muted)]">{options.rank}</span>
          {options.badge}
          <span className="min-w-0">
            <span className="flex items-center gap-1.5">
              <span className="truncate font-semibold text-[var(--sr-ink)]">{options.title}</span>
              {options.newsCount > 0 && (
                <span className="shrink-0 rounded-full bg-[var(--sr-blue-soft)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-[var(--sr-blue)]">
                  {options.newsCount} news
                </span>
              )}
            </span>
            <span className="block truncate text-sm tabular-nums text-[var(--sr-muted)]">{options.subtitle}</span>
          </span>
          <span className="text-right text-sm font-semibold tabular-nums text-[var(--sr-ink)]">{options.price}</span>
          <span className="flex flex-col items-end">
            <Sparkline points={options.points} />
            {options.change == null ? <span className="text-sm text-[var(--sr-muted)]">—</span> : <Change value={options.change} className="text-sm" />}
          </span>
        </button>
        {isOpen && <div className="px-3 pb-4 sm:px-4">{options.details}</div>}
      </li>
    );
  };

  const newsPreview = (symbol: string) => {
    const items = newsMap[symbol] ?? [];
    if (!items.length) return <p className="mt-3 text-sm text-[var(--sr-muted)]">No related Vibes articles yet.</p>;
    return (
      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sr-muted)]">Related on Vibes</p>
        <ul className="mt-2 space-y-3">
          {items.slice(0, 3).map((item) => (
            <li key={item.id}>
              <NewsLink item={item} />
            </li>
          ))}
        </ul>
        {items.length > 3 && (
          <button type="button" onClick={() => setTab('news')} className="mt-3 text-sm font-semibold text-[var(--sr-blue)]">
            See all {items.length} articles
          </button>
        )}
      </div>
    );
  };

  const assetDetails = (asset: Asset) => (
    <div className="rounded-xl bg-[var(--sr-subtle)] p-4">
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[var(--sr-muted)]">Holding</dt>
          <dd className="font-medium text-[var(--sr-ink)]">{asset.holdingLabel || asset.name}</dd>
        </div>
        <div>
          <dt className="text-[var(--sr-muted)]">Share of reserve</dt>
          <dd className="font-medium tabular-nums text-[var(--sr-ink)]">{asset.currentAllocation.toFixed(2)}%</dd>
        </div>
        <div>
          <dt className="text-[var(--sr-muted)]">Target</dt>
          <dd className="font-medium tabular-nums text-[var(--sr-ink)]">{targetsVisible ? `${asset.targetAllocation.toFixed(2)}%` : 'Holders only'}</dd>
        </div>
        <div>
          <dt className="text-[var(--sr-muted)]">Category</dt>
          <dd className="font-medium text-[var(--sr-ink)]">{asset.category}</dd>
        </div>
      </dl>
      {newsPreview(asset.symbol)}
    </div>
  );

  const priceLabel = (asset: Asset) =>
    asset.hasPriceError || !asset.price ? '—' : asset.kind === 'cash' && !asset.fxPair ? formatPrice(1) : formatPrice(asset.price);

  const assetChange = (asset: Asset) =>
    asset.hasPriceError || (asset.kind !== 'market' && !asset.fxPair && asset.symbol !== 'MoCoin') ? null : asset[changeKey];

  const chartUp = valueHistory.length < 2 || valueHistory[valueHistory.length - 1].value >= valueHistory[0].value;
  const chartColor = chartUp ? CMC.green : CMC.red;

  return (
    <main data-theme={theme} className="sr-root min-h-screen bg-[var(--sr-bg)] pb-40 pt-28 text-[var(--sr-ink)] transition-colors sm:pb-16 sm:pt-32">
      {/* Raw so React doesn't HTML-escape the quotes (a hydration mismatch). */}
      <style dangerouslySetInnerHTML={{ __html: THEME_CSS }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript({ '@graph': [breadcrumbJsonLd(RESERVE_CRUMBS), faqJsonLd(RESERVE_FAQS)] }) }}
      />
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <Breadcrumbs
          crumbs={RESERVE_CRUMBS}
          className="mb-4 text-sm text-[var(--sr-muted)]"
          linkClassName="hover:text-[var(--sr-ink)]"
          currentClassName="font-semibold text-[var(--sr-ink)]"
        />
        {/* Title row */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="sr-title text-3xl font-extrabold tracking-tight sm:text-4xl">Strategic Reserve</h1>
            <p className="mt-1 text-sm text-[var(--sr-muted)]">
              The assets backing <Link href="/vestmentz/mocoin" className="font-semibold text-[var(--sr-blue)]">MoCoin</Link>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Pills
              options={[{ key: 'CAD', label: 'C$' }, { key: 'USD', label: '$' }, { key: 'BTC', label: '₿' }]}
              value={currency}
              onChange={setCurrency}
            />
            <ThemeToggle theme={theme} onChange={setTheme} />
          </div>
        </header>

        {/* Stat tiles */}
        <div className="-mx-4 mt-5 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
          <StatTile label="MoCoin Market Cap">
            {loading ? (
              <Skeleton className="h-12 w-28" />
            ) : (
              <>
                <p className="text-xl font-bold tabular-nums">{mocoinMarket?.marketCap != null ? formatCompact(mocoinMarket.marketCap) : '—'}</p>
                {mocoin && <Change value={mocoin.change1d || 0} className="text-sm" />}
              </>
            )}
          </StatTile>
          <StatTile label="MoCoin Price">
            {loading ? (
              <Skeleton className="h-12 w-28" />
            ) : (
              <>
                <p className="text-xl font-bold tabular-nums">{mocoin ? formatPrice(mocoinPrice) : '—'}</p>
                {mocoin && <Change value={mocoin.change1d || 0} className="text-sm" />}
              </>
            )}
          </StatTile>
          <StatTile label="Reserve Value">
            {loading ? (
              <Skeleton className="h-12 w-28" />
            ) : (
              <>
                <p className="text-xl font-bold tabular-nums">{formatCompact(totalValue)}</p>
                <Change value={totalChange} className="text-sm" />
              </>
            )}
          </StatTile>
          <StatTile label="Reserve Backing">
            {loading ? <Skeleton className="mx-auto h-12 w-20" /> : <BackingGauge percent={backingPercent} />}
          </StatTile>
        </div>

        {/* Quick links */}
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {[
            { href: mocoinMarket?.pairUrl || `https://dexscreener.com/solana/${treasuryConfig.mocoin.poolAddress}`, label: 'MoCoin chart', external: true },
            { href: RAYDIUM_SWAP_URL, label: 'Swap MoCoin', external: true },
            { href: '/vestmentz/mocoin', label: 'About MoCoin', external: false },
            { href: '/feed', label: 'Vibes', external: false },
          ].map((chip) =>
            chip.external ? (
              <a key={chip.label} href={chip.href} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full border border-[var(--sr-line)] bg-[var(--sr-card)] px-4 py-2 text-sm font-semibold shadow-sm">
                {chip.label}
              </a>
            ) : (
              <Link key={chip.label} href={chip.href} className="shrink-0 rounded-full border border-[var(--sr-blue-line)] bg-[var(--sr-card)] px-4 py-2 text-sm font-semibold text-[var(--sr-blue)] shadow-sm">
                {chip.label}
              </Link>
            ),
          )}
        </div>

        {reserveError && !reserve && (
          <div className="mt-4 rounded-xl border border-[var(--sr-warn-line)] bg-[var(--sr-warn-bg)] px-4 py-3 text-sm text-[var(--sr-warn-ink)]">
            The reserve&apos;s holdings couldn&apos;t be loaded ({reserveError}). Please refresh to try again.
          </div>
        )}

        {(marketError || btcUnavailable || (marketData && fx.isFallback)) && (
          <div className="mt-4 rounded-xl border border-[var(--sr-warn-line)] bg-[var(--sr-warn-bg)] px-4 py-3 text-sm text-[var(--sr-warn-ink)]">
            {marketError
              ? `Live prices couldn't be loaded (${marketError}). Showing the last values received.`
              : btcUnavailable
                ? "The live BTC price is unavailable, so values can't be shown in BTC right now."
                : `The live USD/CAD rate is unavailable, so conversions use a fallback rate of ${fx.usdCadRate.toFixed(2)}.`}
          </div>
        )}

        {/* Tabs */}
        <nav className="-mx-4 mt-6 overflow-x-auto border-b border-[var(--sr-line)] px-4 sm:mx-0 sm:px-0" aria-label="Reserve sections">
          <ul className="flex gap-6">
            {TABS.map((entry) => (
              <li key={entry.key}>
                <button
                  type="button"
                  onClick={() => setTab(entry.key)}
                  aria-current={tab === entry.key ? 'page' : undefined}
                  className={`relative whitespace-nowrap pb-3 text-lg font-bold transition-colors ${tab === entry.key ? 'text-[var(--sr-ink)]' : 'text-[var(--sr-faint)]'}`}
                >
                  {entry.label}
                  {HOLDER_TABS.includes(entry.key) && !holderAccess && (
                    <svg className="ml-1 inline-block align-[-1px]" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label="holders only">
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  )}
                  {entry.key === 'news' && relatedItems.length > 0 && (
                    <span className="ml-1 align-top text-xs font-semibold text-[var(--sr-blue)]">{relatedItems.length}</span>
                  )}
                  {tab === entry.key && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[var(--sr-blue)]" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Period selector for the tabs that show price changes */}
        <div className="mt-4 flex min-h-[2.75rem] items-center justify-between gap-3">
          {(tab === 'holdings' || ((tab === 'watchlist' || tab === 'overview') && holderAccess)) && (
            <Pills options={PERIODS.map((entry) => ({ key: entry.key, label: entry.label }))} value={timePeriod} onChange={setTimePeriod} />
          )}
          <p className="hidden text-xs text-[var(--sr-muted)] sm:block">
            {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Loading live prices…'}
          </p>
        </div>

        <div className="mt-4">
          {tab === 'holdings' && (
            <section className="overflow-hidden rounded-2xl border border-[var(--sr-line)] bg-[var(--sr-card)] shadow-sm">
              <div className="grid grid-cols-[1.25rem_2.25rem_minmax(0,1fr)_auto_4.5rem] gap-x-2 border-b border-[var(--sr-line)] px-3 py-2 text-xs font-semibold text-[var(--sr-muted)] sm:gap-x-3 sm:px-4">
                <span className="text-center">#</span>
                <span className="col-span-2">Value</span>
                <span className="text-right">Price</span>
                <span className="text-right">{period.label} %</span>
              </div>
              {loading ? (
                <div className="space-y-3 p-4">
                  {[0, 1, 2, 3, 4].map((index) => <Skeleton key={index} className="h-12" />)}
                </div>
              ) : (
                <ul className="divide-y divide-[var(--sr-line)]">
                  {renderRow({
                    key: MOCOIN_ROW,
                    rank: '★',
                    badge: (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src="/mo.svg" alt="" className="h-9 w-9 shrink-0 rounded-full border border-[var(--sr-line)] bg-white p-1" />
                    ),
                    title: 'MOCOIN',
                    subtitle: mocoinMarket?.marketCap != null ? formatCompact(mocoinMarket.marketCap) : 'MoCoin',
                    price: mocoin ? formatPrice(mocoinPrice) : '—',
                    change: mocoin ? mocoin[changeKey] || 0 : null,
                    points: mocoin?.history?.[timePeriod],
                    newsCount: newsMap.MoCoin?.length ?? 0,
                    highlight: true,
                    details: (
                      <div className="rounded-xl bg-[var(--sr-subtle)] p-4">
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                          {[
                            ['Market cap', mocoinMarket?.marketCap != null ? formatCompact(mocoinMarket.marketCap) : '—'],
                            ['Fully diluted', mocoinMarket?.fullyDilutedValue != null ? formatCompact(mocoinMarket.fullyDilutedValue) : '—'],
                            ['Volume (24h)', mocoinMarket?.volume24h != null ? formatCompact(mocoinMarket.volume24h) : '—'],
                            ['Liquidity', mocoinMarket?.liquidity != null ? formatCompact(mocoinMarket.liquidity) : '—'],
                            ['Circulating supply', mocoinMarket?.circulatingSupply != null ? `${formatCount(mocoinMarket.circulatingSupply)} MOCOIN` : '—'],
                            ['Total supply', mocoinMarket?.totalSupply != null ? `${formatCount(mocoinMarket.totalSupply)} MOCOIN` : '—'],
                            ['Reserve per MOCOIN', mocoinMarket?.circulatingSupply ? formatPrice(totalValue / mocoinMarket.circulatingSupply) : '—'],
                            ['Reserve backing', backingPercent != null ? `${backingPercent.toFixed(1)}% of market cap` : '—'],
                          ].map(([label, value]) => (
                            <div key={label}>
                              <dt className="text-[var(--sr-muted)]">{label}</dt>
                              <dd className="font-medium tabular-nums text-[var(--sr-ink)]">{value}</dd>
                            </div>
                          ))}
                        </dl>
                        <p className="mt-3 text-xs text-[var(--sr-muted)]">
                          Circulating supply excludes MoCoin held by the treasury. Market data from DexScreener and GeckoTerminal.
                        </p>
                        {newsPreview('MoCoin')}
                      </div>
                    ),
                  })}
                  {rankedHoldings.map((asset, index) =>
                    renderRow({
                      key: asset.symbol,
                      rank: index + 1,
                      badge: <AssetBadge symbol={asset.symbol} color={assetColor(asset.symbol)} />,
                      title: asset.symbol,
                      subtitle: rowSubtitle(asset),
                      price: priceLabel(asset),
                      change: assetChange(asset),
                      points: asset.history?.[timePeriod],
                      newsCount: newsMap[asset.symbol]?.length ?? 0,
                      details: assetDetails(asset),
                    }),
                  )}
                </ul>
              )}
              <p className="border-t border-[var(--sr-line)] px-4 py-3 text-xs text-[var(--sr-muted)]">
                {reserve && `Holdings as of ${new Date(`${reserve.holdingsAsOf}T12:00:00Z`).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}. `}Tap a row for details and related news.
              </p>
            </section>
          )}

          {HOLDER_TABS.includes(tab) && !holderAccess && <HolderGate session={moSession} loading={moLoading} />}

          {HOLDER_TABS.includes(tab) && holderAccess && moSession?.wallet && (
            <p className="mb-3 flex items-center justify-between gap-3 text-xs text-[var(--sr-muted)]">
              <span>
                Holder view · signed in as <span className="font-semibold text-[var(--sr-ink)]">{shortAddress(moSession.wallet)}</span>
              </span>
              <button type="button" onClick={() => signOutOfMo()} className="font-semibold text-[var(--sr-blue)]">
                Sign out
              </button>
            </p>
          )}

          {tab === 'watchlist' && holderAccess && (
            <section className="overflow-hidden rounded-2xl border border-[var(--sr-line)] bg-[var(--sr-card)] shadow-sm">
              <p className="border-b border-[var(--sr-line)] px-4 py-3 text-sm text-[var(--sr-muted)]">Assets with a target allocation that the reserve doesn&apos;t hold yet.</p>
              <ul className="divide-y divide-[var(--sr-line)]">
                {notHeldAssets.map((asset) =>
                  renderRow({
                    key: asset.symbol,
                    rank: '',
                    badge: <AssetBadge symbol={asset.symbol} color="#8a94a6" />,
                    title: asset.symbol,
                    subtitle: `Target ${asset.targetAllocation.toFixed(2)}%`,
                    price: priceLabel(asset),
                    change: assetChange(asset),
                    points: asset.history?.[timePeriod],
                    newsCount: newsMap[asset.symbol]?.length ?? 0,
                    details: assetDetails(asset),
                  }),
                )}
              </ul>
            </section>
          )}

          {tab === 'markets' && (
            <section className="overflow-hidden rounded-2xl border border-[var(--sr-line)] bg-[var(--sr-card)] shadow-sm">
              <p className="border-b border-[var(--sr-line)] px-4 py-3 text-sm text-[var(--sr-muted)]">Pools trading MoCoin, and pools of the tokens it pairs with. Tracked pools are always checked.</p>
              {!treasury ? (
                <div className="space-y-3 p-4">
                  {[0, 1].map((index) => <Skeleton key={index} className="h-12" />)}
                </div>
              ) : treasury.pools.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-[var(--sr-muted)]">
                  {treasury.poolsError ? `Pool scan unavailable (${treasury.poolsError}).` : 'No pools found.'}
                </p>
              ) : (
                <ul className="divide-y divide-[var(--sr-line)]">
                  {treasury.pools.map((pool, index) => {
                    const position = treasury.lpPositions?.find((entry) => entry.pairAddress === pool.pairAddress);
                    return (
                      <li key={pool.pairAddress}>
                        <a href={pool.url} target="_blank" rel="noopener noreferrer" className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-x-3 px-3 py-3 sm:px-4">
                          <span className="text-center text-sm text-[var(--sr-muted)]">{index + 1}</span>
                          <span className="min-w-0">
                            <span className="flex min-w-0 items-center gap-1.5">
                              <span className="truncate font-semibold">{pool.label}</span>
                              {pool.tracked && (
                                <span className="shrink-0 rounded-full bg-[var(--sr-blue-soft)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-[var(--sr-blue)]">Tracked</span>
                              )}
                            </span>
                            <span className="block truncate text-sm text-[var(--sr-muted)]">
                              {pool.source === 'none' ? (
                                'No market data yet'
                              ) : (
                                <>
                                  <span className="capitalize">{pool.dexId}</span> · {pool.hop === 0 ? 'MoCoin pair' : 'Paired token'}
                                </>
                              )}
                            </span>
                          </span>
                          <span className="text-right">
                            <span className="block font-semibold tabular-nums">{pool.source === 'none' ? '—' : formatCompact(convert(pool.liquidityUsd, 'USD', currency, rates))}</span>
                            <span className="block text-xs text-[var(--sr-muted)]">{position ? `Treasury ${(position.poolShare * 100).toFixed(2)}%` : 'liquidity'}</span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}

          {tab === 'news' && (
            <section className="space-y-3">
              {relatedItems.length === 0 ? (
                <Card>
                  <p className="text-center text-sm text-[var(--sr-muted)]">No Vibes articles mention the reserve&apos;s assets yet.</p>
                </Card>
              ) : (
                relatedItems.map(({ item, symbols }) => (
                  <Card key={item.id} className="!p-4">
                    <NewsLink item={item} />
                    {item.excerpt && <p className="mt-1 line-clamp-2 text-sm text-[var(--sr-muted)]">{item.excerpt}</p>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {symbols.map((symbol) => (
                        <button
                          key={symbol}
                          type="button"
                          onClick={() => openAsset(symbol)}
                          className="rounded-full bg-[var(--sr-line)] px-3 py-1 text-xs font-semibold text-[var(--sr-ink)]"
                        >
                          {symbol === 'MoCoin' ? 'MOCOIN' : symbol}
                        </button>
                      ))}
                    </div>
                  </Card>
                ))
              )}
              <p className="text-center text-xs text-[var(--sr-muted)]">
                Articles from <Link href="/feed" className="font-semibold text-[var(--sr-blue)]">Vibes</Link> that mention an asset in the reserve.
              </p>
            </section>
          )}

          {tab === 'overview' && holderAccess && (
            <div className="space-y-4">
              {/* Reserve value chart */}
              <Card className="!px-2 sm:!px-4">
                <div className="px-2">
                  <p className="text-sm text-[var(--sr-muted)]">Reserve value · {period.description}</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums">{formatMoney(totalValue)}</p>
                  <p className={`text-sm font-semibold tabular-nums ${changeText(totalMoneyChange)}`}>
                    {totalMoneyChange >= 0 ? '+' : '-'}{formatMoney(Math.abs(totalMoneyChange))} ({formatPercent(totalChange)})
                  </p>
                </div>
                {loading ? (
                  <Skeleton className="mx-2 mt-4 h-48" />
                ) : valueHistory.length > 1 ? (
                  <div className="mt-2 h-48 sm:h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={valueHistory} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                        <defs>
                          <linearGradient id="reserveFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColor} stopOpacity={0.25} />
                            <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="t" hide />
                        <YAxis hide domain={['dataMin', 'dataMax']} />
                        <Tooltip
                          contentStyle={CHART_TOOLTIP}
                          labelFormatter={(t: any) => formatPointTime(Number(t), timePeriod)}
                          formatter={(value: any) => [formatMoney(Number(value)), 'Value']}
                        />
                        <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} fill="url(#reserveFill)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="px-2 py-12 text-center text-sm text-[var(--sr-muted)]">Price history unavailable right now.</p>
                )}
              </Card>

              {/* Allocation */}
              <Card>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold">Allocation</h2>
                  <Pills options={[{ key: 'asset' as const, label: 'Asset' }, { key: 'industry' as const, label: 'Category' }]} value={view} onChange={setView} />
                </div>
                {loading ? (
                  <Skeleton className="mx-auto h-52 w-52 rounded-full" />
                ) : (
                  <div className="relative mx-auto h-52 w-full max-w-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieRows} dataKey="current" nameKey="name" innerRadius="68%" outerRadius="100%" paddingAngle={2} stroke="none">
                          {pieRows.map((row) => (
                            <Cell key={row.key} fill={row.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any, name: any) => [`${Number(value).toFixed(2)}%`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs text-[var(--sr-muted)]">{view === 'asset' ? `${heldAssets.length} held` : `${pieRows.length} categories`}</span>
                      <span className="text-lg font-bold tabular-nums">{formatCompact(totalValue)}</span>
                    </div>
                  </div>
                )}
                <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2">
                  {pieRows.map((row) => (
                    <li key={row.key} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                      <span className="min-w-0 flex-1 truncate">{row.name}</span>
                      <span className="tabular-nums text-[var(--sr-muted)]">{row.current.toFixed(1)}%</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Projected allocation */}
              <Card>
                <h2 className="text-lg font-bold">Projected allocation</h2>
                <p className="mt-1 text-sm text-[var(--sr-muted)]">Where the reserve is now, where its targets put it, and how each mix would grow.</p>
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Now', key: 'current' as const },
                    { label: 'Target', key: 'target' as const },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="mb-1 text-xs font-semibold text-[var(--sr-muted)]">{bar.label}</div>
                      <div className="flex h-3 w-full overflow-hidden rounded-full bg-[var(--sr-line)]">
                        {categoryRows
                          .filter((row) => row[bar.key] > 0)
                          .map((row) => (
                            <div key={row.key} style={{ width: `${row[bar.key]}%`, backgroundColor: row.color }} title={`${row.name} ${row[bar.key].toFixed(1)}%`} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
                <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2">
                  {categoryRows
                    .filter((row) => row.current > 0 || row.target > 0)
                    .map((row) => (
                      <li key={row.key} className="flex items-center gap-2">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                        <span className="min-w-0 flex-1 truncate">{row.name}</span>
                        <span className="tabular-nums text-[var(--sr-muted)]">
                          {row.current.toFixed(1)}% → {row.target.toFixed(1)}%
                        </span>
                      </li>
                    ))}
                  {unallocatedTarget > 0.01 && (
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full border border-dashed border-[var(--sr-faint)]" />
                      <span className="min-w-0 flex-1 truncate text-[var(--sr-muted)]">Unallocated target</span>
                      <span className="tabular-nums text-[var(--sr-muted)]">{unallocatedTarget.toFixed(1)}%</span>
                    </li>
                  )}
                </ul>

                <h3 className="mt-6 text-sm font-bold">If the last month repeated</h3>
                <div className="mt-2 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                      <XAxis dataKey="horizon" stroke="#a1a7bb" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip contentStyle={CHART_TOOLTIP} formatter={(value: any, name: any) => [formatMoney(Number(value)), name]} />
                      <Line type="monotone" dataKey="Current mix" stroke={MO_COLORS.blue} strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Target mix" stroke={MO_COLORS.purple} strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {[
                    { label: 'Current mix, 1Y', value: currentProjectedGain, note: `${formatPercent(currentMonthly)} / month` },
                    { label: 'Target mix, 1Y', value: idealProjectedGain, note: `${formatPercent(idealMonthly)} / month` },
                    { label: 'Rebalancing difference', value: rebalanceUplift, note: 'Target minus current' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between rounded-xl bg-[var(--sr-subtle)] px-4 py-3 sm:block">
                      <div className="text-xs text-[var(--sr-muted)]">{stat.label}</div>
                      <div className="text-right sm:mt-1 sm:text-left">
                        <div className={`font-semibold tabular-nums ${changeText(stat.value)}`}>
                          {stat.value > 0 ? '+' : ''}{formatMoney(stat.value)}
                        </div>
                        <div className="text-xs tabular-nums text-[var(--sr-muted)]">{stat.note}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="mt-6 text-sm font-bold">To reach the targets</h3>
                <ul className="mt-3 space-y-4">
                  {(showAllRebalance ? rebalanceActions : rebalanceActions.slice(0, REBALANCE_PREVIEW)).map((asset) => {
                    const isAdd = asset.action === 'Add';
                    const isReduce = asset.action === 'Reduce';
                    const barWidth = `${Math.min(50, (Math.abs(asset.delta) / maxRebalanceDelta) * 50)}%`;
                    return (
                      <li key={asset.symbol}>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="truncate text-sm font-semibold">{asset.symbol}</span>
                          <span className={`shrink-0 text-sm font-semibold tabular-nums ${isAdd ? 'text-[#16c784]' : isReduce ? 'text-[#ea3943]' : 'text-[var(--sr-muted)]'}`}>
                            {asset.action === 'Hold' ? 'Hold' : `${asset.action} ${formatMoney(asset.estimatedValue)}`}
                          </span>
                        </div>
                        <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--sr-line)]">
                          <div className="absolute left-1/2 top-0 h-full w-px bg-[var(--sr-faint)]" />
                          <div
                            className={`absolute top-0 h-full rounded-full ${isAdd ? 'bg-[#16c784]' : isReduce ? 'bg-[#ea3943]' : 'bg-[var(--sr-faint)]'}`}
                            style={{ width: barWidth, left: isAdd ? '50%' : undefined, right: isReduce ? '50%' : undefined }}
                          />
                        </div>
                        <div className="mt-1 flex justify-between text-xs tabular-nums text-[var(--sr-muted)]">
                          <span>Now {asset.currentAllocation.toFixed(1)}%</span>
                          <span>Target {asset.targetAllocation.toFixed(1)}%</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {rebalanceActions.length > REBALANCE_PREVIEW && (
                  <button
                    type="button"
                    onClick={() => setShowAllRebalance((value) => !value)}
                    className="mt-4 w-full rounded-xl bg-[var(--sr-line)] py-2.5 text-sm font-semibold"
                  >
                    {showAllRebalance ? 'Show less' : `Show all ${rebalanceActions.length}`}
                  </button>
                )}
                <p className="mt-4 text-xs text-[var(--sr-muted)]">
                  Compounds each mix&apos;s trailing 1-month return. Ignores volatility, fees and changing markets. An illustration, not a forecast or investment advice.
                </p>
              </Card>
            </div>
          )}
        </div>

        {/* FAQ: the same questions are sent as FAQPage structured data above. */}
        <section className="mt-10" aria-labelledby="reserve-faq">
          <h2 id="reserve-faq" className="text-xl font-bold">
            Frequently asked questions
          </h2>
          <div className="mt-3 divide-y divide-[var(--sr-line)] overflow-hidden rounded-2xl border border-[var(--sr-line)] bg-[var(--sr-card)] shadow-sm">
            {RESERVE_FAQS.map((faq) => (
              <details key={faq.question} className="group px-4 py-3 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1 font-semibold [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base">{faq.question}</h3>
                  <span aria-hidden="true" className="text-[var(--sr-muted)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-2 pt-1 text-sm leading-relaxed text-[var(--sr-muted)]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-8 text-center">
          <Link href="/vestmentz/mocoin" className="text-sm font-semibold text-[var(--sr-blue)]">
            ← About MoCoin
          </Link>
          <Link href="/vestmentz" className="text-sm font-semibold text-[var(--sr-blue)]">
            MoVestmentz
          </Link>
        </div>
      </div>
    </main>
  );
}

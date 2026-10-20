import { NextRequest, NextResponse } from 'next/server';

const YAHOO_CHART_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';
const CRYPTO_SYMBOLS = new Set(['BTC', 'SOL', 'ADA', 'FIL', 'USDC', 'USDT']);
const STABLECOINS = new Set(['USDC', 'USDT']);

type BaseCurrency = 'USD' | 'CAD';
type YahooChartResult = {
    meta?: {
        chartPreviousClose?: number;
        currency?: string;
        regularMarketPrice?: number;
    };
    timestamp?: number[];
    indicators?: {
        quote?: Array<{
            close?: Array<number | null>;
        }>;
    };
};
function normalizeBaseCurrency(value: unknown): BaseCurrency {
    return value === 'CAD' ? 'CAD' : 'USD';
}

function normalizeAssetSymbol(symbol: string) {
    return symbol.replace('-USD', '').replace('-CAD', '');
}

function mapToYahooSymbol(symbol: string) {
    const normalized = normalizeAssetSymbol(symbol);

    if (CRYPTO_SYMBOLS.has(normalized)) {
        return `${normalized}-USD`;
    }

    return symbol;
}

type ChartWindow = string | { period1: number; period2: number };

async function fetchYahooChart(symbol: string, window: ChartWindow, interval: string): Promise<YahooChartResult> {
    const searchParams = new URLSearchParams({
        ...(typeof window === 'string'
            ? { range: window }
            : { period1: String(window.period1), period2: String(window.period2) }),
        interval,
        includePrePost: 'true',
    });
    const response = await fetch(`${YAHOO_CHART_BASE_URL}/${encodeURIComponent(symbol)}?${searchParams.toString()}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
        },
    });

    if (!response.ok) {
        throw new Error(`Yahoo chart request failed for ${symbol} with ${response.status}`);
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    const error = data?.chart?.error;

    if (!result || error) {
        throw new Error(error?.description || `No Yahoo chart data for ${symbol}`);
    }

    return result;
}

function getCloseSeries(chart: YahooChartResult) {
    const timestamps = chart.timestamp || [];
    const closes = chart.indicators?.quote?.[0]?.close || [];

    return timestamps
        .map((timestamp, index) => ({
            timestamp,
            close: closes[index],
        }))
        .filter((point): point is { timestamp: number; close: number } => typeof point.close === 'number' && point.close > 0);
}

function getLatestClose(chart: YahooChartResult) {
    const series = getCloseSeries(chart);
    return chart.meta?.regularMarketPrice || series[series.length - 1]?.close || 0;
}

function calculateChangeFromSeries(chart: YahooChartResult, currentPrice: number, secondsAgo: number) {
    const series = getCloseSeries(chart);

    if (!series.length || !currentPrice) {
        return 0;
    }

    const targetTime = Math.floor(Date.now() / 1000) - secondsAgo;
    let baseline = series[0].close;

    for (const point of series) {
        if (point.timestamp <= targetTime) {
            baseline = point.close;
        } else {
            break;
        }
    }

    if (!baseline) return 0;

    return ((currentPrice - baseline) / baseline) * 100;
}

function getNativeCurrency(symbol: string, chart: YahooChartResult): BaseCurrency {
    const yahooCurrency = chart.meta?.currency;

    if (yahooCurrency === 'CAD' || symbol === 'WEED.TO') return 'CAD';
    return 'USD';
}

const FALLBACK_USD_CAD_RATE = 1.43;

type Period = '1h' | '4h' | '1d' | '7d' | '1m';
type PricePoint = { t: number; c: number };

// Which chart feeds each period, how far back it goes, and how coarse the
// points are (0 = keep every point), so a month isn't sent at 5-minute detail.
const HISTORY_WINDOWS: Record<Period, { source: 'intraday' | 'hourly'; seconds: number; step: number }> = {
    '1h': { source: 'intraday', seconds: 60 * 60, step: 0 },
    '4h': { source: 'intraday', seconds: 4 * 60 * 60, step: 0 },
    '1d': { source: 'intraday', seconds: 24 * 60 * 60, step: 15 * 60 },
    '7d': { source: 'hourly', seconds: 7 * 24 * 60 * 60, step: 60 * 60 },
    '1m': { source: 'hourly', seconds: 30 * 24 * 60 * 60, step: 4 * 60 * 60 },
};

// Price points for each period. Each series also keeps the last point from
// before its window, so something that didn't trade inside the window (a
// stock overnight or at the weekend) still has a price to carry forward.
function buildHistory(
    charts: { intraday: YahooChartResult; hourly: YahooChartResult },
    toBase: (price: number) => number,
): Record<Period, PricePoint[]> {
    const now = Math.floor(Date.now() / 1000);
    const series = {
        intraday: getCloseSeries(charts.intraday),
        hourly: getCloseSeries(charts.hourly),
    };

    const history = {} as Record<Period, PricePoint[]>;
    for (const [period, window] of Object.entries(HISTORY_WINDOWS) as [Period, (typeof HISTORY_WINDOWS)[Period]][]) {
        const start = now - window.seconds;
        const points = series[window.source];
        const before = points.filter((point) => point.timestamp < start).pop();
        const inside = points.filter((point) => point.timestamp >= start);

        const kept: typeof inside = [];
        let lastBucket = -1;
        for (const point of inside) {
            const bucket = window.step ? Math.floor(point.timestamp / window.step) : point.timestamp;
            if (bucket === lastBucket) kept[kept.length - 1] = point;
            else kept.push(point);
            lastBucket = bucket;
        }

        history[period] = (before ? [before, ...kept] : kept).map((point) => ({
            t: point.timestamp,
            // 7 significant digits is plenty for a chart and keeps the payload small.
            c: Number(toBase(point.close).toPrecision(7)),
        }));
    }
    return history;
}

async function getUsdCadRate() {
    try {
        const chart = await fetchYahooChart('CAD=X', '5d', '1d');
        const rate = getLatestClose(chart);
        if (rate) return { rate, isFallback: false };
    } catch (error) {
        console.error('Failed to fetch USD/CAD rate:', error);
    }
    return { rate: FALLBACK_USD_CAD_RATE, isFallback: true };
}

function convertPrice(price: number, nativeCurrency: BaseCurrency, baseCurrency: BaseCurrency, usdCadRate: number) {
    if (nativeCurrency === baseCurrency) return price;
    return baseCurrency === 'CAD' ? price * usdCadRate : price / usdCadRate;
}

// How the other currency moved, measured in the base currency: USD in CAD
// when the base is CAD, CAD in USD when the base is USD. CAD=X is CAD per
// USD, so the USD-base view is its inverse.
async function getFxChanges(baseCurrency: BaseCurrency) {
    const [intradayChart, dailyChart, hourlyChart] = await Promise.all([
        fetchYahooChart('CAD=X', '5d', '5m'),
        fetchYahooChart('CAD=X', '2mo', '1d'),
        fetchYahooChart('CAD=X', '1mo', '1h'),
    ]);
    const rate = getLatestClose(intradayChart) || getLatestClose(dailyChart);
    if (!rate) throw new Error('No USD/CAD rate');

    const usdInCad = {
        change1h: calculateChangeFromSeries(intradayChart, rate, 60 * 60),
        change4h: calculateChangeFromSeries(intradayChart, rate, 4 * 60 * 60),
        change1d: calculateChangeFromSeries(intradayChart, rate, 24 * 60 * 60),
        change7d: calculateChangeFromSeries(dailyChart, rate, 7 * 24 * 60 * 60),
        change1m: calculateChangeFromSeries(dailyChart, rate, 30 * 24 * 60 * 60),
    };
    const charts = { intraday: intradayChart, hourly: hourlyChart };
    if (baseCurrency === 'CAD') {
        // Price of one USD in CAD is the rate itself.
        return { currency: 'USD' as BaseCurrency, ...usdInCad, history: buildHistory(charts, (rate) => rate) };
    }

    const invert = (change: number) => (1 / (1 + change / 100) - 1) * 100;
    return {
        currency: 'CAD' as BaseCurrency,
        history: buildHistory(charts, (rate) => 1 / rate),
        change1h: invert(usdInCad.change1h),
        change4h: invert(usdInCad.change4h),
        change1d: invert(usdInCad.change1d),
        change7d: invert(usdInCad.change7d),
        change1m: invert(usdInCad.change1m),
    };
}

type Purchase = { amount: number; currency: BaseCurrency; date: string };

// Last daily close on or before the given date (YYYY-MM-DD). Weekends and
// holidays fall back to the previous trading day.
async function getCloseOnDate(yahooSymbol: string, date: string) {
    const endOfDay = Math.floor(new Date(`${date}T23:59:59Z`).getTime() / 1000);
    if (!Number.isFinite(endOfDay)) throw new Error(`Invalid purchase date ${date}`);

    const chart = await fetchYahooChart(yahooSymbol, { period1: endOfDay - 10 * 24 * 60 * 60, period2: endOfDay }, '1d');
    const closes = getCloseSeries(chart).filter((point) => point.timestamp <= endOfDay);
    const close = closes[closes.length - 1]?.close;
    if (!close) throw new Error(`No ${yahooSymbol} close on or before ${date}`);
    return close;
}

// A position recorded as "this much money, on this date" instead of a share
// count: the share count is fixed from that day's close (and that day's
// USD/CAD rate when the money and the asset are in different currencies), so
// from then on the position moves with the asset's price.
async function resolvePurchase(yahooSymbol: string, nativeCurrency: BaseCurrency, baseCurrency: BaseCurrency, purchase: Purchase) {
    const closeOnDate = await getCloseOnDate(yahooSymbol, purchase.date);
    const needsFx = purchase.currency !== nativeCurrency || purchase.currency !== baseCurrency;
    const fxOnDate = needsFx ? await getCloseOnDate('CAD=X', purchase.date) : 1;

    const amountInNative = convertPrice(purchase.amount, purchase.currency, nativeCurrency, fxOnDate);
    return {
        quantity: amountInNative / closeOnDate,
        bookValue: convertPrice(purchase.amount, purchase.currency, baseCurrency, fxOnDate),
        priceOnDate: convertPrice(closeOnDate, nativeCurrency, baseCurrency, fxOnDate),
    };
}

export async function POST(request: NextRequest) {
    try {
        const { symbols, baseCurrency: requestedBaseCurrency, purchases = {} } = await request.json();
        const baseCurrency = normalizeBaseCurrency(requestedBaseCurrency);

        if (!symbols || !Array.isArray(symbols)) {
            return NextResponse.json(
                { error: 'Invalid symbols array' },
                { status: 400 }
            );
        }

        const { rate: usdCadRate, isFallback: usdCadRateIsFallback } = await getUsdCadRate();
        const results: Record<string, any> = {};

        for (const symbol of symbols) {
            try {
                const normalizedSymbol = normalizeAssetSymbol(symbol);

                if (STABLECOINS.has(normalizedSymbol)) {
                    const stablePrice = convertPrice(1, 'USD', baseCurrency, usdCadRate);
                    results[symbol] = {
                        c: stablePrice,
                        pc: stablePrice,
                        price: stablePrice,
                        baseCurrency,
                        nativeCurrency: 'USD',
                        sourceSymbol: `${normalizedSymbol}-USD`,
                        usdCadRate,
                        usdCadRateIsFallback,
                        change1h: 0,
                        change4h: 0,
                        change1d: 0,
                        change7d: 0,
                        change1m: 0,
                    };
                    continue;
                }

                const yahooSymbol = mapToYahooSymbol(symbol);
                const [intradayChart, dailyChart, hourlyChart] = await Promise.all([
                    fetchYahooChart(yahooSymbol, '5d', '5m'),
                    fetchYahooChart(yahooSymbol, '2mo', '1d'),
                    fetchYahooChart(yahooSymbol, '1mo', '1h'),
                ]);
                const currentPrice = getLatestClose(intradayChart) || getLatestClose(dailyChart);

                if (!currentPrice) {
                    throw new Error(`No current price for ${symbol}`);
                }

                const nativeCurrency = getNativeCurrency(symbol, intradayChart);
                const displayPrice = convertPrice(currentPrice, nativeCurrency, baseCurrency, usdCadRate);
                const purchase: Purchase | undefined = purchases[symbol];
                let purchaseResult: Awaited<ReturnType<typeof resolvePurchase>> | { error: string } | undefined;
                if (purchase) {
                    purchaseResult = await resolvePurchase(yahooSymbol, nativeCurrency, baseCurrency, purchase)
                        .catch((error: any) => ({ error: error.message as string }));
                }
                const previousClose = convertPrice(
                    intradayChart.meta?.chartPreviousClose || dailyChart.meta?.chartPreviousClose || currentPrice,
                    nativeCurrency,
                    baseCurrency,
                    usdCadRate
                );

                results[symbol] = {
                    c: displayPrice,
                    pc: previousClose,
                    price: displayPrice,
                    baseCurrency,
                    nativeCurrency,
                    sourceSymbol: yahooSymbol,
                    usdCadRate,
                    usdCadRateIsFallback,
                    purchase: purchaseResult,
                    // Prices for each chart period, in the base currency
                    // (historical points use today's FX rate).
                    history: buildHistory(
                        { intraday: intradayChart, hourly: hourlyChart },
                        (price) => convertPrice(price, nativeCurrency, baseCurrency, usdCadRate),
                    ),
                    change1h: calculateChangeFromSeries(intradayChart, currentPrice, 60 * 60),
                    change4h: calculateChangeFromSeries(intradayChart, currentPrice, 4 * 60 * 60),
                    change1d: calculateChangeFromSeries(intradayChart, currentPrice, 24 * 60 * 60),
                    change7d: calculateChangeFromSeries(dailyChart, currentPrice, 7 * 24 * 60 * 60),
                    change1m: calculateChangeFromSeries(dailyChart, currentPrice, 30 * 24 * 60 * 60),
                };

                await new Promise(resolve => setTimeout(resolve, 50));
            } catch (error: any) {
                console.error(`Error fetching ${symbol}:`, error.message);
                results[symbol] = {
                    error: error.message,
                    c: 0,
                    pc: 0,
                    price: 0,
                    baseCurrency,
                    change1h: 0,
                    change4h: 0,
                    change1d: 0,
                    change7d: 0,
                    change1m: 0,
                };
            }
        }

        try {
            results._fx = { ...(await getFxChanges(baseCurrency)), usdCadRate, usdCadRateIsFallback };
        } catch (error: any) {
            console.error('Failed to fetch USD/CAD changes:', error.message);
            results._fx = { error: error.message, usdCadRate, usdCadRateIsFallback };
        }

        return NextResponse.json(results);
    } catch (error: any) {
        console.error('Market data API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch market data' },
            { status: 500 }
        );
    }
}

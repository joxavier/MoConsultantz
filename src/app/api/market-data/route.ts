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

async function fetchYahooChart(symbol: string, range: string, interval: string): Promise<YahooChartResult> {
    const searchParams = new URLSearchParams({
        range,
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

async function getUsdCadRate() {
    try {
        const chart = await fetchYahooChart('CAD=X', '5d', '1d');
        return getLatestClose(chart) || 1.43;
    } catch (error) {
        console.error('Failed to fetch USD/CAD rate:', error);
        return 1.43;
    }
}

function convertPrice(price: number, nativeCurrency: BaseCurrency, baseCurrency: BaseCurrency, usdCadRate: number) {
    if (nativeCurrency === baseCurrency) return price;
    return baseCurrency === 'CAD' ? price * usdCadRate : price / usdCadRate;
}

export async function POST(request: NextRequest) {
    try {
        const { symbols, baseCurrency: requestedBaseCurrency } = await request.json();
        const baseCurrency = normalizeBaseCurrency(requestedBaseCurrency);

        if (!symbols || !Array.isArray(symbols)) {
            return NextResponse.json(
                { error: 'Invalid symbols array' },
                { status: 400 }
            );
        }

        const usdCadRate = await getUsdCadRate();
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
                        change1h: 0,
                        change4h: 0,
                        change1d: 0,
                        change7d: 0,
                        change1m: 0,
                    };
                    continue;
                }

                const yahooSymbol = mapToYahooSymbol(symbol);
                const intradayChart = await fetchYahooChart(yahooSymbol, '5d', '15m');
                const dailyChart = await fetchYahooChart(yahooSymbol, '2mo', '1d');
                const currentPrice = getLatestClose(intradayChart) || getLatestClose(dailyChart);

                if (!currentPrice) {
                    throw new Error(`No current price for ${symbol}`);
                }

                const nativeCurrency = getNativeCurrency(symbol, intradayChart);
                const displayPrice = convertPrice(currentPrice, nativeCurrency, baseCurrency, usdCadRate);
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

        return NextResponse.json(results);
    } catch (error: any) {
        console.error('Market data API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch market data' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { symbols } = await request.json();

        if (!symbols || !Array.isArray(symbols)) {
            return NextResponse.json(
                { error: 'Invalid symbols array' },
                { status: 400 }
            );
        }

        console.log('Fetching data from Finnhub for symbols:', symbols);

        const finnhub = require('finnhub');
        const finnhubClient = new finnhub.DefaultApi(process.env.FINNHUB_API_KEY || '');

        const results: Record<string, any> = {};

        // Fetch data for each symbol sequentially to avoid rate limits
        for (const symbol of symbols) {
            try {
                // Map symbols to Finnhub format
                let finnhubSymbol = symbol;

                if (symbol.includes('-USD')) {
                    const base = symbol.replace('-USD', '');
                    if (base === 'BTC') finnhubSymbol = 'BINANCE:BTCUSDT';
                    else if (base === 'SOL') finnhubSymbol = 'BINANCE:SOLUSDT';
                    else if (base === 'ADA') finnhubSymbol = 'BINANCE:ADAUSDT';
                    else if (base === 'FIL') finnhubSymbol = 'BINANCE:FILUSDT';
                    else if (base === 'USDC') finnhubSymbol = 'BINANCE:USDCUSDT';
                    else if (base === 'USDT') {
                        results[symbol] = {
                            c: 1.0,
                            pc: 1.0,
                            dp: 0,
                            price: 1.0,
                            change24h: 0,
                            change7d: 0,
                            change30d: 0,
                        };
                        continue;
                    }
                } else if (symbol === 'WEED.TO') {
                    finnhubSymbol = 'WEED:CA';
                }

                // Get current quote
                const quote: any = await new Promise((resolve, reject) => {
                    finnhubClient.quote(finnhubSymbol, (error: any, data: any) => {
                        if (error) reject(error);
                        else resolve(data);
                    });
                });

                console.log("Retrieved:", finnhubSymbol, quote);

                // Get historical candles for change calculations
                const now = Math.floor(Date.now() / 1000);
                const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
                const oneYearAgo = now - (365 * 24 * 60 * 60);

                const candles30d: any = await new Promise((resolve, reject) => {
                    finnhubClient.stockCandles(
                        finnhubSymbol,
                        'D',
                        thirtyDaysAgo,
                        now,
                        (error: any, data: any) => {
                            if (error) reject(error);
                            else resolve(data);
                        }
                    );
                });

                if (!quote || quote.c === 0) {
                    throw new Error('No quote data available');
                }

                const currentPrice = quote.c;
                const previousClose = quote.pc;
                const percentChange24h = quote.dp || 0;

                // Calculate changes from candles
                let change7d = 0;
                let change30d = 0;
                
                if (candles30d && candles30d.c && candles30d.c.length > 0) {
                    // 7 days ago
                    if (candles30d.c.length >= 7) {
                        const sevenDaysAgo = candles30d.c[candles30d.c.length - 7];
                        change7d = ((currentPrice - sevenDaysAgo) / sevenDaysAgo) * 100;
                    }

                    // 30 days ago
                    const thirtyDaysAgoPrice = candles30d.c[0];
                    change30d = ((currentPrice - thirtyDaysAgoPrice) / thirtyDaysAgoPrice) * 100;
                }

                // Store in Finnhub format + calculated changes
                results[symbol] = {
                    c: currentPrice,
                    pc: previousClose,
                    dp: percentChange24h,
                    h: quote.h,
                    l: quote.l,
                    o: quote.o,
                    t: quote.t,
                    price: currentPrice,
                    change24h: percentChange24h,
                    change7d: isNaN(change7d) ? 0 : change7d,
                    change30d: isNaN(change30d) ? 0 : change30d,
                    change1y: 0, // Will need separate call for 1y data
                    changeAll: 0, // Calculate from Sep 24, 2024
                };

                console.log(`✓ ${symbol}: $${currentPrice.toFixed(2)} | 24h: ${percentChange24h.toFixed(2)}% | 7d: ${change7d.toFixed(2)}% | 30d: ${change30d.toFixed(2)}%`);

                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error: any) {
                console.error(`✗ Error fetching ${symbol}:`, error.message);
                results[symbol] = {
                    error: error.message,
                    c: 0,
                    pc: 0,
                    dp: 0,
                    price: 0,
                    change24h: 0,
                    change7d: 0,
                    change30d: 0,
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
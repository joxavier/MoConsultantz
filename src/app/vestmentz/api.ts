'use server'

import axios from "axios";
const yahooFinance = require("yahoo-finance2").default;

export async function getPrice() {    
    try {

        const quote = await yahooFinance.quote('WEED.TO');
        console.log("SUCCES:" + quote.regularMarketChange)
        

        const data = quote;//await yahooFinance.quoteSummary('WEED.TO');
        
        
        // Display relevant details
        console.log(`Stock: ${data.symbol}`);
        console.log(`Name: ${data.shortName}`);
        console.log(`Current Price: $${data.regularMarketPrice}`);
        console.log(`Market Change: ${data.regularMarketChange} (${data.regularMarketChangePercent}%)`);
        console.log(`Previous Close: $${data.regularMarketPreviousClose}`);
        console.log(`Market Cap: $${data.marketCap.toLocaleString()}`);
        return quote.regularMarketPrice;
    } catch (error) {
        console.error("Error fetching stock data from LIB:", error instanceof Error ? error.message : error);
    }
}
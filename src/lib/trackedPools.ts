import treasuryConfig from "@/data/treasuryConfig.json";
import { getSheets, readTab } from "@/lib/googleSheets";

// Pools the reserve always tracks, whether or not a DexScreener or
// GeckoTerminal search turns them up: the "MoCoin Pools" tab of the site's
// Google Sheet (Pool Address, Note), re-read at most once a minute. Falls back
// to poolScan.trackedPools in treasuryConfig.json, which also fills an empty tab.

export const POOLS_TAB = "MoCoin Pools";
const HEADERS = ["Pool Address", "Note"];
const CACHE_MS = 60_000;

// Solana addresses are 32–44 base58 characters.
export const isSolanaAddress = (value: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);

const fileList = () => (treasuryConfig.poolScan.trackedPools as string[]).filter(isSolanaAddress);

let cache: { pools: string[]; expires: number } | null = null;

export async function getTrackedPools(): Promise<string[]> {
  if (cache && cache.expires > Date.now()) return cache.pools;

  let pools = fileList();
  let ok = true;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (spreadsheetId && process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    try {
      const rows = await readTab(spreadsheetId, POOLS_TAB, HEADERS);
      if (rows.length <= 1) {
        await getSheets().spreadsheets.values.update({
          spreadsheetId,
          range: `${POOLS_TAB}!A1`,
          valueInputOption: "RAW",
          requestBody: { values: [HEADERS, ...pools.map((address) => [address, ""])] },
        });
      } else {
        pools = rows.slice(1).map((row) => String(row[0] ?? "").trim()).filter(isSolanaAddress);
      }
    } catch (error: any) {
      ok = false;
      console.error("Tracked pools: couldn't read the sheet:", error?.message || error);
    }
  }

  pools = Array.from(new Set(pools));
  cache = { pools, expires: Date.now() + (ok ? CACHE_MS : 15_000) };
  return pools;
}

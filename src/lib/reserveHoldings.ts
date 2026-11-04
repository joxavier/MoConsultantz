import fallback from "@/data/reserveHoldings.json";
import { getSheets, readTab } from "@/lib/googleSheets";
import type { AssetConfig, AssetKind, BaseCurrency } from "@/lib/treasury/types";

// Strategic Reserve holdings, from the "Reserve Holdings" tab of the site's
// Google Sheet (GOOGLE_SHEET_ID), one row per asset, plus "Holdings as of" in
// the "Reserve Settings" tab. Edit the sheet and the page picks it up within a
// minute; no deploy needed.
//
// When the sheet can't be read, the last good copy is used, else
// src/data/reserveHoldings.json. An empty tab is filled from that file once,
// so the sheet starts out matching the site.
//
// Server-only: holders get every column, everyone else gets the held
// positions without targets (see publicView).

export const HOLDINGS_TAB = "Reserve Holdings";
export const SETTINGS_TAB = "Reserve Settings";

export const HOLDINGS_HEADERS = [
  "Symbol",
  "Name",
  "Category",
  "Kind",
  "Target %",
  "Quantity",
  "Currency",
  "Holding Label",
  "Manual Value",
  "Purchase Amount",
  "Purchase Currency",
  "Purchase Date",
  "News Keywords",
];
const SETTINGS_HEADERS = ["Setting", "Value"];
const AS_OF_SETTING = "Holdings as of";

const KINDS: AssetKind[] = ["market", "cash", "manual", "onchain"];
const CACHE_MS = 60_000;

export type ReserveHoldings = {
  holdingsAsOf: string;
  assets: AssetConfig[];
  source: "sheet" | "file";
};

// ---------- parsing ----------

// "1,000", "3.5%", " 7 " → number; blank or junk → null.
function parseNumber(value: unknown): number | null {
  const text = String(value ?? "").replace(/[,%$\s]/g, "");
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

const parseCurrency = (value: unknown): BaseCurrency | undefined => {
  const text = String(value ?? "").trim().toUpperCase();
  return text === "USD" || text === "CAD" ? text : undefined;
};

const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

export function parseHoldingRows(rows: string[][]): AssetConfig[] {
  const [header = [], ...body] = rows;
  const column = (name: string) => header.findIndex((cell) => String(cell).trim().toLowerCase() === name.toLowerCase());
  const index = Object.fromEntries(HOLDINGS_HEADERS.map((name) => [name, column(name)]));
  const cell = (row: string[], name: string) => (index[name] >= 0 ? String(row[index[name]] ?? "").trim() : "");

  const assets: AssetConfig[] = [];
  const seen = new Set<string>();
  for (const row of body) {
    const symbol = cell(row, "Symbol");
    const kind = cell(row, "Kind").toLowerCase() as AssetKind;
    if (!symbol || !KINDS.includes(kind) || seen.has(symbol)) continue;
    seen.add(symbol);

    const asset: AssetConfig = {
      symbol,
      name: cell(row, "Name") || symbol,
      category: cell(row, "Category") || "Other",
      kind,
      targetAllocation: Math.max(0, parseNumber(cell(row, "Target %")) ?? 0),
      quantity: parseNumber(cell(row, "Quantity")),
    };
    const currency = parseCurrency(cell(row, "Currency"));
    if (currency) asset.currency = currency;
    const label = cell(row, "Holding Label");
    if (label) asset.holdingLabel = label;
    if (kind === "manual") asset.manualValue = parseNumber(cell(row, "Manual Value"));

    const purchaseAmount = parseNumber(cell(row, "Purchase Amount"));
    const purchaseCurrency = parseCurrency(cell(row, "Purchase Currency"));
    const purchaseDate = cell(row, "Purchase Date");
    if (kind === "market" && purchaseAmount && purchaseAmount > 0 && purchaseCurrency && isIsoDate(purchaseDate)) {
      asset.purchase = { amount: purchaseAmount, currency: purchaseCurrency, date: purchaseDate };
    }

    const keywords = cell(row, "News Keywords")
      .split(",")
      .map((word) => word.trim())
      .filter(Boolean);
    if (keywords.length) asset.newsKeywords = keywords;

    assets.push(asset);
  }
  return assets;
}

export function holdingRow(asset: AssetConfig): (string | number)[] {
  return [
    asset.symbol,
    asset.name,
    asset.category,
    asset.kind,
    asset.targetAllocation,
    asset.quantity ?? "",
    asset.currency ?? "",
    asset.holdingLabel ?? "",
    asset.manualValue ?? "",
    asset.purchase?.amount ?? "",
    asset.purchase?.currency ?? "",
    asset.purchase?.date ?? "",
    (asset.newsKeywords ?? []).join(", "),
  ];
}

// ---------- reading ----------

const fileHoldings = (): ReserveHoldings => ({
  holdingsAsOf: fallback.holdingsAsOf,
  assets: fallback.assets as unknown as AssetConfig[],
  source: "file",
});

async function seed(spreadsheetId: string, range: string, values: (string | number)[][]) {
  await getSheets().spreadsheets.values.update({ spreadsheetId, range, valueInputOption: "RAW", requestBody: { values } });
}

async function readSheet(spreadsheetId: string): Promise<ReserveHoldings> {
  const [holdingRows, settingRows] = await Promise.all([
    readTab(spreadsheetId, HOLDINGS_TAB, HOLDINGS_HEADERS),
    readTab(spreadsheetId, SETTINGS_TAB, SETTINGS_HEADERS),
  ]);

  let assets = parseHoldingRows(holdingRows);
  if (holdingRows.length <= 1) {
    // New, empty tab: fill it with the current holdings.
    assets = fileHoldings().assets;
    await seed(spreadsheetId, `${HOLDINGS_TAB}!A1`, [HOLDINGS_HEADERS, ...assets.map(holdingRow)]);
  }

  let holdingsAsOf = settingRows.find((row) => String(row[0] ?? "").trim().toLowerCase() === AS_OF_SETTING.toLowerCase())?.[1]?.trim() ?? "";
  if (!isIsoDate(holdingsAsOf)) {
    if (settingRows.length <= 1) {
      await seed(spreadsheetId, `${SETTINGS_TAB}!A1`, [SETTINGS_HEADERS, [AS_OF_SETTING, fallback.holdingsAsOf]]);
    }
    holdingsAsOf = fallback.holdingsAsOf;
  }

  if (!assets.length) throw new Error(`The "${HOLDINGS_TAB}" tab has no valid rows`);
  return { holdingsAsOf, assets, source: "sheet" };
}

let cache: { value: ReserveHoldings; expires: number } | null = null;
let lastGood: ReserveHoldings | null = null;
let pending: Promise<ReserveHoldings> | null = null;

export async function getReserveHoldings(): Promise<ReserveHoldings> {
  if (cache && cache.expires > Date.now()) return cache.value;
  if (pending) return pending;

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) return fileHoldings();

  pending = readSheet(spreadsheetId)
    .then((value) => {
      lastGood = value;
      return value;
    })
    .catch((error: any) => {
      console.error("Reserve holdings: couldn't read the sheet:", error?.message || error);
      return lastGood ?? fileHoldings();
    })
    .then((value) => {
      // Retry a failing sheet sooner than a working one.
      cache = { value, expires: Date.now() + (value.source === "sheet" ? CACHE_MS : 15_000) };
      pending = null;
      return value;
    });
  return pending;
}

// ---------- what non-holders see ----------

// Positions the reserve actually has (or may have: an unvalued manual
// position, the on-chain MoCoin rows). Watch-only rows are left out.
export function isHeldConfig(asset: AssetConfig) {
  switch (asset.kind) {
    case "market":
      return (asset.quantity ?? 0) > 0 || (asset.quantity == null && Boolean(asset.purchase));
    case "cash":
      return (asset.quantity ?? 0) > 0;
    default:
      return true;
  }
}

// Without targets and watch-only assets: those are for MoCoin holders.
export function publicView(holdings: ReserveHoldings): ReserveHoldings {
  return {
    ...holdings,
    assets: holdings.assets.filter(isHeldConfig).map((asset) => ({ ...asset, targetAllocation: 0 })),
  };
}

import { columnReader, normalizeHeader as normalize, readTab as readSheetTab } from "@/lib/googleSheets";
import type { BaseCurrency } from "@/lib/treasury/types";

// Client data lives in the Google Sheet named by GOOGLE_SHEET_ID (the same
// sheet and service account the newsletter uses: GOOGLE_CLIENT_EMAIL /
// GOOGLE_PRIVATE_KEY), kept out of the repo because it's public. Each tab is
// created with its header row if it doesn't exist yet, and columns are matched
// by header, case-insensitive, in any order.
//
// "Clients" tab — one row per account:
//   Username           – the client this row gives access to
//   Email              – Google account allowed to see this client
//   Wallet Addresses   – Solana wallets to scan, comma- or space-separated
//   Preferred Currency – CAD or USD (optional, defaults to CAD)
//
// "Ledger" tab — one row per transaction:
//   Date      – when it happened; YYYY-MM-DD (or YYYY-MM) sorts best
//   Username  – the client it belongs to
//   Type      – Deposit / Withdrawal (see LEDGER_TYPES)
//   Token     – a token name or symbol from src/data/clients.json, or a Solana mint address
//   Quantity  – number of tokens
//   Note      – optional
export const CLIENTS_TAB = "Clients";
export const LEDGER_TAB = "Ledger";
const CLIENTS_HEADERS = ["Username", "Email", "Wallet Addresses", "Preferred Currency"];
const LEDGER_HEADERS = ["Date", "Username", "Type", "Token", "Quantity", "Note"];

// How each transaction type moves the balance. "Adjustment" takes the sign of
// its quantity, so corrections can go either way. Other types are listed but
// don't change the balance.
const LEDGER_TYPES: Record<string, 1 | -1 | "signed"> = {
  deposit: 1, buy: 1, transferin: 1, in: 1, reward: 1,
  withdrawal: -1, withdraw: -1, sell: -1, transferout: -1, out: -1, fee: -1,
  adjustment: "signed",
};

export type SheetClient = {
  username: string;
  email: string;
  walletAddresses: string[];
  preferredCurrency?: BaseCurrency;
};

export type LedgerEntry = {
  date: string;
  username: string;
  type: string;
  token: string;
  // Signed change to the balance: positive in, negative out, 0 for types that
  // don't move it.
  quantity: number;
  note?: string;
};

function readTab(title: string, headers: string[]): Promise<string[][]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEET_ID is not set");
  return readSheetTab(spreadsheetId, title, headers);
}

export function parseClientRows(rows: string[][]): SheetClient[] {
  // A brand-new or cleared tab has no header row yet.
  if (!rows.length) return [];
  const [header = [], ...body] = rows;
  const { find, cell } = columnReader(header);
  const col = {
    username: find("username", "user", "client"),
    email: find("email", "emailaddress"),
    wallets: find("walletaddresses", "walletaddress", "wallets", "wallet"),
    currency: find("preferredcurrency", "currency"),
  };
  if (col.username < 0 || col.email < 0) {
    throw new Error(`The ${CLIENTS_TAB} tab needs "Username" and "Email" columns`);
  }

  return body
    .map((row) => {
      const currency = cell(row, col.currency).toUpperCase();
      return {
        username: cell(row, col.username),
        email: cell(row, col.email).toLowerCase(),
        walletAddresses: cell(row, col.wallets).split(/[\s,;]+/).filter(Boolean),
        preferredCurrency: currency === "CAD" || currency === "USD" ? (currency as BaseCurrency) : undefined,
      };
    })
    .filter((client) => client.username && client.email);
}

export function parseLedgerRows(rows: string[][]): LedgerEntry[] {
  // A brand-new or cleared tab has no header row yet.
  if (!rows.length) return [];
  const [header = [], ...body] = rows;
  const { find, cell } = columnReader(header);
  const col = {
    date: find("date"),
    username: find("username", "user", "client"),
    type: find("type", "transactiontype"),
    token: find("token", "asset", "coin"),
    quantity: find("quantity", "amount", "qty"),
    note: find("note", "notes", "memo", "description"),
  };
  const missing = (["username", "type", "token", "quantity"] as const).filter((key) => col[key] < 0);
  if (missing.length) {
    throw new Error(`The ${LEDGER_TAB} tab is missing columns: ${missing.join(", ")}`);
  }

  const entries: LedgerEntry[] = [];
  for (const row of body) {
    const username = cell(row, col.username);
    const token = cell(row, col.token);
    const raw = Number(cell(row, col.quantity).replace(/[,\s]/g, ""));
    if (!username || !token || !Number.isFinite(raw) || raw === 0) continue;

    const type = cell(row, col.type) || "Deposit";
    const direction = LEDGER_TYPES[normalize(type)];
    const quantity = direction === "signed" ? raw : direction ? direction * Math.abs(raw) : 0;
    entries.push({ date: cell(row, col.date), username, type, token, quantity, note: cell(row, col.note) || undefined });
  }
  return entries;
}

export async function readClientsSheet(): Promise<SheetClient[]> {
  return parseClientRows(await readTab(CLIENTS_TAB, CLIENTS_HEADERS));
}

export async function readLedgerSheet(): Promise<LedgerEntry[]> {
  return parseLedgerRows(await readTab(LEDGER_TAB, LEDGER_HEADERS));
}

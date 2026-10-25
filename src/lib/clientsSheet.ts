import { google } from "googleapis";
import type { BaseCurrency } from "@/lib/treasury/types";

// Client accounts live in the "Clients" tab of the Google Sheet named by
// GOOGLE_SHEET_ID (the same sheet and service account the newsletter uses:
// GOOGLE_CLIENT_EMAIL / GOOGLE_PRIVATE_KEY). Kept out of the repo because it's
// public. The tab is created with its header row if it doesn't exist yet.
//
// Columns (matched by header, case-insensitive, in any order):
//   Username           – matches a client id in src/data/clients.json, if any
//   Email              – Google account allowed to see this client
//   Wallet Addresses   – Solana wallets to scan, comma- or space-separated
//   Preferred Currency – CAD or USD (optional, defaults to CAD)
export const CLIENTS_TAB = "Clients";
const HEADERS = ["Username", "Email", "Wallet Addresses", "Preferred Currency"];

export type SheetClient = {
  username: string;
  email: string;
  walletAddresses: string[];
  preferredCurrency?: BaseCurrency;
};

function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function createClientsTab(spreadsheetId: string) {
  const sheets = getSheets();
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: [{ addSheet: { properties: { title: CLIENTS_TAB, gridProperties: { frozenRowCount: 1 } } } }] },
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${CLIENTS_TAB}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [HEADERS] },
  });
}

const normalizeHeader = (header: string) => header.toLowerCase().replace(/[^a-z]/g, "");

export function parseClientRows(rows: string[][]): SheetClient[] {
  const [header = [], ...body] = rows;
  const index = (...names: string[]) => header.findIndex((cell) => names.includes(normalizeHeader(String(cell))));
  const col = {
    username: index("username", "user", "client"),
    email: index("email", "emailaddress"),
    wallets: index("walletaddresses", "walletaddress", "wallets", "wallet"),
    currency: index("preferredcurrency", "currency"),
  };
  if (col.username < 0 || col.email < 0) {
    throw new Error(`The ${CLIENTS_TAB} tab needs "Username" and "Email" columns`);
  }

  const cell = (row: string[], i: number) => (i >= 0 ? String(row[i] ?? "").trim() : "");

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

export async function readClientsSheet(): Promise<SheetClient[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEET_ID is not set");

  try {
    const response = await getSheets().spreadsheets.values.get({ spreadsheetId, range: `${CLIENTS_TAB}!A:Z` });
    return parseClientRows((response.data.values || []) as string[][]);
  } catch (error: any) {
    // The Sheets API reports a missing tab as an unparseable range.
    if (String(error?.message || "").includes("Unable to parse range")) {
      await createClientsTab(spreadsheetId);
      return [];
    }
    throw error;
  }
}

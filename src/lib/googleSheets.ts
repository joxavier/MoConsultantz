import { google } from "googleapis";

// Google Sheets access through the site's service account
// (GOOGLE_CLIENT_EMAIL / GOOGLE_PRIVATE_KEY). A sheet has to be shared with
// that account's email, as an Editor, before it can be read or written.

export function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function createTab(spreadsheetId: string, title: string, headers: string[]) {
  const sheets = getSheets();
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: [{ addSheet: { properties: { title, gridProperties: { frozenRowCount: 1 } } } }] },
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${title}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [headers] },
  });
}

// Every row of a tab, header first. A missing tab is created with `headers`.
export async function readTab(spreadsheetId: string, title: string, headers: string[]): Promise<string[][]> {
  try {
    const response = await getSheets().spreadsheets.values.get({ spreadsheetId, range: `${title}!A:Z` });
    return (response.data.values || []) as string[][];
  } catch (error: any) {
    // The Sheets API reports a missing tab as an unparseable range.
    if (String(error?.message || "").includes("Unable to parse range")) {
      await createTab(spreadsheetId, title, headers);
      return [];
    }
    throw error;
  }
}

// Replace a tab's contents with `headers` and `rows`. Values are written RAW,
// so text that looks like a formula is stored as text, never evaluated.
export async function writeTab(spreadsheetId: string, title: string, headers: string[], rows: string[][]) {
  await readTab(spreadsheetId, title, headers); // creates the tab if needed
  const sheets = getSheets();
  await sheets.spreadsheets.values.clear({ spreadsheetId, range: `${title}!A:Z` });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${title}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [headers, ...rows] },
  });
}

const normalize = (value: string) => String(value).toLowerCase().replace(/[^a-z]/g, "");

// Finds columns by header name (case- and punctuation-insensitive), so a tab's
// columns can be reordered or renamed slightly without breaking anything.
export function columnReader(header: string[]) {
  const find = (...names: string[]) => header.findIndex((cell) => names.includes(normalize(cell)));
  const cell = (row: string[], i: number) => (i >= 0 ? String(row[i] ?? "").trim() : "");
  return { find, cell };
}

export { normalize as normalizeHeader };

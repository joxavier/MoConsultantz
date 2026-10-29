import { getSheets, readTab } from "@/lib/googleSheets";

// The newsletter list is the "Newsletter" tab of the site's Google Sheet
// (GOOGLE_SHEET_ID), the same one /api/subscribe writes to: column A is the
// time, B the email, C where the signup came from.
const TAB = "Newsletter";
const HEADERS = ["Timestamp", "Email", "Source"];

// Adds the email unless it's already on the list. Returns false when it was
// already there.
export async function addToNewsletter(email: string, source: string) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEET_ID is not set");

  const rows = await readTab(spreadsheetId, TAB, HEADERS);
  const wanted = email.trim().toLowerCase();
  if (rows.some((row) => String(row[1] ?? "").trim().toLowerCase() === wanted)) return false;

  await getSheets().spreadsheets.values.append({
    spreadsheetId,
    range: `${TAB}!A:C`,
    // RAW so an address that looks like a formula is stored as text.
    valueInputOption: "RAW",
    requestBody: { values: [[new Date().toISOString(), wanted, source]] },
  });
  return true;
}

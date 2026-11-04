import { createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { getSheets, readTab } from "@/lib/googleSheets";
import { SESSION_COOKIE as MO_SESSION_COOKIE, createSession as createMoSession, readSession as readMoSession, signToken, verifyToken, type MoSession } from "@/lib/moAuth";

// Passwordless sign-in for Ank (ank.modevz.ca). An account holder enters
// their email, gets a one-time code by email, and enters it to sign in.
//
// Accounts are the rows of the "Ank Accounts" tab (Name, Email) of the site's
// Google Sheet (GOOGLE_SHEET_ID), plus any in ANK_ACCOUNTS, a comma-separated
// list such as
//   ANK_ACCOUNTS="Joshua <josh@modevz.ca>, Tactical Grapes <hello@example.com>"
// The sheet is re-read at most once a minute, so adding or removing a row
// takes effect within a minute. Any other email that tries to sign in joins
// the launch newsletter instead.
//
// Nothing is stored server-side: the pending code lives in a signed, httpOnly
// cookie. Signing in adds the email to the shared Mo ID session (see
// src/lib/moAuth.ts), so it carries over to MoOS and the other Mo dapps.

export const CHALLENGE_COOKIE = "ank_challenge";
// Ank used its own session cookie before Mo ID; it is cleared on sign-out.
export const LEGACY_SESSION_COOKIE = "ank_session";
export const SESSION_COOKIE = MO_SESSION_COOKIE;
export const CODE_TTL_SECONDS = 10 * 60;
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

// 8 characters from 31 easy-to-read symbols (no 0/O or 1/I/L): about
// 8.5 x 10^11 combinations, so a code can't be guessed within its 10 minutes even
// though attempts can't be counted reliably across server instances.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;

export type AnkAccount = { name: string; email: string };

export const ACCOUNTS_TAB = "Ank Accounts";
const ACCOUNTS_HEADERS = ["Name", "Email"];
// Written to a new, empty tab so the owner's account works straight away.
const DEFAULT_ACCOUNTS: AnkAccount[] = [{ name: "Joshua", email: "josh@modevz.ca" }];
const ACCOUNTS_CACHE_MS = 60_000;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function envAccounts(): AnkAccount[] {
  return (process.env.ANK_ACCOUNTS || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(.*?)\s*<\s*([^>]+?)\s*>$/);
      const email = normalizeEmail(match ? match[2] : entry);
      return { name: match?.[1]?.trim() || email, email };
    });
}

async function sheetAccounts(spreadsheetId: string): Promise<AnkAccount[]> {
  const rows = await readTab(spreadsheetId, ACCOUNTS_TAB, ACCOUNTS_HEADERS);
  if (rows.length <= 1) {
    const seed = envAccounts().length ? envAccounts() : DEFAULT_ACCOUNTS;
    await getSheets().spreadsheets.values.update({
      spreadsheetId,
      range: `${ACCOUNTS_TAB}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [ACCOUNTS_HEADERS, ...seed.map((account) => [account.name, account.email])] },
    });
    return seed;
  }
  return rows
    .slice(1)
    .map((row) => ({ name: String(row[0] ?? "").trim(), email: normalizeEmail(String(row[1] ?? "")) }))
    .filter((account) => isEmail(account.email))
    .map((account) => ({ ...account, name: account.name || account.email }));
}

let accountsCache: { accounts: AnkAccount[]; expires: number } | null = null;
let lastSheetAccounts: AnkAccount[] = [];

export async function getAccounts(): Promise<AnkAccount[]> {
  if (accountsCache && accountsCache.expires > Date.now()) return accountsCache.accounts;

  let fromSheet = lastSheetAccounts;
  let ok = true;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (spreadsheetId && process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    try {
      fromSheet = lastSheetAccounts = await sheetAccounts(spreadsheetId);
    } catch (error: any) {
      ok = false;
      console.error("Ank accounts: couldn't read the sheet:", error?.message || error);
    }
  }

  const byEmail = new Map<string, AnkAccount>();
  for (const account of [...envAccounts(), ...fromSheet]) if (!byEmail.has(account.email)) byEmail.set(account.email, account);
  const accounts = Array.from(byEmail.values());
  accountsCache = { accounts, expires: Date.now() + (ok ? ACCOUNTS_CACHE_MS : 15_000) };
  return accounts;
}

export async function findAccount(email: string) {
  const wanted = normalizeEmail(email);
  return (await getAccounts()).find((account) => account.email === wanted);
}

function getSecret() {
  return process.env.MO_AUTH_SECRET || process.env.ANK_AUTH_SECRET || process.env.NEXTAUTH_SECRET || null;
}

export const isAuthConfigured = () => Boolean(getSecret());

const sign = (payload: { x: number } & Record<string, unknown>) => signToken(payload);
const verify = <T extends { x: number }>(token: string | undefined) => verifyToken<T>(token);

const now = () => Math.floor(Date.now() / 1000);

export function generateCode() {
  return Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
}

// Accepts "abcd-efgh", "ABCD EFGH", etc.
export const normalizeCode = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, "");

export const formatCode = (code: string) => `${code.slice(0, 4)}-${code.slice(4)}`;

// The code itself never goes into the cookie, only a keyed hash of it bound
// to the email and a random challenge id.
function codeHash(email: string, code: string, id: string) {
  return createHmac("sha256", getSecret()!).update(`${id}:${email}:${code}`).digest("base64url");
}

type Challenge = { e: string; h: string; i: string; x: number };

export function createChallenge(email: string, code: string) {
  const id = randomBytes(12).toString("base64url");
  return { id, token: sign({ e: email, h: codeHash(email, code, id), i: id, x: now() + CODE_TTL_SECONDS } satisfies Challenge) };
}

export function readChallenge(token: string | undefined) {
  return verify<Challenge>(token);
}

export function checkCode(challenge: Challenge, code: string) {
  const expected = Buffer.from(challenge.h);
  const given = Buffer.from(codeHash(challenge.e, normalizeCode(code), challenge.i));
  return expected.length === given.length && timingSafeEqual(expected, given);
}

// Adds the email to the Mo ID session, keeping a linked wallet.
export function createSession(email: string, current: MoSession | null) {
  return createMoSession(current, { email });
}

// The signed-in Ank account, or null. Also re-checks the account list, so removing
// an email there signs that account out within a minute.
export async function readSession(token: string | undefined) {
  const session = readMoSession(token);
  return session?.e ? (await findAccount(session.e)) ?? null : null;
}

// Shared with Mo ID: cookies go on the parent domain so the challenge and
// session work on ank.modevz.ca and every other Mo dapp.
export { cookieOptions } from "@/lib/moAuth";

// Best-effort limits within one server instance, on top of the code's
// strength: they slow down repeated sends and guessing.
const attempts = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(key: string, limit: number, windowSeconds: number) {
  const time = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < time) {
    attempts.set(key, { count: 1, resetAt: time + windowSeconds * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

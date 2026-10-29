import { createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto";

// Passwordless sign-in for Ank (ank.modevz.ca). An account holder enters
// their email, gets a one-time code by email, and enters it to sign in.
//
// Accounts are set with ANK_ACCOUNTS, a comma-separated list such as
//   ANK_ACCOUNTS="Joshua <josh@modevz.ca>, Tactical Grapes <hello@example.com>"
// Any other email that tries to sign in joins the launch newsletter instead.
//
// Nothing is stored server-side: the pending code and the session live in
// signed, httpOnly cookies (HMAC with ANK_AUTH_SECRET, or NEXTAUTH_SECRET).

export const CHALLENGE_COOKIE = "ank_challenge";
export const SESSION_COOKIE = "ank_session";
export const CODE_TTL_SECONDS = 10 * 60;
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

// 8 characters from 31 easy-to-read symbols (no 0/O or 1/I/L): about
// 8.5 x 10^11 combinations, so a code can't be guessed within its 10 minutes even
// though attempts can't be counted reliably across server instances.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;

export type AnkAccount = { name: string; email: string };

export function getAccounts(): AnkAccount[] {
  return (process.env.ANK_ACCOUNTS || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(.*?)\s*<\s*([^>]+?)\s*>$/);
      const email = (match ? match[2] : entry).toLowerCase();
      return { name: match?.[1]?.trim() || email, email };
    });
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function findAccount(email: string) {
  const wanted = normalizeEmail(email);
  return getAccounts().find((account) => account.email === wanted);
}

function getSecret() {
  return process.env.ANK_AUTH_SECRET || process.env.NEXTAUTH_SECRET || null;
}

export const isAuthConfigured = () => Boolean(getSecret());

const base64url = (value: Buffer | string) => Buffer.from(value).toString("base64url");

function sign(payload: object) {
  const secret = getSecret();
  if (!secret) throw new Error("ANK_AUTH_SECRET is not set");
  const body = base64url(JSON.stringify(payload));
  const signature = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verify<T extends { x: number }>(token: string | undefined): T | null {
  const secret = getSecret();
  if (!secret || !token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = createHmac("sha256", secret).update(body).digest();
  const given = Buffer.from(signature, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as T;
    return payload.x > Math.floor(Date.now() / 1000) ? payload : null;
  } catch {
    return null;
  }
}

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
type Session = { e: string; x: number };

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

export function createSession(email: string) {
  return sign({ e: email, x: now() + SESSION_TTL_SECONDS } satisfies Session);
}

// The signed-in account, or null. Also re-checks ANK_ACCOUNTS, so removing
// an email there signs that account out straight away.
export function readSession(token: string | undefined) {
  const session = verify<Session>(token);
  return session ? findAccount(session.e) ?? null : null;
}

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

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

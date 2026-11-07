import { createHmac, createPublicKey, randomBytes, timingSafeEqual, verify as verifySignature } from "crypto";
import { PublicKey } from "@solana/web3.js";
import treasuryConfig from "@/data/treasuryConfig.json";
import { getTokenAccountBalance } from "@/lib/treasury/solana";

// Mo ID: one sign-in shared by the Mo dapps (MoOS, the Strategic Reserve,
// Ank, …). A visitor can link two identities to the same session:
//   - a Solana wallet, proven by signing a one-time message (no transaction,
//     no fees). MoCoin holders get holder-only pages.
//   - an email, proven by a one-time code (Ank's sign-in).
//
// Nothing is stored server-side. The session is a signed (HMAC-SHA256),
// httpOnly cookie set on the parent domain (.modevz.ca), so every subdomain
// sees the same sign-in and signing out signs out everywhere.
//
// Secret: MO_AUTH_SECRET, else ANK_AUTH_SECRET, else NEXTAUTH_SECRET.
// Holder threshold: MOCOIN_HOLDER_MIN (default: any MoCoin at all).

export const SESSION_COOKIE = "mo_session";
export const WALLET_CHALLENGE_COOKIE = "mo_wallet_challenge";
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
export const WALLET_CHALLENGE_TTL_SECONDS = 5 * 60;

const SHARED_DOMAINS = ["modevz.ca", "modevz.com", "moconsultantz.com"];

function getSecret() {
  return process.env.MO_AUTH_SECRET || process.env.ANK_AUTH_SECRET || process.env.NEXTAUTH_SECRET || null;
}

export const isAuthConfigured = () => Boolean(getSecret());

const now = () => Math.floor(Date.now() / 1000);

// ---------- signed tokens ----------

export function signToken(payload: { x: number } & Record<string, unknown>) {
  const secret = getSecret();
  if (!secret) throw new Error("MO_AUTH_SECRET is not set");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

// The payload when the signature is valid and it hasn't expired, else null.
export function verifyToken<T extends { x: number }>(token: string | undefined): T | null {
  const secret = getSecret();
  if (!secret || !token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = createHmac("sha256", secret).update(body).digest();
  const given = Buffer.from(signature, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as T;
    return typeof payload.x === "number" && payload.x > now() ? payload : null;
  } catch {
    return null;
  }
}

// ---------- cookies ----------

const hostOf = (host: string | null | undefined) => (host || "").split(":")[0].toLowerCase();

// ".modevz.ca" on modevz.ca and its subdomains, so the session is shared;
// host-only elsewhere (localhost, previews).
export function cookieDomain(host: string | null | undefined) {
  const name = hostOf(host);
  const shared = SHARED_DOMAINS.find((domain) => name === domain || name.endsWith(`.${domain}`));
  return shared ? `.${shared}` : undefined;
}

export const cookieOptions = (maxAge: number, host?: string | null) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
  domain: cookieDomain(host),
});

// ---------- session ----------

// e: email (verified by code), w: wallet address (verified by signature).
export type MoSession = { e?: string; w?: string; x: number };

export const readSession = (token: string | undefined) => verifyToken<MoSession>(token);

// Adds identities to the current session (or starts one) and renews it.
export function createSession(current: MoSession | null, add: { email?: string; wallet?: string }) {
  const session: MoSession = { x: now() + SESSION_TTL_SECONDS };
  const email = add.email ?? current?.e;
  const wallet = add.wallet ?? current?.w;
  if (email) session.e = email;
  if (wallet) session.w = wallet;
  return signToken(session);
}

// ---------- wallet sign-in ----------

export function isWalletAddress(value: unknown): value is string {
  if (typeof value !== "string" || value.length < 32 || value.length > 44) return false;
  try {
    return PublicKey.isOnCurve(new PublicKey(value).toBytes());
  } catch {
    return false;
  }
}

type WalletChallenge = { w: string; n: string; d: string; i: number; x: number };

// The exact text the wallet signs, in Sign-In With Solana format (EIP-4361
// adapted for Solana). Phantom and other wallets parse a message that opens
// with "... wants you to sign in" strictly and refuse to show it if any field
// is off, so: Version 1, a Chain ID, an alphanumeric nonce, fields in order.
// It is rebuilt from the signed challenge cookie when checking the signature,
// so the browser can't swap in a different message.
export function walletMessage(challenge: Omit<WalletChallenge, "x"> & { x: number }) {
  return [
    `${challenge.d} wants you to sign in with your Solana account:`,
    challenge.w,
    "",
    "Sign in to Mo: MoOS, the MoCoin Strategic Reserve and Ank. This is not a transaction and costs nothing.",
    "",
    `URI: https://${challenge.d}`,
    "Version: 1",
    "Chain ID: mainnet",
    `Nonce: ${challenge.n}`,
    `Issued At: ${new Date(challenge.i * 1000).toISOString()}`,
    `Expiration Time: ${new Date(challenge.x * 1000).toISOString()}`,
  ].join("\n");
}

export function createWalletChallenge(wallet: string, host: string | null | undefined) {
  const issued = now();
  const challenge: WalletChallenge = {
    w: wallet,
    n: randomBytes(16).toString("hex"), // letters and digits only, as SIWS requires
    d: hostOf(host) || "modevz.ca",
    i: issued,
    x: issued + WALLET_CHALLENGE_TTL_SECONDS,
  };
  return { token: signToken(challenge), message: walletMessage(challenge) };
}

export const readWalletChallenge = (token: string | undefined) => verifyToken<WalletChallenge>(token);

// Ed25519 check of a wallet's signature over the message, using Node's crypto
// (a Solana address is the raw 32-byte Ed25519 public key).
export function verifyWalletSignature(wallet: string, message: string, signature: Buffer) {
  if (signature.length !== 64) return false;
  try {
    const key = createPublicKey({
      key: { kty: "OKP", crv: "Ed25519", x: Buffer.from(new PublicKey(wallet).toBytes()).toString("base64url") },
      format: "jwk",
    });
    return verifySignature(null, Buffer.from(message, "utf8"), key, signature);
  } catch {
    return false;
  }
}

// ---------- MoCoin holder check ----------

export const holderMinimum = () => {
  const value = Number(process.env.MOCOIN_HOLDER_MIN);
  return Number.isFinite(value) && value > 0 ? value : 0;
};

export type HolderStatus = { balance: number; minimum: number; isHolder: boolean } | { error: string };

// Balances are re-read on-chain at most once a minute per wallet, so selling
// all your MoCoin closes the holder pages within a minute.
const holderCache = new Map<string, { status: HolderStatus; expires: number }>();

export async function getHolderStatus(wallet: string): Promise<HolderStatus> {
  const cached = holderCache.get(wallet);
  if (cached && cached.expires > Date.now()) return cached.status;

  let status: HolderStatus;
  try {
    const balance = await getTokenAccountBalance(wallet, treasuryConfig.mocoin.mintAddress);
    const minimum = holderMinimum();
    status = { balance, minimum, isHolder: minimum > 0 ? balance >= minimum : balance > 0 };
  } catch {
    status = { error: "Couldn't read the wallet's MoCoin balance right now." };
  }
  if (holderCache.size > 5000) holderCache.clear();
  holderCache.set(wallet, { status, expires: Date.now() + ("error" in status ? 10_000 : 60_000) });
  return status;
}

// ---------- rate limiting ----------

// Best-effort, per server instance.
const attempts = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(key: string, limit: number, windowSeconds: number) {
  const time = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < time) {
    if (attempts.size > 10000) attempts.clear();
    attempts.set(key, { count: 1, resetAt: time + windowSeconds * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

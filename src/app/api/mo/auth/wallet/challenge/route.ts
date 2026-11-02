import { NextResponse } from "next/server";
import {
  WALLET_CHALLENGE_COOKIE,
  WALLET_CHALLENGE_TTL_SECONDS,
  clientIp,
  cookieOptions,
  createWalletChallenge,
  isAuthConfigured,
  isWalletAddress,
  rateLimited,
} from "@/lib/moAuth";

// Step 1 of wallet sign-in: the message for the wallet to sign. The challenge
// (wallet, nonce, domain, times) goes back in a signed cookie.
export async function POST(req: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ error: "Sign-in isn't set up yet." }, { status: 503 });
  }
  if (rateLimited(`wallet-challenge:${clientIp(req)}`, 20, 10 * 60)) {
    return NextResponse.json({ error: "Too many sign-in attempts. Try again in a few minutes." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!isWalletAddress(body?.wallet)) {
    return NextResponse.json({ error: "That isn't a Solana wallet address." }, { status: 400 });
  }

  const host = req.headers.get("host");
  const { token, message } = createWalletChallenge(body.wallet, host);
  const response = NextResponse.json({ message });
  response.cookies.set(WALLET_CHALLENGE_COOKIE, token, cookieOptions(WALLET_CHALLENGE_TTL_SECONDS, host));
  return response;
}

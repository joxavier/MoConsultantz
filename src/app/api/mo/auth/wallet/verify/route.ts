import { NextResponse } from "next/server";
import { linkWalletToAccount } from "@/lib/ankAuth";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  WALLET_CHALLENGE_COOKIE,
  clientIp,
  cookieOptions,
  createSession,
  getHolderStatus,
  rateLimited,
  readSession,
  readWalletChallenge,
  verifyWalletSignature,
  walletMessage,
} from "@/lib/moAuth";

// Step 2 of wallet sign-in: check the wallet's signature over the challenge
// message, then link the wallet to the Mo ID session (keeping a linked email).
export async function POST(req: Request) {
  const host = req.headers.get("host");
  if (rateLimited(`wallet-verify:${clientIp(req)}`, 20, 10 * 60)) {
    return NextResponse.json({ error: "Too many sign-in attempts. Try again in a few minutes." }, { status: 429 });
  }

  const challenge = readWalletChallenge(cookies().get(WALLET_CHALLENGE_COOKIE)?.value);
  if (!challenge) {
    return NextResponse.json({ error: "The sign-in request expired. Please try again." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const signature = typeof body?.signature === "string" ? Buffer.from(body.signature.slice(0, 200), "base64") : Buffer.alloc(0);

  // The challenge is single-use: cleared whether or not the signature checks out.
  const fail = (error: string) => {
    const response = NextResponse.json({ error }, { status: 401 });
    response.cookies.set(WALLET_CHALLENGE_COOKIE, "", cookieOptions(0, host));
    return response;
  };
  if (!verifyWalletSignature(challenge.w, walletMessage(challenge), signature)) {
    return fail("The wallet signature didn't match. Please try again.");
  }

  const current = readSession(cookies().get(SESSION_COOKIE)?.value);
  // Signed in by email too: save the wallet to that Ank account, so the
  // wallet alone signs in to it next time (web3 login).
  if (current?.e) {
    await linkWalletToAccount(current.e, challenge.w).catch((error) => console.error("Linking wallet to Ank account failed:", error?.message || error));
  }
  const response = NextResponse.json({ status: "signed-in", wallet: challenge.w, holder: await getHolderStatus(challenge.w) });
  response.cookies.set(WALLET_CHALLENGE_COOKIE, "", cookieOptions(0, host));
  response.cookies.set(SESSION_COOKIE, createSession(current, { wallet: challenge.w }), cookieOptions(SESSION_TTL_SECONDS, host));
  return response;
}

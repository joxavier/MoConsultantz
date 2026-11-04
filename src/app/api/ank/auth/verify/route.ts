import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  CHALLENGE_COOKIE,
  LEGACY_SESSION_COOKIE,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  checkCode,
  cookieOptions,
  createSession,
  findAccount,
  linkWalletToAccount,
  rateLimited,
  readChallenge,
} from "@/lib/ankAuth";
import { readSession as readMoSession } from "@/lib/moAuth";

// Step 2 of Ank sign-in: check the emailed code and add the email to the
// shared Mo ID session (keeping a wallet already linked to it).
export async function POST(req: Request) {
  const host = req.headers.get("host");
  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.slice(0, 20) : "";

  const challenge = readChallenge(cookies().get(CHALLENGE_COOKIE)?.value);
  if (!challenge) {
    return NextResponse.json({ error: "That code has expired. Please request a new one." }, { status: 400 });
  }

  // Five tries per code; after that a new code has to be requested.
  if (rateLimited(`verify:${challenge.i}`, 5, 15 * 60)) {
    const response = NextResponse.json({ error: "Too many tries. Please request a new code." }, { status: 429 });
    response.cookies.set(CHALLENGE_COOKIE, "", cookieOptions(0, host));
    return response;
  }

  if (!checkCode(challenge, code) || !(await findAccount(challenge.e))) {
    return NextResponse.json({ error: "That code isn't right. Check the email and try again." }, { status: 400 });
  }

  const response = NextResponse.json({ status: "signed-in" });
  response.cookies.set(CHALLENGE_COOKIE, "", cookieOptions(0, host));
  response.cookies.set(LEGACY_SESSION_COOKIE, "", cookieOptions(0));
  const current = readMoSession(cookies().get(SESSION_COOKIE)?.value);
  // A wallet already signed in to Mo ID gets saved to this account.
  if (current?.w) {
    await linkWalletToAccount(challenge.e, current.w).catch((error) => console.error("Linking wallet to Ank account failed:", error?.message || error));
  }
  response.cookies.set(SESSION_COOKIE, createSession(challenge.e, current), cookieOptions(SESSION_TTL_SECONDS, host));
  return response;
}

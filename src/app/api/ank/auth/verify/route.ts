import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  CHALLENGE_COOKIE,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  checkCode,
  cookieOptions,
  createSession,
  findAccount,
  rateLimited,
  readChallenge,
} from "@/lib/ankAuth";

// Step 2 of Ank sign-in: check the emailed code and start a session.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.slice(0, 20) : "";

  const challenge = readChallenge(cookies().get(CHALLENGE_COOKIE)?.value);
  if (!challenge) {
    return NextResponse.json({ error: "That code has expired. Please request a new one." }, { status: 400 });
  }

  // Five tries per code; after that a new code has to be requested.
  if (rateLimited(`verify:${challenge.i}`, 5, 15 * 60)) {
    const response = NextResponse.json({ error: "Too many tries. Please request a new code." }, { status: 429 });
    response.cookies.set(CHALLENGE_COOKIE, "", cookieOptions(0));
    return response;
  }

  if (!checkCode(challenge, code) || !findAccount(challenge.e)) {
    return NextResponse.json({ error: "That code isn't right. Check the email and try again." }, { status: 400 });
  }

  const response = NextResponse.json({ status: "signed-in" });
  response.cookies.set(CHALLENGE_COOKIE, "", cookieOptions(0));
  response.cookies.set(SESSION_COOKIE, createSession(challenge.e), cookieOptions(SESSION_TTL_SECONDS));
  return response;
}

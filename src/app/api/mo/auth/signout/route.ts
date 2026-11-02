import { NextResponse } from "next/server";
import { SESSION_COOKIE, cookieOptions } from "@/lib/moAuth";

// Signs out of Mo ID on every Mo dapp (the cookie is shared across subdomains).
export function POST(req: Request) {
  const response = NextResponse.json({ status: "signed-out" });
  response.cookies.set(SESSION_COOKIE, "", cookieOptions(0, req.headers.get("host")));
  response.cookies.set("ank_session", "", cookieOptions(0));
  return response;
}

import { NextResponse } from "next/server";
import { LEGACY_SESSION_COOKIE, SESSION_COOKIE, cookieOptions } from "@/lib/ankAuth";

// Signs out of Mo ID everywhere (Ank, MoOS, the Strategic Reserve).
export function POST(req: Request) {
  const response = NextResponse.json({ status: "signed-out" });
  response.cookies.set(SESSION_COOKIE, "", cookieOptions(0, req.headers.get("host")));
  response.cookies.set(LEGACY_SESSION_COOKIE, "", cookieOptions(0));
  return response;
}

import { NextResponse } from "next/server";
import { SESSION_COOKIE, cookieOptions } from "@/lib/ankAuth";

export function POST() {
  const response = NextResponse.json({ status: "signed-out" });
  response.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
  return response;
}

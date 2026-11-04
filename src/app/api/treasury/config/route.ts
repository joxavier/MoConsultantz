import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, getHolderStatus, readSession } from "@/lib/moAuth";
import { getReserveHoldings, publicView } from "@/lib/reserveHoldings";

export const dynamic = "force-dynamic";

// The Strategic Reserve's holdings, from the Google Sheet. MoCoin holders
// (Mo ID wallet, balance checked on-chain) get targets and the watchlist;
// everyone else gets the held positions only.
export async function GET() {
  const holdings = await getReserveHoldings();
  const session = readSession(cookies().get(SESSION_COOKIE)?.value);
  const status = session?.w ? await getHolderStatus(session.w) : null;
  const isHolder = Boolean(status && "isHolder" in status && status.isHolder);

  const view = isHolder ? holdings : publicView(holdings);
  return NextResponse.json(
    { holdingsAsOf: view.holdingsAsOf, assets: view.assets, source: view.source, targetsVisible: isHolder },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

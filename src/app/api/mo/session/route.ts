import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findAccount } from "@/lib/ankAuth";
import { SESSION_COOKIE, getHolderStatus, isAuthConfigured, readSession } from "@/lib/moAuth";

export const dynamic = "force-dynamic";

// Who is signed in to Mo ID, and whether their wallet holds MoCoin (read
// on-chain, cached for a minute). Holder-only pages ask this, never the
// browser's own idea of the wallet.
export async function GET() {
  const session = readSession(cookies().get(SESSION_COOKIE)?.value);
  const headers = { "Cache-Control": "no-store" };
  if (!session) return NextResponse.json({ configured: isAuthConfigured(), signedIn: false }, { headers });

  const account = session.e ? await findAccount(session.e) : undefined;
  return NextResponse.json(
    {
      configured: true,
      signedIn: true,
      wallet: session.w ?? null,
      email: session.e ?? null,
      ankAccount: account ? account.name : null,
      holder: session.w ? await getHolderStatus(session.w) : null,
      expiresAt: new Date(session.x * 1000).toISOString(),
    },
    { headers },
  );
}

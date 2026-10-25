import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getVisibleClients, priceClients, type ClientsResponse } from "@/lib/clients";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let visible: Awaited<ReturnType<typeof getVisibleClients>>;
  try {
    visible = await getVisibleClients(session);
  } catch (error: any) {
    console.error("Clients sheet read error:", error.message);
    return NextResponse.json({ error: "Client accounts are unavailable right now" }, { status: 503 });
  }

  const { isManager, clients } = visible;
  if (!clients.length) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const priced = await priceClients(clients);
  return NextResponse.json<ClientsResponse>({ isManager, ...priced });
}

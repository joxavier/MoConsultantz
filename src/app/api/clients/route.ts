import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getVisibleClients, priceClients, type ClientsResponse } from "@/lib/clients";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { isManager, clients } = getVisibleClients(session);
  if (!clients.length) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const priced = await priceClients(clients);
  return NextResponse.json<ClientsResponse>({ isManager, ...priced });
}

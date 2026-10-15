import type { Session } from "next-auth";

// Required env var: TREASURY_MANAGER_EMAILS — comma-separated list of Google
// account emails allowed to see exact treasury balances, the wallet address,
// and the rebalance-proposal/approval workflow. Everyone else only ever sees
// aggregate totals and percentages. Not currently set: josh@modevz.ca (2026-09-15).
function getAllowlist(): string[] {
  return (process.env.TREASURY_MANAGER_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isTreasuryManager(email?: string | null): boolean {
  if (!email) return false;
  return getAllowlist().includes(email.toLowerCase());
}

export function isTreasuryManagerSession(session: Session | null): boolean {
  return isTreasuryManager(session?.user?.email);
}

// Call from a route handler; returns null (and the caller should proceed) when
// the session belongs to an allowlisted treasury manager, otherwise returns a
// Response the handler should return immediately.
export function requireTreasuryManager(session: Session | null): Response | null {
  if (isTreasuryManagerSession(session)) return null;

  return new Response(
    JSON.stringify({ error: "Forbidden" }),
    { status: session ? 403 : 401, headers: { "Content-Type": "application/json" } }
  );
}

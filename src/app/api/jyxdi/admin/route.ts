import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  StoreError,
  deleteProduct,
  getAdminData,
  isJyxdiAdmin,
  saveProduct,
  saveSettings,
  validateProduct,
  validateSettings,
} from "@/lib/jyxdiStore";

// Admin API for the Art by Jyxdi store (used by /admin on jyxdi.modevz.ca).
//   GET                         – products and settings
//   POST   { product, originalSlug? } – add or update a product
//   DELETE ?slug=…              – remove a product
//   PUT    { settings }         – save the bio and payment details
// Every method requires a signed-in admin (JYXDI_ADMIN_EMAILS).

export const dynamic = "force-dynamic";

async function requireAdmin(req: NextRequest): Promise<Response | null> {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (!isJyxdiAdmin(session)) return NextResponse.json({ error: "This account isn't an admin." }, { status: 403 });
  // Writes must be JSON, which a cross-site form can't send without a CORS
  // preflight this API never grants.
  if (req.method !== "GET" && req.method !== "DELETE" && !req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Expected JSON." }, { status: 415 });
  }
  return null;
}

async function handle(req: NextRequest, action: () => Promise<unknown>) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const result = await action();
    if (req.method !== "GET") revalidatePath("/jyxdi", "layout");
    return NextResponse.json(result ?? { ok: true });
  } catch (error: any) {
    if (error instanceof StoreError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Jyxdi admin error:", error.message);
    return NextResponse.json({ error: "Couldn't reach the store's Google Sheet. Check it's shared with the site's service account." }, { status: 502 });
  }
}

export function GET(req: NextRequest) {
  return handle(req, getAdminData);
}

export function POST(req: NextRequest) {
  return handle(req, async () => {
    const body = await req.json();
    const product = validateProduct(body?.product);
    await saveProduct(product, typeof body?.originalSlug === "string" ? body.originalSlug : undefined);
    return { product };
  });
}

export function DELETE(req: NextRequest) {
  return handle(req, async () => {
    const slug = req.nextUrl.searchParams.get("slug");
    if (!slug) throw new StoreError("Which product? (missing slug)");
    await deleteProduct(slug);
  });
}

export function PUT(req: NextRequest) {
  return handle(req, async () => {
    const body = await req.json();
    const settings = validateSettings(body?.settings);
    await saveSettings(settings);
    return { settings };
  });
}

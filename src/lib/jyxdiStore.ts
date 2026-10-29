import type { Session } from "next-auth";
import { SITE, formatOptions, parseOptions, type Artwork, type ArtworkType } from "@/lib/jyxdi";
import { columnReader, normalizeHeader, readTab, writeTab } from "@/lib/googleSheets";

// Everything the Art by Jyxdi admin (/admin on jyxdi.modevz.ca) can edit lives
// in the Google Sheet named by JYXDI_SHEET_ID, which must be shared with the
// site's service account (GOOGLE_CLIENT_EMAIL) as an Editor:
//   "Products" tab – one row per artwork for sale
//   "Settings" tab – Key / Value rows: the bio and how buyers can pay
// Both tabs are created on first use. Until JYXDI_SHEET_ID is set the site
// falls back to the artworks and bio in src/data/jyxdi.json.
//
// Admins are the Google accounts listed in JYXDI_ADMIN_EMAILS
// (comma-separated).

const PRODUCTS_TAB = "Products";
const SETTINGS_TAB = "Settings";
const PRODUCT_HEADERS = ["Slug", "Title", "Type", "Price", "Description", "Image", "Details", "Checkout URL", "Sold", "Options"];
const SETTINGS_HEADERS = ["Key", "Value"];

export type PaymentSettings = {
  etransferEmail: string;
  solanaWallet: string;
  // Canadian bank account (direct deposit / wire)
  bankAccountHolder: string;
  bankName: string;
  bankInstitution: string;
  bankTransit: string;
  bankAccount: string;
  // U.S. ACH
  achAccountHolder: string;
  achBankName: string;
  achRouting: string;
  achAccount: string;
  achAccountType: string;
};

export type StoreSettings = PaymentSettings & { bio: string[] };

// Settings-tab key for each field. Readable labels so the sheet makes sense
// on its own.
const SETTING_KEYS: Record<keyof StoreSettings, string> = {
  bio: "Bio",
  etransferEmail: "E-Transfer Email",
  solanaWallet: "Solana Wallet",
  bankAccountHolder: "Bank Account Holder",
  bankName: "Bank Name",
  bankInstitution: "Bank Institution Number",
  bankTransit: "Bank Transit Number",
  bankAccount: "Bank Account Number",
  achAccountHolder: "ACH Account Holder",
  achBankName: "ACH Bank Name",
  achRouting: "ACH Routing Number",
  achAccount: "ACH Account Number",
  achAccountType: "ACH Account Type",
};

const EMPTY_PAYMENTS: PaymentSettings = {
  etransferEmail: "", solanaWallet: "",
  bankAccountHolder: "", bankName: "", bankInstitution: "", bankTransit: "", bankAccount: "",
  achAccountHolder: "", achBankName: "", achRouting: "", achAccount: "", achAccountType: "",
};

export function isJyxdiAdmin(session: Session | null) {
  const email = session?.user?.email?.toLowerCase();
  if (!email) return false;
  return (process.env.JYXDI_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).includes(email);
}

const sheetId = () => process.env.JYXDI_SHEET_ID || null;
export const isStoreConfigured = () => Boolean(sheetId());

// The sheet to write to; a missing one is reported plainly instead of as a
// failed Google request.
function requireSheetId(): string {
  const id = sheetId();
  if (!id) throw new StoreError("JYXDI_SHEET_ID is not set, so there's nowhere to save changes yet.");
  return id;
}

// ---------------------------------------------------------------- parsing

function parseProducts(rows: string[][]): Artwork[] {
  if (!rows.length) return [];
  const [header, ...body] = rows;
  const { find, cell } = columnReader(header);
  const col = {
    slug: find("slug"), title: find("title", "name"), type: find("type"), price: find("price"),
    description: find("description"), image: find("image", "imageurl"), details: find("details"),
    checkoutUrl: find("checkouturl", "checkout", "paymentlink"), sold: find("sold"), options: find("options", "variants"),
  };

  return body
    .map((row): Artwork | null => {
      const title = cell(row, col.title);
      const slug = cell(row, col.slug) || slugify(title);
      const price = Number(cell(row, col.price).replace(/[$,\s]/g, ""));
      if (!title || !slug || !Number.isFinite(price)) return null;
      return {
        slug,
        title,
        type: cell(row, col.type).toLowerCase() === "canvas" ? "canvas" : "digital",
        price,
        description: cell(row, col.description),
        image: cell(row, col.image),
        details: cell(row, col.details) || undefined,
        checkoutUrl: cell(row, col.checkoutUrl) || undefined,
        sold: ["yes", "true", "sold", "y", "1"].includes(cell(row, col.sold).toLowerCase()),
        options: parseOptions(cell(row, col.options)),
      };
    })
    .filter((artwork): artwork is Artwork => artwork !== null);
}

const productToRow = (a: Artwork) => [
  a.slug, a.title, a.type, String(a.price), a.description, a.image, a.details || "", a.checkoutUrl || "", a.sold ? "Yes" : "", formatOptions(a.options),
];

function parseSettings(rows: string[][]): StoreSettings {
  const settings: StoreSettings = { ...EMPTY_PAYMENTS, bio: SITE.bio };
  const byKey = new Map(rows.slice(1).map((row) => [normalizeHeader(row[0] || ""), String(row[1] ?? "").trim()]));
  for (const [field, key] of Object.entries(SETTING_KEYS) as [keyof StoreSettings, string][]) {
    const value = byKey.get(normalizeHeader(key));
    if (!value) continue;
    if (field === "bio") settings.bio = splitParagraphs(value);
    else settings[field] = value;
  }
  return settings;
}

export const splitParagraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

// ---------------------------------------------------------------- reads

async function readProducts(): Promise<Artwork[]> {
  return parseProducts(await readTab(requireSheetId(), PRODUCTS_TAB, PRODUCT_HEADERS));
}

async function readSettings(): Promise<StoreSettings> {
  return parseSettings(await readTab(requireSheetId(), SETTINGS_TAB, SETTINGS_HEADERS));
}

// Artworks for the public site: the sheet's products plus any in
// src/data/jyxdi.json not overridden by slug. If the sheet can't be read the
// site still renders from the JSON.
export async function getStoreArtworks(): Promise<Artwork[]> {
  if (!isStoreConfigured()) return SITE.artworks;
  try {
    const products = await readProducts();
    const slugs = new Set(products.map((p) => p.slug));
    return [...products, ...SITE.artworks.filter((a) => !slugs.has(a.slug))];
  } catch (error: any) {
    console.error("Jyxdi products read error:", error.message);
    return SITE.artworks;
  }
}

export async function getStoreArtwork(slug: string) {
  return (await getStoreArtworks()).find((artwork) => artwork.slug === slug);
}

export async function getStoreSettings(): Promise<StoreSettings> {
  if (!isStoreConfigured()) return { ...EMPTY_PAYMENTS, bio: SITE.bio };
  try {
    return await readSettings();
  } catch (error: any) {
    console.error("Jyxdi settings read error:", error.message);
    return { ...EMPTY_PAYMENTS, bio: SITE.bio };
  }
}

// Admin reads fail loudly rather than falling back, so a broken sheet
// connection isn't mistaken for an empty store.
export async function getAdminData() {
  requireSheetId();
  const [products, settings] = await Promise.all([readProducts(), readSettings()]);
  return { products, settings };
}

// ---------------------------------------------------------------- validation + writes

export class StoreError extends Error {}

export function slugify(text: string) {
  return text.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

const str = (value: unknown, max: number, label: string) => {
  const text = typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
  if (text.length > max) throw new StoreError(`${label} is too long (max ${max} characters).`);
  return text;
};

const isHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

export function validateProduct(input: any): Artwork {
  const title = str(input?.title, 120, "Title");
  if (!title) throw new StoreError("Title is required.");
  const slug = slugify(str(input?.slug, 80, "URL name") || title);
  if (!slug) throw new StoreError("Title needs at least one letter or number.");

  const type: ArtworkType = input?.type === "canvas" ? "canvas" : input?.type === "digital" ? "digital" : (() => { throw new StoreError("Type must be Digital or Canvas."); })();
  const price = Number(String(input?.price ?? "").replace(/[$,\s]/g, ""));
  if (!Number.isFinite(price) || price < 0 || price > 1_000_000) throw new StoreError("Price must be a number between 0 and 1,000,000.");

  const image = str(input?.image, 2000, "Image URL");
  if (!image) throw new StoreError("An image URL is required.");
  if (!isHttpsUrl(image) && !/^\/[\w\-./]+$/.test(image)) throw new StoreError("Image must be an https:// link.");

  const checkoutUrl = str(input?.checkoutUrl, 2000, "Checkout link");
  if (checkoutUrl && !isHttpsUrl(checkoutUrl)) throw new StoreError("Checkout link must be an https:// link.");

  const options = parseOptions(str(Array.isArray(input?.options) ? formatOptions(input.options) : input?.options, 1000, "Options"));
  if (options.length > 6 || options.some((o) => o.values.length > 20 || o.name.length > 40 || o.values.some((v) => v.length > 40))) {
    throw new StoreError("Options: up to 6 options, each with up to 20 short choices.");
  }

  return {
    slug,
    title,
    type,
    price: Math.round(price * 100) / 100,
    description: str(input?.description, 5000, "Description"),
    image,
    details: str(input?.details, 200, "Details") || undefined,
    checkoutUrl: checkoutUrl || undefined,
    sold: Boolean(input?.sold),
    options,
  };
}

// U.S. routing numbers carry a checksum, which catches most typos.
function isValidAbaRouting(routing: string) {
  if (!/^\d{9}$/.test(routing)) return false;
  const d = routing.split("").map(Number);
  return (3 * (d[0] + d[3] + d[6]) + 7 * (d[1] + d[4] + d[7]) + (d[2] + d[5] + d[8])) % 10 === 0;
}

export function validateSettings(input: any): StoreSettings {
  const field = (key: keyof PaymentSettings, max = 200) => str(input?.[key], max, SETTING_KEYS[key]);
  const digits = (key: keyof PaymentSettings) => field(key).replace(/[\s-]/g, "");

  const s: StoreSettings = {
    bio: splitParagraphs(str(Array.isArray(input?.bio) ? input.bio.join("\n\n") : input?.bio, 6000, "Bio")),
    etransferEmail: field("etransferEmail").toLowerCase(),
    solanaWallet: field("solanaWallet"),
    bankAccountHolder: field("bankAccountHolder"),
    bankName: field("bankName"),
    bankInstitution: digits("bankInstitution"),
    bankTransit: digits("bankTransit"),
    bankAccount: digits("bankAccount"),
    achAccountHolder: field("achAccountHolder"),
    achBankName: field("achBankName"),
    achRouting: digits("achRouting"),
    achAccount: digits("achAccount"),
    achAccountType: field("achAccountType").toLowerCase(),
  };

  if (!s.bio.length) throw new StoreError("The bio can't be empty.");
  if (s.etransferEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.etransferEmail)) throw new StoreError("E-Transfer email doesn't look like an email address.");
  if (s.solanaWallet && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s.solanaWallet)) throw new StoreError("Solana wallet doesn't look like a Solana address.");

  const bankFields = [s.bankAccountHolder, s.bankInstitution, s.bankTransit, s.bankAccount];
  if (bankFields.some(Boolean)) {
    if (!bankFields.every(Boolean)) throw new StoreError("For a Canadian bank account, fill in the account holder, institution, transit and account numbers (or clear them all).");
    if (!/^\d{3}$/.test(s.bankInstitution)) throw new StoreError("Institution number is 3 digits.");
    if (!/^\d{5}$/.test(s.bankTransit)) throw new StoreError("Transit number is 5 digits.");
    if (!/^\d{5,12}$/.test(s.bankAccount)) throw new StoreError("Account number should be 5 to 12 digits.");
  }

  const achFields = [s.achAccountHolder, s.achRouting, s.achAccount];
  if ([...achFields, s.achBankName].some(Boolean)) {
    if (!achFields.every(Boolean)) throw new StoreError("For ACH, fill in the account holder, routing and account numbers (or clear them all).");
    if (!isValidAbaRouting(s.achRouting)) throw new StoreError("That ACH routing number isn't valid (9 digits, checksum failed).");
    if (!/^\d{4,17}$/.test(s.achAccount)) throw new StoreError("ACH account number should be 4 to 17 digits.");
  }
  if (s.achAccountType && !["checking", "savings"].includes(s.achAccountType)) throw new StoreError("ACH account type must be checking or savings.");

  return s;
}

// Saves a product. `originalSlug` is the slug being edited, so renaming a
// product's URL replaces its row instead of adding a second one.
export async function saveProduct(product: Artwork, originalSlug?: string) {
  const products = await readProducts();
  const existing = originalSlug ?? product.slug;
  if (product.slug !== existing && products.some((p) => p.slug === product.slug)) {
    throw new StoreError(`Another product already uses the URL name "${product.slug}".`);
  }
  if (!originalSlug && products.some((p) => p.slug === product.slug)) {
    throw new StoreError(`A product with the URL name "${product.slug}" already exists. Edit it instead, or change the title.`);
  }

  const index = products.findIndex((p) => p.slug === existing);
  if (index >= 0) products[index] = product;
  else products.push(product);
  await writeTab(requireSheetId(), PRODUCTS_TAB, PRODUCT_HEADERS, products.map(productToRow));
}

export async function deleteProduct(slug: string) {
  const products = await readProducts();
  const remaining = products.filter((p) => p.slug !== slug);
  if (remaining.length === products.length) throw new StoreError("That product doesn't exist.");
  await writeTab(requireSheetId(), PRODUCTS_TAB, PRODUCT_HEADERS, remaining.map(productToRow));
}

export async function saveSettings(settings: StoreSettings) {
  const rows = (Object.entries(SETTING_KEYS) as [keyof StoreSettings, string][]).map(([field, key]) => [
    key,
    field === "bio" ? settings.bio.join("\n\n") : settings[field],
  ]);
  await writeTab(requireSheetId(), SETTINGS_TAB, SETTINGS_HEADERS, rows);
}

"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import type { Artwork } from "@/lib/jyxdi";
import type { StoreSettings } from "@/lib/jyxdiStore";

const splitParagraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

type Tab = "products" | "payments" | "bio";

const EMPTY_PRODUCT = { title: "", type: "canvas", price: "", image: "", description: "", details: "", checkoutUrl: "", sold: false, slug: "" };
type ProductForm = typeof EMPTY_PRODUCT;

const toForm = (a: Artwork): ProductForm => ({
  title: a.title, type: a.type, price: String(a.price), image: a.image, description: a.description,
  details: a.details || "", checkoutUrl: a.checkoutUrl || "", sold: Boolean(a.sold), slug: a.slug,
});

const price = (amount: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount);

const inputClass = "mt-1.5 w-full rounded-lg border border-[var(--jx-line)] bg-white px-3.5 py-2.5 text-[var(--jx-ink)] focus:border-[var(--jx-accent)] focus:outline-none";
const primaryButton = "rounded-full bg-[var(--jx-ink)] px-6 py-3 font-medium text-[var(--jx-bg)] disabled:opacity-50";
const secondaryButton = "rounded-full border border-[var(--jx-ink)] px-6 py-3 font-medium";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[var(--jx-muted)]">{hint}</span>}
    </label>
  );
}

async function callAdmin(method: string, body?: unknown, query = "") {
  const response = await fetch(`/api/jyxdi/admin${query}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

export default function AdminPanel({ email, initialProducts, initialSettings }: { email: string; initialProducts: Artwork[]; initialSettings: StoreSettings }) {
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState(initialProducts);
  const [settings, setSettings] = useState(initialSettings);
  const [bioText, setBioText] = useState(initialSettings.bio.join("\n\n"));
  const [editing, setEditing] = useState<{ form: ProductForm; originalSlug?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const run = async (action: () => Promise<void>, success: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      setMessage({ kind: "ok", text: success });
    } catch (error: any) {
      setMessage({ kind: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const reload = async () => {
    const data = await callAdmin("GET");
    setProducts(data.products);
    setSettings(data.settings);
    setBioText(data.settings.bio.join("\n\n"));
  };

  const saveProduct = () =>
    run(async () => {
      await callAdmin("POST", { product: editing!.form, originalSlug: editing!.originalSlug });
      await reload();
      setEditing(null);
    }, "Product saved. It's live on the site.");

  const removeProduct = (artwork: Artwork) => {
    if (!window.confirm(`Delete "${artwork.title}"? This removes it from the site.`)) return;
    run(async () => {
      await callAdmin("DELETE", undefined, `?slug=${encodeURIComponent(artwork.slug)}`);
      await reload();
    }, "Product deleted.");
  };

  const saveSettings = (next: StoreSettings, success: string) =>
    run(async () => {
      await callAdmin("PUT", { settings: next });
      await reload();
    }, success);

  const setField = (key: keyof StoreSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setSettings({ ...settings, [key]: e.target.value });

  const setForm = (patch: Partial<ProductForm>) => setEditing((current) => current && { ...current, form: { ...current.form, ...patch } });

  return (
    <div className="mx-auto max-w-5xl px-4 pt-10 pb-16 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="jx-serif text-4xl">Store admin</h1>
          <p className="mt-1 text-sm text-[var(--jx-muted)]">
            Signed in as {email} ·{" "}
            <button onClick={() => signOut({ callbackUrl: "/admin" })} className="underline underline-offset-2">Sign out</button>
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener" className="text-sm underline underline-offset-2">View site ↗</a>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-[var(--jx-line)]" role="tablist">
        {([["products", "Products"], ["payments", "Payments"], ["bio", "Bio"]] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => { setTab(key); setMessage(null); }}
            className={`-mb-px border-b-2 px-4 py-3 font-medium ${tab === key ? "border-[var(--jx-accent)] text-[var(--jx-ink)]" : "border-transparent text-[var(--jx-muted)]"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {message && (
        <div role="status" className={`mt-6 rounded-lg px-4 py-3 text-sm ${message.kind === "ok" ? "bg-[#e3e8d9] text-[#3f4a31]" : "bg-[#f6d8cc] text-[#7a2e14]"}`}>
          {message.text}
        </div>
      )}

      {tab === "products" && !editing && (
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-[var(--jx-muted)]">{products.length} product{products.length === 1 ? "" : "s"}</p>
            <button onClick={() => { setEditing({ form: { ...EMPTY_PRODUCT } }); setMessage(null); }} className={primaryButton}>
              + Add product
            </button>
          </div>
          {products.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-[var(--jx-line)] p-10 text-center text-[var(--jx-muted)]">
              No products yet. Add your first piece to put it in the Art Catalog.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-[var(--jx-line)] rounded-2xl border border-[var(--jx-line)] bg-[var(--jx-surface)]">
              {products.map((artwork) => (
                <li key={artwork.slug} className="flex items-center gap-4 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={artwork.image} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg bg-[var(--jx-accent-soft)] object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{artwork.title}</p>
                    <p className="text-sm text-[var(--jx-muted)]">
                      {artwork.type === "canvas" ? "Canvas" : "Digital"} · {price(artwork.price)}
                      {artwork.sold && <span className="ml-2 rounded-full bg-[var(--jx-accent-soft)] px-2 py-0.5 text-xs text-[var(--jx-accent)]">Sold</span>}
                    </p>
                  </div>
                  <button onClick={() => { setEditing({ form: toForm(artwork), originalSlug: artwork.slug }); setMessage(null); }} className="text-sm font-medium underline underline-offset-2">
                    Edit
                  </button>
                  <button onClick={() => removeProduct(artwork)} disabled={busy} className="text-sm text-[#a03a1b] underline underline-offset-2">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "products" && editing && (
        <form className="mt-6 grid gap-6 md:grid-cols-[1fr_260px]" onSubmit={(e) => { e.preventDefault(); saveProduct(); }}>
          <div className="space-y-5">
            <h2 className="jx-serif text-2xl">{editing.originalSlug ? "Edit product" : "New product"}</h2>
            <Field label="Title">
              <input required maxLength={120} value={editing.form.title} onChange={(e) => setForm({ title: e.target.value })} className={inputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Type">
                <select value={editing.form.type} onChange={(e) => setForm({ type: e.target.value })} className={inputClass}>
                  <option value="canvas">Canvas</option>
                  <option value="digital">Digital</option>
                </select>
              </Field>
              <Field label="Price (CAD)">
                <input required inputMode="decimal" value={editing.form.price} onChange={(e) => setForm({ price: e.target.value })} placeholder="250" className={inputClass} />
              </Field>
            </div>
            <Field label="Image URL" hint="A direct https:// link to the photo.">
              <input required type="url" value={editing.form.image} onChange={(e) => setForm({ image: e.target.value })} placeholder="https://…" className={inputClass} />
            </Field>
            <Field label="Description">
              <textarea rows={5} maxLength={5000} value={editing.form.description} onChange={(e) => setForm({ description: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Details" hint='Size and medium, e.g. "24 x 36 in, acrylic on canvas".'>
              <input maxLength={200} value={editing.form.details} onChange={(e) => setForm({ details: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Checkout link (optional)" hint='A Stripe or Shopify payment link. Without one, buyers get a "Request this piece" button and your payment details.'>
              <input type="url" value={editing.form.checkoutUrl} onChange={(e) => setForm({ checkoutUrl: e.target.value })} placeholder="https://buy.stripe.com/…" className={inputClass} />
            </Field>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={editing.form.sold} onChange={(e) => setForm({ sold: e.target.checked })} className="h-4 w-4 accent-[var(--jx-accent)]" />
              <span className="font-medium">Sold</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={busy} className={primaryButton}>{busy ? "Saving…" : "Save product"}</button>
              <button type="button" onClick={() => setEditing(null)} className={secondaryButton}>Cancel</button>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Preview</p>
            <div className="mt-1.5 aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--jx-accent-soft)]">
              {editing.form.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={editing.form.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <p className="mt-3 font-medium">{editing.form.title || "Untitled"}</p>
            <p className="text-sm text-[var(--jx-muted)]">{Number(editing.form.price) >= 0 && editing.form.price ? price(Number(editing.form.price)) : ""}</p>
          </div>
        </form>
      )}

      {tab === "payments" && (
        <form className="mt-6 max-w-2xl space-y-10" onSubmit={(e) => { e.preventDefault(); saveSettings({ ...settings, bio: splitParagraphs(bioText) }, "Payment details saved."); }}>
          <p className="text-[var(--jx-muted)]">
            Buyers see these on each piece that doesn&apos;t have a checkout link. Leave a section blank to hide it.
          </p>

          <fieldset className="space-y-4">
            <legend className="jx-serif text-2xl">Interac e-Transfer</legend>
            <Field label="E-Transfer email">
              <input type="email" value={settings.etransferEmail} onChange={setField("etransferEmail")} className={inputClass} />
            </Field>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="jx-serif text-2xl">Solana wallet</legend>
            <Field label="Wallet address" hint="Your public address only. Never enter a seed phrase or private key anywhere.">
              <input value={settings.solanaWallet} onChange={setField("solanaWallet")} spellCheck={false} className={`${inputClass} font-mono text-sm`} />
            </Field>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="jx-serif text-2xl">Canadian bank account</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Account holder"><input value={settings.bankAccountHolder} onChange={setField("bankAccountHolder")} className={inputClass} /></Field>
              <Field label="Bank name"><input value={settings.bankName} onChange={setField("bankName")} className={inputClass} /></Field>
              <Field label="Institution number" hint="3 digits"><input inputMode="numeric" value={settings.bankInstitution} onChange={setField("bankInstitution")} className={inputClass} /></Field>
              <Field label="Transit number" hint="5 digits"><input inputMode="numeric" value={settings.bankTransit} onChange={setField("bankTransit")} className={inputClass} /></Field>
              <Field label="Account number"><input inputMode="numeric" value={settings.bankAccount} onChange={setField("bankAccount")} className={inputClass} /></Field>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="jx-serif text-2xl">U.S. bank account (ACH)</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Account holder"><input value={settings.achAccountHolder} onChange={setField("achAccountHolder")} className={inputClass} /></Field>
              <Field label="Bank name"><input value={settings.achBankName} onChange={setField("achBankName")} className={inputClass} /></Field>
              <Field label="Routing number" hint="9 digits"><input inputMode="numeric" value={settings.achRouting} onChange={setField("achRouting")} className={inputClass} /></Field>
              <Field label="Account number"><input inputMode="numeric" value={settings.achAccount} onChange={setField("achAccount")} className={inputClass} /></Field>
              <Field label="Account type">
                <select value={settings.achAccountType} onChange={setField("achAccountType")} className={inputClass}>
                  <option value="">Choose…</option>
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </Field>
            </div>
          </fieldset>

          <button type="submit" disabled={busy} className={primaryButton}>{busy ? "Saving…" : "Save payment details"}</button>
        </form>
      )}

      {tab === "bio" && (
        <form className="mt-6 max-w-2xl space-y-4" onSubmit={(e) => { e.preventDefault(); saveSettings({ ...settings, bio: splitParagraphs(bioText) }, "Bio saved."); }}>
          <Field label="Bio" hint="Leave a blank line between paragraphs.">
            <textarea required rows={16} maxLength={6000} value={bioText} onChange={(e) => setBioText(e.target.value)} className={`${inputClass} leading-relaxed`} />
          </Field>
          <button type="submit" disabled={busy} className={primaryButton}>{busy ? "Saving…" : "Save bio"}</button>
        </form>
      )}
    </div>
  );
}

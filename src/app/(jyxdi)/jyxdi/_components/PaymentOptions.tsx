import type { PaymentSettings } from "@/lib/jyxdiStore";

// How to pay for a piece without a checkout link. Each method appears only
// once it's filled in under Payments in /admin.
export default function PaymentOptions({ payments: p, pieceTitle }: { payments: PaymentSettings; pieceTitle: string }) {
  const methods: { title: string; rows: [string, string][]; mono?: boolean }[] = [];

  if (p.etransferEmail) methods.push({ title: "Interac e-Transfer", rows: [["Send to", p.etransferEmail]] });
  if (p.solanaWallet) methods.push({ title: "Solana", rows: [["Wallet", p.solanaWallet]], mono: true });
  if (p.bankAccount) {
    methods.push({
      title: "Bank transfer (Canada)",
      rows: [
        ["Account holder", p.bankAccountHolder],
        ...(p.bankName ? ([["Bank", p.bankName]] as [string, string][]) : []),
        ["Institution", p.bankInstitution],
        ["Transit", p.bankTransit],
        ["Account", p.bankAccount],
      ],
    });
  }
  if (p.achAccount) {
    methods.push({
      title: "ACH transfer (U.S.)",
      rows: [
        ["Account holder", p.achAccountHolder],
        ...(p.achBankName ? ([["Bank", p.achBankName]] as [string, string][]) : []),
        ["Routing", p.achRouting],
        ["Account", p.achAccount],
        ...(p.achAccountType ? ([["Type", p.achAccountType[0].toUpperCase() + p.achAccountType.slice(1)]] as [string, string][]) : []),
      ],
    });
  }

  if (!methods.length) return null;

  return (
    <section className="mt-10 rounded-2xl border border-[var(--jx-line)] bg-[var(--jx-surface)] p-6">
      <h2 className="jx-serif text-2xl">Ways to pay</h2>
      <p className="mt-2 text-sm text-[var(--jx-muted)]">
        Request the piece first so it&apos;s held for you, then pay with any option below. Include &ldquo;{pieceTitle}&rdquo; in the payment message.
      </p>
      <div className="mt-5 space-y-5">
        {methods.map((method) => (
          <div key={method.title}>
            <h3 className="font-medium">{method.title}</h3>
            <dl className="mt-1.5 space-y-1 text-sm">
              {method.rows.map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <dt className="w-28 flex-shrink-0 text-[var(--jx-muted)]">{label}</dt>
                  <dd className={`min-w-0 select-all break-all ${method.mono ? "font-mono text-xs leading-5" : ""}`}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

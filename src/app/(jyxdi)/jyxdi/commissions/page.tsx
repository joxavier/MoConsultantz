import type { Metadata } from "next";
import { SITE } from "@/lib/jyxdi";
import InquiryForm from "../_components/InquiryForm";

export const metadata: Metadata = {
  title: "Commissions",
  description: `Commission a custom digital artwork or canvas painting from ${SITE.shortName}. Share your idea, budget and timeline to get started.`,
  alternates: { canonical: "/commissions" },
};

const STEPS = [
  { title: "Share your idea", text: "Tell me what you have in mind, where it's going and your budget." },
  { title: "Sketch and quote", text: "You'll get a reply with questions, a rough direction and a price." },
  { title: "Made for you", text: "Your piece is created with check-ins along the way, then delivered." },
];

export default function CommissionsPage({ searchParams }: { searchParams: { piece?: string } }) {
  const piece = typeof searchParams.piece === "string" ? searchParams.piece.slice(0, 200) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="jx-serif text-4xl sm:text-5xl">Commissions</h1>
      <p className="mt-3 text-[var(--jx-muted)]">
        Custom digital art and canvas paintings, made around your idea. You can also use this form to ask about a piece in the catalog.
      </p>

      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-[var(--jx-line)] bg-[var(--jx-surface)] p-5">
            <span className="text-sm font-medium text-[var(--jx-accent)]">{index + 1}</span>
            <p className="mt-1 font-medium">{step.title}</p>
            <p className="mt-1 text-sm text-[var(--jx-muted)]">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <InquiryForm kind="commission" artwork={piece} />
      </div>
    </div>
  );
}

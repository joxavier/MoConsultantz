import type { Metadata } from "next";
import Link from "next/link";
import { consultingPlans, formatMoCoin } from "@/lib/consultingPlans";

export const metadata: Metadata = {
  title: "Technical Consulting Plans",
  description: "Compare three outcome-focused technical consulting plans for strategy, growth systems, and digital transformation.",
  alternates: { canonical: "/plans" },
};

export default function PlansPage() {
  return (
    <main className="min-h-screen bg-black px-6 pb-24 pt-36 text-white">
      <section className="mx-auto max-w-6xl">
        <p className="font-mono text-sm uppercase tracking-[0.22em] text-blue-300">Fixed-scope consulting</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">Choose the level of change your business needs now.</h1>
        <p className="mt-6 max-w-3xl font-mono text-lg leading-8 text-zinc-300">Each plan connects a defined business outcome to practical technical delivery. Pricing is shown in MoCoin service-pricing units, with the US dollar reference converted to supported local currency by Stripe at checkout.</p>
        <Link href="/start" className="mt-6 inline-block rounded-full border border-zinc-700 px-6 py-3 font-mono text-sm font-bold text-zinc-200 hover:border-zinc-500">Not sure which plan fits? Take the 2-minute assessment</Link>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {consultingPlans.map((plan) => (
            <article key={plan.slug} className="flex flex-col rounded-3xl border border-zinc-800 bg-zinc-950 p-7">
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-blue-300">{plan.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-bold">{plan.name}</h2>
              <p className="mt-5 text-4xl font-bold">{formatMoCoin(plan.mocoin)} <span className="text-lg text-zinc-400">MoCoin</span></p>
              <p className="mt-2 font-mono text-sm text-zinc-500">US${plan.usd.toLocaleString()} checkout reference</p>
              <p className="mt-6 flex-1 font-mono leading-7 text-zinc-300">{plan.summary}</p>
              <Link href={`/plans/${plan.slug}`} className="mt-8 rounded-full bg-white px-6 py-4 text-center font-bold text-black transition hover:bg-blue-200">View this plan</Link>
            </article>
          ))}
        </div>
        <p className="mt-8 font-mono text-sm leading-6 text-zinc-500">For these consulting plans, one MoCoin pricing unit equals US$1. Stripe Checkout charges fiat currency and may present a localized amount and conversion fee based on customer location. This checkout does not transfer cryptocurrency.</p>
      </section>
    </main>
  );
}

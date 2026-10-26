import type { Metadata } from "next";
import Link from "next/link";

const bookingUrl = "https://booking.setmore.com/scheduleappointment/9c25b029-94d9-4790-bf2e-4791b9dcbc2e";

export const metadata: Metadata = {
  title: "Smart Contract Development",
  description: "Smart contract development, token launch engineering, and Web3 integration for founders building on Solana and EVM chains.",
  alternates: { canonical: "/vestmentz/smart-contracts" },
  openGraph: { title: "Smart Contract Development | MoDevz", description: "Smart contracts, token launches, and Web3 integrations built and reviewed by an experienced blockchain developer.", url: "https://modevz.ca/vestmentz/smart-contracts" },
};

const questions = [
  ["Which chains do you build on?", "Solana and EVM-compatible chains (Ethereum, Base, Polygon, and similar). Tell us your target chain during scoping and we'll confirm fit before you commit."],
  ["Can you review a contract someone else wrote?", "Yes. A security-focused review can run standalone or alongside new development, covering access control, common exploit patterns, and gas efficiency."],
  ["Do you help with tokenomics, not just code?", "Yes. Token supply, vesting, and incentive design are reviewed before implementation so the contract encodes a model that actually works."],
  ["Is this the same team as MoDevz consulting?", "Yes. Smart contract work is delivered by MoDevz, the same team behind MoConsultantz technical consulting, so you also get the surrounding product, security, and go-to-market support if you need it."],
];

const capabilities = [
  ["Smart contract development", "Custom contracts for token launches, staking, DeFi mechanics, or on-chain business logic on Solana and EVM chains."],
  ["Token launch engineering", "Translate a tokenomics model into audited, deployable contract logic and a tested launch sequence."],
  ["Security review", "A focused pass for access control gaps, common exploit patterns, and gas inefficiencies before you deploy."],
  ["Web3 integration", "Wallet connections, on-chain data, and contract calls wired into an existing product or new front end."],
];

export default function SmartContractsPage() {
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Service", name: "Smart Contract Development", serviceType: "Smart Contract Development", provider: { "@id": "https://modevz.ca/#organization" }, url: "https://modevz.ca/vestmentz/smart-contracts", areaServed: ["Canada", "United States"], description: "Smart contract development, token launch engineering, security review, and Web3 integration on Solana and EVM chains." },
    { "@type": "FAQPage", mainEntity: questions.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ] };

  return (
    <main className="min-h-screen bg-black px-6 pb-24 pt-36 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <article className="mx-auto max-w-5xl">
        <p className="font-mono text-sm uppercase tracking-[0.22em] text-purple-300">Smart contract development</p>
        <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-6xl">Ship a smart contract that matches your tokenomics, not just your deadline.</h1>
        <p className="mt-7 max-w-3xl font-mono text-lg leading-8 text-zinc-300">Joshua Xavier builds and reviews smart contracts for founders launching tokens, DeFi mechanics, or on-chain product features on Solana and EVM chains.</p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full bg-purple-500 px-7 py-4 font-bold hover:bg-purple-400">Discuss your project</a>
          <Link href="/start" className="inline-block rounded-full border border-zinc-700 px-7 py-4 font-bold text-zinc-200 hover:border-zinc-500">Not sure what you need? Take the 2-minute assessment</Link>
        </div>

        <section className="mt-20 grid gap-6 md:grid-cols-2">{capabilities.map(([title, copy]) => <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7"><h2 className="text-2xl font-bold">{title}</h2><p className="mt-4 font-mono leading-7 text-zinc-400">{copy}</p></div>)}</section>

        <section className="mt-20"><h2 className="text-3xl font-bold sm:text-5xl">Common questions</h2><div className="mt-8 space-y-8">{questions.map(([question, answer]) => <div key={question}><h3 className="text-xl font-bold">{question}</h3><p className="mt-3 font-mono leading-7 text-zinc-400">{answer}</p></div>)}</div></section>

        <section className="mt-20 rounded-3xl bg-white p-8 text-black sm:p-12"><h2 className="text-3xl font-bold">Start with the contract logic, not the deploy script.</h2><p className="mt-4 max-w-2xl font-mono leading-7 text-zinc-700">Book a 30-minute strategy call to walk through your tokenomics or product requirements and what a secure, correct implementation would take.</p><a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-block rounded-full bg-black px-7 py-4 font-bold text-white">Book a free strategy call</a></section>
      </article>
    </main>
  );
}

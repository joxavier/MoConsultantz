import Link from "next/link";

const bookingUrl = "https://booking.setmore.com/scheduleappointment/9c25b029-94d9-4790-bf2e-4791b9dcbc2e";
const services = [
  ["Technical & digital strategy", "A prioritized plan connecting technology decisions to revenue, efficiency, customer experience, and risk."],
  ["Automation & custom software", "Practical systems that reduce repetitive work, connect business processes, and make growth easier to manage."],
  ["Cybersecurity & resilience", "A clear review of vulnerabilities, continuity risks, and the highest-value steps to protect your operations."],
];
const faqs = [
  ["Who is MoConsultantz best suited for?", "Founder-led companies and small or growing organizations with an urgent operational or technology problem but no need for a full-time technical executive."],
  ["What can the first engagement look like?", "Most relationships can begin with a focused diagnostic. We define the business problem, review current systems, identify risks and opportunities, and provide a prioritized action plan."],
  ["Can you implement the recommendations?", "Yes. MoConsultantz can move from strategy into a defined implementation sprint covering software, automation, web systems, or technical operations."],
  ["Where do you work?", "Engagements can be delivered remotely across Canada and the United States, with local availability in the Waterloo and Toronto region."],
];

export default function ConsultantzPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", "@id": "https://modevz.ca/consultantz#service", name: "Small Business Strategy and Technical Consulting", serviceType: "Technical consulting and digital transformation", provider: { "@id": "https://modevz.ca/#organization" }, areaServed: [{ "@type": "Country", name: "Canada" }, { "@type": "Country", name: "United States" }], audience: { "@type": "BusinessAudience", audienceType: "Small and growing businesses" }, url: "https://modevz.ca/consultantz" },
      { "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
    ],
  };

  return (
    <main className="min-h-screen bg-black pt-28 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="mb-5 font-mono text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">Strategy + hands-on implementation</p>
        <h1 className="max-w-5xl text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">Solve the technology bottlenecks slowing your business down.</h1>
        <p className="mt-7 max-w-3xl font-mono text-lg leading-8 text-zinc-300 md:text-xl">MoConsultantz helps small and growing businesses clarify what to fix, choose the right systems, and implement solutions that improve revenue, efficiency, and resilience.</p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-blue-500 px-7 py-4 text-center font-bold transition hover:bg-blue-400">Book a free strategy call</a>
          <Link href="/technical-consulting" className="rounded-full border border-zinc-600 px-7 py-4 text-center font-bold transition hover:border-white hover:bg-white hover:text-black">Explore technical consulting</Link>
        </div>
        <p className="mt-4 font-mono text-sm text-zinc-500">A practical 30-minute conversation. No obligation and no generic sales presentation.</p>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-950">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-8 text-center font-mono text-sm text-zinc-300 sm:grid-cols-3"><p>Founder-led consulting</p><p>Remote across Canada &amp; the U.S.</p><p>Strategy through implementation</p></div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-blue-300">How we help</p>
        <h2 className="mt-4 max-w-3xl text-3xl font-bold sm:text-5xl">Start with the business outcome, then build only what matters.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map(([title, description]) => <article key={title} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7"><h3 className="text-2xl font-bold">{title}</h3><p className="mt-4 font-mono leading-7 text-zinc-400">{description}</p></article>)}
        </div>
      </section>

      <section className="bg-white text-black">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_.9fr]">
          <div><p className="font-mono text-sm uppercase tracking-[0.2em] text-blue-700">A low-risk first step</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">Begin with a focused business and technology diagnostic.</h2><p className="mt-6 font-mono text-lg leading-8 text-zinc-700">Leave with a clear view of the problem, the cost of inaction, priority opportunities, and a realistic implementation roadmap.</p></div>
          <ol className="space-y-5 font-mono text-zinc-700"><li><strong className="text-black">01 — Discover:</strong> Define the outcome and urgency.</li><li><strong className="text-black">02 — Diagnose:</strong> Review workflows, systems, data, and risk.</li><li><strong className="text-black">03 — Prioritize:</strong> Rank actions by value and effort.</li><li><strong className="text-black">04 — Implement:</strong> Execute a defined sprint or support your team.</li></ol>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-3xl font-bold sm:text-5xl">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-zinc-800 border-y border-zinc-800">{faqs.map(([question, answer]) => <details key={question} className="py-6"><summary className="cursor-pointer list-none text-xl font-bold">{question}</summary><p className="mt-4 max-w-3xl font-mono leading-7 text-zinc-400">{answer}</p></details>)}</div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24 text-center"><div className="rounded-3xl border border-blue-500/40 bg-blue-500/10 px-6 py-14"><h2 className="text-3xl font-bold sm:text-5xl">What is the most expensive bottleneck in your business?</h2><p className="mx-auto mt-5 max-w-2xl font-mono text-zinc-300">Bring the problem. We’ll determine whether there is a practical path forward and whether MoConsultantz is the right fit.</p><a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block rounded-full bg-white px-7 py-4 font-bold text-black transition hover:bg-blue-200">Book a free strategy call</a></div></section>
    </main>
  );
}

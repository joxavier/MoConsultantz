import type { Metadata } from "next";

const bookingUrl = "https://booking.setmore.com/scheduleappointment/9c25b029-94d9-4790-bf2e-4791b9dcbc2e";
export const metadata: Metadata = {
  title: "Technical Consultant for Small Businesses",
  description: "Technical consulting for small businesses that need a clear technology roadmap, custom software, automation, cybersecurity, or hands-on implementation.",
  alternates: { canonical: "/technical-consulting" },
  openGraph: { title: "Technical Consultant for Small Businesses | MoDevz", description: "Turn an urgent technology problem into a prioritized plan and a focused implementation sprint.", url: "https://modevz.ca/technical-consulting" },
};

const questions = [
  ["When should a small business hire a technical consultant?", "Hire a technical consultant when a technology decision affects revenue, operating costs, customer experience, security, or the ability to scale—and your team needs objective guidance or implementation capacity."],
  ["What does a technical consultant do?", "A technical consultant translates a business problem into practical technology decisions by reviewing systems, defining requirements, comparing options, reducing risk, and leading implementation."],
  ["Do you only provide recommendations?", "No. Engagements can include both an independent diagnostic and hands-on delivery, including websites, internal tools, workflow automation, integrations, and security improvements."],
];
const capabilities = [
  ["Technology roadmap", "Clarify priorities, dependencies, costs, risks, and the sequence that creates value fastest."],
  ["Workflow automation", "Reduce repetitive work and connect the tools your team already uses."],
  ["Software and web systems", "Plan or build customer-facing and internal systems around real operating needs."],
  ["Cybersecurity review", "Identify practical gaps in access, data protection, continuity, and day-to-day security."],
];

export default function TechnicalConsultingPage() {
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Service", name: "Technical Consulting for Small Businesses", serviceType: "Technical Consulting", provider: { "@id": "https://modevz.ca/#organization" }, url: "https://modevz.ca/technical-consulting", areaServed: ["Canada", "United States"], description: "Technology strategy, software and automation planning, cybersecurity review, and hands-on implementation for small and growing businesses." },
    { "@type": "FAQPage", mainEntity: questions.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ] };

  return (
    <main className="min-h-screen bg-black px-6 pb-24 pt-36 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <article className="mx-auto max-w-5xl">
        <p className="font-mono text-sm uppercase tracking-[0.22em] text-blue-300">Technical consulting for small businesses</p>
        <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-6xl">Get a clear technology plan before you spend more time or money.</h1>
        <p className="mt-7 max-w-3xl font-mono text-lg leading-8 text-zinc-300">Joshua Xavier helps leaders diagnose technical bottlenecks, choose practical solutions, and deliver focused improvements without adding a full-time technical executive.</p>
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="mt-9 inline-block rounded-full bg-blue-500 px-7 py-4 font-bold hover:bg-blue-400">Discuss your project</a>

        <section className="mt-20 grid gap-6 md:grid-cols-2">{capabilities.map(([title, copy]) => <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7"><h2 className="text-2xl font-bold">{title}</h2><p className="mt-4 font-mono leading-7 text-zinc-400">{copy}</p></div>)}</section>

        <section className="mt-20"><h2 className="text-3xl font-bold sm:text-5xl">Common questions</h2><div className="mt-8 space-y-8">{questions.map(([question, answer]) => <div key={question}><h3 className="text-xl font-bold">{question}</h3><p className="mt-3 font-mono leading-7 text-zinc-400">{answer}</p></div>)}</div></section>

        <section className="mt-20 rounded-3xl bg-white p-8 text-black sm:p-12"><h2 className="text-3xl font-bold">Start with the problem, not a predetermined solution.</h2><p className="mt-4 max-w-2xl font-mono leading-7 text-zinc-700">Book a 30-minute strategy call to explain what is happening, what it is costing the business, and what a successful outcome would look like.</p><a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-block rounded-full bg-black px-7 py-4 font-bold text-white">Book a free strategy call</a></section>
      </article>
    </main>
  );
}

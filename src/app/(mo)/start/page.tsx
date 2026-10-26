import type { Metadata } from "next";
import IntakeForm from "./IntakeForm";

export const metadata: Metadata = {
  title: "Find Your Right Starting Point",
  description: "Answer three questions about your goal, budget, and timeline to get matched with the right MoDevz service.",
  alternates: { canonical: "/start" },
  robots: { index: false, follow: true },
};

export default function StartPage() {
  return (
    <main className="min-h-screen bg-black px-6 pb-24 pt-36 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-sm uppercase tracking-[0.22em] text-blue-300">2-minute assessment</p>
        <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">Let's find the right starting point.</h1>
        <p className="mt-6 font-mono text-lg leading-8 text-zinc-300">Three quick questions about your goal, budget, and timeline, and we'll point you to the right plan or service.</p>
      </div>
      <div className="mt-12">
        <IntakeForm />
      </div>
    </main>
  );
}

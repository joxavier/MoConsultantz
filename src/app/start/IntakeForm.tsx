"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BUDGET_OPTIONS,
  GOAL_OPTIONS,
  TIMELINE_OPTIONS,
  getRecommendation,
  type Budget,
  type Goal,
  type Timeline,
} from "@/lib/intake";

const bookingUrl = "https://booking.setmore.com/scheduleappointment/9c25b029-94d9-4790-bf2e-4791b9dcbc2e";

type Step = 1 | 2 | 3;

export default function IntakeForm() {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);

  const canContinueFromContact = name.trim().length > 0 && email.trim().length > 0;
  const canSubmit = goal !== null && budget !== null && timeline !== null;

  const handleSubmit = async () => {
    if (!goal || !budget || !timeline) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, phone, goal, budget, timeline }),
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && goal && budget) {
    const { recommendation, downgraded, underMinimum } = getRecommendation(goal, budget);

    if (underMinimum) {
      return (
        <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8 sm:p-12">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-blue-300">Thanks, {name}</p>
          <h2 className="mt-4 text-3xl font-bold">Our engagements typically start around $5,000.</h2>
          <p className="mt-4 font-mono leading-7 text-zinc-400">
            If that's not the right fit for you right now, that's completely fine. In the meantime, our{" "}
            <Link href="/feed" className="text-blue-300 underline">articles</Link> cover the same technical and business-strategy topics we consult on, at no cost.
          </p>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8 sm:p-12">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-blue-300">Thanks, {name}</p>
        <h2 className="mt-4 text-3xl font-bold">Your best starting point: {recommendation.title}</h2>
        {downgraded && (
          <p className="mt-4 rounded-xl border border-yellow-700/40 bg-yellow-900/20 p-4 font-mono text-sm leading-6 text-yellow-200">
            Based on your budget, we're suggesting a smaller starting engagement than what you first described. It's a lower-commitment way to get expert input before a bigger build.
          </p>
        )}
        <p className="mt-4 font-mono leading-7 text-zinc-400">{recommendation.blurb}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href={recommendation.href} className="rounded-full bg-white px-6 py-4 text-center font-bold text-black hover:bg-blue-200">View this service</Link>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-zinc-700 px-6 py-4 text-center font-bold text-zinc-200 hover:border-zinc-500">Book a call instead</a>
        </div>
        <p className="mt-6 font-mono text-sm text-zinc-500">We've also emailed this recommendation to {email}.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8 sm:p-12">
      <div className="mb-8 flex gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-blue-400" : "bg-zinc-800"}`} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold">A few details first</h2>
          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 font-mono text-white placeholder:text-zinc-600"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 font-mono text-white placeholder:text-zinc-600"
            />
            <input
              type="text"
              placeholder="Company (optional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 font-mono text-white placeholder:text-zinc-600"
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 font-mono text-white placeholder:text-zinc-600"
            />
          </div>
          <button
            disabled={!canContinueFromContact}
            onClick={() => setStep(2)}
            className="mt-8 w-full rounded-full bg-blue-500 px-6 py-4 font-bold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold">What's your primary goal right now?</h2>
          <div className="mt-6 space-y-3">
            {GOAL_OPTIONS.map((option) => (
              <label key={option.value} className={`block cursor-pointer rounded-xl border p-4 font-mono text-sm ${goal === option.value ? "border-blue-400 bg-blue-500/10" : "border-zinc-700"}`}>
                <input type="radio" name="goal" className="mr-3" checked={goal === option.value} onChange={() => setGoal(option.value)} />
                {option.label}
              </label>
            ))}
          </div>
          <div className="mt-8 flex gap-4">
            <button onClick={() => setStep(1)} className="rounded-full border border-zinc-700 px-6 py-4 font-bold text-zinc-300 hover:border-zinc-500">Back</button>
            <button disabled={!goal} onClick={() => setStep(3)} className="flex-1 rounded-full bg-blue-500 px-6 py-4 font-bold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40">Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold">Budget and timeline</h2>
          <div className="mt-6">
            <p className="font-mono text-sm uppercase tracking-wide text-zinc-500">Approximate budget</p>
            <div className="mt-3 space-y-3">
              {BUDGET_OPTIONS.map((option) => (
                <label key={option.value} className={`block cursor-pointer rounded-xl border p-4 font-mono text-sm ${budget === option.value ? "border-blue-400 bg-blue-500/10" : "border-zinc-700"}`}>
                  <input type="radio" name="budget" className="mr-3" checked={budget === option.value} onChange={() => setBudget(option.value)} />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <p className="font-mono text-sm uppercase tracking-wide text-zinc-500">Timeline</p>
            <div className="mt-3 space-y-3">
              {TIMELINE_OPTIONS.map((option) => (
                <label key={option.value} className={`block cursor-pointer rounded-xl border p-4 font-mono text-sm ${timeline === option.value ? "border-blue-400 bg-blue-500/10" : "border-zinc-700"}`}>
                  <input type="radio" name="timeline" className="mr-3" checked={timeline === option.value} onChange={() => setTimeline(option.value)} />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          {errorMsg && <p className="mt-4 font-mono text-sm text-red-400">{errorMsg}</p>}
          <div className="mt-8 flex gap-4">
            <button onClick={() => setStep(2)} className="rounded-full border border-zinc-700 px-6 py-4 font-bold text-zinc-300 hover:border-zinc-500">Back</button>
            <button disabled={!canSubmit || submitting} onClick={handleSubmit} className="flex-1 rounded-full bg-blue-500 px-6 py-4 font-bold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40">
              {submitting ? "Submitting..." : "Get my recommendation"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { SITE, jsonLdScript, livePaintingJsonLd } from "@/lib/jyxdi";
import InquiryForm from "../_components/InquiryForm";

export const metadata: Metadata = {
  title: "Live Painting for Weddings, Birthdays and Events",
  description: `Book ${SITE.shortName} to paint your wedding, birthday or event live on canvas. Request a date with your event details, location and budget.`,
  alternates: { canonical: "/live-painting" },
};

// Kept to how booking works; pricing, travel and deposit terms belong here
// once the artist confirms them.
const FAQS = [
  {
    question: "What is live event painting?",
    answer:
      "A painter works on site during your event, creating an original canvas of a moment you choose, such as the ceremony, first dance or the room full of guests. Guests can watch the painting take shape, and you keep the finished piece.",
  },
  {
    question: "What kinds of events can I book live painting for?",
    answer: "Weddings, birthdays, engagement parties, baby showers, corporate events and other celebrations.",
  },
  {
    question: "How do I book live painting?",
    answer:
      "Send the booking form on this page with your event date, location, budget and details. You'll get a reply by email to confirm availability and next steps.",
  },
  {
    question: "How far ahead should I book?",
    answer: "As early as you can. Popular dates, especially wedding season weekends, are booked first.",
  },
];

const HIGHLIGHTS = [
  { title: "An heirloom from the day", text: "An original painting of your event to hang at home." },
  { title: "Something for guests to watch", text: "The canvas comes together in front of everyone." },
  { title: "Made around your moment", text: "Choose the scene, the canvas size and the style." },
];

export default function LivePaintingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(livePaintingJsonLd(FAQS)) }} />

      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--jx-accent)]">Live paint</p>
      <h1 className="jx-serif mt-2 text-4xl sm:text-5xl">Live painting for weddings, birthdays and events</h1>
      <p className="mt-4 text-[var(--jx-muted)]">
        Have your celebration painted live on canvas while it happens. Tell me about your event and I&apos;ll get back to you about availability.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map((item) => (
          <li key={item.title} className="rounded-2xl border border-[var(--jx-line)] bg-[var(--jx-surface)] p-5">
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-[var(--jx-muted)]">{item.text}</p>
          </li>
        ))}
      </ul>

      <h2 className="jx-serif mt-14 text-3xl">Request a booking</h2>
      <p className="mt-2 text-sm text-[var(--jx-muted)]">Fields marked * are required.</p>
      <div className="mt-6">
        <InquiryForm kind="live-paint" />
      </div>

      <h2 className="jx-serif mt-16 text-3xl">Questions</h2>
      <div className="mt-6 divide-y divide-[var(--jx-line)] border-y border-[var(--jx-line)]">
        {FAQS.map((faq) => (
          <details key={faq.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              {faq.question}
              <span className="text-[var(--jx-accent)] transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-[var(--jx-muted)]">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

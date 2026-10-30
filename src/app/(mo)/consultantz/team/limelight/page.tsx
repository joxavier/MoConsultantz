import type { Metadata } from "next";
import profile from "@/data/limelightPage.json";
import { stripLinks } from "@/lib/linkedText";
import LimelightPageClient from "./LimelightPage";
import { faqJsonLd, type Faq } from "../_shared/FaqSection";

// Emil Kiruba's page, served at limelight.modevz.ca (see the "limelight" host
// rewrite in src/middleware.ts). Content lives in src/data/limelightPage.json.

const description = `${profile.name} is an actor. See his work on Instagram (@${profile.instagram.handle}) and his Metaparlour page, and book a consultation, casting inquiry or collaboration meeting.`;

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.role}`,
  description,
  keywords: [profile.name, "Emil Kiruba actor", "actor", "Limelight", `@${profile.instagram.handle}`, "casting", "Metaparlour"],
  alternates: { canonical: profile.siteUrl },
  openGraph: { title: `${profile.name} | ${profile.role}`, description, url: profile.siteUrl, type: "profile" },
  twitter: { card: "summary", title: `${profile.name} | ${profile.role}`, description },
};

// Shown on the page and published as FAQPage structured data.
const FAQS: Faq[] = [
  {
    question: `Who is ${profile.name}?`,
    answer: `${profile.name} is an actor. He shares his work on Instagram as @${profile.instagram.handle}.`,
  },
  {
    question: `How do I book a meeting with ${profile.name}?`,
    answer:
      "Use the Book a Consultation button on this page, choose a date and time, and pick a meeting type. You'll get a confirmation email with a calendar invite.",
  },
  {
    question: `What can I book a meeting with ${profile.name} about?`,
    answer: "A casting inquiry, a project collaboration, or a general consultation.",
  },
  {
    question: `Where can I see ${profile.name}'s work?`,
    answer: `On Instagram at @${profile.instagram.handle} (${profile.instagram.url}) and on his Metaparlour page (${profile.metaparlour}).`,
  },
];

export default function LimelightPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.siteUrl,
    jobTitle: profile.role,
    description: profile.bio.map(stripLinks).join(" "),
    ...(profile.photo ? { image: profile.photo } : {}),
    sameAs: [profile.instagram.url, profile.metaparlour],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)).replace(/</g, "\\u003c") }} />
      <LimelightPageClient faqs={FAQS} />
    </>
  );
}

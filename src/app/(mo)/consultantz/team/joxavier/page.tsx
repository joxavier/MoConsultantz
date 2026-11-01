import type { Metadata } from "next";
import personalPageData from "@/data/personalPage.json";
import PersonalPageClient from "./personalPage";
import { faqJsonLd, type Faq } from "../_shared/FaqSection";

// Shown on the page and published as FAQPage structured data, so search
// engines and AI assistants get the same answers visitors see.
const FAQS: Faq[] = [
  {
    question: "What does Joshua Xavier do?",
    answer:
      "Joshua Xavier is a technical consultant and software developer, and the founder of MoDevz. He builds web applications, automation and AI components, and secure blockchain integrations (including Solana) that help small businesses scale.",
  },
  {
    question: "Where is Joshua Xavier based?",
    answer:
      "He works with clients in Toronto, Ontario and San Francisco, California, and is available remotely across Canada and the United States.",
  },
  {
    question: "How do I book a consultation with Joshua Xavier?",
    answer:
      "Use the Book a Free Consultation button on this page, choose a date and time, and pick a meeting type. You'll get a confirmation email with a calendar invite.",
  },
  {
    question: "Is the first consultation free?",
    answer: "Yes. Choose Free Consultation as the meeting type when you book.",
  },
  {
    question: "What can I book a meeting about?",
    answer: "A free consultation, branding strategy, web development, or blockchain integration.",
  },
  {
    question: "What is Joshua Xavier's educational background?",
    answer:
      "He holds a Bachelor of Computer Science from the University of Waterloo and a Bachelor of Business Administration from Wilfrid Laurier University. Key courses include Cybersecurity for Web3, Environmental Economics, and Game Theory and Digital Marketing.",
  },
];

export const metadata: Metadata = {
  title: "Joshua Xavier | Technical Consultant & Developer | Waterloo, Toronto & Silicon Valley",
  description: "Joshua Xavier is a professional Technical Consultant and Developer at MoDevz. Providing custom Web Development, Blockchain Solutions, and Strategy for small businesses.",
  keywords: [
    "Joshua Xavier",
    "Technical Consultant",
    "Software Developer",
    "MoDevz",
    "Toronto Web Development",
    "San Francisco Blockchain Developer",
  ],
  alternates: {
    canonical: "https://josh.modevz.ca",
  },
  openGraph: {
    title: "Joshua Xavier | Technical Consultant & Developer",
    description: "Technical consulting, web development, and blockchain solutions for growing businesses by Joshua Xavier.",
    url: "https://josh.modevz.ca",
    type: "profile",
  },
};

export default function PersonalPage() {
  const { highlights } = personalPageData;

  // Structured Data Schema for Person/Professional (GEO & SEO Optimization)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Joshua Xavier",
    url: "https://josh.modevz.ca",
    image: "https://josh.modevz.ca/hero.jpg",
    jobTitle: "Technical Consultant & Software Developer",
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "University of Waterloo" },
      { "@type": "CollegeOrUniversity", name: "Wilfrid Laurier University" },
    ],
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "Bachelor of Computer Science" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "Bachelor of Business Administration" },
    ],
    worksFor: {
      "@type": "Organization",
      name: "MoDevz",
      url: "https://josh.modevz.ca",
    },
    description: "Joshua Xavier is a Technical Consultant and Software Developer serving small businesses across Toronto, ON and San Francisco, CA.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    knowsAbout: [
      "Technical Consulting",
      "Web Development",
      "Blockchain Integration",
      "Next.js",
      "Solana",
      "Small Business Strategy",
      "Cybersecurity for Web3",
      "Environmental Economics",
      "Game Theory",
      "Digital Marketing",
    ],
    sameAs: [
      "https://www.linkedin.com/in/joxavier-3299/",
      "https://x.com/joshuax47",
      "https://www.instagram.com/joshuax32/",
      "https://www.facebook.com/Joshuax47",
      "https://www.tiktok.com/@jmojx",
      "https://open.spotify.com/user/mangoesrmyfav",
      "https://www.youtube.com/@realJMOJX",
      "https://www.snapchat.com/@jmojx",
      "https://github.com/joxavier",
      "https://stackoverflow.com/users/18236982/joshua-xavier",
      "https://www.reddit.com/user/joxavier99/",
      "https://ca.pinterest.com/joshuax47/",
      "https://jmojx.metaparlour.io/",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)).replace(/</g, "\\u003c") }}
      />
      <PersonalPageClient highlights={highlights} faqs={FAQS} />
    </>
  );
}
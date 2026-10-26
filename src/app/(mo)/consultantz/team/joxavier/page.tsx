import type { Metadata } from "next";
import personalPageData from "@/data/personalPage.json";
import PersonalPageClient from "./personalPage";

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
      <PersonalPageClient highlights={highlights} />
    </>
  );
}
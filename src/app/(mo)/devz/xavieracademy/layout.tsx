import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xavier Academy | Practical Tech Skills by MoDevz",
  description: "Xavier Academy teaches practical software development, automation, cybersecurity, and Web3 skills through hands-on, project-based learning led by Joshua Xavier.",
  alternates: { canonical: "https://xavieracademy.modevz.ca" },
  openGraph: {
    title: "Xavier Academy | Practical Tech Skills by MoDevz",
    description: "Learn by building. Project-based tech training from the team behind MoDevz.",
    url: "https://xavieracademy.modevz.ca",
    siteName: "Xavier Academy",
  },
  // Keep out of search results until the academy launches.
  robots: { index: false, follow: false },
};

export default function XavierAcademyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

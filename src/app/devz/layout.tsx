import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Software, Automation & Cybersecurity Consulting",
  description: "MoDevz helps small and growing businesses plan, build, secure, and improve websites, internal tools, automations, and digital operations.",
  alternates: { canonical: "/devz" },
  openGraph: { title: "Custom Software, Automation & Cybersecurity Consulting | MoDevz", description: "Technical strategy and implementation designed around measurable business outcomes.", url: "https://modevz.ca/devz" },
};

export default function DevzLayout({ children }: { children: React.ReactNode }) { return children; }

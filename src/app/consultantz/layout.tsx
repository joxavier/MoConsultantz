import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Small Business Strategy & Technical Consulting",
  description: "Turn operational and technology bottlenecks into a clear, practical growth plan. Strategy, automation, software, and implementation support led by Joshua Xavier.",
  alternates: { canonical: "/consultantz" },
  openGraph: { title: "Small Business Strategy & Technical Consulting | MoConsultantz", description: "Clear strategy and hands-on implementation for growing businesses.", url: "https://modevz.ca/consultantz" },
};

export default function ConsultantzLayout({ children }: { children: React.ReactNode }) { return children; }

// Fixed-scope consulting plans shown on /plans. Prices are in MoCoin
// service-pricing units, where one unit equals US$1 (see /plans and
// public/llms.txt); descriptions match the /start recommendations in
// src/lib/intake.ts.
export type ConsultingPlan = {
  slug: string;
  name: string;
  eyebrow: string;
  mocoin: number;
  usd: number;
  summary: string;
};

export const consultingPlans: ConsultingPlan[] = [
  {
    slug: "technical-clarity",
    name: "Technical Clarity Sprint",
    eyebrow: "2 weeks",
    mocoin: 5000,
    usd: 5000,
    summary: "A 2-week diagnostic that turns your bottleneck into a decision-ready plan, with one quick win delivered along the way.",
  },
  {
    slug: "growth-systems",
    name: "Growth Systems Build",
    eyebrow: "4-6 weeks",
    mocoin: 10000,
    usd: 10000,
    summary: "A 4-6 week build for a priority website, workflow automation, or internal tool, with SEO and analytics included.",
  },
  {
    slug: "digital-transformation",
    name: "Digital Transformation Partnership",
    eyebrow: "8-12 weeks",
    mocoin: 20000,
    usd: 20000,
    summary: "An 8-12 week partnership covering strategy, build, launch, and team adoption for a multi-system transformation.",
  },
];

export function formatMoCoin(amount: number) {
  return amount.toLocaleString("en-US");
}

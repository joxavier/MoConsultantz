export type Goal = "clarity" | "build" | "transformation" | "marketing" | "web3" | "unsure";
export type Budget = "under5k" | "5to10k" | "10to20k" | "over20k" | "unsure";
export type Timeline = "asap" | "month" | "quarter" | "exploring";

export const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: "clarity", label: "I need a clear technology plan before spending more" },
  { value: "build", label: "I need a website, tool, or workflow automation built" },
  { value: "transformation", label: "I'm coordinating a larger transformation across multiple systems" },
  { value: "marketing", label: "I need help with SEO, discoverability, or conversion" },
  { value: "web3", label: "I need a smart contract or Web3 product built" },
  { value: "unsure", label: "I'm not sure yet" },
];

export const BUDGET_OPTIONS: { value: Budget; label: string }[] = [
  { value: "under5k", label: "Under $5,000" },
  { value: "5to10k", label: "$5,000 - $10,000" },
  { value: "10to20k", label: "$10,000 - $20,000" },
  { value: "over20k", label: "$20,000+" },
  { value: "unsure", label: "Not sure yet" },
];

export const TIMELINE_OPTIONS: { value: Timeline; label: string }[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "month", label: "Within a month" },
  { value: "quarter", label: "1-3 months" },
  { value: "exploring", label: "Just exploring options" },
];

const BUDGET_FLOOR: Record<Budget, number | null> = {
  under5k: 0,
  "5to10k": 5000,
  "10to20k": 10000,
  over20k: 20000,
  unsure: null,
};

type Recommendation = {
  title: string;
  href: string;
  blurb: string;
  minBudget: number;
};

const RECOMMENDATIONS: Record<Goal, Recommendation> = {
  clarity: {
    title: "Technical Clarity Sprint",
    href: "/plans/technical-clarity",
    blurb: "A 2-week diagnostic that turns your bottleneck into a decision-ready plan, with one quick win delivered along the way.",
    minBudget: 5000,
  },
  build: {
    title: "Growth Systems Build",
    href: "/plans/growth-systems",
    blurb: "A 4-6 week build for a priority website, workflow automation, or internal tool, with SEO and analytics included.",
    minBudget: 10000,
  },
  transformation: {
    title: "Digital Transformation Partnership",
    href: "/plans/digital-transformation",
    blurb: "An 8-12 week partnership covering strategy, build, launch, and team adoption for a multi-system transformation.",
    minBudget: 20000,
  },
  marketing: {
    title: "Digital Marketing",
    href: "/technical-consulting",
    blurb: "SEO, generative-search visibility, and conversion tracking, scoped to what your current site and traffic actually need.",
    minBudget: 5000,
  },
  web3: {
    title: "Smart Contract Development",
    href: "/vestmentz/smart-contracts",
    blurb: "Smart contract development, token launch engineering, or a security review for an existing contract.",
    minBudget: 5000,
  },
  unsure: {
    title: "Technical Clarity Sprint",
    href: "/plans/technical-clarity",
    blurb: "Start with a short diagnostic. It's the lowest-commitment way to get an expert opinion before deciding on anything bigger.",
    minBudget: 5000,
  },
};

export type IntakeResult = {
  recommendation: Recommendation;
  downgraded: boolean;
  underMinimum: boolean;
};

export function getRecommendation(goal: Goal, budget: Budget): IntakeResult {
  const recommendation = RECOMMENDATIONS[goal];
  const budgetFloor = BUDGET_FLOOR[budget];

  if (budgetFloor === null) {
    return { recommendation, downgraded: false, underMinimum: false };
  }

  if (budgetFloor < 5000) {
    return { recommendation, downgraded: false, underMinimum: true };
  }

  if (budgetFloor < recommendation.minBudget && goal !== "clarity" && goal !== "unsure") {
    return { recommendation: RECOMMENDATIONS.clarity, downgraded: true, underMinimum: false };
  }

  return { recommendation, downgraded: false, underMinimum: false };
}

export function labelFor<T extends string>(options: { value: T; label: string }[], value: T) {
  return options.find((o) => o.value === value)?.label ?? value;
}

// Canadas-Post-Pandemic-Economic-Outlook.tsx
"use client";
import React from "react";
import Link from "next/link";
import Head from "next/head";
// If your file exists at src/components/CanadaEconomyChart.tsx, keep this import.
// Otherwise, update the path below to the correct relative path, for example:
import CanadaEconomyChart from "../../components/CanadaEconomyChart2";
import EventTimeline from "./event-timeline";
// Or, if your tsconfig.json does not support '@' alias, use a relative path.
import Recommendation from "./recommendations";

const CanadaEconomicOutlook: React.FC = () => {
  const handleDownloadPDF = () => {
    // Create a comprehensive PDF content
    const pdfContent = `
Canada's Post-Pandemic Economic Outlook: Challenges and Opportunities in a New World

As the world steadily moves beyond the shadows of the COVID-19 pandemic, Canada stands at a pivotal economic crossroads. While the country has demonstrated remarkable resilience during an unprecedented global crisis, the path ahead is marked by both significant challenges and promising opportunities.

The Economic Recovery So Far

Canada entered the pandemic with relatively strong fundamentals but suffered steep contractions in GDP, employment, and consumer spending in 2020. Since then, the rebound has been uneven but resilient:

• GDP Growth: After sharp declines in 2020, Canada saw a strong rebound in 2021 and 2022, followed by a slower but steady expansion in 2023 and 2024.
• Unemployment Rate: From a peak of 13.7% in May 2020, unemployment has dropped to near pre-pandemic levels, hovering around 6% in 2025.
• Inflation: Like many advanced economies, Canada has battled inflationary pressures, driven by global supply chain disruptions, energy prices, and housing costs.

Key Challenges in 2025 and Beyond

1. Housing Affordability Crisis
Skyrocketing home prices, particularly in urban centres like Toronto and Vancouver, have deepened the affordability gap. Young Canadians and new immigrants face barriers to homeownership, while rental costs are also surging.

2. Labour Market Gaps
While overall employment numbers have recovered, mismatches persist. Key industries—such as healthcare, skilled trades, and technology—report talent shortages.

3. Inflation and Interest Rate Volatility
Persistent inflation has led the Bank of Canada to implement a series of interest rate hikes since 2022. This has cooled spending and borrowing but raised concerns about consumer debt and mortgage defaults.

4. Global Trade Disruptions
Geopolitical tensions and supply chain vulnerabilities have exposed Canada's reliance on global trade, especially with China and the U.S.

Emerging Opportunities

1. Green Economy and Clean Tech
Canada is well-positioned to lead in the global transition to a low-carbon economy. Investments in hydrogen, battery technology, sustainable mining, and renewables are accelerating.

2. Digital Transformation
The pandemic fast-tracked digitization across sectors—from e-commerce and fintech to health tech and remote work solutions. This momentum is creating new markets for Canadian startups and tech talent.

3. Immigration and Demographic Growth
Canada continues to welcome over 400,000 new immigrants annually—a vital engine for population growth, labour market strength, and economic vitality.

4. Resilient Consumer Spending
Despite inflationary headwinds, Canadian consumers remain relatively confident, particularly in the service sector—travel, dining, and entertainment are rebounding.

Policy Considerations and Long-Term Strategy

To ensure a stable and inclusive recovery, policymakers should prioritize:
• Affordable housing initiatives
• Workforce reskilling programs
• Support for SMEs and entrepreneurs
• Targeted infrastructure and green investments
• Inclusive digital transformation policies

Final Thoughts

Canada's post-pandemic economy is at a defining moment. While challenges such as inflation, housing, and labour gaps cannot be ignored, the opportunity to build a more resilient, inclusive, and forward-looking economy is well within reach.

By investing in people, innovation, and sustainability, Canada can turn this recovery into a launchpad for long-term prosperity.

Published by Joshua Xavier - August 9, 2025
    `;

    const blob = new Blob([pdfContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Canadas-Post-Pandemic-Economic-Outlook-2025.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <title>
          Canada Economic Outlook 2025: Post-Pandemic Recovery & Opportunities
        </title>
        <meta
          name="description"
          content="Comprehensive analysis of Canada's economic outlook 2025, covering post-pandemic recovery, housing crisis, green economy growth, inflation trends, and digital transformation opportunities."
        />
        <meta
          name="keywords"
          content="Canada economic outlook 2025, post-pandemic recovery, housing crisis Canada, green economy Canada, Canadian inflation 2025, digital transformation, immigration and economy, future of work Canada"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Joshua Xavier" />
        <meta
          property="og:title"
          content="Canada Economic Outlook 2025: Post-Pandemic Recovery & Opportunities"
        />
        <meta
          property="og:description"
          content="Expert analysis of Canada's economic challenges and opportunities in 2025, including housing affordability, green tech growth, and digital transformation."
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content="/Canadas-Post-Pandemic-Economic-Outlook.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Canada Economic Outlook 2025: Post-Pandemic Recovery"
        />
        <meta
          name="twitter:description"
          content="Comprehensive analysis of Canada's economic outlook covering housing crisis, green economy, and digital transformation opportunities."
        />
        <link
          rel="canonical"
          href="/article/canadas-post-pandemic-economic-outlook"
        />
      </Head>
      <div className="min-h-screen mt-32 bg-gradient-to-br from-red-900 via-red-800 to-red-700">
        {/* Canadian Flag Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-red-600 to-white transform rotate-45"></div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl relative">
          {/* Back Button & Download */}
          <div className="mb-8 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 text-red-200 hover:text-white transition-colors duration-200 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <svg
                className="w-4 h-4 rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Back to Feed
            </Link>

            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 bg-white text-red-700 hover:bg-red-50 transition-colors duration-200 px-4 py-2 rounded-full font-semibold shadow-lg"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Article
            </button>
          </div>

          {/* Hero Section */}
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 mb-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                "Economic Outlook",
                "Post-Pandemic",
                "Housing Crisis",
                "Green Economy",
                "Digital Transform",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-red-500/30 text-red-100 rounded-full text-sm font-semibold shadow-lg"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
              Economic Outlook: Canada&apos;s Post-Pandemic Reality
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-red-100 mb-8 opacity-90">
              Challenges and Opportunities in a New World
            </h2>

            {/* Author and Meta */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-red-200 border-t border-white/20 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  JX
                </div>
                <div>
                  <p className="font-semibold text-white">
                    <a
                      href="https://josh.modevz.ca/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-red-200 transition-colors"
                    >
                      Joshua Xavier
                    </a>
                  </p>
                  <p className="text-sm">Technical Consultant</p>
                </div>
              </div>
              <div className="hidden md:block w-px h-8 bg-white/30"></div>
              <div className="text-sm">
                <p>Published: October 1st, 2025</p>
                <p>Reading time: 8 minutes</p>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-8">
              <img
                src="/Canadas-Post-Pandemic-Economic-Outlook.png"
                alt="Canada's Economic Outlook"
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              />
            </div>

            {/* Introduction Text */}
            <div className="prose prose-lg max-w-none text-red-50 leading-relaxed">
              <p className="text-xl font-medium mb-4">
                The COVID-19 pandemic tested Canada’s economic resilience and
                reshaped the way businesses operate. From disrupted supply
                chains to labor shortages and surging costs, small businesses
                were forced to adapt quickly. At the same time, the crisis
                accelerated trends in digital adoption, consumer behavior, and
                workforce expectations.
              </p>
              <p className="text-xl font-medium mb-4">
                As the Canadian economy transitions to the post-pandemic era,
                small business owners and decision makers face a defining
                question: how can they position themselves not just to recover,
                but to thrive in a more dynamic, unpredictable market?
              </p>
              <p className="text-lg">
                This article highlights the short- and long-term impacts of the
                pandemic on Canada&apos;s business landscape and provides
                actionable strategies for entrepreneurs, illustrated by Canadian
                companies already leading the way.
              </p>
            </div>
          </div>

          {/* Body Content */}
          <EventTimeline />

          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Economic Performance Overview
            </h3>

            <div className="space-y-4 text-lg">
              <h4 className="text-xl font-semibold text-white mb-3">
                Canada&apos;s Pandemic Response and Business Implications
              </h4>
              <p>
                Government intervention was decisive in preventing widespread
                economic collapse through Emergency Support Programs such as
                CERB and wage subsidies that kept households afloat and allowed
                businesses to retain employees. Low Interest Rates made
                borrowing easier, encouraging investment and survival through
                credit, while Digital Acceleration saw companies rapidly adopt
                e-commerce, remote work, and virtual services.
              </p>

              <p>
                These measures created breathing room, but also set the stage
                for today&apos;s challenges: inflationary pressure, housing
                affordability crises, and structural labor market shifts.
              </p>

              <div className="bg-white/5 rounded-xl p-6 mt-6">
                <h4 className="text-xl font-semibold text-white mb-3">
                  Short-Term Effects Business Owners Must Manage
                </h4>
                <ul className="space-y-2 text-white/90">
                  <li>
                    <strong>Rising Operating Costs</strong> – Higher input
                    prices, rent, and wages are squeezing margins
                  </li>
                  <li>
                    <strong>Talent Competition</strong> – Recruiting and
                    retaining skilled workers remains difficult
                  </li>
                  <li>
                    <strong>Supply Chain Volatility</strong> – Global
                    disruptions continue to impact delivery times and costs
                  </li>
                  <li>
                    <strong>Shifting Consumer Spending</strong> – With housing
                    and essentials consuming more income, discretionary spending
                    is under pressure
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-white mb-3">
                  Long-Term Economic Shifts to Anticipate
                </h4>
                <ul className="space-y-2 text-white/90">
                  <li>
                    <strong>Digital-First Economy</strong> – Online presence and
                    digital tools are now non-negotiable
                  </li>
                  <li>
                    <strong>Sustainability and Health Priorities</strong> –
                    Consumers demand greener, healthier, and more socially
                    responsible offerings
                  </li>
                  <li>
                    <strong>Demographic Transition</strong> – Aging populations
                    create both labor shortages and opportunities in health and
                    wellness
                  </li>
                  <li>
                    <strong>Policy-Driven Opportunities</strong> – Government
                    focus on housing, digital infrastructure, and clean energy
                    opens new business niches
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Economic Chart */}
          <section className="bg-gradient-to-r from-white/10 to-white/15 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Economic Trends Visualization
            </h3>
            <div className="bg-white/10 rounded-xl p-4">
              <main style={{ padding: 20 }}>
                <CanadaEconomyChart height={500} />
              </main>
            </div>
          </section>

          <section className="bg-gradient-to-r from-white/10 to-white/15 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h8M12 8v8"
                />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
              Environmental Shocks and Longer-Run Economic Impacts
            </h3>
            <p className="text-lg mb-4">
              Environmental factors are increasingly material to the macro
              picture. Climate-driven events —{" "}
              <a
                href="https://globalnews.ca/news/11334817/wildfire-port-alberni-smoke-blankets-region/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-300"
              >
                extreme heat, floods, and massive wildfire seasons
              </a>
              — impose direct costs (infrastructure damage, lost production,
              health care)and indirect effects (higher insurance costs, supply
              chain disruption, labour productivity losses). Canada’s reliance
              on fossil-fuel exports and resource sectors creates transition
              risks: shifting to low-carbon output incurs adjustment costs for
              regions reliant on extraction, while also{" "}
              <a
                href="https://news.ontario.ca/en/release/1005717/ontario-doubling-hydrogen-innovation-fund-to-30-million-to-protect-ontario-jobs"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-300"
              >
                generating new investment and job opportunities in clean energy
              </a>
              . The interplay between climate events and cost-of-living
              pressures — for example, wildfire smoke reducing labour
              productivity, or climate events raising food and energy prices —
              can feed into both CPI volatility and regional unemployment.
              Policymakers therefore face the twin task of buffering short-run
              shocks while financing a just transition to a green economy.
            </p>
          </section>

          {/* Economic Recovery Section */}
          <section className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">
                The Economic Recovery So Far
              </h2>
            </div>
            <div className="prose prose-lg max-w-none text-red-50 leading-relaxed">
              <p className="text-lg mb-4">
                Canada entered the pandemic with relatively strong fundamentals
                but suffered steep contractions in GDP, employment, and consumer
                spending in 2020. Since then, the rebound has been uneven but
                resilient:
              </p>
              <ul className="text-lg ml-4 space-y-3 text-red-100">
                <li>
                  <strong>GDP Growth:</strong> After sharp declines in 2020,
                  Canada saw a strong rebound in 2021 and 2022, followed by a
                  slower but steady expansion in 2023 and 2024.
                </li>
                <li>
                  <strong>Unemployment Rate:</strong> From a peak of 13.7% in
                  May 2020, unemployment has dropped to near pre-pandemic
                  levels, hovering around 6% in 2025.
                </li>
                <li>
                  <strong>Inflation:</strong> Like many advanced economies,
                  Canada has battled inflationary pressures, driven by global
                  supply chain disruptions, energy prices, and housing costs.
                </li>
              </ul>
            </div>
          </section>

          {/* Key Challenges */}
          <section className="bg-gradient-to-r from-white/10 to-white/15 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.12 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">
                Key Challenges in 2025 and Beyond
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  🏠 Housing Affordability Crisis
                </h3>
                <p className="text-red-100">
                  Skyrocketing home prices, particularly in urban centres like
                  Toronto and Vancouver, have deepened the affordability gap.
                  Young Canadians and new immigrants face barriers to
                  homeownership, while rental costs are also surging.
                </p>
                <p className="text-red-200 text-sm mt-2">
                  🔍 Policy focus needed: Increased housing supply, zoning
                  reform, and affordable housing investment.
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  👷 Labour Market Gaps
                </h3>
                <p className="text-red-100">
                  While overall employment numbers have recovered, mismatches
                  persist. Key industries—such as healthcare, skilled trades,
                  and technology—report talent shortages.
                </p>
                <p className="text-red-200 text-sm mt-2">
                  📌 Opportunity: Canada&apos;s robust immigration system can
                  help fill gaps with proper integration programs.
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  📈 Inflation and Interest Rate Volatility
                </h3>
                <p className="text-red-100">
                  Persistent inflation has led the Bank of Canada to implement
                  interest rate hikes since 2022. This has cooled spending but
                  raised concerns about consumer debt and mortgage defaults.
                </p>
                <p className="text-red-200 text-sm mt-2">
                  💡 Watch closely: Balancing inflation control with economic
                  growth will define monetary policy.
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  🌍 Global Trade Disruptions
                </h3>
                <p className="text-red-100">
                  Geopolitical tensions and supply chain vulnerabilities have
                  exposed Canada&apos;s reliance on global trade, especially
                  with China and the U.S.
                </p>
                <p className="text-red-200 text-sm mt-2">
                  🔄 Strategy needed: Diversifying trade partners and investing
                  in domestic manufacturing.
                </p>
              </div>
            </div>
          </section>

          {/* Emerging Opportunities */}
          <section className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">
                Emerging Opportunities
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  🌱 Green Economy and Clean Tech
                </h3>
                <p className="text-red-100">
                  Canada is well-positioned to lead in the global transition to
                  a low-carbon economy. Investments in hydrogen, battery
                  technology, sustainable mining, and renewables are
                  accelerating.
                </p>
                <p className="text-green-200 text-sm mt-2">
                  🌱 Why it matters: Drive exports, create quality jobs, and
                  establish sustainability leadership.
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  💻 Digital Transformation
                </h3>
                <p className="text-red-100">
                  The pandemic fast-tracked digitization across sectors—from
                  e-commerce and fintech to health tech and remote work
                  solutions. This momentum is creating new markets for Canadian
                  startups.
                </p>
                <p className="text-blue-200 text-sm mt-2">
                  🚀 Outlook: Tech adoption is no longer optional for business
                  success.
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  🌎 Immigration and Demographic Growth
                </h3>
                <p className="text-red-100">
                  Canada continues to welcome over 400,000 new immigrants
                  annually—a vital engine for population growth, labour market
                  strength, and economic vitality.
                </p>
                <p className="text-purple-200 text-sm mt-2">
                  🌎 Big picture: Leveraging diversity as a strategic
                  competitive advantage.
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  💳 Resilient Consumer Spending
                </h3>
                <p className="text-red-100">
                  Despite inflationary headwinds, Canadian consumers remain
                  relatively confident, particularly in services—travel, dining,
                  and entertainment are rebounding.
                </p>
                <p className="text-yellow-200 text-sm mt-2">
                  💳 Insight: Experience-based spending outpaces goods, showing
                  priority shifts.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 17l6-6 4 4 8-8"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5h6v6"
                />
              </svg>
              Positioning Strategies for Small Business Owners
            </h3>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 mt-6">
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-white mb-2">
                    1. Invest in Inclusive Workforce Development
                  </h5>
                  <p className="text-white/90 mb-2">
                    Upskilling and reskilling will define long-term
                    competitiveness. Businesses that create entry points for
                    low-skill workers will benefit from loyalty and productivity
                    gains.
                  </p>
                  <p className="text-sm text-blue-200">
                    <em>
                      Example: Metaparlour Academy provides wellness-oriented,
                      entry-level courses that combine soft skills with health
                      and well-being, creating a model small businesses can
                      adopt.
                    </em>
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-white mb-2">
                    2. Align With Consumer Needs in Critical Markets
                  </h5>
                  <p className="text-white/90 mb-2">
                    Affordability, transparency, and consumer-first solutions
                    are gaining ground. Businesses that position themselves as
                    advocates for consumer well-being build trust and long-term
                    loyalty.
                  </p>
                  <p className="text-sm text-blue-200">
                    <em>
                      Example: JustListed.today empowers Canadians—especially
                      first-time buyers and newcomers—to understand
                      affordability and connect with certified agents.
                    </em>
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-white mb-2">
                    3. Embrace Digital Tools to Support Essential Sectors
                  </h5>
                  <p className="text-white/90 mb-2">
                    The pandemic highlighted the importance of logistics, supply
                    chains, and critical services. Small businesses supporting
                    these infrastructures can anchor themselves in the
                    economy&apos;s backbone.
                  </p>
                  <p className="text-sm text-blue-200">
                    <em>
                      Example: MoDevz provides digital solutions tailored to
                      small logistics and operations businesses that underpin
                      pandemic resilience.
                    </em>
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-white mb-2">
                    4. Build for Long-Term Resilience
                  </h5>
                  <ul className="text-white/90 text-sm space-y-1 ml-4">
                    <li>
                      • Diversify suppliers and revenue streams to reduce
                      vulnerabilities
                    </li>
                    <li>
                      • Use automation and digital marketing to control costs
                    </li>
                    <li>
                      • Monitor fiscal and housing policy for business
                      opportunities
                    </li>
                    <li>
                      • Communicate authenticity and values—trust has become a
                      competitive advantage
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 17l6-6 4 4 8-8"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5h6v6"
                />
              </svg>
              Key Takeaway
            </h3>

            <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
              <p className="text-white/90">
                Canada&apos;s post-pandemic economy presents both headwinds and
                opportunities. Small businesses that embrace digital tools,
                align with shifting consumer values, and invest in inclusive
                workforce strategies will not only survive but become leaders in
                their sectors. Agility, purpose, and consumer focus are the
                defining traits of resilient Canadian enterprises in this new
                era.
              </p>
            </div>
          </section>

          {/* Policy Considerations */}
          <section className="bg-gradient-to-r from-white/10 to-white/15 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 mb-8">
            <Recommendation />
          </section>

          {/* Citations */}
          <section className="bg-gray-50 rounded-xl shadow-lg border-t-4 border-gray-600">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📚</span>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Works Cited
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    BNN Bloomberg. &quot;Build Canada Homes Proposal Aims to
                    Double Housing Output.&quot; <em>BNN Bloomberg</em>, 15 Mar.
                    2025, bnnbloomberg.ca/build-canada-homes-proposal.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Canada Mortgage and Housing Corporation.{" "}
                    <em>
                      Summer Update 2025: Housing Market Outlook—National
                      Edition
                    </em>
                    . CMHC, 2025,
                    cmhc-schl.gc.ca/observer/2025/summer-update-2025-housing-market-outlook.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Government of Canada.{" "}
                    <em>
                      Canada&apos;s National Housing Strategy: Progress and
                      Implementation Report 2025
                    </em>
                    . Canada Mortgage and Housing Corporation, 2025,
                    publications.gc.ca/collections/collection_2025/hpc-phc/PH4-207-2025-eng.pdf.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Infrastructure Canada.{" "}
                    <em>National Infrastructure Assessment 2025</em>. Government
                    of Canada, 2025, infrastructure.gc.ca/assessment-2025.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    International Monetary Fund. &quot;Central Bank Digital
                    Currencies in Low-Connectivity Settings.&quot;{" "}
                    <em>IMF Fintech Notes</em>, 7 Aug. 2025,
                    imf.org/en/Publications/fintech-notes/2025/CBDC-connectivity.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Natural Resources Canada.{" "}
                    <em>Clean Technology and Innovation Strategy 2025</em>.
                    Government of Canada, 2025,
                    nrcan.gc.ca/climate-change/clean-tech-strategy-2025.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Policy Horizons Canada.{" "}
                    <em>
                      Social Mobility in Canada: Exploring Future Disruptions to
                      2040
                    </em>
                    . Government of Canada, 2025,
                    horizons.service.canada.ca/en/2025/01/15/social-mobility-disruptions-2040.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Statistics Canada.{" "}
                    <em>Key Small Business Statistics 2024</em>. Government of
                    Canada, 2024, ic.gc.ca/eic/site/061.nsf/eng/h_03126.html.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Trade Commissioner Service.{" "}
                    <em>CanExport SMEs Program Guidelines</em>. Global Affairs
                    Canada, 2025,
                    tradecommissioner.gc.ca/funding-financement/canexport/sme-pme.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    World Economic Forum. <em>Future of Jobs Report 2025</em>.
                    WEF, 2025, weforum.org/reports/future-of-jobs-report-2025.
                  </p>
                </div>

                {/* Newly added from your footer */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Statistics Canada. &quot;GDP Growth 2015–2019.&quot;
                    Government of Canada, 2020,
                    www150.statcan.gc.ca/n1/daily-quotidien/200228/dq200228a-eng.htm.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Trading Economics. &quot;TSX Market Data.&quot; Trading
                    Economics, 2025, tradingeconomics.com/canada/stock-market.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Statistics Canada. &quot;GDP Contraction 2020.&quot;
                    Government of Canada, 2020,
                    www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3610022201.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Bank of Canada. <em>Monetary Policy</em>. Bank of Canada,
                    2025, bankofcanada.ca/core-functions/monetary-policy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                Continue Reading
              </h3>
              <p className="text-red-200 mb-6">
                Explore more insights on Canada&apos;s economic future and
                global trends.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/feed"
                  className="inline-flex items-center gap-2 bg-white text-red-700 px-8 py-4 rounded-full font-bold hover:bg-red-50 transition-all duration-200 hover:transform hover:scale-105 shadow-lg text-lg"
                >
                  Back to Articles
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-2 bg-red-500/30 text-white px-8 py-4 rounded-full font-bold hover:bg-red-500/40 transition-all duration-200 hover:transform hover:scale-105 shadow-lg text-lg border border-white/20"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CanadaEconomicOutlook;

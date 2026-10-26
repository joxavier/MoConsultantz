import React, { useState } from "react";

interface TimelineData {
  year: string;
  gdpGrowth: string;
  unemployment: string;
  inflation: string;
  context: string;
  details: {
    title: string;
    content: (string | React.ReactElement)[];
  };
  gdpColor?: string;
  unemploymentColor?: string;
  inflationColor?: string;
}

const timelineData: TimelineData[] = [
  {
    year: "2015–19",
    gdpGrowth: "Moderate, commodity-sensitive",
    unemployment: "~6.9% decreasing",
    inflation: "~1–2% steady",
    context: "Pre-pandemic normalcy, stable housing and employment",
    details: {
      title: "Pre-Pandemic Stability (2015-2019)",
      content: [
        <>
          Between 2015 and 2019, Canada&apos;s{" "}
          <a
            href="https://www150.statcan.gc.ca/n1/daily-quotidien/200228/dq200228a-eng.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-300"
          >
            GDP
          </a>{" "}
          growth averaged around 2%, supported by strong global demand and
          resource exports. The{" "}
          <a
            href="https://tradingeconomics.com/canada/stock-market"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-300"
          >
            TSX
          </a>{" "}
          rose steadily, reflecting business confidence and stable commodity
          prices.
        </>,
        <>
          This period represented economic normalcy with predictable growth
          patterns, manageable unemployment rates, and stable inflation within
          the Bank of Canada&apos;s target range.
        </>,
      ],
    },
  },
  {
    year: "2020",
    gdpGrowth: "–5.0%",
    unemployment: "13.7% peak",
    inflation: "Initial dip → rising",
    context:
      "Pandemic years: full lockdowns hit output; CERB & CEWS protected incomes; BoC slashed rates to 0.25% and launched QE",
    gdpColor: "text-red-300",
    unemploymentColor: "text-red-300",
    details: {
      title: "Pandemic Crisis Response (2020)",
      content: [
        <>
          The COVID-19 pandemic caused an{" "}
          <a
            href="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=3610022201"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-300"
          >
            unprecedented GDP contraction
          </a>
          , while the TSX plunged in March 2020 before rebounding on stimulus
          measures and record-low interest rates.
        </>,
        "Canada entered the crisis on relatively strong footing, but the pandemic triggered sharp contractions in GDP, steep unemployment surges (peaking at 13.7% in May 2020), and widespread economic disruption.",
        "The combined monetary and fiscal response was swift and robust: the Bank of Canada slashed its policy rate to near-zero, initiated quantitative easing, while the federal government rolled out groundbreaking income and wage-support programs (CERB, CEWS) alongside public-health restrictions.",
      ],
    },
  },
  {
    year: "2021",
    gdpGrowth: "+5.3%",
    unemployment: "Falling from peak",
    inflation: "Rising sharply",
    context:
      "Reopening demand boosts growth; supply shocks + energy driven inflation; stimulus amplifies demand",
    gdpColor: "text-green-300",
    unemploymentColor: "text-green-300",
    inflationColor: "text-yellow-300",
    details: {
      title: "Recovery and Reopening (2021)",
      content: [
        "By 2021, recovery was underway, driven by fiscal stimulus, commodity rebounds, and reopening effects. The stabilization of household incomes and preservation of business-labour connections enabled a powerful rebound in GDP.",
        "However, reopening-driven demand, global supply constraints, and energy shocks began to fuel inflation, setting the stage for future monetary policy challenges.",
      ],
    },
  },
  {
    year: "2022",
    gdpGrowth: "~3.8%",
    unemployment: "Continued recovery",
    inflation: "High inflation",
    context:
      "BoC begins tightening, reducing QE; fiscal policy transitions from emergency to investment-oriented",
    inflationColor: "text-red-300",
    details: {
      title: "Monetary Tightening Begins (2022)",
      content: [
        <>
          Rising inflation led the{" "}
          <a
            href="https://www.bankofcanada.ca/core-functions/monetary-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-300"
          >
            Bank of Canada
          </a>{" "}
          to raise rates aggressively in 2022, cooling housing markets and
          beginning to slow growth. The transition from emergency fiscal support
          to longer-term investment-oriented policies marked a key shift in
          government approach.
        </>,
        "Global supply chain disruptions and energy price volatility continued to impact the Canadian economy during this period.",
      ],
    },
  },
  {
    year: "2023",
    gdpGrowth: "~1.3%",
    unemployment: "~5–6%",
    inflation: "Inflation eases (2–3%)",
    context:
      "Further rate hikes, inflation moderates; Budget 2024 begins clean tech and housing affordability tax credits",
    inflationColor: "text-green-300",
    details: {
      title: "Inflation Moderation (2023)",
      content: [
        "From late 2022 through 2024, monetary tightening and easing external pressures gradually brought inflation toward target while growth cooled and unemployment edged back toward pre-pandemic averages (~6–7%).",
        "Government policy began shifting toward clean technology investments and housing affordability measures, signaling long-term structural priorities.",
      ],
    },
  },
  {
    year: "2024",
    gdpGrowth: "Sluggish",
    unemployment: "~6–7%",
    inflation: "Inflation near target",
    context:
      "Rate cuts possible; spending continues on housing and zero-carbon investment",
    inflationColor: "text-green-300",
    details: {
      title: "Economic Stabilization (2024)",
      content: [
        "As of 2024, growth is projected to remain modest, with ongoing global uncertainty, tighter credit conditions, and shifts toward green-energy investment shaping Canada's economic path.",
        "Climate-related economic risks — including natural disasters damaging infrastructure and disrupting output — are becoming increasingly material, underscoring the importance of sustainable, resilient policy frameworks for the future.",
      ],
    },
  },
  {
    year: "2025",
    gdpGrowth: "Stabilizing",
    unemployment: "~6.6–7.0%",
    inflation: "~2.4%",
    context:
      "Balanced policy stance; fiscal deficits narrowing; sustainable growth focus",
    inflationColor: "text-green-300",
    details: {
      title: "Looking Forward (2025)",
      content: [
        "Economic projections suggest continued stabilization with balanced monetary and fiscal policy approaches. The focus shifts toward sustainable, long-term growth strategies that balance economic recovery with environmental and social priorities.",
        "Fiscal deficits are expected to narrow as emergency spending winds down, while targeted investments in green technology and housing affordability continue.",
      ],
    },
  },
];

const EventTimeline: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleDetails = (year: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(year)) {
      newExpandedRows.delete(year);
    } else {
      newExpandedRows.add(year);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <section className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 mb-8">
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
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h8M12 8v8"
          />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
        Event Timeline
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-red-100">
          <thead>
            <tr className="border-b border-white/30">
              <th className="text-left p-3 font-semibold text-white">Year</th>
              <th className="text-left p-3 font-semibold text-white">
                GDP Growth
              </th>
              <th className="text-left p-3 font-semibold text-white">
                Unemployment
              </th>
              <th className="text-left p-3 font-semibold text-white">
                CPI/Inflation
              </th>
              <th className="text-left p-3 font-semibold text-white">
                Key Policy & Economic Context
              </th>
              <th className="text-center p-3 font-semibold text-white">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {timelineData.map((item, index) => (
              <React.Fragment key={item.year}>
                <tr className="border-b border-white/20 hover:bg-white/10 transition-colors">
                  <td className="p-3 font-medium">{item.year}</td>
                  <td className={`p-3 ${item.gdpColor || ""}`}>
                    {item.gdpGrowth}
                  </td>
                  <td className={`p-3 ${item.unemploymentColor || ""}`}>
                    {item.unemployment}
                  </td>
                  <td className={`p-3 ${item.inflationColor || ""}`}>
                    {item.inflation}
                  </td>
                  <td className="p-3">{item.context}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => toggleDetails(item.year)}
                      className="text-blue-300 hover:text-blue-200 flex items-center justify-center w-full"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedRows.has(item.year) ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>

                {expandedRows.has(item.year) && (
                  <tr>
                    <td
                      colSpan={6}
                      className={`p-4 bg-white/5 ${
                        index === timelineData.length - 1
                          ? ""
                          : "border-b border-white/10"
                      }`}
                    >
                      <div className="text-white/90 space-y-2">
                        <h4 className="font-semibold text-white mb-2">
                          {item.details.title}
                        </h4>
                        {item.details.content.map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default EventTimeline;

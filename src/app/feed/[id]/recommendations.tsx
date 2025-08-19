import React from 'react';

const PolicyRecommendations = () => {
  return (
    <div className="max-w-6xl mx-auto p-6  min-h-screen">
      {/* Header Section */}
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Policy Considerations and Long-Term Strategy
          </h1>
        </div>

      {/* Issue #1: Affordable Housing */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-6xl">🏡</span>
            <h2 className="text-xl font-bold text-white-800">
              Affordable Housing Initiatives
            </h2>
          </div>
        </div>

        {/* Platform Highlight */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-400 rounded-full p-3 flex-shrink-0">
              <span className="text-2xl">🌟</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">
                JustListed.today
              </h3>
              <p className="text-lg leading-relaxed">
                A consumer-first marketplace empowering Canadians—especially first-time buyers, newcomers, 
                and low-income households—to understand what they can afford, connect with certified agents, 
                and access listings aligned with their financial needs.
              </p>
            </div>
          </div>
        </div>

        {/* Supporting Factors */}
        <div className="space-y-6">
          {/* National Strategy */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🏛️</span>
                <h3 className="text-2xl font-semibold text-gray-800">
                  National Strategy & Supply Gap
                </h3>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Canada&apos;s National Housing Strategy targets vulnerable populations including students, seniors, 
                  and equity-deserving groups (Government of Canada, 2025). Yet, CMHC projects that between 
                  4.3 and 4.8 million new homes must be built over the next 10 years—about 430,000 to 480,000 
                  units per year—to restore housing affordability to pre-pandemic levels (Canada Mortgage and Housing Corporation, 2025).
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-6 text-white text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="text-4xl font-bold">430K-480K</div>
                  <div className="text-sm mt-2 opacity-90">New units needed annually</div>
                </div>
                <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-lg p-6 text-white text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="text-4xl font-bold">2x</div>
                  <div className="text-sm mt-2 opacity-90">Current output needs to double</div>
                </div>
              </div>
            </div>
          </div>

          {/* Policy Innovation */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">💡</span>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Policy Innovation: Build Canada Homes (BCH)
                </h3>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 rounded-full p-2 flex-shrink-0 mt-1">
                    <span className="text-white text-xl">💰</span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-2">$26B</div>
                    <p className="text-gray-700 leading-relaxed">
                      The BCH proposal aims to double housing output to 500,000 units annually through 
                      public land development, modular construction, and substantial financing support—about 
                      C$25 billion in debt and C$1 billion in equity (BNN Bloomberg, 2025). This initiative 
                      represents a critical policy innovation to address Canada&apos;s housing crisis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Mobility Warning */}
          <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl shadow-lg">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">⚠️</span>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Social Mobility & Housing Security
                </h3>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  Policy Horizons Canada warns that by 2040, upward social mobility may become rare, 
                  with many Canadians believing they risk sliding downward despite effort—undermining 
                  the social promise that hard work leads to progress (Policy Horizons Canada, 2025). 
                  Housing affordability barriers are central to this threat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Issue #2: Workforce Reskilling */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-6xl">👩‍🏫</span>
            <h2 className="text-xl font-bold text-white-800">
              Workforce Reskilling Programs
            </h2>
          </div>
        </div>

        {/* Platform Highlight */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-orange-400 rounded-full p-3 flex-shrink-0">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-orange-300 mb-4">
                Metaparlour Academy
              </h3>
              <p className="text-lg leading-relaxed">
                A wellness-oriented platform offering entry-level courses tailored for low-skill workers. 
                Its approach—combining soft skills with health and wellbeing—aligns with Canada&apos;s broader 
                need for inclusive reskilling pathways.
              </p>
            </div>
          </div>
        </div>

        {/* Supporting Factors */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-emerald-500">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📊</span>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Skills Trends According to WEF
                </h3>
              </div>
              
              <div className="bg-emerald-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  The Future of Jobs Report 2025 identifies analytical thinking as the most sought-after 
                  skill by 2025, with strong demand for adaptability, creativity, sustainability awareness, 
                  and digital skills like AI, big data, cybersecurity, and fintech (World Economic Forum, 2025). 
                  The report projects a net gain of 78 million jobs globally by 2030, with many roles tied 
                  to sustainability and technology sectors.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-4 text-white text-center">
                  <div className="text-2xl font-bold">78M</div>
                  <div className="text-sm mt-1 opacity-90">New jobs by 2030</div>
                </div>
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg p-4 text-white text-center">
                  <div className="text-2xl font-bold">AI/Tech</div>
                  <div className="text-sm mt-1 opacity-90">High-demand skills</div>
                </div>
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-4 text-white text-center">
                  <div className="text-2xl font-bold">Sustainability</div>
                  <div className="text-sm mt-1 opacity-90">Growing sector</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🛠️</span>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Strategic Implementation
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-indigo-400">
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-indigo-600">Skill-Aligned Modules:</strong> Embed Metaparlour Academy 
                    modules around critical skills identified by WEF—analytical reasoning, resilience, 
                    sustainability literacy—to prepare learners for emerging roles.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-400">
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-purple-600">Industry Partnerships:</strong> Partner with employers 
                    in healthcare, social services, tech, and trades to create rapid &quot;micro-credential&quot; 
                    pipelines bridging entry-level workers into growing sectors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Issue #3: SMEs & Digital Transformation */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-6xl">🚀</span>
            <h2 className="text-xl font-bold text-white-800">
              SMEs, Infrastructure & Digital Transformation
            </h2>
            <span className="text-6xl">💱</span>
          </div>
        </div>

        {/* Platform Highlight */}
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-pink-400 rounded-full p-3 flex-shrink-0">
              <span className="text-2xl">💼</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-pink-300 mb-4">
                MoCoin
              </h3>
              <p className="text-lg leading-relaxed">
                A digital service provider helping critical service providers—especially small logistics 
                and operations businesses—that underpin pandemic resilience and future economic infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* Supporting Factors */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-cyan-500">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🏢</span>
                <h3 className="text-2xl font-semibold text-gray-800">
                  SME Role in Canada&apos;s Economy
                </h3>
              </div>
              
              <div className="bg-cyan-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  SMEs represent over 1.22 million businesses and employ nearly 8 million Canadians 
                  (~64% of private-sector workforce) (Statistics Canada, 2024). Export diversification 
                  is supported by programs like CanExport SMEs, which covers up to C$50,000 (50%) of 
                  export development costs (Trade Commissioner Service, 2025).
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg p-6 text-white text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="text-4xl font-bold">1.22M</div>
                  <div className="text-sm mt-2 opacity-90">SME businesses</div>
                </div>
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-6 text-white text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="text-4xl font-bold">64%</div>
                  <div className="text-sm mt-2 opacity-90">Private sector workforce</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🌱</span>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Infrastructure & Green Investment
                </h3>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  Canada&apos;s strategy focuses on underserved housing and service gaps (Infrastructure Canada, 2025). 
                  Green tech and clean infrastructure investments align with reskilling trends—particularly roles 
                  in sustainable mining, energy storage, hydrogen, and renewables (Natural Resources Canada, 2025).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl shadow-lg">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🏦</span>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Central Bank Digital Currency (CBDC)
                </h3>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
                <p className="text-gray-700 leading-relaxed">
                  The IMF Fintech Note (August 7, 2025) explores CBDC implementation in low-connectivity 
                  settings—covering stored-value cards, device-to-device payments, and offline modes—to 
                  boost financial inclusion for underserved communities or remote regions (International Monetary Fund, 2025).
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-violet-400">
                  <p className="text-gray-700">
                    <strong className="text-violet-600">Digital Payment Infrastructure:</strong> Integrate 
                    Modevz or similar platforms with pilot CBDC infrastructure to enable digital payment 
                    services in underserved communities.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-fuchsia-400">
                  <p className="text-gray-700">
                    <strong className="text-fuchsia-600">Digital Literacy Training:</strong> Work with 
                    policymakers to ensure training through Metaparlour Academy includes digital literacy 
                    for new CBDC systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>      
    </div>
  );
};

export default PolicyRecommendations;
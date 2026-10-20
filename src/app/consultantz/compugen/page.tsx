"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Brain, Shield, TrendingUp, Users, Lightbulb } from 'lucide-react';

const CompugenPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Your Next Technology Ally",
      subtitle: "Business Development Representative",
      content: (
        <div className="text-center space-y-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white px-6 py-3 rounded-lg shadow-lg">
              <img 
                src="https://www.compugen.com/hubfs/Layer_1.svg" 
                alt="Compugen Logo" 
                className="h-12 w-auto"
              />
            </div>
          </div>
          <div className="text-7xl font-bold text-white mb-4">
            Dream. Design. Deliver.
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-300 shadow-2xl">
              <img 
                src="https://josh.modevz.ca/_next/image?url=%2Fhero.jpg&w=256&q=75" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/20">
            <p className="text-2xl font-light text-white leading-relaxed">
              Bringing <span className="font-semibold text-green-300">AI expertise</span> and <span className="font-semibold text-green-300">cybersecurity knowledge</span> to help organizations realize new possibilities
            </p>
          </div>
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <Brain className="w-12 h-12 mx-auto mb-2 text-green-300" />
              <p className="text-sm text-white/80">Databricks AI</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-2 text-green-300" />
              <p className="text-sm text-white/80">Network Security</p>
            </div>
          </div>
        </div>
      ),
      bgColor: "from-purple-900 via-purple-800 to-navy-900"
    },
    {
      title: "Technical Foundation Meets Business Acumen",
      subtitle: "Why My Experience Aligns with Compugen's Vision",
      icon: <Lightbulb className="w-10 h-10" />,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-600">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpR53ixkfZvuntB9YIbi98vM9YH0vJ9oUi2A&s" 
                  alt="Databricks" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-3 text-gray-900">Databricks AI Learning Experience</h4>
                <p className="text-gray-700 mb-3">
                  Deep understanding of AI/ML platforms and data intelligence solutions — enabling me to speak credibly with technical decision-makers about transformation opportunities.
                </p>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-900 font-medium">
                    <span className="font-bold">Business Impact:</span> I can identify prospects struggling with data silos, ML deployment, or analytics scalability — positioning Compugen's hybrid cloud and AI enablement services as the solution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-600">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/9/93/OptivLogo.png" 
                  alt="Optiv Security" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-3 text-gray-900">Cybersecurity Suites for Network Security</h4>
                <p className="text-gray-700 mb-3">
                  Hands-on knowledge of network security architecture and threat protection — critical for conversations around Compugen's security solutions and compliance requirements.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-900 font-medium">
                    <span className="font-bold">Business Impact:</span> I understand the pain points executives face with ransomware, zero-trust, and endpoint protection — making my outreach relevant and solution-focused.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 bg-gradient-to-r from-purple-100 to-green-100 p-4 rounded-lg">
            <p className="text-gray-800 font-medium">
              🎯 <span className="font-bold">The Compugen Advantage:</span> Technical credibility + business development drive = trusted advisor, not just a sales rep
            </p>
          </div>
        </div>
      ),
      bgColor: "from-green-700 via-green-600 to-green-700"
    },
    {
      title: "Strategic Communication with Technical Depth",
      subtitle: "Building Trust Through Knowledge",
      icon: <Users className="w-10 h-10" />,
      content: (
        <div className="space-y-6">
          <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-xl">
            <h4 className="font-bold text-2xl mb-4 text-purple-900">Speaking the Language of IT Leaders</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-semibold text-lg text-purple-800 mb-2">🤝 With CIOs & CTOs</h5>
                <p className="text-sm text-gray-700">
                  Discuss AI model deployment pipelines, data governance, and how hybrid IT frameworks support innovation without compromising control
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-lg text-green-800 mb-2">🛡️ With CISOs</h5>
                <p className="text-sm text-gray-700">
                  Address zero-trust architecture, network segmentation, threat detection, and compliance — showing how Compugen's security solutions protect their assets
                </p>
              </div>
              <div className="bg-navy-50 p-4 rounded-lg">
                <h5 className="font-semibold text-lg text-navy-800 mb-2">📊 With Business Executives</h5>
                <p className="text-sm text-black">
                  Translate technical capabilities into ROI, risk reduction, and competitive advantages — connecting technology to business outcomes
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-semibold text-lg text-purple-800 mb-2">💡 Discovery Conversations</h5>
                <p className="text-sm text-gray-700">
                  Ask informed questions about their current AI initiatives and security posture — uncovering real pain points, not surface-level needs
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-xl p-6 shadow-xl">
            <p className="text-lg font-medium text-center">
              <span className="text-2xl">💎</span> My technical foundation transforms cold outreach into <span className="font-bold">warm, credible conversations</span> that IT leaders actually want to take
            </p>
          </div>
        </div>
      ),
      bgColor: "from-purple-800 via-navy-700 to-purple-800"
    },
    {
      title: "Goal-Driven Performance with Technical Edge",
      subtitle: "Exceeding Targets Through Smart Prospecting",
      icon: <TrendingUp className="w-10 h-10" />,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="font-bold text-2xl mb-4 text-navy-900">How My Background Accelerates Results</h4>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-600 pl-4 bg-purple-50 p-4 rounded-r-lg">
                <h5 className="font-semibold text-lg text-purple-900 mb-2">🎯 Targeted Account Selection</h5>
                <p className="text-gray-700">
                  My AI and security knowledge helps me identify high-value prospects faster — companies investing in cloud migration, AI/ML projects, or facing compliance pressures
                </p>
              </div>
              
              <div className="border-l-4 border-green-600 pl-4 bg-green-50 p-4 rounded-r-lg">
                <h5 className="font-semibold text-lg text-green-900 mb-2">📧 Personalized Outreach</h5>
                <p className="text-gray-700">
                  Reference specific pain points (e.g., "I noticed your recent AI hiring push — many organizations struggle with MLOps without the right infrastructure")
                </p>
              </div>
              
              <div className="border-l-4 border-navy-600 pl-4 bg-navy-50 p-4 rounded-r-lg">
                <h5 className="font-semibold text-lg text-navy-900 mb-2">🔄 Higher Conversion Rates</h5>
                <p className="text-black">
                  Technical credibility = more meetings booked, better qualification, and stronger handoffs to Account Executives
                </p>
              </div>

              <div className="border-l-4 border-purple-600 pl-4 bg-purple-50 p-4 rounded-r-lg">
                <h5 className="font-semibold text-lg text-purple-900 mb-2">🚀 Continuous Learning</h5>
                <p className="text-gray-700">
                  Already investing in AI and security knowledge — will rapidly expand expertise in Compugen's full portfolio (Modern Workspace, Managed Services, etc.)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-purple-600 text-white rounded-xl p-6 shadow-xl text-center">
            <p className="text-2xl font-bold mb-2">Ready to Exceed Activity & Pipeline Goals</p>
            <p className="text-lg">Technical knowledge × Sales drive = Compugen's next top performer</p>
          </div>
        </div>
      ),
      bgColor: "from-navy-800 via-purple-700 to-green-700"
    },
    {
      title: "A Perfect Cultural Fit",
      subtitle: "Relentlessly Curious. Collaborative. Driven to Make a Difference.",
      icon: <Users className="w-10 h-10" />,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="font-bold text-2xl mb-4 text-purple-900">Living Compugen's Values</h4>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-5 rounded-lg border-l-4 border-purple-600">
                <h5 className="font-bold text-lg text-purple-900 mb-2">🔍 Relentlessly Curious</h5>
                <p className="text-gray-800">
                  My investment in learning Databricks and cybersecurity proves I ask questions, seek understanding, and pursue knowledge — exactly what Compugen values in uncovering client needs
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-green-50 p-5 rounded-lg border-l-4 border-green-600">
                <h5 className="font-bold text-lg text-green-900 mb-2">🤝 Collaborative at the Core</h5>
                <p className="text-gray-800">
                  Understand the importance of partnering with Account Executives, solution architects, and technical teams to deliver Compugen's human-centered, technology-enabled approach
                </p>
              </div>

              <div className="bg-gradient-to-r from-navy-100 to-navy-50 p-5 rounded-lg border-l-4 border-navy-600">
                <h5 className="font-bold text-lg text-navy-900 mb-2">💪 Driven to Make a Difference</h5>
                <p className="text-white">
                  Not just interested in hitting quotas — passionate about helping organizations realize new possibilities through the right technology solutions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-700 via-green-600 to-navy-700 text-white rounded-2xl p-8 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <img 
                  src="https://www.compugen.com/hubfs/Layer_1.svg" 
                  alt="Compugen Logo" 
                  className="h-12 w-auto opacity-90"
                />
              </div>
              <p className="text-3xl font-bold">Dream. Design. Deliver.</p>
              <div className="h-1 w-32 bg-green-300 mx-auto rounded-full"></div>
              <p className="text-xl font-light">
                I'm ready to be <span className="font-bold text-green-300">your next Technology Ally</span> on the Business Development team
              </p>
              <div className="flex justify-center gap-6 mt-6">
                <div className="text-center">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpR53ixkfZvuntB9YIbi98vM9YH0vJ9oUi2A&s" 
                    alt="Databricks" 
                    className="w-12 h-12 mx-auto mb-2 object-contain bg-white/10 p-1 rounded"
                  />
                  <p className="text-sm">AI Expertise</p>
                </div>
                <div className="text-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/9/93/OptivLogo.png" 
                    alt="Optiv Security" 
                    className="w-12 h-12 mx-auto mb-2 object-contain bg-white/10 p-1 rounded"
                  />
                  <p className="text-sm">Security Knowledge</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-green-300" />
                  <p className="text-sm">Sales Drive</p>
                </div>
              </div>
              <p className="text-lg font-medium mt-6 text-green-200">
                Where Inspiration Meets Impact
              </p>
            </div>
          </div>
        </div>
      ),
      bgColor: "from-purple-900 via-green-800 to-navy-900"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: any) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-navy-900 flex items-center justify-center p-4">
      <style>{`
        .navy-50 { background-color: #e6eaf0; }
        .navy-600 { background-color: #1e3a5f; border-color: #1e3a5f; }
        .navy-700 { background-color: #152d4a; }
        .navy-800 { background-color: #0f1f35; color: #1e3a5f; }
        .navy-900 { background-color: #0a1628; }
      `}</style>
      
      <div className="w-full max-w-6xl">
        {/* Main Slide */}
        <div className={`bg-gradient-to-br ${slides[currentSlide].bgColor} rounded-2xl shadow-2xl px-12 py-16 min-h-[650px] flex flex-col relative overflow-hidden`}>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
          
          {/* Header */}
          <div className="text-white mb-8 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              {slides[currentSlide].icon && (
                <div className="text-green-300">
                  {slides[currentSlide].icon}
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold">{slides[currentSlide].title}</h1>
                <p className="text-xl opacity-90 mt-2">{slides[currentSlide].subtitle}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative z-10">
            {slides[currentSlide].content}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-8 text-white text-sm relative z-10">
            <div className="flex items-center gap-3 opacity-90">
              <img 
                src="https://www.compugen.com/hubfs/Layer_1.svg" 
                alt="Compugen" 
                className="h-8 w-auto"
              />
              <div>
                <p className="font-semibold">Compugen Inc.</p>
                <p className="text-xs">Canada's Technology Ally</p>
              </div>
            </div>
            <div className="opacity-75">
              Slide {currentSlide + 1} of {slides.length}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prevSlide}
            className="bg-white text-purple-900 p-3 rounded-full shadow-lg hover:bg-purple-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={currentSlide === 0}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Dot Navigation */}
          <div className="flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all ${
                  currentSlide === index
                    ? 'bg-green-400 w-10'
                    : 'bg-white/40 hover:bg-white/60 w-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="bg-white text-purple-900 p-3 rounded-full shadow-lg hover:bg-purple-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompugenPresentation;
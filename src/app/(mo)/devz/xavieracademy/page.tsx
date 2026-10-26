"use client"
import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Blocks, Briefcase, Calendar, Check, Code2, GraduationCap, Hammer, Mail, Rocket, ShieldCheck, Workflow } from 'lucide-react';

// Pages on xavieracademy.modevz.ca are rewritten under /devz/xavieracademy by the
// middleware, so links to the rest of the site must be absolute.
const BOOKING_URL = "https://booking.setmore.com/scheduleappointment/9c25b029-94d9-4790-bf2e-4791b9dcbc2e";
const WAITLIST_MAILTO = "mailto:josh@modevz.ca?subject=Xavier%20Academy%20Waitlist&body=Hi%20Josh%2C%0A%0AI'd%20like%20to%20join%20the%20Xavier%20Academy%20waitlist.%0A%0ATrack%20I'm%20interested%20in%3A%20%0AMy%20current%20experience%3A%20";

const AcademyLogo = () => (
  <div className="flex flex-col items-center mb-10">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
      <GraduationCap className="w-9 h-9 text-black" />
    </div>
    <div className="text-4xl md:text-5xl text-white tracking-wide" style={{ fontFamily: 'Anton, sans-serif' }}>
      XAVIER
    </div>
    <div className="text-sm md:text-base font-light text-amber-300 tracking-[0.5em] -mt-1">
      ACADEMY
    </div>
  </div>
);

const SectionHeading = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <div className="text-center mb-14">
    <div className="text-amber-300 text-sm font-semibold tracking-[0.3em] uppercase mb-3">{eyebrow}</div>
    <h2 className="text-4xl md:text-5xl text-white mb-5" style={{ fontFamily: 'Anton, sans-serif' }}>{title}</h2>
    {subtitle && <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">{subtitle}</p>}
  </div>
);

export default function XavierAcademyPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const tracks = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Software Development",
      description: "Build and ship modern web apps with the same stack we use for client work.",
      topics: ["JavaScript & TypeScript", "React & Next.js", "APIs & databases", "Deploying to production"]
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Automation & AI",
      description: "Replace repetitive work with reliable automations and AI-assisted workflows.",
      topics: ["Workflow automation", "Integrating AI models", "Spreadsheets to systems", "Measuring time saved"]
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Cybersecurity",
      description: "Learn to find and fix weaknesses before someone else does.",
      topics: ["Security fundamentals", "Network scanning", "Hardening web apps", "Incident readiness"]
    },
    {
      icon: <Blocks className="w-8 h-8" />,
      title: "Web3 & Smart Contracts",
      description: "Understand blockchains well enough to build on them responsibly.",
      topics: ["Wallets & tokens", "Solana & EVM basics", "Smart contract design", "Security & audits"]
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Tech for Business Owners",
      description: "Make confident technology decisions without becoming a full-time engineer.",
      topics: ["Choosing tools", "Scoping projects", "Working with developers", "Digital strategy"]
    }
  ];

  const steps = [
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: "Learn",
      description: "Short, focused lessons on the concepts that matter, with no filler."
    },
    {
      icon: <Hammer className="w-7 h-7" />,
      title: "Build",
      description: "Apply every lesson to a real project with guidance and code review."
    },
    {
      icon: <Rocket className="w-7 h-7" />,
      title: "Ship",
      description: "Finish with work you can deploy, show employers, or use in your business."
    }
  ];

  const audiences = [
    "Beginners who want a structured path into tech",
    "Developers looking to level up into new areas",
    "Business owners who want to understand and use technology",
    "Teams that need practical, hands-on upskilling"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.15),_transparent_60%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-28">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <AcademyLogo />
            <h1 className="text-5xl md:text-7xl text-white mb-6 leading-tight" style={{ fontFamily: 'Anton, sans-serif' }}>
              Learn Tech by
              <span className="block bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                Building Real Things
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Xavier Academy is hands-on, project-based training in software development, automation,
              cybersecurity, and Web3, taught by the team behind MoDevz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={WAITLIST_MAILTO} className="bg-amber-400 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-300 hover:scale-105 transition-all duration-300 shadow-lg shadow-amber-500/20">
                Join the Waitlist
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </a>
              <a href="#tracks" className="border-2 border-amber-400/70 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-400 hover:text-black transition-all duration-300">
                Explore Tracks
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section id="tracks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-24">
        <SectionHeading
          eyebrow="Learning Tracks"
          title="Pick Your Path"
          subtitle="Each track is built around the skills we use every day delivering real projects for real businesses."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-amber-300 mb-6 group-hover:scale-110 transition-transform duration-300">
                {track.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{track.title}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">{track.description}</p>
              <ul className="space-y-2">
                {track.topics.map((topic, idx) => (
                  <li key={idx} className="flex items-center text-gray-400">
                    <Check className="w-4 h-4 text-amber-300 mr-2 flex-shrink-0" />
                    <span className="text-sm">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-black/30 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How It Works"
            title="Learn. Build. Ship."
            subtitle="Every lesson leads to something you make, so you leave with real skills and real work."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="text-amber-300 flex justify-center mb-4 mt-2">{step.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for + Instructor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-amber-300 text-sm font-semibold tracking-[0.3em] uppercase mb-3">Who It&apos;s For</div>
            <h2 className="text-4xl text-white mb-8" style={{ fontFamily: 'Anton, sans-serif' }}>Built for Doers</h2>
            <ul className="space-y-4">
              {audiences.map((audience, index) => (
                <li key={index} className="flex items-start text-gray-300 text-lg">
                  <Check className="w-6 h-6 text-amber-300 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{audience}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-amber-400/10 to-transparent rounded-2xl p-8 border border-amber-400/30">
            <div className="text-amber-300 text-sm font-semibold tracking-[0.3em] uppercase mb-3">Your Instructor</div>
            <h3 className="text-3xl text-white mb-4" style={{ fontFamily: 'Anton, sans-serif' }}>Joshua Xavier</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Founder of MoDevz and MoConsultantz. Josh helps businesses plan, build, and secure their
              technology, and brings that hands-on experience into every lesson at Xavier Academy.
            </p>
            <a href="https://josh.modevz.ca" className="inline-flex items-center text-amber-300 font-semibold hover:text-amber-200 transition-colors">
              View Josh&apos;s profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-500/20 via-black to-slate-900 p-10 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl text-white mb-5" style={{ fontFamily: 'Anton, sans-serif' }}>
            Be First in the Door
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Enrollment is opening soon. Join the waitlist to hear about the first cohort, or book a call
            to talk through which track fits your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WAITLIST_MAILTO} className="inline-flex items-center justify-center bg-amber-400 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-300 transition-all duration-300">
              <Mail className="w-5 h-5 mr-2" />
              Join the Waitlist
            </a>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border-2 border-white/70 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300">
              <Calendar className="w-5 h-5 mr-2" />
              Book a Call
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

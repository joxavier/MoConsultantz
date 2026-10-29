"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowDownLeft, ArrowUpRight, BarChart3, Check, CreditCard, FileText, Globe, Lock, Receipt, Send, ShieldCheck, Smartphone, Users } from 'lucide-react';
import AnkLogo from './AnkLogo';

// Pages on ank.modevz.ca are rewritten under /devz/ank by the middleware, so
// "/signin" here resolves to /devz/ank/signin on the subdomain.
const WAITLIST_MAILTO = "mailto:josh@modevz.ca?subject=Ank%20Early%20Access&body=Hi%2C%0A%0AI'd%20like%20early%20access%20to%20Ank.%0A%0ABusiness%20name%3A%20%0AProvince%3A%20%0AType%20of%20business%3A%20";

const SectionHeading = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => (
  <div className="text-center mb-14">
    <div className="text-emerald-300 text-sm font-semibold tracking-[0.3em] uppercase mb-3">{eyebrow}</div>
    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-5">{title}</h2>
    {subtitle && <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">{subtitle}</p>}
  </div>
);

// Illustrative app preview for the hero. All figures are sample data.
const AppPreview = () => {
  const activity = [
    { icon: <ArrowDownLeft className="w-4 h-4" />, label: "Invoice #1042 paid", amount: "+$2,450.00", positive: true },
    { icon: <ArrowUpRight className="w-4 h-4" />, label: "Supplier payment", amount: "-$812.37", positive: false },
    { icon: <CreditCard className="w-4 h-4" />, label: "Card · Office supplies", amount: "-$64.18", positive: false },
  ];
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute -inset-6 bg-emerald-500/20 blur-3xl rounded-full"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-400">Operating account · CAD</span>
          <span className="text-[10px] uppercase tracking-widest text-emerald-300 bg-emerald-400/10 px-2 py-1 rounded-full">Sample</span>
        </div>
        <div className="text-4xl font-black text-white tracking-tight mb-1">$48,320.55</div>
        <div className="text-sm text-gray-400 mb-6">Available balance</div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[{ icon: <Send className="w-4 h-4" />, label: "Pay" }, { icon: <FileText className="w-4 h-4" />, label: "Invoice" }, { icon: <CreditCard className="w-4 h-4" />, label: "Cards" }].map((action) => (
            <div key={action.label} className="flex flex-col items-center gap-2 bg-white/5 rounded-xl py-3 text-gray-200 text-xs">
              <span className="text-emerald-300">{action.icon}</span>
              {action.label}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {activity.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-300">{item.icon}</div>
                <span className="text-sm text-gray-200">{item.label}</span>
              </div>
              <span className={`text-sm font-semibold ${item.positive ? 'text-emerald-300' : 'text-gray-300'}`}>{item.amount}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3">
          <span className="text-xs text-emerald-200">GST/HST set aside this quarter</span>
          <span className="text-sm font-semibold text-emerald-200">$3,140.00</span>
        </div>
      </div>
    </div>
  );
};

export default function AnkPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: <Send className="w-7 h-7" />, title: "Fast Payments", description: "Pay suppliers and contractors and get paid by customers, all from one account." },
    { icon: <CreditCard className="w-7 h-7" />, title: "Team Cards", description: "Issue physical and virtual cards with per-person limits and real-time controls." },
    { icon: <FileText className="w-7 h-7" />, title: "Invoicing", description: "Send professional invoices and see the moment they're paid." },
    { icon: <Receipt className="w-7 h-7" />, title: "Expense Capture", description: "Snap receipts and match them to transactions automatically." },
    { icon: <BarChart3 className="w-7 h-7" />, title: "Cash Flow Insights", description: "See where money is going and what's coming in before it lands." },
    { icon: <Users className="w-7 h-7" />, title: "Accountant Access", description: "Give your bookkeeper read-only access and sync to your accounting software." },
  ];

  const canada = [
    "Set aside GST/HST automatically as revenue comes in",
    "Remittance reminders so tax deadlines don't sneak up",
    "Hold and pay in Canadian and U.S. dollars",
    "Built for sole proprietors, partnerships, and incorporated businesses",
  ];

  const steps = [
    { title: "Apply online", description: "Tell us about your business. No branch visit required." },
    { title: "Verify your identity", description: "Confirm who you are and who owns the business, right from your phone." },
    { title: "Start running your business", description: "Fund your account, order cards, and send your first invoice." },
  ];

  const security = [
    { icon: <Lock className="w-6 h-6" />, title: "Encryption", description: "Data is encrypted in transit and at rest." },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Two-factor sign-in", description: "Every sign-in is protected with a second factor." },
    { icon: <Smartphone className="w-6 h-6" />, title: "Instant card controls", description: "Freeze a card or change limits in seconds." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 flex items-center justify-between">
        <AnkLogo />
        <div className="flex items-center gap-3">
          <Link href="/signin" className="text-sm font-semibold text-gray-200 hover:text-white px-4 py-2">Sign in</Link>
          <a href={WAITLIST_MAILTO} className="text-sm font-semibold bg-emerald-400 text-black px-4 py-2 rounded-lg hover:bg-emerald-300 transition-colors">Get early access</a>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(52,211,153,0.15),_transparent_55%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Built in Canada for small business
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-[1.05]">
              Your business money,
              <span className="block bg-gradient-to-r from-emerald-200 via-emerald-400 to-teal-500 bg-clip-text text-transparent">
                finally in one place.
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-xl">
              Ank is the digital business account for Canadian small business owners. Get paid, pay
              your team, manage cards, and stay tax-ready without the paperwork or the lineup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={WAITLIST_MAILTO} className="inline-flex items-center justify-center bg-emerald-400 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-300 hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/20">
                Get early access
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <Link href="/signin" className="inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300">
                Sign in
              </Link>
            </div>
          </div>
          <AppPreview />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading
          eyebrow="Everything in one account"
          title="Less admin. More business."
          subtitle="The tools small business owners actually use every day, built into the account itself."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="group bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-emerald-400/50 hover:-translate-y-1 transition-all duration-300">
              <div className="text-emerald-300 mb-5 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built for Canada */}
      <section className="bg-black/30 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-emerald-300 text-sm font-semibold tracking-[0.3em] uppercase mb-3">Made for Canada</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Tax season, without the scramble.</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Ank is designed around how Canadian businesses actually operate, from sales tax to
              cross-border customers.
            </p>
          </div>
          <ul className="space-y-4">
            {canada.map((item) => (
              <li key={item} className="flex items-start bg-white/5 border border-white/10 rounded-xl p-5 text-gray-200">
                <Check className="w-6 h-6 text-emerald-300 mr-3 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How to open */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading eyebrow="Getting started" title="Open in minutes" subtitle="Apply entirely online, from anywhere in Canada." />
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-emerald-400 text-black font-bold flex items-center justify-center mb-5">{index + 1}</div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-6 h-6 text-emerald-300" />
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Security built in from day one</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {security.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="text-emerald-300 mt-1">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 via-black to-slate-900 p-10 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-5">Be one of the first.</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Ank is launching soon. Request early access and we&apos;ll reach out when accounts open in your province.
          </p>
          <a href={WAITLIST_MAILTO} className="inline-flex items-center justify-center bg-emerald-400 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-300 transition-all duration-300">
            Get early access
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <p className="text-xs text-gray-500 leading-relaxed text-center">
          Ank is not yet available and is not accepting deposits. Features described are planned and may change
          before launch. Account availability will depend on regulatory approvals and partner arrangements.
          App screens shown are illustrative and use sample data.
        </p>
      </section>
    </div>
  );
}

"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Info, Lock, ShieldCheck } from 'lucide-react';
import AnkLogo from '../AnkLogo';

const WAITLIST_MAILTO = "mailto:josh@modevz.ca?subject=Ank%20Early%20Access";

// Draft sign-in UI. There is no account backend yet, so submitting never sends
// credentials anywhere: it clears the password and shows a pre-launch notice.
export default function AnkSignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassword("");
    setShowNotice(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(52,211,153,0.12),_transparent_60%)]"></div>
      <div className="relative max-w-md mx-auto px-4 pt-28 pb-24">
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ank
        </Link>

        <div className="flex justify-center mb-8">
          <AnkLogo size="lg" />
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-black tracking-tight text-white mb-1">Sign in</h1>
          <p className="text-sm text-gray-400 mb-8">Welcome back. Sign in to manage your business account.</p>

          {showNotice && (
            <div role="status" className="flex items-start gap-3 bg-emerald-400/10 border border-emerald-400/30 rounded-xl p-4 mb-6">
              <Info className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-100 leading-relaxed">
                Ank accounts aren&apos;t open yet, so there&apos;s nothing to sign in to.{" "}
                <a href={WAITLIST_MAILTO} className="font-semibold underline underline-offset-2">Request early access</a>{" "}
                and we&apos;ll let you know when we launch.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">Business email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbusiness.ca"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                <button type="button" onClick={() => setShowNotice(true)} className="text-sm text-emerald-300 hover:text-emerald-200">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 px-4 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-300">
              <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-black/40 accent-emerald-400" />
              Remember this device
            </label>

            <button type="submit" className="w-full bg-emerald-400 text-black font-semibold py-3 rounded-lg hover:bg-emerald-300 transition-colors">
              Sign in
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
            New to Ank?{" "}
            <a href={WAITLIST_MAILTO} className="font-semibold text-emerald-300 hover:text-emerald-200">Get early access</a>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" />Encrypted connection</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" />Two-factor protected</span>
        </div>
      </div>
    </div>
  );
}

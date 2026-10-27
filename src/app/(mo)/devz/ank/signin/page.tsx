"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Info, Lock, Mail, ShieldCheck } from 'lucide-react';
import AnkLogo from '../AnkLogo';

// Passwordless sign-in. An account holder (ANK_ACCOUNTS) gets a one-time
// code by email; anyone else is added to the launch newsletter. See
// src/lib/ankAuth.ts and /api/ank/auth/*.
type Step = "email" | "code" | "waitlist";

const inputClass =
  "w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition";

async function post(path: string, body: object) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

export default function AnkSignInPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const requestCode = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const data = await post("/api/ank/auth/start", { email });
      setStep(data.status === "waitlist" ? "waitlist" : "code");
      if (data.status === "code" && step === "code") setNotice("A new code is on its way.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await post("/api/ank/auth/verify", { code });
      // A full page load, so the account page is rendered with the new session.
      window.location.assign("/account");
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  };

  const startOver = () => {
    setStep("email");
    setCode("");
    setError(null);
    setNotice(null);
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

        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {step === "waitlist" ? (
            <div role="status" className="text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <h1 className="text-2xl font-black tracking-tight text-white mb-2">You&apos;re on the list</h1>
              <p className="text-sm text-gray-300 leading-relaxed">
                Ank isn&apos;t open to new accounts yet. We&apos;ve added <span className="font-semibold text-white">{email}</span> to
                our launch list and we&apos;ll email you as soon as accounts open.
              </p>
              <button type="button" onClick={startOver} className="mt-6 text-sm text-emerald-300 hover:text-emerald-200">
                Use a different email
              </button>
            </div>
          ) : step === "code" ? (
            <>
              <h1 className="text-2xl font-black tracking-tight text-white mb-1">Check your email</h1>
              <p className="text-sm text-gray-400 mb-6">
                We sent an 8-character sign-in code to <span className="text-white">{email}</span>. It expires in 10 minutes.
              </p>

              <form onSubmit={verifyCode} className="space-y-5">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-200 mb-2">Sign-in code</label>
                  <input
                    id="code"
                    inputMode="text"
                    autoComplete="one-time-code"
                    autoCapitalize="characters"
                    spellCheck={false}
                    required
                    autoFocus
                    maxLength={12}
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ABCD-2345"
                    className={`${inputClass} text-center text-xl tracking-[0.3em] font-mono`}
                  />
                </div>

                {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
                {notice && <p role="status" className="text-sm text-emerald-200">{notice}</p>}

                <button type="submit" disabled={busy} className="w-full bg-emerald-400 text-black font-semibold py-3 rounded-lg hover:bg-emerald-300 transition-colors disabled:opacity-60">
                  {busy ? "Checking…" : "Sign in"}
                </button>
              </form>

              <div className="mt-6 flex justify-between text-sm">
                <button type="button" onClick={startOver} className="text-gray-400 hover:text-white">Use a different email</button>
                <button type="button" onClick={() => requestCode()} disabled={busy} className="text-emerald-300 hover:text-emerald-200 disabled:opacity-60">
                  Send a new code
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black tracking-tight text-white mb-1">Sign in</h1>
              <p className="text-sm text-gray-400 mb-8">No password needed. We&apos;ll email you a one-time code.</p>

              <form onSubmit={requestCode} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">Business email</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={200}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourbusiness.ca"
                    className={inputClass}
                  />
                </div>

                {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

                <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 bg-emerald-400 text-black font-semibold py-3 rounded-lg hover:bg-emerald-300 transition-colors disabled:opacity-60">
                  <Mail className="w-4 h-4" />
                  {busy ? "Sending…" : "Email me a code"}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-start gap-3 text-sm text-gray-400">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  Ank is launching soon. If you don&apos;t have an account yet, enter your email and we&apos;ll add you to the launch list.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" />Encrypted connection</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" />Email verification</span>
        </div>
      </div>
    </div>
  );
}

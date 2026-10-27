import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CheckCircle2, Mail, User } from "lucide-react";
import { SESSION_COOKIE, readSession } from "@/lib/ankAuth";
import AnkLogo from "../AnkLogo";
import SignOutButton from "./SignOutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export default function AnkAccountPage() {
  const account = readSession(cookies().get(SESSION_COOKIE)?.value);
  // Pages on ank.modevz.ca are rewritten under /devz/ank, so "/signin" here
  // is the Ank sign-in page.
  if (!account) redirect("/signin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(52,211,153,0.12),_transparent_60%)]"></div>
      <div className="relative max-w-2xl mx-auto px-4 pt-28 pb-24">
        <div className="flex items-center justify-between mb-10">
          <AnkLogo size="md" />
          <SignOutButton />
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <p className="text-sm text-emerald-300 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Signed in
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">{account.name}</h1>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-300">
              <User className="w-4 h-4 text-gray-500" />
              <dt className="sr-only">Account</dt>
              <dd>{account.name}</dd>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Mail className="w-4 h-4 text-gray-500" />
              <dt className="sr-only">Email</dt>
              <dd className="break-all">{account.email}</dd>
            </div>
          </dl>

          <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 text-sm text-gray-300 leading-relaxed">
            Ank is in early access. Payments, cards and invoicing will appear here when accounts open.
          </div>
        </div>
      </div>
    </div>
  );
}

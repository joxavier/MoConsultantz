"use client"
import { useState } from "react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    setBusy(true);
    await fetch("/api/ank/auth/signout", { method: "POST" }).catch(() => {});
    window.location.assign("/signin");
  };

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300 hover:text-white hover:border-white/30 disabled:opacity-60"
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </button>
  );
}

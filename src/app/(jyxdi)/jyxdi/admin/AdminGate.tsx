"use client";
import { signIn, signOut } from "next-auth/react";

export default function AdminGate({ mode, email }: { mode: "signin" | "denied"; email?: string }) {
  return (
    <div className="mx-auto max-w-md px-4 pt-16 sm:px-6">
      <div className="rounded-2xl border border-[var(--jx-line)] bg-[var(--jx-surface)] p-8 text-center">
        <h1 className="jx-serif text-3xl">Store admin</h1>
        {mode === "signin" ? (
          <>
            <p className="mt-3 text-[var(--jx-muted)]">Sign in with your Google account to manage the site.</p>
            <button
              onClick={() => signIn("google", { callbackUrl: "/admin" })}
              className="mt-8 w-full rounded-full bg-[var(--jx-ink)] px-7 py-3.5 font-medium text-[var(--jx-bg)]"
            >
              Continue with Google
            </button>
          </>
        ) : (
          <>
            <p className="mt-3 text-[var(--jx-muted)]">{email} doesn&apos;t have admin access to this store.</p>
            <button onClick={() => signOut({ callbackUrl: "/admin" })} className="mt-8 w-full rounded-full border border-[var(--jx-ink)] px-7 py-3.5 font-medium">
              Use a different account
            </button>
          </>
        )}
      </div>
    </div>
  );
}

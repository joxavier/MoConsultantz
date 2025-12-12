"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center py-20">
      <h1 className="text-3xl mb-6">Sign in</h1>

      <button
        onClick={() => signIn("google")}
        className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-90"
      >
        Continue with Google
      </button>
    </div>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';

// Client side of Mo ID (src/lib/moAuth.ts): the shared sign-in for MoOS, the
// Strategic Reserve and Ank. Every component using useMoSession updates when
// any of them signs in or out.

export type HolderStatus = { balance: number; minimum: number; isHolder: boolean } | { error: string };

export type MoSessionInfo = {
  configured: boolean;
  signedIn: boolean;
  wallet?: string | null;
  email?: string | null;
  ankAccount?: string | null;
  holder?: HolderStatus | null;
};

const CHANGE_EVENT = 'mo-session-change';

export function useMoSession() {
  const [session, setSession] = useState<MoSessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/mo/session', { cache: 'no-store' });
      setSession(response.ok ? await response.json() : { configured: false, signedIn: false });
    } catch {
      setSession({ configured: false, signedIn: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => window.removeEventListener(CHANGE_EVENT, refresh);
  }, [refresh]);

  return { session, loading, refresh };
}

const announceChange = () => window.dispatchEvent(new Event(CHANGE_EVENT));

export const isHolder = (session: MoSessionInfo | null) =>
  Boolean(session?.holder && 'isHolder' in session.holder && session.holder.isHolder);

export const shortAddress = (address: string) => `${address.slice(0, 4)}…${address.slice(-4)}`;

// ---------- wallets ----------

type SolanaProvider = {
  connect: () => Promise<{ publicKey: { toString(): string } } | void>;
  publicKey?: { toString(): string } | null;
  signMessage: (message: Uint8Array, encoding?: string) => Promise<{ signature: Uint8Array } | Uint8Array>;
};

// Wallets that inject a provider into the page: Phantom, Solflare, Backpack
// and anything exposing window.solana.
function findProvider(): SolanaProvider | null {
  const w = window as any;
  return w.phantom?.solana ?? w.solflare ?? w.backpack ?? w.solana ?? null;
}

// On a phone without a wallet browser, opens this page inside Phantom's.
const phantomBrowseLink = () =>
  `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}?ref=${encodeURIComponent(window.location.origin)}`;

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...Array.from(bytes)));

async function postJson(url: string, body?: object) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

export async function signInWithWallet() {
  const provider = findProvider();
  if (!provider) {
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.location.href = phantomBrowseLink();
      return false;
    }
    throw new Error('No Solana wallet found. Install Phantom or Solflare, then try again.');
  }

  const connected = await provider.connect();
  const wallet = (connected && 'publicKey' in connected ? connected.publicKey : provider.publicKey)?.toString();
  if (!wallet) throw new Error("The wallet didn't share its address.");

  const { message } = await postJson('/api/mo/auth/wallet/challenge', { wallet });
  const signed = await provider.signMessage(new TextEncoder().encode(message), 'utf8');
  const signature = signed instanceof Uint8Array ? signed : signed.signature;
  await postJson('/api/mo/auth/wallet/verify', { signature: toBase64(signature) });
  announceChange();
  return true;
}

export async function signOutOfMo() {
  await postJson('/api/mo/auth/signout');
  announceChange();
}

// A button that runs wallet sign-in and shows any error under it.
export function WalletSignInButton({
  className = '',
  label = 'Connect wallet',
  errorClassName = 'mt-2 text-sm text-red-400',
  reloadOnSuccess = false,
  onSignedIn,
}: {
  className?: string;
  label?: string;
  errorClassName?: string;
  // For server-rendered pages that read the session themselves.
  reloadOnSuccess?: boolean;
  onSignedIn?: () => void | Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setBusy(true);
    setError(null);
    try {
      if (await signInWithWallet()) {
        if (onSignedIn) await onSignedIn();
        if (reloadOnSuccess) window.location.reload();
      }
    } catch (err: any) {
      // A wallet's "user rejected" error isn't worth showing.
      if (err?.code !== 4001) setError(err?.message || 'Sign-in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={onClick} disabled={busy} className={className}>
        {busy ? 'Check your wallet…' : label}
      </button>
      {error && (
        <p role="alert" className={errorClassName}>
          {error}
        </p>
      )}
    </div>
  );
}

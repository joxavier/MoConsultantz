'use client'
import React, { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import type { ClientsResponse } from '@/lib/clients';
import type { BaseCurrency } from '@/lib/treasury/types';

const CURRENCIES: BaseCurrency[] = ['CAD', 'USD'];

const formatMoney = (value: number, currency: BaseCurrency) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency, maximumFractionDigits: value !== 0 && Math.abs(value) < 1 ? 6 : 2 }).format(value);

// Ledger dates come from the sheet as typed; tidy the ISO forms, show the rest as-is.
const formatDate = (date: string) => {
  const month = /^(\d{4})-(\d{2})$/.exec(date);
  if (month) return new Date(+month[1], +month[2] - 1).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' });
  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (day) return new Date(+day[1], +day[2] - 1, +day[3]).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
  return date || '—';
};

const shortAddress = (address: string) => `${address.slice(0, 6)}…${address.slice(-6)}`;

// Saved per signed-in account so each user keeps their own display currency.
const currencyKey = (email: string) => `clientsCurrency:${email.toLowerCase()}`;

function readSavedCurrency(email: string): BaseCurrency | null {
  try {
    const saved = localStorage.getItem(currencyKey(email));
    return saved === 'CAD' || saved === 'USD' ? saved : null;
  } catch {
    return null;
  }
}

export default function ClientsPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<ClientsResponse | null>(null);
  const [error, setError] = useState<'forbidden' | 'unavailable' | 'failed' | null>(null);
  const [currency, setCurrency] = useState<BaseCurrency>('CAD');

  const email = session?.user?.email || '';

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/clients')
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) return setError('forbidden');
        if (response.status === 503) return setError('unavailable');
        if (!response.ok) return setError('failed');
        const payload: ClientsResponse = await response.json();
        setData(payload);
        const preferred = payload.clients.length === 1 ? payload.clients[0].preferredCurrency : 'CAD';
        setCurrency(readSavedCurrency(email) || preferred);
      })
      .catch(() => setError('failed'));
  }, [status, email]);

  const chooseCurrency = (next: BaseCurrency) => {
    setCurrency(next);
    try {
      localStorage.setItem(currencyKey(email), next);
    } catch {}
  };

  const convert = (usd: number) => (currency === 'CAD' && data ? usd * data.usdCadRate : usd);

  const shell = (children: React.ReactNode) => (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-24">
      <div className="max-w-4xl mx-auto">{children}</div>
    </main>
  );

  if (status === 'loading') return shell(<p className="text-center text-gray-500">Loading…</p>);

  if (status === 'unauthenticated') {
    return shell(
      <div className="max-w-md mx-auto text-center border border-gray-200 dark:border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-3">Client Portfolio</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Sign in with the Google account linked to your portfolio.</p>
        <button
          onClick={() => signIn('google')}
          className="w-full px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-lg font-semibold hover:opacity-90"
        >
          Continue with Google
        </button>
        <p className="text-xs text-gray-500 mt-6">
          For your security, turn on 2-Step Verification for your Google account.
        </p>
      </div>
    );
  }

  if (error) {
    return shell(
      <div className="max-w-md mx-auto text-center border border-gray-200 dark:border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-3">{error === 'forbidden' ? 'No portfolio found' : 'Something went wrong'}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error === 'forbidden'
            ? `${email} isn't linked to a client portfolio.`
            : 'We couldn’t load your portfolio. Please try again shortly.'}
        </p>
        <button onClick={() => signOut()} className="text-sm font-semibold underline underline-offset-2">Sign out</button>
      </div>
    );
  }

  if (!data) return shell(<p className="text-center text-gray-500">Loading portfolio…</p>);

  return shell(
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{data.isManager ? 'Clients' : 'Your Portfolio'}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Signed in as {email} · <button onClick={() => signOut()} className="underline underline-offset-2">Sign out</button>
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-white/10 p-1 self-start" role="group" aria-label="Display currency">
          {CURRENCIES.map((option) => (
            <button
              key={option}
              onClick={() => chooseCurrency(option)}
              aria-pressed={currency === option}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold ${currency === option ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-gray-500'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {data.clients.map((client) => (
          <section key={client.id} className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5">
              <div>
                <h2 className="text-xl font-bold">{client.name}</h2>
                {client.walletAddresses?.map((wallet) => (
                  <a
                    key={wallet}
                    href={`https://solscan.io/account/${wallet}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-gray-500 underline underline-offset-2 font-mono"
                  >
                    {shortAddress(wallet)}
                  </a>
                ))}
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Current value</div>
                <div className="text-2xl font-bold">{formatMoney(convert(client.totalUsd), currency)}</div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Holding</th>
                    <th className="px-6 py-3 font-medium">Source</th>
                    <th className="px-6 py-3 font-medium text-right">Price</th>
                    <th className="px-6 py-3 font-medium text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {client.holdings.map((holding) => (
                    <tr key={`${holding.source}-${holding.wallet || ''}-${holding.mint || holding.label}`} className="border-t border-gray-200 dark:border-white/10">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold">{holding.quantity.toLocaleString('en-CA', { maximumFractionDigits: 6 })} {holding.label}</div>
                        <div className="text-xs text-gray-500">
                          {holding.symbol}
                          {holding.wallet && (client.walletAddresses?.length || 0) > 1 && <span className="font-mono"> · {shortAddress(holding.wallet)}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{holding.source === 'ledger' ? 'Ledger' : 'On-chain'}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {holding.priceUsd === null ? '—' : formatMoney(convert(holding.priceUsd), currency)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap font-semibold">
                        {holding.valueUsd === null
                          ? <span className="text-gray-500 font-normal" title={holding.priceError}>Price unavailable</span>
                          : formatMoney(convert(holding.valueUsd), currency)}
                      </td>
                    </tr>
                  ))}
                  {!client.holdings.length && !client.walletError && (
                    <tr className="border-t border-gray-200 dark:border-white/10">
                      <td colSpan={4} className="px-6 py-6 text-center text-gray-500">No holdings yet.</td>
                    </tr>
                  )}
                  {client.walletError && (
                    <tr className="border-t border-gray-200 dark:border-white/10">
                      <td colSpan={4} className="px-6 py-6 text-center text-gray-500">{client.walletError}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {client.transactions.length > 0 && (
              <details className="border-t border-gray-200 dark:border-white/10">
                <summary className="px-6 py-4 text-sm font-semibold cursor-pointer select-none">
                  Transactions ({client.transactions.length})
                </summary>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-gray-500">
                      <tr>
                        <th className="px-6 py-3 font-medium">Date</th>
                        <th className="px-6 py-3 font-medium">Type</th>
                        <th className="px-6 py-3 font-medium text-right">Amount</th>
                        <th className="px-6 py-3 font-medium">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.transactions.map((entry, index) => (
                        <tr key={index} className="border-t border-gray-200 dark:border-white/10">
                          <td className="px-6 py-3 whitespace-nowrap">{formatDate(entry.date)}</td>
                          <td className="px-6 py-3 whitespace-nowrap">{entry.type}</td>
                          <td className={`px-6 py-3 text-right whitespace-nowrap font-semibold ${entry.quantity > 0 ? 'text-emerald-600 dark:text-emerald-400' : entry.quantity < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                            {entry.quantity > 0 ? '+' : ''}{entry.quantity.toLocaleString('en-CA', { maximumFractionDigits: 6 })} {entry.token}
                          </td>
                          <td className="px-6 py-3 text-gray-500">{entry.note || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
          </section>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-6">
        Values use live on-chain prices from Solana liquidity pools (as of {new Date(data.pricedAt).toLocaleString('en-CA')}).
        {currency === 'CAD' && (data.usdCadRateIsFallback
          ? ` The live USD/CAD rate is unavailable, so a fallback rate of ${data.usdCadRate.toFixed(2)} is used.`
          : ` Converted at USD/CAD ${data.usdCadRate.toFixed(4)}.`)}
      </p>
    </>
  );
}

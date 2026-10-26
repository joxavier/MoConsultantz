"use client";
import Link from "next/link";
import { useState } from "react";
import { formatArtworkPrice, type Artwork } from "@/lib/jyxdi";

// Price, option pickers (Size, Style, ...) and the buy/request button for a
// product page. The chosen options go along with the request so the artist
// knows exactly which version was asked for.
export default function ProductBuy({ artwork }: { artwork: Artwork }) {
  const options = artwork.options || [];
  const [chosen, setChosen] = useState<Record<string, string>>(() =>
    Object.fromEntries(options.map((option) => [option.name, option.values[0]]))
  );

  const summary = options.map((option) => chosen[option.name]).join(", ");
  const requestLabel = summary ? `${artwork.title} (${summary})` : artwork.title;

  return (
    <>
      <p className="mt-3 text-2xl tabular-nums">{formatArtworkPrice(artwork)} <span className="text-base text-[var(--jx-muted)]">CAD</span></p>
      {artwork.details && <p className="mt-2 text-sm text-[var(--jx-muted)]">{artwork.details}</p>}

      {options.map((option) => (
        <fieldset key={option.name} className="mt-6">
          <legend className="text-sm font-medium">
            {option.name}: <span className="font-normal text-[var(--jx-muted)]">{chosen[option.name]}</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {option.values.map((value) => {
              const selected = chosen[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setChosen({ ...chosen, [option.name]: value })}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    selected ? "border-[var(--jx-ink)] bg-[var(--jx-ink)] text-[var(--jx-bg)]" : "border-[var(--jx-line)] hover:border-[var(--jx-ink)]"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="mt-8">
        {artwork.sold ? (
          <Link href="/commissions" className="block rounded-full border border-[var(--jx-ink)] px-7 py-3.5 text-center font-medium sm:inline-block">
            Sold. Commission something similar
          </Link>
        ) : artwork.checkoutUrl ? (
          <a href={artwork.checkoutUrl} className="block rounded-full bg-[var(--jx-ink)] px-7 py-3.5 text-center font-medium text-[var(--jx-bg)] sm:inline-block">
            Buy now
          </a>
        ) : (
          <Link
            href={`/commissions?piece=${encodeURIComponent(requestLabel)}`}
            className="block rounded-full bg-[var(--jx-ink)] px-7 py-3.5 text-center font-medium text-[var(--jx-bg)] sm:inline-block"
          >
            Request this piece
          </Link>
        )}
        {options.length > 0 && !artwork.sold && (
          <p className="mt-3 text-sm text-[var(--jx-muted)]">The price shown is the starting price; the final price depends on the options you choose.</p>
        )}
      </div>
    </>
  );
}

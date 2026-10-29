'use client';

import Link from "next/link";
import { useState } from "react";
import { ARTWORK_TYPE_LABELS, SITE, formatArtworkPrice, type Artwork, type ArtworkType } from "@/lib/jyxdi";

export function ArtCard({ artwork }: { artwork: Artwork }) {
  return (
    <Link href={`/art/${artwork.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--jx-accent-soft)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artwork.image}
          alt={artwork.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {artwork.sold && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--jx-ink)] px-3 py-1 text-xs font-medium text-[var(--jx-bg)]">Sold</span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{artwork.title}</p>
          <p className="text-sm text-[var(--jx-muted)]">{ARTWORK_TYPE_LABELS[artwork.type]}</p>
        </div>
        <p className="shrink-0 text-sm tabular-nums">{formatArtworkPrice(artwork)}</p>
      </div>
    </Link>
  );
}

export function EmptyCatalog() {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--jx-line)] px-6 py-14 text-center">
      <p className="jx-serif text-2xl">New pieces are on their way</p>
      <p className="mx-auto mt-2 max-w-md text-[var(--jx-muted)]">
        The catalog is being moved over. In the meantime, see the latest work on Instagram or request a commission.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--jx-ink)] px-6 py-3 font-medium">
          View Instagram
        </a>
        <Link href="/commissions" className="rounded-full bg-[var(--jx-ink)] px-6 py-3 font-medium text-[var(--jx-bg)]">
          Request a commission
        </Link>
      </div>
    </div>
  );
}

const FILTERS: { key: "all" | ArtworkType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "digital", label: ARTWORK_TYPE_LABELS.digital },
  { key: "canvas", label: ARTWORK_TYPE_LABELS.canvas },
];

export default function ArtGrid({ artworks }: { artworks: Artwork[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  if (!artworks.length) return <EmptyCatalog />;

  const shown = filter === "all" ? artworks : artworks.filter((artwork) => artwork.type === filter);

  return (
    <>
      <div className="mb-8 flex gap-2" role="group" aria-label="Filter artwork">
        {FILTERS.map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={filter === option.key}
            onClick={() => setFilter(option.key)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              filter === option.key ? "bg-[var(--jx-ink)] text-[var(--jx-bg)]" : "border border-[var(--jx-line)] text-[var(--jx-muted)]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3">
          {shown.map((artwork) => (
            <ArtCard key={artwork.slug} artwork={artwork} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-[var(--jx-muted)]">No {filter} pieces right now.</p>
      )}
    </>
  );
}

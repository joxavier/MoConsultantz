import { SITE } from "@/lib/jyxdi";
import type { OpenSeaItem } from "@/lib/jyxdiOpensea";

// The digital side of the catalog: Spirit Gates NFTs on OpenSea.
export default function OpenSeaGallery({ items }: { items: OpenSeaItem[] }) {
  return (
    <section className="mt-20" aria-labelledby="spirit-gates">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--jx-accent)]">Digital collectibles</p>
          <h2 id="spirit-gates" className="jx-serif mt-2 text-3xl sm:text-4xl">Spirit Gates on OpenSea</h2>
          <p className="mt-2 max-w-xl text-[var(--jx-muted)]">
            Jyxdi&apos;s NFT collection. Collect a piece on OpenSea to own it on-chain.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={SITE.opensea.collection} target="_blank" rel="noopener" className="rounded-full bg-[var(--jx-ink)] px-6 py-3 text-center font-medium text-[var(--jx-bg)]">
            View the collection
          </a>
          <a href={SITE.opensea.profile} target="_blank" rel="noopener" className="rounded-full border border-[var(--jx-ink)] px-6 py-3 text-center font-medium">
            Artist profile
          </a>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {items.map((item) => (
            <a key={item.url} href={item.url} target="_blank" rel="noopener" className="group block">
              <div className="aspect-square overflow-hidden rounded-2xl bg-[var(--jx-blue-soft)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <p className="mt-3 truncate font-medium">{item.name}</p>
              <p className="text-sm text-[var(--jx-muted)]">View on OpenSea ↗</p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

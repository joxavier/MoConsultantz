import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTWORK_TYPE_LABELS, artworkJsonLd, jsonLdScript } from "@/lib/jyxdi";
import { getStoreArtwork, getStoreSettings } from "@/lib/jyxdiStore";
import PaymentOptions from "../../_components/PaymentOptions";
import ProductBuy from "../../_components/ProductBuy";

// Products are added in /admin, so pages render on demand and refresh at most
// once a minute (saving in /admin refreshes them immediately).
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artwork = await getStoreArtwork(params.slug);
  if (!artwork) return {};
  return {
    title: artwork.title,
    description: artwork.description,
    alternates: { canonical: `/art/${artwork.slug}` },
    openGraph: { title: artwork.title, description: artwork.description, images: [{ url: artwork.image, alt: artwork.title }] },
  };
}

export default async function ArtworkPage({ params }: { params: { slug: string } }) {
  const [artwork, settings] = await Promise.all([getStoreArtwork(params.slug), getStoreSettings()]);
  if (!artwork) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(artworkJsonLd(artwork)) }} />
      <Link href="/art" className="text-sm text-[var(--jx-muted)]">
        ← Art Catalog
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="overflow-hidden rounded-2xl bg-[var(--jx-accent-soft)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={artwork.image} alt={artwork.title} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--jx-accent)]">{ARTWORK_TYPE_LABELS[artwork.type]}</p>
          <h1 className="jx-serif mt-2 text-4xl">{artwork.title}</h1>
          <ProductBuy artwork={artwork} />
          {artwork.description && <p className="mt-8 whitespace-pre-line leading-relaxed">{artwork.description}</p>}
          {!artwork.sold && !artwork.checkoutUrl && <PaymentOptions payments={settings} pieceTitle={artwork.title} />}
        </div>
      </div>
    </div>
  );
}

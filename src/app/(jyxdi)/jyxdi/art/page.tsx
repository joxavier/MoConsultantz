import type { Metadata } from "next";
import { SITE } from "@/lib/jyxdi";
import { getStoreArtworks } from "@/lib/jyxdiStore";
import { getSpiritGatesNfts } from "@/lib/jyxdiOpensea";
import ArtGrid from "../_components/ArtGrid";
import OpenSeaGallery from "../_components/OpenSeaGallery";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Art Catalog",
  description: `Shop digital artwork and original canvas paintings by ${SITE.shortName}.`,
  alternates: { canonical: "/art" },
};

export default async function ArtCatalogPage() {
  const [artworks, nfts] = await Promise.all([getStoreArtworks(), getSpiritGatesNfts()]);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="jx-serif text-4xl sm:text-5xl">Art Catalog</h1>
      <p className="mt-3 max-w-xl text-[var(--jx-muted)]">
        Digital pieces and original paintings on canvas. Looking for something made just for you? Commissions are open.
      </p>
      <div className="mt-10">
        <ArtGrid artworks={artworks} />
      </div>
      <OpenSeaGallery items={nfts} />
    </div>
  );
}

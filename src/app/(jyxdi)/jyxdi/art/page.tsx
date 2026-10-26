import type { Metadata } from "next";
import { SITE } from "@/lib/jyxdi";
import ArtGrid from "../_components/ArtGrid";

export const metadata: Metadata = {
  title: "Art Catalog",
  description: `Shop digital artwork and original canvas paintings by ${SITE.shortName}.`,
  alternates: { canonical: "/art" },
};

export default function ArtCatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="jx-serif text-4xl sm:text-5xl">Art Catalog</h1>
      <p className="mt-3 max-w-xl text-[var(--jx-muted)]">
        Digital pieces and original paintings on canvas. Looking for something made just for you? Commissions are open.
      </p>
      <div className="mt-10">
        <ArtGrid artworks={SITE.artworks} />
      </div>
    </div>
  );
}

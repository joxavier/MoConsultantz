import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/jyxdi";
import { getStoreSettings } from "@/lib/jyxdiStore";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Bio",
  description: `About ${SITE.shortName}, the artist behind ${SITE.brand}: digital art, canvas paintings and live event painting.`,
  alternates: { canonical: "/bio" },
};

export default async function BioPage() {
  const { bio } = await getStoreSettings();
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="jx-serif text-4xl sm:text-5xl">Biography &amp; Achievements</h1>
      <div className="mt-6 space-y-5 text-lg leading-relaxed">
        {bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--jx-ink)] px-7 py-3.5 text-center font-medium">
          Follow on Instagram
        </a>
        <Link href="/commissions" className="rounded-full bg-[var(--jx-ink)] px-7 py-3.5 text-center font-medium text-[var(--jx-bg)]">
          Work with me
        </Link>
      </div>
    </div>
  );
}

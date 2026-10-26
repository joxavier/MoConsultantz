import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/jyxdi";
import { ArtCard, EmptyCatalog } from "./_components/ArtGrid";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const PATHS = [
  { href: "/art", title: "Shop the catalog", text: "Digital pieces and original paintings on canvas, ready to take home." },
  { href: "/commissions", title: "Commission a piece", text: "A custom artwork made around your idea, your colours and your space." },
  { href: "/live-painting", title: "Book live painting", text: "Your wedding, birthday or event painted on canvas as it happens." },
];

export default function JyxdiHome() {
  const featured = SITE.artworks.filter((artwork) => !artwork.sold).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(40% 50% at 15% 20%, var(--jx-accent-soft), transparent 70%), radial-gradient(35% 45% at 85% 30%, #e3e8d9, transparent 70%), radial-gradient(45% 40% at 60% 90%, #f3e1d2, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--jx-accent)]">Digital + canvas artwork</p>
          <h1 className="jx-serif mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl">{SITE.brand}</h1>
          <p className="mt-5 max-w-xl text-lg text-[var(--jx-muted)]">{SITE.tagline}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/art" className="rounded-full bg-[var(--jx-ink)] px-7 py-3.5 text-center font-medium text-[var(--jx-bg)]">
              Shop the art
            </Link>
            <Link href="/live-painting" className="rounded-full border border-[var(--jx-ink)] px-7 py-3.5 text-center font-medium">
              Book live painting
            </Link>
          </div>
        </div>
      </section>

      {/* Three ways in */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {PATHS.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="rounded-2xl border border-[var(--jx-line)] bg-[var(--jx-surface)] p-6 transition hover:border-[var(--jx-accent)]"
            >
              <h2 className="jx-serif text-xl">{path.title}</h2>
              <p className="mt-2 text-sm text-[var(--jx-muted)]">{path.text}</p>
              <span className="mt-4 inline-block text-sm font-medium text-[var(--jx-accent)]">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured work */}
      <section className="mx-auto mt-16 max-w-6xl px-4 sm:mt-24 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="jx-serif text-3xl">Featured work</h2>
          {featured.length > 0 && (
            <Link href="/art" className="text-sm font-medium text-[var(--jx-accent)]">
              See all →
            </Link>
          )}
        </div>
        {featured.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3">
            {featured.map((artwork) => (
              <ArtCard key={artwork.slug} artwork={artwork} />
            ))}
          </div>
        ) : (
          <EmptyCatalog />
        )}
      </section>

      {/* Live painting */}
      <section className="mx-auto mt-16 max-w-6xl px-4 sm:mt-24 sm:px-6">
        <div className="rounded-3xl bg-[var(--jx-ink)] px-6 py-12 text-[var(--jx-bg)] sm:px-12 sm:py-16">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--jx-accent-soft)]">Live paint</p>
          <h2 className="jx-serif mt-3 max-w-2xl text-3xl sm:text-4xl">A painting of your day, made while it happens</h2>
          <p className="mt-4 max-w-xl text-[var(--jx-line)]">
            For weddings, birthdays and celebrations: a live painter on site, an original canvas to keep, and a moment your guests can watch come together.
          </p>
          <Link href="/live-painting" className="mt-8 inline-block rounded-full bg-[var(--jx-bg)] px-7 py-3.5 font-medium text-[var(--jx-ink)]">
            Check availability
          </Link>
        </div>
      </section>
    </>
  );
}

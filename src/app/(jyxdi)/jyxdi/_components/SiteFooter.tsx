import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/jyxdi";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--jx-line)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="jx-serif text-lg font-semibold">{SITE.brand}</p>
          <p className="mt-2 text-sm text-[var(--jx-muted)]">{SITE.tagline}</p>
        </div>
        <ul className="space-y-2 text-sm">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-[var(--jx-muted)] hover:text-[var(--jx-ink)]">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="space-y-2 text-sm">
          <a href={`mailto:${SITE.email}`} className="block text-[var(--jx-muted)] hover:text-[var(--jx-ink)]">
            {SITE.email}
          </a>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="block text-[var(--jx-muted)] hover:text-[var(--jx-ink)]">
            Instagram @{SITE.shortName.toLowerCase()}
          </a>
          <a href={SITE.opensea.collection} target="_blank" rel="noopener" className="block text-[var(--jx-muted)] hover:text-[var(--jx-ink)]">
            Spirit Gates on OpenSea
          </a>
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-[var(--jx-muted)]">
        © {new Date().getFullYear()} {SITE.brand}
      </p>
    </footer>
  );
}

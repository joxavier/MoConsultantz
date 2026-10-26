'use client';

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/jyxdi";

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--jx-line)] bg-[var(--jx-bg)]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6" aria-label="Main">
        <Link href="/" className="jx-serif text-xl font-semibold tracking-tight" onClick={() => setOpen(false)}>
          {SITE.brand}
        </Link>

        <ul className="hidden items-center gap-7 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-[var(--jx-muted)] transition-colors hover:text-[var(--jx-ink)]">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="rounded-full border border-[var(--jx-line)] px-4 py-2 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="jx-mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <ul id="jx-mobile-menu" className="border-t border-[var(--jx-line)] px-4 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="block py-3 text-base" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

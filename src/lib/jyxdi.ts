import site from "@/data/jyxdi.json";

// Art by Jyxdi: a client storefront served at jyxdi.modevz.ca (see the
// "jyxdi" host rewrite in src/middleware.ts). Content lives in
// src/data/jyxdi.json; pages live in src/app/(jyxdi)/jyxdi.

export type ArtworkType = "digital" | "canvas";

export type Artwork = {
  // Keep the old Shopify product handle as the slug so /products/<handle>
  // links redirect straight to the new page.
  slug: string;
  title: string;
  type: ArtworkType;
  price: number;
  description: string;
  image: string;
  // e.g. "24 x 36 in, acrylic on canvas" or "4000 x 5000 px PNG"
  details?: string;
  // Payment link (e.g. a Stripe Payment Link). Without one, the piece shows
  // a "Request this piece" button that opens the commission form instead.
  checkoutUrl?: string;
  sold?: boolean;
};

export type Location = {
  city: string | null;
  region: string | null;
  country: string | null;
  serviceArea: string[];
};

export const SITE = site as Omit<typeof site, "artworks" | "location"> & { artworks: Artwork[]; location: Location };

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/art", label: "Art Catalog" },
  { href: "/commissions", label: "Commissions" },
  { href: "/live-painting", label: "Live Paint" },
  { href: "/bio", label: "Bio" },
];

export const ARTWORK_TYPE_LABELS: Record<ArtworkType, string> = {
  digital: "Digital",
  canvas: "Canvas",
};

export function getArtwork(slug: string) {
  return SITE.artworks.find((artwork) => artwork.slug === slug);
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: SITE.currency }).format(amount);
}

export const absoluteUrl = (path: string) => `${SITE.siteUrl}${path === "/" ? "" : path}`;

// Location fields are optional until the client confirms them, so structured
// data only claims a place when one has actually been set.
function postalAddress() {
  const { city, region, country } = SITE.location;
  if (!city && !region && !country) return undefined;
  return {
    "@type": "PostalAddress",
    ...(city && { addressLocality: city }),
    ...(region && { addressRegion: region }),
    ...(country && { addressCountry: country }),
  };
}

function areaServed() {
  const areas = SITE.location.serviceArea.length ? SITE.location.serviceArea : [SITE.location.city].filter(Boolean);
  return areas.length ? areas.map((name) => ({ "@type": "Place", name })) : undefined;
}

export const ORGANIZATION_ID = `${SITE.siteUrl}/#organization`;

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE.brand,
        url: SITE.siteUrl,
        email: SITE.email,
        description: SITE.description,
        sameAs: [SITE.instagram],
        address: postalAddress(),
        areaServed: areaServed(),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.siteUrl}/#website`,
        url: SITE.siteUrl,
        name: SITE.brand,
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: "en-CA",
      },
    ],
  };
}

export function livePaintingJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Live event painting",
        serviceType: "Live painting for weddings, birthdays and events",
        provider: { "@id": ORGANIZATION_ID },
        areaServed: areaServed(),
        url: absoluteUrl("/live-painting"),
        description:
          "A live painter at your wedding, birthday or event, creating an original canvas of the day while guests watch.",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export function artworkJsonLd(artwork: Artwork) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: artwork.title,
    description: artwork.description,
    image: artwork.image.startsWith("http") ? artwork.image : absoluteUrl(artwork.image),
    url: absoluteUrl(`/art/${artwork.slug}`),
    category: ARTWORK_TYPE_LABELS[artwork.type],
    brand: { "@id": ORGANIZATION_ID },
    offers: {
      "@type": "Offer",
      price: artwork.price,
      priceCurrency: SITE.currency,
      availability: artwork.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: absoluteUrl(`/art/${artwork.slug}`),
    },
  };
}

// Serialise JSON-LD for a <script> tag without letting "</script>" in any
// value close the tag early.
export const jsonLdScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

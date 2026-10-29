import { SITE, absoluteUrl, stripLinks } from "@/lib/jyxdi";

// Served as jyxdi.modevz.ca/llms.txt (rewritten in src/middleware.ts): a
// plain-text summary for AI assistants and generative search.
export function GET() {
  const { city, region, country, serviceArea } = SITE.location;
  const place = [city, region, country].filter(Boolean).join(", ");
  const areas = serviceArea.length ? serviceArea.join(", ") : place;

  const body = `# ${SITE.brand}

${SITE.description}
${place ? `\nBased in ${place}.` : ""}${areas ? `\nLive painting available in: ${areas}.` : ""}

## Pages

- ${absoluteUrl("/")} — Home: digital art, canvas paintings, commissions and live event painting.
- ${absoluteUrl("/art")} — Art Catalog: digital artwork and original canvas paintings for sale.
- ${absoluteUrl("/commissions")} — Commissions: request a custom digital or canvas piece.
- ${absoluteUrl("/live-painting")} — Live Paint: book a live painter for weddings, birthdays and events.
- ${absoluteUrl("/bio")} — About the artist.

## About the artist

${SITE.bio.map(stripLinks).join("\n\n")}

## Links

- Spirit Gates NFT collection: ${SITE.opensea.collection}
- OpenSea profile: ${SITE.opensea.profile}
- Metaparlour: https://metaparlour.io
- Michael B. Jordan: https://en.wikipedia.org/wiki/Michael_B._Jordan
- OVO40: https://www.instagram.com/ovo40/

## Booking and contact

- Live painting and commission requests: use the forms at ${absoluteUrl("/live-painting")} and ${absoluteUrl("/commissions")}.
- Email: ${SITE.email}
- Instagram: ${SITE.instagram}
- OpenSea: ${SITE.opensea.profile}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

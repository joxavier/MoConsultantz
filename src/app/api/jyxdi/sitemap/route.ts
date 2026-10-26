import { SITE, absoluteUrl } from "@/lib/jyxdi";

// Served as jyxdi.modevz.ca/sitemap.xml (rewritten in src/middleware.ts).
const PAGES = [
  { path: "/", priority: 1, changefreq: "weekly" },
  { path: "/art", priority: 0.9, changefreq: "weekly" },
  { path: "/live-painting", priority: 0.9, changefreq: "monthly" },
  { path: "/commissions", priority: 0.8, changefreq: "monthly" },
  { path: "/bio", priority: 0.6, changefreq: "yearly" },
];

export function GET() {
  const urls = [
    ...PAGES,
    ...SITE.artworks.map((artwork) => ({ path: `/art/${artwork.slug}`, priority: 0.7, changefreq: "monthly" })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url><loc>${absoluteUrl(url.path)}</loc><changefreq>${url.changefreq}</changefreq><priority>${url.priority}</priority></url>`)
  .join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

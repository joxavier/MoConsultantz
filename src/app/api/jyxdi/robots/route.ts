import { SITE } from "@/lib/jyxdi";

// Served as jyxdi.modevz.ca/robots.txt (rewritten in src/middleware.ts).
// AI search crawlers are allowed explicitly so the site can be cited.
export function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /api/

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${SITE.siteUrl}/sitemap.xml
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

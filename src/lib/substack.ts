import config from "@/data/substack.json";

// Substack posts in the Vibes feed (/feed). Publications listed in
// src/data/substack.json are read from their RSS feeds by /api/feed/substack;
// "pinned" posts are added by hand (e.g. to credit who shared them) and show
// even when a feed can't be fetched. Cards show the title, the post's own
// subtitle and a credit, and link to the original — the full text stays on
// Substack.

export type SharedBy = { name: string; url?: string };

export type SubstackPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  externalLink: string;
  author: string;
  date: string;
  tags: string[];
  imageUrl?: string;
  readTime?: string;
  sharedBy?: SharedBy;
};

type Publication = (typeof config.publications)[number];
type Pinned = (typeof config.pinned)[number] & { imageUrl?: string };

export const PUBLICATIONS: Publication[] = config.publications;

const publicationById = (id: string) => PUBLICATIONS.find((publication) => publication.id === id);

const authorLabel = (publication: Publication | undefined, fallback?: string) =>
  publication ? `${publication.name}${publication.handle ? ` (@${publication.handle})` : ""}` : fallback || "Substack";

// Substack serves the same post at several addresses (the publication's
// substack.com domain, a custom domain, open.substack.com/pub/<name>/p/...),
// so posts are matched on their /p/<slug>.
export function slugFromUrl(url: string) {
  return url.match(/\/p\/([^/?#]+)/)?.[1] ?? url;
}

const postKey = (publicationId: string, url: string) => `${publicationId}:${slugFromUrl(url)}`;

export function pinnedPosts(): SubstackPost[] {
  return (config.pinned as Pinned[]).map((pin) => ({
    id: `substack-${postKey(pin.publication, pin.url)}`,
    title: pin.title,
    excerpt: pin.excerpt,
    content: "",
    externalLink: pin.url,
    author: authorLabel(publicationById(pin.publication)),
    date: pin.date,
    tags: pin.tags,
    imageUrl: pin.imageUrl,
    sharedBy: pin.sharedBy,
  }));
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === "#") {
      const code = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function tagValue(item: string, tag: string) {
  const match = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  if (!match) return "";
  const raw = match[1].trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return cdata ? cdata[1] : decodeEntities(raw);
}

const stripHtml = (html: string) => decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}

// Parses a Substack RSS feed into feed cards. Only the subtitle is kept as
// the excerpt; the full post body is used just to estimate reading time.
export function parseSubstackRss(xml: string, publication: Publication): SubstackPost[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
  return items.slice(0, publication.limit).flatMap((item) => {
    const link = tagValue(item, "link");
    const title = stripHtml(tagValue(item, "title"));
    if (!link || !title) return [];

    const published = new Date(tagValue(item, "pubDate"));
    const words = stripHtml(tagValue(item, "content:encoded")).split(" ").filter(Boolean).length;
    const image = item.match(/<enclosure[^>]*url="([^"]+)"/i)?.[1];

    return [
      {
        id: `substack-${postKey(publication.id, link)}`,
        title,
        excerpt: truncate(stripHtml(tagValue(item, "description")), 280),
        content: "",
        externalLink: link,
        author: authorLabel(publication, stripHtml(tagValue(item, "dc:creator"))),
        date: Number.isNaN(published.getTime()) ? new Date().toISOString() : published.toISOString(),
        tags: publication.tags,
        imageUrl: image ? decodeEntities(image) : undefined,
        readTime: words ? `${Math.max(1, Math.round(words / 230))} min read` : undefined,
      },
    ];
  });
}

// Combines pinned posts with posts read from the feeds. When both have the
// same post, the pinned title, excerpt, tags and credit are kept, and the
// feed fills in the real publish date, cover image and reading time.
export function mergeSubstackPosts(pinned: SubstackPost[], fetched: SubstackPost[]) {
  const byId = new Map(fetched.map((post) => [post.id, post]));
  const merged = pinned.map((pin) => {
    const fromFeed = byId.get(pin.id);
    byId.delete(pin.id);
    return fromFeed
      ? { ...pin, date: fromFeed.date, imageUrl: pin.imageUrl ?? fromFeed.imageUrl, readTime: pin.readTime ?? fromFeed.readTime }
      : pin;
  });
  return [...merged, ...Array.from(byId.values())];
}

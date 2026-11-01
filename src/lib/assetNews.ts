import articlesData from "@/app/(mo)/feed/articles.json";
import type { SubstackPost } from "@/lib/substack";

// Links Vibes articles (/feed, including Substack posts) to Strategic Reserve
// assets. An article is related to an asset when it names the asset (e.g.
// "Bitcoin", "Canopy Growth") or its ticker in capitals (e.g. "SOL",
// "$SNAP"). An article can also list its assets explicitly with
// "assets": ["BTC", ...], and an asset can add search terms with
// "newsKeywords" in treasuryConfig.json.

export type NewsItem = {
  id: string;
  title: string;
  excerpt?: string;
  href: string;
  external: boolean;
  source: string;
  date: string;
  tags: string[];
  assets?: string[];
  // Everything matching looks at: title, excerpt, tags and body text.
  text: string;
};

type MatchableAsset = { symbol: string; name: string; kind: string; newsKeywords?: string[] };

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ");

type LocalArticle = {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  externalLink?: string;
  author: string;
  date: string;
  tags: string[];
  assets?: string[];
};

export function localNews(): NewsItem[] {
  return (articlesData as LocalArticle[]).map((article) => ({
    id: `feed-${article.id}`,
    title: article.title,
    excerpt: article.excerpt,
    href: article.externalLink || `/feed/${article.id}`,
    external: Boolean(article.externalLink),
    source: article.author,
    date: article.date,
    tags: article.tags,
    assets: article.assets,
    text: [article.title, article.excerpt, article.tags.join(" "), stripHtml(article.content || "")].join(" \n "),
  }));
}

export function substackNews(posts: (SubstackPost & { assets?: string[] })[]): NewsItem[] {
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    href: post.externalLink,
    external: true,
    source: post.author,
    date: post.date,
    tags: post.tags,
    assets: post.assets,
    text: [post.title, post.excerpt, post.tags.join(" ")].join(" \n "),
  }));
}

const CORPORATE_SUFFIX = /\s*\b(Corp\.?|Corporation|Inc\.?|Ltd\.?|Limited|LLC|plc)$/i;

// Search terms for an asset: its name (without "Corp.", "(…)" and the like)
// and, for traded assets, its ticker without an exchange suffix.
export function assetTerms(asset: MatchableAsset) {
  const names = new Set<string>(asset.newsKeywords ?? []);
  const tickers = new Set<string>();

  if (asset.symbol === "MoCoin") {
    names.add("MoCoin");
  } else if (asset.kind === "market") {
    const name = asset.name.replace(/\(.*?\)/g, "").replace(CORPORATE_SUFFIX, "").trim();
    if (name) names.add(name);
  }
  if (asset.kind === "market") tickers.add(asset.symbol.replace(/\.[A-Z]+$/, ""));

  return { names: Array.from(names), tickers: Array.from(tickers) };
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Whole-word, case-sensitive: "Snap" or "SNAP" match, "snapshot" and "snap"
// in a sentence don't.
function mentions(text: string, term: string) {
  return new RegExp(`(^|[^A-Za-z0-9])\\$?${escapeRegex(term)}(?=$|[^A-Za-z0-9])`).test(text);
}

export function relatedNews(items: NewsItem[], asset: MatchableAsset) {
  const { names, tickers } = assetTerms(asset);
  return items
    .filter((item) =>
      item.assets?.length
        ? item.assets.includes(asset.symbol)
        : names.some((name) => mentions(item.text, name)) || tickers.some((ticker) => mentions(item.text, ticker)),
    )
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

// News for every asset, keyed by symbol.
export function newsByAsset(items: NewsItem[], assets: MatchableAsset[]) {
  return Object.fromEntries(assets.map((asset) => [asset.symbol, relatedNews(items, asset)]));
}

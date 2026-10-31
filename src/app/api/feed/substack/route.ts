import { NextResponse } from "next/server";
import { PUBLICATIONS, mergeSubstackPosts, parseSubstackRss, pinnedPosts, type SubstackPost } from "@/lib/substack";

// Substack posts for the Vibes feed: every publication in
// src/data/substack.json, merged with the pinned posts. Feeds are cached
// for an hour; a feed that fails is skipped so the rest still show. A
// publication marked "pinnedOnly" shows just its pinned posts: its feed is
// still read so those cards get the real cover image, date and reading time.
export const revalidate = 3600;

async function fetchPublication(publication: (typeof PUBLICATIONS)[number]): Promise<SubstackPost[]> {
  try {
    const response = await fetch(publication.feedUrl, {
      headers: { Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8" },
      next: { revalidate },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const posts = parseSubstackRss(await response.text(), publication);
    if (!publication.pinnedOnly) return posts;
    const pinnedIds = new Set(pinnedPosts().map((post) => post.id));
    return posts.filter((post) => pinnedIds.has(post.id));
  } catch (error: any) {
    console.error(`Substack feed ${publication.id} failed:`, error.message);
    return [];
  }
}

export async function GET() {
  const fetched = (await Promise.all(PUBLICATIONS.map(fetchPublication))).flat();
  return NextResponse.json({ posts: mergeSubstackPosts(pinnedPosts(), fetched) });
}

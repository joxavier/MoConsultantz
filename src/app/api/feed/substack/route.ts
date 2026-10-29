import { NextResponse } from "next/server";
import { PUBLICATIONS, mergeSubstackPosts, parseSubstackRss, pinnedPosts, type SubstackPost } from "@/lib/substack";

// Substack posts for the Vibes feed: every publication in
// src/data/substack.json, merged with the pinned posts. Feeds are cached
// for an hour; a feed that fails is skipped so the rest still show.
export const revalidate = 3600;

async function fetchPublication(publication: (typeof PUBLICATIONS)[number]): Promise<SubstackPost[]> {
  try {
    const response = await fetch(publication.feedUrl, {
      headers: { Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8" },
      next: { revalidate },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return parseSubstackRss(await response.text(), publication);
  } catch (error: any) {
    console.error(`Substack feed ${publication.id} failed:`, error.message);
    return [];
  }
}

export async function GET() {
  const fetched = (await Promise.all(PUBLICATIONS.map(fetchPublication))).flat();
  return NextResponse.json({ posts: mergeSubstackPosts(pinnedPosts(), fetched) });
}

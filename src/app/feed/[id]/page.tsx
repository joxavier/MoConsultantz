import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import articlesData from "../articles.json";
import ArticleContent from "./ArticleContent";

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  imageUrl?: string;
  readTime: string;
}

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const AUTHOR_URLS: Record<string, string> = {
  "Joshua Xavier": "https://josh.modevz.ca",
};

const DESCRIPTION_OVERRIDES: Record<string, string> = {
  "6": "Comprehensive analysis of Canada's economic outlook 2025, covering post-pandemic recovery, housing crisis, green economy growth, inflation trends, and digital transformation opportunities.",
};

function getArticle(routeParam: string) {
  return (articlesData as Article[]).find(
    (a) => a.id === routeParam || slugify(a.title) === routeParam
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

function getDescription(article: Article, maxLength: number) {
  return (
    DESCRIPTION_OVERRIDES[article.id] ||
    stripHtml(article.content).slice(0, maxLength) ||
    article.title
  );
}

export function generateStaticParams() {
  return (articlesData as Article[]).map((a) => ({ id: a.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const article = getArticle(params.id);
  if (!article) return {};

  const description = getDescription(article, 155);
  const authorUrl = AUTHOR_URLS[article.author];
  const canonical = `https://modevz.ca/feed/${article.id}`;

  return {
    title: article.title,
    description,
    authors: [{ name: article.author, ...(authorUrl ? { url: authorUrl } : {}) }],
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url: canonical,
      publishedTime: new Date(article.date).toISOString(),
      authors: authorUrl ? [authorUrl] : [article.author],
      tags: article.tags,
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = getArticle(params.id);

  if (!article) notFound();
  if (article.id === "7") permanentRedirect("/articles/tech-adoption-cycle");

  const authorUrl = AUTHOR_URLS[article.author];
  const canonical = `https://modevz.ca/feed/${article.id}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: getDescription(article, 200),
    author: authorUrl
      ? { "@type": "Person", name: article.author, url: authorUrl }
      : { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "MoDevz", url: "https://modevz.ca" },
    datePublished: new Date(article.date).toISOString(),
    image: article.imageUrl,
    url: canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    keywords: article.tags,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <ArticleContent article={article} />
    </>
  );
}

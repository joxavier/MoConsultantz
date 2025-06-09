// pages/article/[id].tsx
"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import articlesData from '../articles.json';

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

const ArticlePage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  // articlesData is an array, so find the article by id
  const article = (articlesData as Article[]).find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen mt-12 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <Link href="/feed" className="text-blue-200 hover:text-white underline">
            Return to Feed
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.content.substring(0, 150)} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen mt-12">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              href="/feed"
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors duration-200"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Back to Feed
            </Link>
          </div>

          {/* Article Header */}
          <article className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-white/20">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-400/30 text-blue-100 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 text-blue-200">
              <span className="font-medium">{article.author}</span>
              <span className="hidden sm:inline">•</span>
              <span>{formatDate(article.date)}</span>
              <span className="hidden sm:inline">•</span>
              <span>{article.readTime}</span>
            </div>

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="mb-8">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <div 
              className="prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{
                color: '#e0f2fe',
                lineHeight: '1.8'
              }}
            />

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-blue-200">
                  <p>Written by <span className="font-semibold text-white">{article.author}</span></p>
                  <p className="text-sm">Published on {formatDate(article.date)}</p>
                </div>
                
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors duration-200">
                    Share
                  </button>
                  <button className="px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors duration-200">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Related Articles or Navigation */}
          <div className="mt-8 text-center">
            <Link 
              href="/feed"
              className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 hover:transform hover:scale-105 shadow-lg"
            >
              Read More Articles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
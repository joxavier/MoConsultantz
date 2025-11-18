// pages/feed.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import articlesData from './articles.json';

interface NewsPost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  imageUrl?: string;
}

// Use the imported articles as your posts
const mockNewsPosts: NewsPost[] = articlesData as NewsPost[];

const Feed: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  
  // Get all unique tags
  const allTags = ['All', ...Array.from(new Set(mockNewsPosts.flatMap(post => post.tags)))];
  
  // Filter posts by selected tag
  const filteredPosts = selectedTag === 'All' 
    ? mockNewsPosts 
    : mockNewsPosts.filter(post => post.tags.includes(selectedTag));
  
  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
        <title>Feed - News & Updates</title>
        <meta name="description" content="Stay updated with the latest news and insights" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto mt-32 px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to Your Feed
            </h1>
            <p className="text-xl text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">
              Stay updated with the latest news, insights, and updates from across industries
            </p>
          </div>

          {/* Tag Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedTag === tag
                      ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-lg shadow-purple-500/50 transform scale-105'
                      : 'bg-gray-700 dark:bg-gray-800 text-gray-200 dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-gray-700 hover:scale-105 border border-gray-600 dark:border-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {sortedPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-semibold text-gray-300 dark:text-gray-400 mb-2">
                No posts found
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                Try selecting a different tag
              </p>
            </div>
          )}

          {/* News Posts Grid */}
          <div className="grid gap-6 md:gap-8">
            {sortedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:transform hover:scale-[1.02] border border-gray-700 dark:border-gray-800 group"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image */}
                  {post.imageUrl && (
                    <div className="lg:w-1/3">
                      <div className="relative overflow-hidden rounded-xl">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-48 lg:h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className={`${post.imageUrl ? 'lg:w-2/3' : 'w-full'}`}>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-purple-500/20 dark:bg-purple-600/20 text-purple-200 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-500/30 dark:border-purple-600/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-100 mb-3 leading-tight group-hover:text-purple-400 dark:group-hover:text-purple-300 transition-colors duration-200">
                      {post.title}
                    </h2>
                    
                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-gray-300 dark:text-gray-400 mb-4 text-lg leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    
                    {/* Meta & CTA */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                      {/* Author & Date */}
                      <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium text-gray-300 dark:text-gray-400">{post.author}</span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-700">•</span>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(post.date)}</span>
                        </div>
                      </div>
                      
                      {/* Read More Button */}
                      <Link 
                        href={`/feed/${post.id}`}
                        className="inline-flex items-center gap-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-200 hover:transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 text-center justify-center sm:justify-start group/button"
                      >
                        Read Full Article
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover/button:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Results Counter */}
          {sortedPosts.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-400 dark:text-gray-500">
                Showing {sortedPosts.length} {sortedPosts.length === 1 ? 'article' : 'articles'}
                {selectedTag !== 'All' && ` in "${selectedTag}"`}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link 
              href="/moos"
              className="inline-flex items-center gap-2 bg-gray-700/50 dark:bg-gray-800/50 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-600/50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:transform hover:scale-105 backdrop-blur-md border border-gray-600 dark:border-gray-700 group"
            >
              Visit MoOS
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
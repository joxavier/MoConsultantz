// pages/feed.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  imageUrl?: string;
}

const mockNewsPosts: NewsPost[] = [
  {
    id: '1',
    title: 'Revolutionary AI Technology Transforms Healthcare Industry',
    excerpt: 'New breakthrough in machine learning algorithms promises to revolutionize patient care and medical diagnostics worldwide.',
    content: 'Full article content would go here...',
    author: 'Sarah Johnson',
    date: '2025-05-30',
    tags: ['Technology', 'Healthcare', 'AI'],
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'
  },
  {
    id: '2',
    title: 'Global Markets Show Strong Recovery Amid Economic Optimism',
    excerpt: 'Stock markets worldwide experience significant gains as investors show renewed confidence in economic recovery.',
    content: 'Full article content would go here...',
    author: 'Michael Chen',
    date: '2025-05-29',
    tags: ['Finance', 'Markets', 'Economy'],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400'
  },
{
    id: '3',
    title: 'From Ethereum to Exodus: Canada’s Blockchain Boom—and Bust?',
    excerpt: 'Canada helped launch the blockchain revolution with Ethereum, but regulatory uncertainty now threatens its position in the global crypto economy.',
    content: `    `,
    author: 'Joshua Xavier',
    date: '2025-06-09',
    tags: ['Blockchain', 'Canada', 'Innovation'],
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400',
  },
  {
    id: '4',
    title: 'Digital Assets Market Sees Major Institutional Investment',
    excerpt: 'Traditional financial institutions are increasingly investing in digital assets, signaling mainstream adoption.',
    content: 'Full article content would go here...',
    author: 'David Park',
    date: '2025-05-27',
    tags: ['Assets', 'Crypto', 'Finance'],
    imageUrl: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400'
  },
  {
    id: '5',
    title: 'Manufacturing Industry Embraces Automation and Robotics',
    excerpt: 'Smart factories and automated production lines are reshaping the manufacturing landscape globally.',
    content: 'Full article content would go here...',
    author: 'Lisa Thompson',
    date: '2025-05-26',
    tags: ['Manufacturing', 'Industries', 'Technology'],
    imageUrl: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400'
  },
    {
    id: '6',
    title: 'Sustainable Energy Solutions Gain Momentum Across Industries',
    excerpt: 'Companies worldwide are adopting renewable energy sources at an unprecedented rate, driving innovation in clean technology.',
    content: 'Full article content would go here...',
    author: 'Emily Rodriguez',
    date: '2025-05-28',
    tags: ['Energy', 'Sustainability', 'Industries'],
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400'
  },
];

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
      
      <div className="min-h-screen mt-12">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Welcome to Your Feed
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
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
                      ? 'bg-white text-purple-700 shadow-lg transform scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* News Posts Grid */}
          <div className="grid gap-6 md:gap-8">
            {sortedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] border border-white/20"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image */}
                  {post.imageUrl && (
                    <div className="lg:w-1/3">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 lg:h-full object-cover rounded-xl"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className={`${post.imageUrl ? 'lg:w-2/3' : 'w-full'}`}>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-400/30 text-blue-100 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                      {post.title}
                    </h2>
                    
                    <p className="text-blue-100 mb-4 text-lg leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4 text-blue-200">
                        <span className="font-medium">{post.author}</span>
                        <span>•</span>
                        <span>{formatDate(post.date)}</span>
                      </div>
                      
                      <Link 
                        href={`/feed/${post.id}`}
                        className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 hover:transform hover:scale-105 shadow-lg text-center justify-center sm:justify-start"
                      >
                        Read Full Article
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link 
              href="/moos"
              className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-200 hover:transform hover:scale-105 backdrop-blur-md border border-white/20"
            >
              Visit MoOS
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

export default Feed;
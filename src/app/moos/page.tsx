// pages/moos.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import Hero from "../devz/Hero";
import { useTheme } from "next-themes";
import articlesData from "../feed/articles.json";

interface App {
  id: string;
  name: string;
  description: string;
  link?: string;
  icon: string;
  isActive: boolean;
  category: "ecosystem" | "launchpad";
}

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  imageUrl: string;
  readTime: string;
}

const apps: App[] = [
  // Mo Ecosystem Apps
  {
    id: "0",
    name: "MoCoin",
    description: "Official Coin of the ecosystem",
    icon: "⚡",
    link: "https://mocoin.modevz.ca",
    isActive: true,
    category: "ecosystem",
  },
  {
    id: "1",
    name: "Metaparlour",
    description: "Wellness Platform",
    icon: "🛍️",
    link: "https://metaparlour.io", 
    isActive: true,
    category: "ecosystem",
  },

  // LaunchPad Apps
  {
    id: "7",
    name: "Ank",
    description: "Coming soon to ecosystem",
    icon: "⚡",
    isActive: false,
    category: "launchpad",
  },
  {
    id: "8",
    name: "6Cylndr",
    description: "Coming soon to ecosystem",
    icon: "⚡",
    link: "https://6cylndr.com",
    isActive: true,
    category: "launchpad",
  },
];

const MoOS: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [articles, setArticles] = useState<Article[]>(articlesData);
  const [loading, setLoading] = useState(true);

  const ecosystemApps = apps.filter((app) => app.category === "ecosystem");
  const launchpadApps = apps.filter((app) => app.category === "launchpad");

  // Load articles from JSON file
  useEffect(() => {
    
  }, []);

  const handleSignIn = () => {
    setIsSignedIn(!isSignedIn);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Extract excerpt from HTML content
  const getExcerpt = (htmlContent: string, maxLength: number = 150) => {
    // Remove HTML tags and get plain text
    const textContent = htmlContent.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  let darkModeActive = useTheme().systemTheme === "dark";

  return (
    <>
      <Head>
        <title>MoOS - Mo Operating System</title>
        <meta
          name="description"
          content="Access all your Mo ecosystem apps in one place"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen">
        <div className="container mt-16 mx-auto px-4 py-8 max-w-6xl">
          {/* Enhanced Hero Section */}
          <div className="text-center mb-16 pt-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-white to-blue-100 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/mo.svg"
                    alt="MoOS Logo"
                    width={80}
                    height={80}
                    className="drop-shadow-lg"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  OS
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">MoOS</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
                Your unified workspace for the Mo ecosystem. Access powerful apps, stay connected, and boost your productivity all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  onClick={handleSignIn}
                  className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:transform hover:scale-105 shadow-xl ${
                    isSignedIn
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                      : "bg-gradient-to-r from-white to-blue-50 text-purple-700 hover:from-blue-50 hover:to-white"
                  }`}
                >
                  {isSignedIn ? "✓ Signed In" : "Sign In to Get Started"}
                </button>
                
                <Link 
                  href="/feed"
                  className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-200 hover:transform hover:scale-105 backdrop-blur-md border border-white/20"
                >
                  View Feed
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Mo Ecosystem Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Mo Ecosystem
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Powerful apps and services working together seamlessly
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecosystemApps.map((app) => (
                <div
                  key={app.id}
                  className={`relative group transition-all duration-300 ${
                    app.isActive
                      ? "hover:transform hover:scale-105 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`
                      bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20
                      ${app.isActive ? "hover:shadow-2xl hover:bg-white/20" : "bg-gray-400/10"}
                    `}
                    onClick={() => {
                      if (app.isActive && app.link) {
                        window.open(app.link, "_blank", "noopener,noreferrer");
                      }
                    }}
                    style={app.isActive && app.link ? { cursor: "pointer" } : undefined}
                  >
                    <div className="text-center">
                      <div
                        className={`text-4xl mb-4 ${!app.isActive ? "grayscale" : ""}`}
                      >
                        {app.icon}
                      </div>
                      <h3
                        className={`text-xl font-bold mb-2 ${
                          app.isActive ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {app.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          app.isActive ? "text-blue-100" : "text-gray-400"
                        }`}
                      >
                        {app.description}
                      </p>

                      {!app.isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                          <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Coming Soon
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feed Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Latest Updates
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                Stay informed with news, updates, and insights from the Mo ecosystem
              </p>
            </div>

            {articles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white">No articles available</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {articles.slice(-1).map((article) => (
                  <div
                    key={article.id}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] border border-white/20"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Image */}
                      {article.imageUrl && (
                        <div className="lg:w-1/4">
                          <div className="w-full h-32 lg:h-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-xl overflow-hidden">
                            <Image
                              src={article.imageUrl}
                              alt={article.title}
                              width={400}
                              height={200}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to gradient background if image fails to load
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className={`${article.imageUrl ? 'lg:w-3/4' : 'w-full'}`}>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-blue-400/30 text-blue-100 rounded-full text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                          {article.title}
                        </h3>
                        
                        <p className="text-blue-100 mb-4 leading-relaxed">
                          {getExcerpt(article.content)}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3 text-blue-200 text-sm">
                            <span className="font-medium">{article.author}</span>
                            <span>•</span>
                            <span>{formatDate(article.date)}</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </div>
                          
                          <Link 
                            href={`/feed/${article.id}`}
                            className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full font-medium hover:bg-white/30 transition-all duration-200 hover:transform hover:scale-105 text-sm"
                          >
                            Read More
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <Link 
                href="/feed"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:transform hover:scale-105 shadow-lg"
              >
                View All Updates
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* LaunchPad Section */}
          <div className="mb-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                LaunchPad
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Exciting new apps and services coming to the ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {launchpadApps.map((app) => (
                <div
                  key={app.id}
                  className="relative group opacity-75 hover:opacity-90 transition-opacity duration-300 max-w-sm w-full"
                >
                  <div className="bg-gray-400/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 hover:border-white/30 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-4xl mb-4 grayscale">{app.icon}</div>
                      <h3 className="text-xl font-bold mb-2 text-gray-300">
                        {app.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">{app.description}</p>

                      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-200 hover:transform hover:scale-105"
              >
                <svg
                  className="w-4 h-4 rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Back to Feed
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 hover:transform hover:scale-105"
              >
                Home
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoOS;
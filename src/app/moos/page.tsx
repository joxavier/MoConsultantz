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

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mt-16 mx-auto px-4 py-8 max-w-6xl">
          {/* Enhanced Hero Section */}
          <div className="text-center mb-16 pt-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-600 dark:to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/50 dark:shadow-purple-900/50 transform hover:scale-105 transition-transform duration-300 border border-purple-400/30 dark:border-purple-500/30">
                  <Image
                    src="/mo.svg"
                    alt="MoOS Logo"
                    width={80}
                    height={80}
                    className="drop-shadow-lg"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  OS
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white dark:text-gray-100 mb-6 drop-shadow-2xl">
                Welcome to <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent">MoOS</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                Your unified workspace for the Mo ecosystem. Access powerful apps, stay connected, and boost your productivity all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  onClick={handleSignIn}
                  className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:transform hover:scale-105 shadow-xl ${
                    isSignedIn
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white hover:from-green-600 hover:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 shadow-green-500/50 dark:shadow-green-900/50"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 shadow-purple-500/50 dark:shadow-purple-900/50"
                  }`}
                >
                  {isSignedIn ? "✓ Signed In" : "Sign In to Get Started"}
                </button>
                
                <Link 
                  href="/feed"
                  className="inline-flex items-center gap-2 bg-gray-700/50 dark:bg-gray-800/50 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-600/50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:transform hover:scale-105 backdrop-blur-md border border-gray-600/50 dark:border-gray-700/50"
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
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-4">
                Mo Ecosystem
              </h2>
              <p className="text-xl text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">
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
                      bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-700 dark:border-gray-800
                      ${app.isActive ? "hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-900/30 hover:bg-gray-800/70 dark:hover:bg-gray-900/70 hover:border-purple-500/50 dark:hover:border-purple-600/50" : "bg-gray-800/30 dark:bg-gray-900/30"}
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
                        className={`text-5xl mb-4 transition-transform duration-300 ${app.isActive ? "group-hover:scale-110" : "grayscale opacity-50"}`}
                      >
                        {app.icon}
                      </div>
                      <h3
                        className={`text-xl font-bold mb-2 ${
                          app.isActive ? "text-white dark:text-gray-100 group-hover:text-purple-400 dark:group-hover:text-purple-300" : "text-gray-500 dark:text-gray-600"
                        }`}
                      >
                        {app.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          app.isActive ? "text-gray-300 dark:text-gray-400" : "text-gray-600 dark:text-gray-700"
                        }`}
                      >
                        {app.description}
                      </p>

                      {!app.isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 dark:bg-black/60 rounded-2xl backdrop-blur-sm">
                          <span className="bg-gray-700 dark:bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium border border-gray-600 dark:border-gray-700">
                            Coming Soon
                          </span>
                        </div>
                      )}

                      {app.isActive && (
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="inline-flex items-center gap-2 text-purple-400 dark:text-purple-300 text-sm font-medium">
                            Launch App
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
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
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-4">
                Latest Updates
              </h2>
              <p className="text-xl text-gray-300 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                Stay informed with news, updates, and insights from the Mo ecosystem
              </p>
            </div>

            {articles.length === 0 ? (
              <div className="text-center py-16 bg-gray-800/50 dark:bg-gray-900/50 rounded-2xl border border-gray-700 dark:border-gray-800">
                <div className="text-6xl mb-4">📰</div>
                <p className="text-gray-300 dark:text-gray-400 text-lg">No articles available</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {articles.slice(-3).map((article) => (
                  <article
                    key={article.id}
                    className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20 transition-all duration-300 hover:transform hover:scale-[1.02] border border-gray-700 dark:border-gray-800 group"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Image */}
                      {article.imageUrl && (
                        <div className="lg:w-1/4">
                          <div className="w-full h-32 lg:h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 dark:from-purple-600/20 dark:to-blue-600/20 rounded-xl overflow-hidden relative">
                            <Image
                              src={article.imageUrl}
                              alt={article.title}
                              width={400}
                              height={200}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              onError={(e) => {
                                // Fallback to gradient background if image fails to load
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className={`${article.imageUrl ? 'lg:w-3/4' : 'w-full'}`}>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-purple-500/20 dark:bg-purple-600/20 text-purple-200 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-500/30 dark:border-purple-600/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-white dark:text-gray-100 mb-2 leading-tight group-hover:text-purple-400 dark:group-hover:text-purple-300 transition-colors duration-200">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-300 dark:text-gray-400 mb-4 leading-relaxed line-clamp-2">
                          {getExcerpt(article.content)}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 text-sm">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium text-gray-300 dark:text-gray-400">{article.author}</span>
                            </div>
                            <span className="text-gray-600 dark:text-gray-700">•</span>
                            <span>{formatDate(article.date)}</span>
                            <span className="text-gray-600 dark:text-gray-700">•</span>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{article.readTime}</span>
                            </div>
                          </div>
                          
                          <Link 
                            href={`/feed/${article.id}`}
                            className="inline-flex items-center gap-2 bg-purple-600 dark:bg-purple-500 text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-200 hover:transform hover:scale-105 text-sm shadow-lg hover:shadow-purple-500/50 dark:hover:shadow-purple-900/50 group/button"
                          >
                            Read More
                            <svg className="w-3 h-3 transition-transform duration-200 group-hover/button:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <Link 
                href="/feed"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 transition-all duration-200 hover:transform hover:scale-105 shadow-lg shadow-purple-500/50 dark:shadow-purple-900/50 group"
              >
                View All Updates
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* LaunchPad Section */}
          <div className="mb-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-4">
                LaunchPad
              </h2>
              <p className="text-xl text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">
                Exciting new apps and services coming to the ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {launchpadApps.map((app) => (
                <div
                  key={app.id}
                  className="relative group opacity-75 hover:opacity-100 transition-all duration-300 max-w-sm w-full"
                >
                  <div className="bg-gray-800/30 dark:bg-gray-900/30 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-700 dark:border-gray-800 hover:border-gray-600 dark:hover:border-gray-700 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-5xl mb-4 grayscale opacity-50">{app.icon}</div>
                      <h3 className="text-xl font-bold mb-2 text-gray-400 dark:text-gray-500">
                        {app.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-600 mb-4">{app.description}</p>

                      <div className="bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-gray-300 dark:text-gray-400 px-4 py-2 rounded-full text-sm font-medium border border-gray-600 dark:border-gray-700">
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
            <div className="inline-flex items-center gap-4 p-2 bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-md rounded-full border border-gray-700 dark:border-gray-800">
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 bg-gray-700/50 dark:bg-gray-800/50 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-600/50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:transform hover:scale-105 group"
              >
                <svg
                  className="w-4 h-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-1"
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
                className="inline-flex items-center gap-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-200 hover:transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 dark:hover:shadow-purple-900/50 group"
              >
                Home
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
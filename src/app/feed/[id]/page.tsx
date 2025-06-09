// pages/article/[id].tsx
"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';

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

const mockArticles: { [key: string]: Article } = {
  '1': {
    id: '1',
    title: 'Revolutionary AI Technology Transforms Healthcare Industry',
    content: `
      <p>The healthcare industry is experiencing a paradigm shift with the introduction of groundbreaking artificial intelligence technologies that promise to revolutionize patient care and medical diagnostics worldwide.</p>
      
      <h2>Breaking Down Barriers</h2>
      <p>Traditional diagnostic methods, while effective, often require significant time and resources. The new AI-powered systems can analyze complex medical data in minutes rather than hours, providing healthcare professionals with rapid, accurate insights that can be critical in emergency situations.</p>
      
      <h2>Enhanced Accuracy</h2>
      <p>Studies show that these AI systems can identify patterns and anomalies in medical imaging with up to 95% accuracy, often detecting issues that might be missed by human analysis alone. This level of precision is particularly valuable in early-stage disease detection.</p>
      
      <h2>Patient Impact</h2>
      <p>For patients, this means faster diagnoses, more personalized treatment plans, and ultimately better health outcomes. The technology is being implemented in hospitals worldwide, with early adopters reporting significant improvements in patient satisfaction and treatment effectiveness.</p>
      
      <h2>Looking Forward</h2>
      <p>As this technology continues to evolve, we can expect even more sophisticated applications in areas such as drug discovery, personalized medicine, and preventive care. The future of healthcare is becoming increasingly intelligent, and patients worldwide stand to benefit.</p>
    `,
    author: 'Sarah Johnson',
    date: '2025-05-30',
    tags: ['Technology', 'Healthcare', 'AI'],
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    readTime: '5 min read'
  },
  '2': {
    id: '2',
    title: 'Global Markets Show Strong Recovery Amid Economic Optimism',
    content: `
      <p>Stock markets worldwide are experiencing significant gains as investors show renewed confidence in economic recovery, with major indices reaching new highs across multiple regions.</p>
      
      <h2>Market Performance</h2>
      <p>The S&P 500, FTSE 100, and Nikkei 225 have all posted substantial gains over the past quarter, driven by strong corporate earnings and positive economic indicators. Technology and healthcare sectors are leading the charge, with many companies exceeding analyst expectations.</p>
      
      <h2>Economic Indicators</h2>
      <p>Key economic metrics including employment rates, consumer spending, and manufacturing output all point to a robust recovery. Central banks have maintained supportive monetary policies while gradually adjusting interest rates to manage inflation concerns.</p>
      
      <h2>Investor Sentiment</h2>
      <p>Professional investors and retail traders alike are displaying increased confidence, with trading volumes reaching levels not seen since the peak of the previous bull market. This enthusiasm is being tempered by cautious optimism about geopolitical factors.</p>
      
      <h2>Future Outlook</h2>
      <p>Analysts predict continued growth but emphasize the importance of monitoring global economic trends and policy changes. The consensus remains positive for the remainder of the year, with expectations of sustained but measured growth.</p>
    `,
    author: 'Michael Chen',
    date: '2025-05-29',
    tags: ['Finance', 'Markets', 'Economy'],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    readTime: '4 min read'
  },
  '3': {
    id: '3',
    title: 'From Ethereum to Exodus: Canada’s Blockchain Boom—and Bust?',
    content: `
      <p>In the early days of blockchain innovation, Canada stood proudly at the frontier. The world’s second-largest blockchain platform, <strong>Ethereum</strong>, was co-founded in 2013 by <strong>Vitalik Buterin</strong>, a Russian-Canadian programmer raised in Toronto. Buterin’s contributions, rooted in academic rigor and visionary thinking, sparked a global revolution in decentralized computing. Ethereum laid the foundation for what we now call <strong>Web3</strong>—a decentralized internet of smart contracts, NFTs, DeFi, and DAOs.</p>

      <p>Canada was also home to early Bitcoin adopters and miners. It hosted some of the first crypto-focused meetups and conferences. Canadian exchanges like <strong>QuadrigaCX</strong>—before its infamous collapse—were among the first platforms where crypto was traded at scale in North America. Innovation hubs in cities like Toronto, Vancouver, and Montreal once buzzed with blockchain startups, protocol builders, and investor interest.</p>

      <h2>Canada's Crypto Conundrum</h2>
      <p>While countries like the UAE, Singapore, and even the United States have moved quickly to develop regulatory frameworks and attract blockchain talent, <strong>Canada’s regulatory uncertainty and lack of institutional support have stifled growth</strong>. Federal agencies have been slow to provide clear guidance. Banks remain reluctant to serve blockchain businesses. Even some provincial securities commissions treat crypto firms with suspicion, creating a patchwork of confusing and often contradictory policies.</p>

      <p>As a result, <strong>Canadian innovators are leaving</strong>. Developers, founders, and capital are migrating to more crypto-friendly environments. Companies that were born in Canada—such as <strong>Dapper Labs</strong> (creators of NBA Top Shot)—have increasingly looked abroad for partnerships, funding, and operational freedom.</p>

      <h2>The Risk of Missed Opportunity</h2>
      <p>Blockchain isn’t just about cryptocurrency. It’s about redefining how we manage trust, ownership, and value in a digital world. Canada has the talent. It has the academic institutions, the multicultural edge, and the technical depth to lead. But without <strong>strategic investment, clear regulation, and active public-private partnerships</strong>, we risk becoming spectators in a field we helped create.</p>

      <p>Vitalik Buterin once said, “<em>The purpose of blockchain is not to cut costs. It’s to redefine systems.</em>” Canada helped ignite that spark. Now it must decide: Will it continue to lead, or will it watch from the sidelines as others build the next great decentralized future?</p>
    `,
    author: 'Joshua Xavier',
    date: '2025-06-09',
    tags: ['Blockchain', 'Canada', 'Innovation'],
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    readTime: '5 min read'
  },
  // Add more mock articles as needed
};

const ArticlePage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  
  const article = mockArticles[id];
  
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
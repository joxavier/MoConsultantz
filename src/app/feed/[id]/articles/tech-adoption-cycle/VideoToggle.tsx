// components/VideoToggle.tsx
'use client';

import { useState } from 'react';

type VideoSource = 'youtube' | 'tiktok' | 'instagram';

interface VideoToggleProps {
  youtubeId?: string;
  tiktokId?: string;
  instagramId?: string;
  defaultSource?: VideoSource;
}

export default function VideoToggle({
  youtubeId = 'Tjw_eJQ6a7E',
  tiktokId = '7546423359551180050',
  instagramId = 'DL6JFTUNv_d',
  defaultSource = 'youtube'
}: VideoToggleProps) {
  const [activeVideo, setActiveVideo] = useState<VideoSource>(defaultSource);

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-purple-400 mb-6 text-center">
        Watch: Technology Adoption in Action
      </h3>
      
      {/* Platform Toggle Buttons */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setActiveVideo('youtube')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
            activeVideo === 'youtube'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105'
              : 'bg-red-900/30 text-red-300 border border-red-500/30 hover:bg-red-900/50'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          YouTube
        </button>

        <button
          onClick={() => setActiveVideo('tiktok')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
            activeVideo === 'tiktok'
              ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/50 scale-105'
              : 'bg-gray-900/30 text-gray-300 border border-gray-500/30 hover:bg-gray-900/50'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
          TikTok
        </button>

        <button
          onClick={() => setActiveVideo('instagram')}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
            activeVideo === 'instagram'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/50 scale-105'
              : 'bg-purple-900/30 text-purple-300 border border-purple-500/30 hover:bg-purple-900/50'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Instagram
        </button>
      </div>

      {/* Video Container */}
      <div className="max-w-md mx-auto">
        <div className={`bg-gradient-to-br rounded-xl overflow-hidden border transition-all duration-500 ${
          activeVideo === 'youtube' 
            ? 'from-red-900/30 to-red-800/30 border-red-500/30' 
            : activeVideo === 'tiktok'
            ? 'from-gray-900/30 to-black/30 border-gray-500/30'
            : 'from-purple-900/30 to-pink-900/30 border-purple-500/30'
        }`}>
          <div className="aspect-[9/16] relative bg-black">
            {activeVideo === 'youtube' && (
              <iframe
                key="youtube"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                className="w-full h-full animate-fadeIn"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            
            {activeVideo === 'tiktok' && (
              <iframe
                key="tiktok"
                src={`https://www.tiktok.com/embed/v2/${tiktokId}`}
                className="w-full h-full animate-fadeIn"
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            )}
            
            {activeVideo === 'instagram' && (
              <iframe
                key="instagram"
                src={`https://www.instagram.com/reel/${instagramId}/embed`}
                className="w-full h-full animate-fadeIn"
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            )}
          </div>
          
          <div className={`p-4 bg-gradient-to-t transition-colors duration-500 ${
            activeVideo === 'youtube'
              ? 'from-red-900/50 to-transparent'
              : activeVideo === 'tiktok'
              ? 'from-black/50 to-transparent'
              : 'from-purple-900/50 to-transparent'
          }`}>
            <p className="text-sm text-gray-400 text-center">
              {activeVideo === 'youtube' && 'Watch on YouTube Shorts'}
              {activeVideo === 'tiktok' && 'Watch on TikTok'}
              {activeVideo === 'instagram' && 'Watch on Instagram'}
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-400 mt-6 text-sm">
        See how we break down complex tech concepts into digestible content
      </p>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </div>
  );
}
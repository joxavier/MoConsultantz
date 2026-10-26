"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaInstagram, FaTiktok, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

interface MobileFooterProps {
  className?: string;
}

const MobileFooter: React.FC<MobileFooterProps> = ({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const isActive = (path: string) => pathname === path;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email && email.includes('@')) {
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setSubscribeStatus('success');
          setEmail('');
          setTimeout(() => {
            setSubscribeStatus('idle');
            setShowNewsletter(false);
          }, 2000);
        } else {
          setSubscribeStatus('error');
          setTimeout(() => setSubscribeStatus('idle'), 3000);
        }
      } catch (error) {
        setSubscribeStatus('error');
        setTimeout(() => setSubscribeStatus('idle'), 3000);
      }
    } else {
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };

  return (
    <>
      {/* Newsletter Modal */}
      {showNewsletter && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowNewsletter(false)}
        >
          <div 
            style={{
              backgroundColor: '#0a0a0a',
              borderRadius: '16px',
              padding: '32px 24px',
              maxWidth: '400px',
              width: '100%',
              border: '1px solid #333'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', fontFamily: 'Anton, sans-serif' }}>
                Stay Connected
              </h3>
              <button 
                onClick={() => setShowNewsletter(false)}
                style={{ color: '#666', fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <p style={{ color: '#a0a0a0', marginBottom: '20px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              Subscribe for updates on MoCoin, ecosystem news, and exclusive insights.
            </p>

            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#000',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem',
                  fontFamily: 'monospace',
                  marginBottom: '12px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#4a9eff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  cursor: 'pointer'
                }}
              >
                Subscribe
              </button>

              {subscribeStatus === 'success' && (
                <p style={{ color: '#4ade80', marginTop: '12px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  ✓ Successfully subscribed!
                </p>
              )}
              {subscribeStatus === 'error' && (
                <p style={{ color: '#f87171', marginTop: '12px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  ✗ Please enter a valid email.
                </p>
              )}
            </form>

            {/* Social Links in Modal */}
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #222' }}>
              <p style={{ color: '#a0a0a0', marginBottom: '16px', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                Follow us on social media:
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <Link href="https://www.youtube.com/channel/UCas-owpj6LrZcLNESKiPKLA" target="_blank">
                  <FaYoutube size={32} color="#FF0000" />
                </Link>
                <Link href="https://www.instagram.com/movestmentz/" target="_blank">
                  <FaInstagram size={32} color="#E1306C" />
                </Link>
                <Link href="https://www.tiktok.com/@movestmentz" target="_blank">
                  <FaTiktok size={32} color="#00f2ea" />
                </Link>
                <Link href="https://www.twitter.com/@moVestmentz" target="_blank">
                  <FaTwitter size={32} color="#1DA1F2" />
                </Link>
                <Link href="https://www.linkedin.com/company/75720064/" target="_blank">
                  <FaLinkedin size={32} color="#0A66C2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <footer
        className={`fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 dark:bg-gray-900/90 dark:border-gray-700 z-50 md:hidden ${className}`}
      >
        <div className="relative flex items-center justify-between px-6 py-3 bg-white dark:bg-black">
          {/* Left - Feed */}
          <div className="flex-1 flex justify-center">
            <Link
              href="/feed"
              className={`flex flex-col items-center transition-all duration-200 ${
                isActive("/feed")
                  ? "text-blue-600 dark:text-blue-400 scale-105"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div className="relative">
                <svg
                  className="w-7 h-7 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
                {isActive("/feed") && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </div>
              <span className="text-sm font-medium">Vibes</span>
            </Link>
          </div>

          {/* Center - Mo logo */}
          <div className="relative z-10 px-16">
            <Link href="/" className="flex items-center justify-center">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-xl w-32 h-32 flex justify-center transition-transform duration-300 group hover:scale-110">
                <img
                  src="/mo.svg"
                  alt="Mo Logo"
                  className="mt-5 w-16 h-16 object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Right - Newsletter Toggle */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => setShowNewsletter(true)}
              className={`flex flex-col items-center transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300`}
            >
              <div className="relative">
                <svg
                  className="w-7 h-7 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Connect</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};

export default MobileFooter;
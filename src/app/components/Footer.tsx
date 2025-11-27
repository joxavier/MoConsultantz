"use client";
import { FaInstagram, FaTiktok, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MobileFooter from './mobile_footer';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

const Footer = () => {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add your newsletter subscription logic here
    // For now, just showing success message
    if (email && email.includes('@')) {
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    } else {
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };

  if (isMobile) return <MobileFooter />;

  return (
    <footer 
      className="py-12"
      style={{
        backgroundColor: '#0a0a0a',
        borderTop: '1px solid #222222'
      }}
    >
      <div className="container mx-auto px-6" style={{ maxWidth: '1200px' }}>
        {/* Newsletter Section */}
        <div 
          style={{
            textAlign: 'center',
            marginBottom: '48px',
            padding: '40px 20px',
            backgroundColor: '#050505',
            borderRadius: '12px',
            border: '1px solid #222222'
          }}
        >
          <h3 
            style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              marginBottom: '12px',
              color: '#ffffff',
              fontFamily: 'Anton, sans-serif'
            }}
          >
            Stay Connected
          </h3>
          <p 
            style={{
              fontSize: '1rem',
              color: '#a0a0a0',
              marginBottom: '24px',
              fontFamily: 'monospace'
            }}
          >
            Subscribe to our newsletter for the latest updates on MoCoin, ecosystem news, and exclusive insights.
          </p>
          
          <form 
            onSubmit={handleSubscribe}
            style={{
              display: 'flex',
              gap: '12px',
              maxWidth: '500px',
              margin: '0 auto',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '12px 20px',
                backgroundColor: '#000000',
                border: '2px solid #333333',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '1rem',
                fontFamily: 'monospace',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#4a9eff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#333333';
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 32px',
                backgroundColor: '#4a9eff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3a7ed8';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4a9eff';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Subscribe
            </button>
          </form>

          {subscribeStatus === 'success' && (
            <p style={{ color: '#4ade80', marginTop: '12px', fontFamily: 'monospace' }}>
              ✓ Successfully subscribed!
            </p>
          )}
          {subscribeStatus === 'error' && (
            <p style={{ color: '#f87171', marginTop: '12px', fontFamily: 'monospace' }}>
              ✗ Please enter a valid email address.
            </p>
          )}
        </div>

        {/* Social Links Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h4 
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#ffffff',
              fontFamily: 'Anton, sans-serif'
            }}
          >
            Follow Us
          </h4>
          <div 
            className='flex justify-center gap-6 flex-wrap'
            style={{ alignItems: 'center' }}
          >
            <Link 
              href="https://www.youtube.com/channel/UCas-owpj6LrZcLNESKiPKLA"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              style={{
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.2)';
                e.currentTarget.style.color = '#FF0000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.color = 'inherit';
              }}
            >
              <FaYoutube size={42} />
            </Link>

            <Link 
              href="https://www.instagram.com/movestmentz/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.2)';
                e.currentTarget.style.color = '#E1306C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.color = 'inherit';
              }}
            >
              <FaInstagram size={42} />
            </Link>

            <Link 
              href="https://www.tiktok.com/@movestmentz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              style={{
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.2)';
                e.currentTarget.style.color = '#00f2ea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.color = 'inherit';
              }}
            >
              <FaTiktok size={42} />
            </Link>

            <Link 
              href="https://www.twitter.com/@moVestmentz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              style={{
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.2)';
                e.currentTarget.style.color = '#1DA1F2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.color = 'inherit';
              }}
            >
              <FaTwitter size={42} />
            </Link>

            <Link 
              href="https://www.linkedin.com/company/75720064/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.2)';
                e.currentTarget.style.color = '#0A66C2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.color = 'inherit';
              }}
            >
              <FaLinkedin size={42} />
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div 
          style={{
            textAlign: 'center',
            paddingTop: '24px',
            borderTop: '1px solid #222222',
            color: '#666666',
            fontSize: '0.875rem',
            fontFamily: 'monospace'
          }}
        >
          <p>© {new Date().getFullYear()} Mo Ecosystem. All rights reserved.</p>
          <div style={{ marginTop: '8px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/aboutus"
              style={{ color: '#a0a0a0', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a0a0a0'}
            >
              About Us
            </Link>
            <Link 
              href="/consultantz"
              style={{ color: '#a0a0a0', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a0a0a0'}
            >
              Consultantz
            </Link>
            <Link 
              href="/devz"
              style={{ color: '#a0a0a0', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a0a0a0'}
            >
              Devz
            </Link>
            <Link 
              href="/vestmentz"
              style={{ color: '#a0a0a0', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a0a0a0'}
            >
              Vestmentz
            </Link>
            <a 
              href="https://mocoin.modevz.ca"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#4a9eff', textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#6bb3ff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4a9eff'}
            >
              MoCoin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
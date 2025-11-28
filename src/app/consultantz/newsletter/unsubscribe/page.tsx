'use client'
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

export default function Unsubscribe() {
  const [isAnimated, setIsAnimated] = useState(false);
  const controls = useAnimation();
  const [email, setEmail] = useState('');
  const [unsubscribeStatus, setUnsubscribeStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    controls.start({ opacity: 1 });
    setIsAnimated(true);
  }, [controls]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setUnsubscribeStatus('error');
      setErrorMessage('Please enter a valid email address.');
      setTimeout(() => setUnsubscribeStatus('idle'), 3000);
      return;
    }

    setUnsubscribeStatus('loading');

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setUnsubscribeStatus('success');
        setEmail('');
      } else {
        setUnsubscribeStatus('error');
        setErrorMessage(data.error || 'Failed to unsubscribe. Please try again.');
        setTimeout(() => setUnsubscribeStatus('idle'), 3000);
      }
    } catch (error) {
      setUnsubscribeStatus('error');
      setErrorMessage('An error occurred. Please try again later.');
      setTimeout(() => setUnsubscribeStatus('idle'), 3000);
    }
  };

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-center p-10 sm:p-10 md:p-24 lg:p-32"
      style={{ 
        fontFamily: 'Anton, sans-serif',
        backgroundColor: '#000000',
        color: '#ffffff'
      }}
    >
      <Head>
        <title>Unsubscribe - Mo Ecosystem</title>
        <meta name="description" content="Unsubscribe from Mo Ecosystem newsletter" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div style={{ maxWidth: '600px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          transition={{ duration: 1 }}
        >
          {unsubscribeStatus !== 'success' ? (
            <>
              {/* Header Section */}
              <motion.div 
                animate={{ opacity: isAnimated ? 1 : 0, y: isAnimated ? 0 : -20 }} 
                style={{ 
                  textAlign: 'center',
                  marginBottom: '40px'
                }}
              >
                <div 
                  className="font-bold text-4xl md:text-5xl"
                  style={{ 
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  We're Sorry to See You Go
                </div>
                <div 
                  style={{ 
                    color: '#a0a0a0',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    marginTop: '20px'
                  }}
                >
                  If you no longer wish to receive updates from the Mo Ecosystem, please enter your email address below.
                </div>
              </motion.div>

              {/* Unsubscribe Form */}
              <motion.div
                animate={{ opacity: isAnimated ? 1 : 0, y: isAnimated ? 0 : 20 }}
                transition={{ delay: 0.2 }}
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #222222',
                  borderRadius: '16px',
                  padding: '40px',
                  marginBottom: '40px'
                }}
              >
                <form onSubmit={handleUnsubscribe}>
                  <div style={{ marginBottom: '24px' }}>
                    <label 
                      htmlFor="email"
                      style={{
                        display: 'block',
                        marginBottom: '12px',
                        color: '#ffffff',
                        fontFamily: 'monospace',
                        fontSize: '1rem'
                      }}
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={unsubscribeStatus === 'loading'}
                      style={{
                        width: '100%',
                        padding: '14px 20px',
                        backgroundColor: '#000000',
                        border: '2px solid #333333',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '1rem',
                        fontFamily: 'monospace',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        opacity: unsubscribeStatus === 'loading' ? 0.6 : 1
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#4a9eff';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#333333';
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={unsubscribeStatus === 'loading'}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: unsubscribeStatus === 'loading' ? '#666666' : '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      cursor: unsubscribeStatus === 'loading' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (unsubscribeStatus !== 'loading') {
                        e.currentTarget.style.backgroundColor = '#b91c1c';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (unsubscribeStatus !== 'loading') {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {unsubscribeStatus === 'loading' ? 'Processing...' : 'Unsubscribe'}
                  </button>

                  {unsubscribeStatus === 'error' && (
                    <p style={{ 
                      color: '#f87171', 
                      marginTop: '16px', 
                      fontFamily: 'monospace',
                      fontSize: '0.95rem',
                      textAlign: 'center'
                    }}>
                      ✗ {errorMessage}
                    </p>
                  )}
                </form>
              </motion.div>

              {/* Feedback Section */}
              <motion.div
                animate={{ opacity: isAnimated ? 1 : 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #222222',
                  borderRadius: '12px',
                  padding: '30px',
                  marginBottom: '30px'
                }}
              >
                <h3 
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    color: '#ffffff'
                  }}
                >
                  Why are you leaving?
                </h3>
                <p 
                  style={{
                    color: '#a0a0a0',
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                  }}
                >
                  We'd love to hear your feedback. Email us at{' '}
                  <a 
                    href="mailto:contact@modevz.ca"
                    style={{
                      color: '#4a9eff',
                      textDecoration: 'none',
                      fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    contact@modevz.ca
                  </a>
                  {' '}to let us know how we can improve.
                </p>
              </motion.div>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                textAlign: 'center',
                padding: '60px 40px'
              }}
            >
              <div 
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#0a0a0a',
                  border: '3px solid #4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 30px',
                  fontSize: '2.5rem'
                }}
              >
                ✓
              </div>

              <h2 
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  color: '#ffffff'
                }}
              >
                You've Been Unsubscribed
              </h2>

              <p 
                style={{
                  color: '#a0a0a0',
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  marginBottom: '40px'
                }}
              >
                You will no longer receive newsletter emails from us. We're sorry to see you go, but you can always come back and resubscribe at any time.
              </p>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/">
                  <button
                    style={{
                      padding: '14px 32px',
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
                    Return Home
                  </button>
                </Link>

                <Link href="/aboutus">
                  <button
                    style={{
                      padding: '14px 32px',
                      backgroundColor: 'transparent',
                      color: '#ffffff',
                      border: '2px solid #333333',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4a9eff';
                      e.currentTarget.style.color = '#4a9eff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#333333';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                  >
                    Learn More About Us
                  </button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Back Link */}
          {unsubscribeStatus !== 'success' && (
            <motion.div
              animate={{ opacity: isAnimated ? 1 : 0 }}
              transition={{ delay: 0.6 }}
              style={{ textAlign: 'center' }}
            >
              <Link 
                href="/"
                style={{
                  color: '#a0a0a0',
                  textDecoration: 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.95rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#4a9eff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#a0a0a0'}
              >
                ← Back to Home
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
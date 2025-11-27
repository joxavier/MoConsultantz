'use client'
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

export default function AboutUs() {
  const [isAnimated, setIsAnimated] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1 });
    setIsAnimated(true);
  }, [controls]);

  const ecosystemBranches = [
    {
      title: "MoConsultantz",
      description: "Strategic business advising for startups, small businesses, creators, and growing organizations. We help you clarify your vision, optimize your operations, and build a sustainable path to profitability.",
      link: "/consultantz"
    },
    {
      title: "MoDevz",
      description: "Full-stack software development and digital transformation. From websites to enterprise systems to AI-powered tools, we build custom solutions that help businesses operate smarter and scale faster.",
      link: "/devz"
    },
    {
      title: "MoVestmentz",
      description: "Next-gen finance for the modern entrepreneur. We bridge the gap between traditional business and the future of money—leveraging blockchain, digital assets, and innovative financing tools to help founders access opportunities once reserved for the few.",
      link: "/vestmentz"
    }
  ];

  const pillars = [
    {
      number: "1",
      title: "Trust",
      description: "Trust is the core of the Mo Ecosystem. We foster a community where transparency, loyalty, and alignment fuel every relationship. When our members win, we all win."
    },
    {
      number: "2",
      title: "Stewardship",
      description: "We build with patience, intentionality, and long-term vision. Stewardship means we don't cut corners—we build sustainably, responsibly, and with the future in mind."
    },
    {
      number: "3",
      title: "Integrity",
      description: "Integrity is our identity. We lead with courage, bold decisions, and an unwavering commitment to doing what's right—even when no one is watching."
    }
  ];

  return (
    <main 
      className="flex min-h-screen flex-col items-center justify-between p-10 sm:p-10 md:p-24 lg:p-32"
      style={{ 
        fontFamily: 'Anton, sans-serif',
        backgroundColor: '#000000',
        color: '#ffffff'
      }}
    >
      <Head>
        <title>About Us - MoConsultantz | Mo Ecosystem</title>
        <meta name="description" content="Learn about the Mo Ecosystem - empowering small businesses with strategic consulting, software development, and next-gen finance. Built on Trust, Stewardship, and Integrity." />
        <meta name="keywords" content="MoConsultantz, MoDevz, MoVestmentz, MoCoin, business consulting, software development, blockchain, cryptocurrency, small business, entrepreneurship, digital transformation" />
        <link rel="canonical" href="https://modevz.ca/aboutus" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://modevz.ca/aboutus" />
        <meta property="og:title" content="About Us - MoConsultantz | Mo Ecosystem" />
        <meta property="og:description" content="Learn about the Mo Ecosystem - empowering small businesses with strategic consulting, software development, and next-gen finance." />
        <meta property="og:image" content="https://modevz.ca/mo.svg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://modevz.ca/aboutus" />
        <meta name="twitter:title" content="About Us - MoConsultantz | Mo Ecosystem" />
        <meta name="twitter:description" content="Learn about the Mo Ecosystem - empowering small businesses with strategic consulting, software development, and next-gen finance." />
        <meta name="twitter:image" content="https://modevz.ca/mo.svg" />
        <meta name="twitter:site" content="@moVestmentz" />
        
        {/* Additional SEO */}
        <meta name="author" content="MoConsultantz" />
        <meta property="og:site_name" content="MoDevz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ maxWidth: '1320px', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          transition={{ duration: 1 }}
          style={{
            minHeight: '100vh',
            maxWidth: '1200px',
            margin: '0px auto'
          }}
        >
          {/* Header Section */}
          <motion.div 
            animate={{ opacity: isAnimated ? 1 : 0 }} 
            style={{ 
              textAlign: 'center',
              marginBottom: '60px'
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
              About Us – MoConsultantz
            </div>
            <div 
              className="font-bold text-xl md:text-2xl"
              style={{ 
                color: '#a0a0a0',
                fontFamily: 'monospace'
              }}
            >
              Powered by the Mo Ecosystem
            </div>
          </motion.div>

          {/* Introduction Section */}
          <motion.div
            style={{
              opacity: isAnimated ? 1 : 0,
              fontSize: '1.1rem',
              lineHeight: '1.8',
              maxWidth: '900px',
              margin: '0 auto 80px',
              fontFamily: 'monospace',
              color: '#e0e0e0'
            }}
          >
            <p style={{ marginBottom: '24px' }}>
              At <strong style={{ color: '#ffffff' }}>MoConsultantz</strong>, we empower small businesses to thrive in a rapidly evolving digital world. As one of the three core branches of the Mo Ecosystem, we provide strategic business advisory services rooted in modern innovation, next-gen finance, and ethical leadership.
            </p>
            <p>
              The Mo Ecosystem was built to help entrepreneurs compete at a global level by giving them the tools, technology, and financial infrastructure they need to scale sustainably. Our official digital asset,{' '}
              <a 
                href="https://mocoin.modevz.ca" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#4a9eff',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#6bb3ff';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#4a9eff';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                MoCoin
              </a>
              , fuels this mission—unlocking access, rewards, and long-term value for members across the entire ecosystem.
            </p>
          </motion.div>

          {/* Mission & Vision Section - MOVED HERE */}
          <motion.div 
            style={{ 
              marginBottom: '80px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '40px'
            }}
          >
            <motion.div
              style={{
                padding: '40px',
                backgroundColor: '#0a0a0a',
                borderLeft: '4px solid #4a9eff',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              animate={{ 
                opacity: isAnimated ? 1 : 0,
                x: isAnimated ? 0 : -100
              }}
              whileHover={{
                backgroundColor: '#111111',
                borderLeftWidth: '6px'
              }}
            >
              <h3 
                className="font-bold text-2xl"
                style={{ 
                  fontSize: '1.75rem',
                  marginBottom: '20px',
                  color: '#ffffff'
                }}
              >
                Our Mission
              </h3>
              <p 
                style={{ 
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  color: '#c0c0c0'
                }}
              >
                To empower small businesses with the tools, technology, and financial infrastructure they need to become global, scalable, and future-proof.
              </p>
            </motion.div>

            <motion.div
              style={{
                padding: '40px',
                backgroundColor: '#0a0a0a',
                borderLeft: '4px solid #4a9eff',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              animate={{ 
                opacity: isAnimated ? 1 : 0,
                x: isAnimated ? 0 : 100
              }}
              whileHover={{
                backgroundColor: '#111111',
                borderLeftWidth: '6px'
              }}
            >
              <h3 
                className="font-bold text-2xl"
                style={{ 
                  fontSize: '1.75rem',
                  marginBottom: '20px',
                  color: '#ffffff'
                }}
              >
                Our Vision
              </h3>
              <p 
                style={{ 
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  color: '#c0c0c0'
                }}
              >
                A world where entrepreneurs have equal access to opportunity—powered by digital transformation, community trust, and next-gen finance.
              </p>
            </motion.div>
          </motion.div>

          {/* Ecosystem Section - NOW AFTER MISSION/VISION */}
          <motion.div 
            style={{ 
              marginBottom: '80px',
              textAlign: 'center'
            }}
          >
            <div 
              className="font-bold text-3xl md:text-4xl"
              style={{ 
                marginBottom: '20px',
                color: '#ffffff'
              }}
            >
              The Mo Ecosystem
            </div>
            <p 
              style={{ 
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                color: '#a0a0a0',
                maxWidth: '800px',
                margin: '0 auto 40px'
              }}
            >
              Mo is built on three interconnected branches designed to support entrepreneurs at every stage:
            </p>

            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'space-around', 
              margin: '40px 0'
            }}>
              {ecosystemBranches.map((branch, index) => (
                <Link 
                  key={index}
                  href={branch.link}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <motion.div 
                    style={{ 
                      width: '100%', 
                      maxWidth: '800px', 
                      margin: '0 auto', 
                      padding: '30px', 
                      border: '2px solid #333333',
                      borderRadius: '8px', 
                      marginBottom: '20px',
                      backgroundColor: '#0a0a0a',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    animate={{ 
                      x: isAnimated ? 0 : (index % 2 === 0 ? 1000 : -1000),
                      opacity: isAnimated ? 1 : 0
                    }}
                    whileHover={{
                      borderColor: '#4a9eff',
                      backgroundColor: '#111111',
                      scale: 1.02
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <h2 
                        className="font-bold text-2xl"
                        style={{ 
                          fontSize: '1.75rem', 
                          marginBottom: '15px',
                          color: '#ffffff'
                        }}
                      >
                        {branch.title}
                      </h2>
                      <p 
                        style={{ 
                          fontFamily: 'monospace', 
                          fontSize: '1rem', 
                          margin: '0',
                          color: '#c0c0c0',
                          lineHeight: '1.6'
                        }}
                      >
                        {branch.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            <p 
              style={{ 
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                color: '#e0e0e0',
                maxWidth: '800px',
                margin: '40px auto 0',
                fontWeight: 500
              }}
            >
              Together, these three branches form a powerful ecosystem designed for growth, empowerment, and long-term impact.
            </p>
          </motion.div>

          {/* Pillars Section */}
          <motion.div 
            style={{ 
              marginBottom: '80px',
              padding: '60px 20px',
              backgroundColor: '#0a0a0a',
              borderRadius: '16px',
              border: '1px solid #222222'
            }}
          >
            <div 
              className="font-bold text-3xl md:text-4xl"
              style={{ 
                marginBottom: '20px',
                color: '#ffffff',
                textAlign: 'center'
              }}
            >
              Our Pillars
            </div>
            <p 
              style={{ 
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                color: '#a0a0a0',
                maxWidth: '800px',
                margin: '0 auto 50px',
                textAlign: 'center'
              }}
            >
              Everything we build is grounded in our three foundational pillars. They guide our actions, shape our culture, and define our identity.
            </p>

            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'space-around',
              gap: '30px'
            }}>
              {pillars.map((pillar, index) => (
                <motion.div 
                  key={index}
                  style={{ 
                    width: '100%', 
                    maxWidth: '350px',
                    padding: '40px 30px',
                    border: '2px solid #222222',
                    borderRadius: '12px',
                    backgroundColor: '#050505',
                    transition: 'all 0.3s ease',
                    position: 'relative' as const
                  }}
                  animate={{ 
                    opacity: isAnimated ? 1 : 0,
                    y: isAnimated ? 0 : 50
                  }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{
                    borderColor: '#4a9eff',
                    backgroundColor: '#0f0f0f',
                    y: -8
                  }}
                >
                  <div 
                    style={{ 
                      fontSize: '4rem',
                      fontWeight: 700,
                      opacity: 0.15,
                      marginBottom: '16px',
                      lineHeight: 1,
                      color: '#ffffff'
                    }}
                  >
                    {pillar.number}
                  </div>
                  <h3 
                    className="font-bold text-2xl"
                    style={{ 
                      fontSize: '1.75rem',
                      marginBottom: '15px',
                      color: '#ffffff'
                    }}
                  >
                    {pillar.title}
                  </h3>
                  <p 
                    style={{ 
                      fontFamily: 'monospace',
                      fontSize: '1rem',
                      color: '#c0c0c0',
                      lineHeight: '1.7'
                    }}
                  >
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
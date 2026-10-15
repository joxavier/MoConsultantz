"use client";
import React, { useState, useEffect } from "react";

const TypewriterEffect = ({ strings, className, speed = 70 }: { strings: string[]; className?: string; speed?: number }) => {
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const string = strings[currentStringIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < string.length) {
            setCurrentText(string.substring(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(string.substring(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentStringIndex((prev) => (prev + 1) % strings.length);
          }
        }
      },
      isDeleting ? 50 : speed
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentStringIndex, strings, speed]);

    useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <span className={className}>
      {currentText}
      <span style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>|</span>
    </span>
  );
};

export default function MoCoin() {
  const [swapAmount, setSwapAmount] = useState("");

  const chartLink = "https://www.dextools.io/app/en/solana/pair-explorer/2mz5eNLTpCk2F6CvP1y9LWdUe6LUh1zqPa7bzPFYWns8?t=1711224539477";

  const handleBuyClick = () => {
    window.open(
      "https://raydium.io/swap/?inputCurrency=sol&outputCurrency=HHVmXazRvA3VdciVG4ayE7vjgUFUn12t5r7vYm2BJ258&fixed=in",
      "_blank"
    );
  };

  const marketData = {
    marketCap: "$21.33M",
    tvl: "$12.8k",
    holders: "27",
  };

  const tierData = [
    {
      name: "Pioneer",
      icon: "👥",
      requirement: "10,000 MoCoin",
      color: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      benefits: [
        "Voting Rights on Mo-Ecosystem governance",
        "Access to community discussions",
        "Monthly ecosystem updates"
      ]
    },
    {
      name: "Builder",
      icon: "🏆",
      requirement: "50,000 MoCoin",
      color: "linear-gradient(135deg, #a855f7, #ec4899)",
      benefits: [
        "Guaranteed Allocation in exclusive launchpad projects like MetaParlour",
        "Private community channels",
        "Priority support",
        "Early access to new features"
      ]
    },
    {
      name: "Executive",
      icon: "🚀",
      requirement: "250,000 MoCoin",
      color: "linear-gradient(135deg, #eab308, #f97316)",
      benefits: [
        "Highest Allocation Multiplier for MoDevz projects",
        "Revenue share from Strategic Liquidity Reserve",
        "Direct team consultation",
        "Exclusive investment opportunities"
      ]
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: "'Space Mono', monospace",
    },
    section: {
      padding: '5rem 1.5rem',
    },
    heroSection: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '5rem 1.5rem',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    heroBg1: {
      position: 'absolute' as const,
      inset: 0,
      background: 'linear-gradient(to bottom, rgba(88, 28, 135, 0.2), #000, #000)',
    },
    heroBg2: {
      position: 'absolute' as const,
      inset: 0,
      background: 'radial-gradient(ellipse at top, rgba(30, 58, 138, 0.2), transparent, transparent)',
    },
    logo: {
      height: '8rem',
      width: '8rem',
      animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      marginBottom: '2rem',
    },
    h1: {
      fontSize: 'clamp(2rem, 8vw, 4.5rem)',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      background: 'linear-gradient(135deg, #3ca5de, #8743f7, #3ca5de)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundSize: '200% auto',
      textAlign: 'center' as const,
    },
    h2: {
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
      color: '#d1d5db',
      marginBottom: '2rem',
      fontWeight: 300,
      textAlign: 'center' as const,
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#9ca3af',
      marginBottom: '3rem',
      maxWidth: '48rem',
      lineHeight: 1.75,
      textAlign: 'center' as const,
    },
    trustBar: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      gap: '1.5rem',
      marginBottom: '3rem',
    },
    trustBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      borderRadius: '9999px',
      padding: '0.75rem 1.5rem',
      fontWeight: 600,
    },
    ctaContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
      marginBottom: '2rem',
    },
    primaryBtn: {
      background: 'linear-gradient(135deg, #3ca5de, #8743f7)',
      padding: '1rem 2.5rem',
      borderRadius: '9999px',
      fontWeight: 'bold',
      fontSize: '1.125rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s',
      color: '#fff',
    },
    secondaryBtn: {
      border: '2px solid #3ca5de',
      background: 'transparent',
      padding: '1rem 2.5rem',
      borderRadius: '9999px',
      fontWeight: 'bold',
      fontSize: '1.125rem',
      cursor: 'pointer',
      transition: 'all 0.3s',
      color: '#fff',
    },
    sectionTitle: {
      fontSize: 'clamp(2rem, 6vw, 3rem)',
      fontWeight: 'bold',
      textAlign: 'center' as const,
      marginBottom: '1.5rem',
      background: 'linear-gradient(135deg, #3ca5de, #8743f7)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    card: {
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))',
      padding: '2rem',
      borderRadius: '1rem',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      transition: 'all 0.3s',
    },
    link: {
      color: '#3ca5de',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
      transition: 'color 0.2s',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
    },
    th: {
      textAlign: 'left' as const,
      padding: '1rem',
      fontWeight: 600,
      borderBottom: '2px solid #374151',
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #1f2937',
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (min-width: 640px) {
          .cta-container { flex-direction: row; justify-content: center; }
        }
        
        .hover-scale:hover {
          transform: scale(1.05);
        }
        
        .hover-bg:hover {
          background: rgba(60, 165, 222, 0.2);
        }
        
        .link:hover {
          color: #8743f7;
        }
      `}</style>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroBg1}></div>
        <div style={styles.heroBg2}></div>
        
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/mo-dark.png" alt="MoCoin" style={styles.logo} />
          </div>

          <h1 style={styles.h1}>
            MoCoin: The Multi-Chain Financial Asset
          </h1>
          
          <h2 style={styles.h2}>
            Backed by Strategic Reserve
          </h2>

          <p style={styles.subtitle}>
            The <a href="https://en.wikipedia.org/wiki/Decentralized_finance" target="_blank" rel="noopener noreferrer" style={styles.link} className="link">DeFi</a> standard for tomorrow&apos;s business leaders, built for efficient state management on <a href="https://solana.com/" target="_blank" rel="noopener noreferrer" style={styles.link} className="link">Solana</a> and secured by audited liquidity.
          </p>

          {/* Trust Bar */}
          <div style={styles.trustBar}>
            <div style={{ ...styles.trustBadge, background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#86efac' }}>
              <span>✓</span>
              <span>Liquidity Locked</span>
            </div>
            <div style={{ ...styles.trustBadge, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#93c5fd' }}>
              <span>🛡️</span>
              <span>Audited Smart Contracts</span>
            </div>
            <div style={{ ...styles.trustBadge, background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#d8b4fe' }}>
              <span>👥</span>
              <span>KYC Verified Team</span>
            </div>
          </div>

          {/* Primary CTAs */}
          <div style={styles.ctaContainer} className="cta-container">
            <button onClick={handleBuyClick} style={styles.primaryBtn} className="hover-scale">
              💼 HODL MoCoin Now
            </button>
            <button onClick={() => window.scrollTo({ top: document.getElementById('whitepaper')?.offsetTop || 0, behavior: 'smooth' })} style={styles.secondaryBtn} className="hover-bg">
              📄 Read Whitepaper v2.0
            </button>
          </div>

          <div style={{ marginTop: '3rem', animation: 'pulse 2s infinite' }}>
            <span style={{ fontSize: '2rem' }}>⌄</span>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section style={{ ...styles.section, background: 'linear-gradient(to bottom, #000, #111827, #000)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <h2 style={styles.sectionTitle}>
            Execution, Stability, and Accessibility
          </h2>
          
          <p style={{ fontSize: '1.25rem', color: '#9ca3af', textAlign: 'center', marginBottom: '4rem', maxWidth: '48rem', margin: '0 auto 4rem' }}>
            MoCoin is a cryptocurrency primarily executing on the <a href="https://solana.com/" target="_blank" rel="noopener noreferrer" style={styles.link} className="link">Solana</a> <a href="https://en.wikipedia.org/wiki/Blockchain" target="_blank" rel="noopener noreferrer" style={styles.link} className="link">Blockchain</a> for efficient state management. We leverage <a href="https://en.wikipedia.org/wiki/Decentralized_finance" target="_blank" rel="noopener noreferrer" style={styles.link} className="link">decentralized finance (DeFi)</a> protocols to create a true multi-chain ecosystem.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ ...styles.card, background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))', border: '1px solid rgba(59, 130, 246, 0.3)' }} className="hover-scale">
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#93c5fd' }}>Solana Core</h3>
              <p style={{ color: '#d1d5db', lineHeight: 1.75 }}>
                We chose <a href="https://solana.com/" target="_blank" rel="noopener noreferrer" style={styles.link} className="link">Solana</a> for its unparalleled speed, low cost, and ability to handle high transaction throughput, ensuring MoCoin remains an effective medium of exchange.
              </p>
            </div>

            <div style={{ ...styles.card, background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))', border: '1px solid rgba(168, 85, 247, 0.3)' }} className="hover-scale">
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#d8b4fe' }}>Strategic Liquidity Reserve</h3>
              <p style={{ color: '#d1d5db', lineHeight: 1.75 }}>
                MoCoin&apos;s stability is backed by a Strategic Reserve of Diversified Liquidity Pools. This reserve acts as a safety net, enabling stable pricing and supporting MoCoin as a reliable global financial asset.
              </p>
            </div>

            <div style={{ ...styles.card, background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.1))', border: '1px solid rgba(34, 197, 94, 0.3)' }} className="hover-scale">
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🌐</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#86efac' }}>Easily Accessible</h3>
              <p style={{ color: '#d1d5db', lineHeight: 1.75 }}>
                Our multi-chain architecture ensures MoCoin is easily accessible across major networks, simplifying entry for both institutional and retail investors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section style={{ ...styles.section, background: '#000' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <h2 style={{ ...styles.sectionTitle, background: 'linear-gradient(135deg, #facc15, #f97316, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            💰 MoCoin Tiers: Exclusive Access & Governance
          </h2>
          
          <p style={{ fontSize: '1.25rem', color: '#9ca3af', textAlign: 'center', marginBottom: '4rem', maxWidth: '48rem', margin: '0 auto 4rem' }}>
            Holding MoCoin grants you tiered access to the Mo Ecosystem&apos;s most valuable opportunities. This is the mechanism for tomorrow&apos;s business leaders to get ahead.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {tierData.map((tier, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #111827, #000)',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '2px solid #374151',
                }}
                className="hover-scale"
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: '8rem', height: '8rem', background: tier.color, opacity: 0.2, filter: 'blur(3rem)', borderRadius: '50%' }}></div>
                
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{tier.icon}</div>
                
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{tier.name}</h3>
                <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', fontWeight: 600, background: tier.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {tier.requirement}
                </p>
                
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ color: '#86efac', flexShrink: 0 }}>✓</span>
                      <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Staking Callout */}
          <div style={{ background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.4), rgba(139, 92, 246, 0.4))', padding: '2rem', borderRadius: '1rem', border: '2px solid rgba(99, 102, 241, 0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '3rem' }}>🔒</span>
              <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.875rem)', fontWeight: 'bold', color: '#c7d2fe' }}>Earn Passive Rewards with Ank Staking</h3>
            </div>
            <p style={{ fontSize: '1.25rem', color: '#d1d5db', lineHeight: 1.75 }}>
              Staking for MoCoin holders is coming soon through the <span style={{ fontWeight: 'bold', color: '#818cf8' }}>Ank App by Mo</span>. Lock your tokens and earn competitive APY, solidifying your long-term position in the ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section style={{ ...styles.section, background: 'linear-gradient(to bottom, #000, #111827, #000)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <h2 style={styles.sectionTitle}>
            MoCoin vs. Traditional Solana ETFs
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={{ borderBottom: '2px solid #374151' }}>
                  <th style={{ ...styles.th, color: '#9ca3af' }}>Feature</th>
                  <th style={{ ...styles.th, color: '#86efac' }}>MoCoin</th>
                  <th style={{ ...styles.th, color: '#fca5a5' }}>Solana ETFs</th>
                </tr>
              </thead>
              <tbody style={{ color: '#d1d5db' }}>
                <tr>
                  <td style={{ ...styles.td, fontWeight: 600 }}>Asset Type</td>
                  <td style={styles.td}>Global Financial Asset (Decentralized)</td>
                  <td style={styles.td}>Centralized, Regulated Security</td>
                </tr>
                <tr>
                  <td style={{ ...styles.td, fontWeight: 600 }}>Access</td>
                  <td style={{ ...styles.td, color: '#86efac' }}>✅ Easily Accessible: Global, 24/7 liquidity</td>
                  <td style={{ ...styles.td, color: '#fca5a5' }}>❌ Restricted to trading hours/brokerages</td>
                </tr>
                <tr>
                  <td style={{ ...styles.td, fontWeight: 600 }}>Exclusive Utility</td>
                  <td style={{ ...styles.td, color: '#86efac' }}>✅ Tiered access to MoDevz launchpad and voting rights</td>
                  <td style={{ ...styles.td, color: '#fca5a5' }}>❌ Pure price exposure only</td>
                </tr>
                <tr>
                  <td style={{ ...styles.td, fontWeight: 600 }}>Direct Ownership</td>
                  <td style={{ ...styles.td, color: '#86efac' }}>✅ You own the asset directly (self-custody)</td>
                  <td style={{ ...styles.td, color: '#fca5a5' }}>❌ You own shares representing the asset</td>
                </tr>
                <tr>
                  <td style={{ ...styles.td, fontWeight: 600 }}>Value Basis</td>
                  <td style={{ ...styles.td, color: '#86efac' }}>✅ Backed by Strategic Liquidity Reserve & Utility</td>
                  <td style={{ ...styles.td, color: '#fca5a5' }}>Backed only by underlying SOL price</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section style={{ ...styles.section, background: '#000' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <h2 style={styles.sectionTitle}>
            Live Market Data
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid rgba(60, 165, 222, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#9ca3af' }}>Market Cap</span>
                <span style={{ fontSize: '1.5rem' }}>📊</span>
              </div>
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#3ca5de' }}>{marketData.marketCap}</div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid rgba(135, 67, 247, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#9ca3af' }}>TVL</span>
                <span style={{ fontSize: '1.5rem' }}>💵</span>
              </div>
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#8743f7' }}>{marketData.tvl}</div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#9ca3af' }}>Holders</span>
                <span style={{ fontSize: '1.5rem' }}>🪙</span>
              </div>
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#fcd34d' }}>{marketData.holders}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <button
              onClick={() => window.open(chartLink, '_blank')}
              style={{ padding: '1rem 2rem', borderRadius: '9999px', border: '2px solid #fff', background: '#000', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, transition: 'all 0.3s' }}
              className="hover-bg"
            >
              View Full Chart <span>↗</span>
            </button>
          </div>

          <div style={{ width: '100%', borderRadius: '1rem', overflow: 'hidden', border: '2px solid #3ca5de', minHeight: '400px' }}>
            <iframe
              src="https://dexscreener.com/solana/2mz5eNLTpCk2F6CvP1y9LWdUe6LUh1zqPa7bzPFYWns8?embed=1&theme=dark&trades=0"
              style={{ width: '100%', height: '400px', border: 'none' }}
              allowFullScreen
            />
          </div>
        </div>
      </section>

            {/* MoPass DCA Section */}
      <section id="MoPass" style={{ padding: '5rem 1.5rem', background: '#000' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(60, 165, 222, 0.2), rgba(135, 67, 247, 0.2))', 
            border: '3px solid #3ca5de', 
            borderRadius: '12px', 
            padding: '2.5rem',
            textAlign: 'center' as const
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
            
            <h2 style={{ 
              margin: '0 0 1rem 0', 
              color: '#ffffff', 
              fontSize: 'clamp(1.75rem, 4vw, 2rem)', 
              fontWeight: 'bold' 
            }}>
              Ready to Stack?
            </h2>
            
            <p style={{ 
              margin: '0 0 1.5rem 0', 
              color: '#d1d5db', 
              fontSize: 'clamp(1rem, 2vw, 1.125rem)', 
              lineHeight: 1.7,
              maxWidth: '48rem',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <strong style={{ color: '#3ca5de' }}>MoPass</strong> lets you dollar-cost average your MoCoin holdings by setting up recurring buys. Build your position automatically, month after month.
            </p>
            
            <p style={{ 
              margin: '0 0 2rem 0', 
              color: '#86efac', 
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', 
              fontWeight: 600 
            }}>
              ✅ Automated purchases • ✅ No volatility stress • ✅ Build wealth consistently
            </p>
            
            {/* Stripe Pricing Table */}
            <div style={{ 
              background: '#ffffff', 
              borderRadius: '8px', 
              padding: '1.25rem', 
              marginTop: '1.25rem' 
            }}>
              {React.createElement("stripe-pricing-table", {
                "pricing-table-id": "prctbl_1SamQfD06hPxM9TKz04yWprx",
                "publishable-key": "pk_live_51MhzlfD06hPxM9TKX3bZ25Op6Wv6xxKQFROtQx3BiJei2e1Ijw2g2nXWBppVkikTf72gjZXJe5qL9LlElTreOHnS003DwnnGIL",
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ ...styles.section, background: 'linear-gradient(to bottom, #000, rgba(88, 28, 135, 0.2), #000)' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 3.75rem)', fontWeight: 'bold', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #facc15, #f97316, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Stop Trading. Start Building.
          </h2>
          
          <p style={{ fontSize: '1.5rem', color: '#d1d5db', marginBottom: '3rem' }}>
            Join the ecosystem built for long-term value creation
          </p>

          <div style={{ background: 'linear-gradient(135deg, rgba(60, 165, 222, 0.2), rgba(135, 67, 247, 0.2))', padding: '3rem', borderRadius: '1.5rem', border: '2px solid rgba(60, 165, 222, 0.5)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <TypewriterEffect
                strings={[
                  "Exclusive launchpad access for holders - Projects like MetaParlour",
                  "Governance rights in the Mo Ecosystem",
                  "Revenue sharing from strategic reserves",
                  "Built by tomorrow's business leaders"
                ]}
                className="text-xl font-bold"
              />
            </div>

            <button
              onClick={handleBuyClick}
              style={{ background: 'linear-gradient(135deg, #3ca5de, #8743f7)', padding: '1.5rem 3rem', borderRadius: '9999px', fontWeight: 'bold', fontSize: '1.5rem', border: 'none', cursor: 'pointer', color: '#fff', marginBottom: '1.5rem', transition: 'all 0.3s' }}
              className="hover-scale"
            >
              💼 HODL MoCoin Today
            </button>

            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              Not financial advice. Always do your own research.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/*<footer id="whitepaper" style={{ padding: '3rem 1.5rem', background: '#000', borderTop: '1px solid #374151' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#3ca5de' }}>Resources</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#whitepaper" style={styles.link} className="link">Whitepaper v2.0</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#audit" style={styles.link} className="link">Audit Report</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#docs" style={styles.link} className="link">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#8743f7' }}>Community</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#telegram" style={styles.link} className="link">Telegram</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#discord" style={styles.link} className="link">Discord</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#twitter" style={styles.link} className="link">Twitter/X</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#86efac' }}>Ecosystem</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#modevz" style={styles.link} className="link">MoDevz</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#ank" style={styles.link} className="link">Ank Staking</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#launchpad" style={styles.link} className="link">Launchpad</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#metaparlour" style={styles.link} className="link">MetaParlour</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#fcd34d' }}>About</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#team" style={styles.link} className="link">Team</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#roadmap" style={styles.link} className="link">Roadmap</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#contact" style={styles.link} className="link">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
            <p>© 2025 MoCoin. All rights reserved.</p>
            <p style={{ marginTop: '0.5rem' }}>MoCoin is a decentralized financial asset. Not financial advice.</p>
          </div>
        </div>
      </footer>*/}
    </div>
  );
}
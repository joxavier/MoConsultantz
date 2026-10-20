// pages/devz/dashboard.js
'use client'
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import StripePricingTable from '../../components/PricingTable';

export default function Modevz() {
  const [isAnimated, setIsAnimated] = useState(false);
  const controls = useAnimation();

  const TypewriterComponent = dynamic(() => import('typewriter-effect'), { ssr: false });

  const dashboards = [
    {
      title: "Cybersecurity Dashboard",
      description: "Monitor and safeguard your company’s digital infrastructure in real-time.",
    },
    {
      title: "CRM Dashboard",
      description: "Enhance your customer relationships and streamline operations with an all-in-one view.",
    },
    {
      title: "Sales Performance Dashboard",
      description: "Track sales, optimize your team’s performance, and analyze trends."
    },
    {
      title: "Finance Dashboard",
      description: "Analyze financial data and make informed business decisions with ease."
    }
  ];

  useEffect(() => {
    controls.start({ opacity: 1 });
    setIsAnimated(true);
  }, [controls]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>
      <Head>
        <title>Modevz - Business Dashboards</title>
        <meta name="description" content="Explore Modevz's cutting-edge business dashboards for corporate clients. From cybersecurity to CRM, we offer the best solutions." />
        <link rel="canonical" href="https://modevz.ca" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Modevz - Business Dashboards" />
        <meta property="og:description" content="Explore Modevz's cutting-edge business dashboards for corporate clients. From cybersecurity to CRM, we offer the best solutions." />
      </Head>

      <Header />

      {/* Introduction */}
      <div style={{ maxWidth: '1320px' }}>
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
          <motion.div animate={{ opacity: isAnimated ? 1 : 0 }} style={{ textAlign: 'center' }}>
            <div className="font-bold text-4xl">Modevz</div>
            <div className="font-bold text-2xl" style={{ lineHeight: '1', marginTop: '-0.5rem' }}>
              Corporate Dashboards
            </div>
          </motion.div>
          <motion.p
            style={{
              opacity: isAnimated ? 1 : 0,
              fontSize: '1.2rem',
              textAlign: 'center',
              lineHeight: '1.5',
              width: '60%',
              display: 'flex',
              alignItems: 'center',
              minHeight: '32vh',
              maxWidth: '1080px',
              margin: '30px auto',
              fontFamily: 'monospace'
            }}
          >
            <TypewriterComponent
              options={{
                strings: [
                  "Unlock the full potential of your business with Modevz dashboards.",
                  "From cybersecurity monitoring to CRM optimization, we offer solutions to drive business growth.",
                  "Modevz provides top-tier tools for businesses to make data-driven decisions."
                ],
                autoStart: true,
                loop: true,
                delay: 70,
                deleteSpeed: 25,
              }}
            />
          </motion.p>

          {/* Dashboard Offerings */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', margin: '20px 0', padding: '20px' }}>
            {dashboards.map((dashboard, index) => (
              <motion.div key={index} style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '20px', border: '2px solid', borderRadius: '8px', marginBottom: '20px' }} animate={{ x: isAnimated ? 0 : (index % 2 === 0 ? 1000 : -1000) }}>
                <div style={{ textAlign: 'center' }}>
                  <h2 className="font-bold text-2xl" style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{dashboard.title}</h2>
                  <p style={{ fontFamily: 'monospace', fontSize: '1rem', margin: '0' }}>{dashboard.description}</p>
                </div>
                {/* Centering the button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                  <button style={{ backgroundColor: '#007BFF', color: '#fff', padding: '10px 20px', borderRadius: '5px', textAlign: 'center' }}>
                    Contact Sales for Demo
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pricing Table */}
          <div>
            <motion.div className="font-bold text-3xl text-center">Plans</motion.div>
            <StripePricingTable />
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}

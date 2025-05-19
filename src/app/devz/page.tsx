'use client'
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Image from "next/image";
import Header from '../components/Header';
import UnderConstructionPage from '../components/UnderConstructionPage';
import dynamic from 'next/dynamic';
import StripePricingTable from '../components/PricingTable';

export default function Devz() {
  const [isAnimated, setIsAnimated] = useState(false);
  const controls = useAnimation();

  const TypewriterComponent = dynamic(() => import('typewriter-effect'), { ssr: false });


  const benefits = [
    {
      title: "Web Development",
      description: "Boost your online presence with our tailored Web Development service. From setup to domain acquisition, we ensure a seamless experience. Specializing in custom designs and Next.js optimization for growth in the digital landscape."
    },
    {
      title: "E-Commerce",
      description: "Elevate your e-commerce venture with our comprehensive package. From online payment processing to inventory management, we ensure a seamless journey. Specializing in custom designs and social media content to boost your digital footprint."
    },
    {
      title: "Digital Marketing",
      description: "Amplify your online presence with our Digital Marketing solutions. Our expert team crafts tailored strategies to boost your brand visibility, engage your audience, and drive conversions, helping you reach your business goals effectively."
    },
    {
      title: "Cybersecurity",
      description: "Protect your business from online threats with our Cybersecurity services. We offer comprehensive solutions to safeguard your digital assets, including data encryption, threat detection, and proactive security measures, ensuring peace of mind in an increasingly interconnected world."
    }
  ];

  useEffect(() => {
    controls.start({ opacity: 1 });
    setIsAnimated(true);
  }, [controls]);


  //console.log(GetProducts())

  return (




    <main className="flex min-h-screen flex-col items-center justify-between p-10 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>
      <Header />

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
            <div className={` font-bold text-4xl`}>
              MoDevz
            </div>
            <div className={`font-bold text-2xl`} style={{ lineHeight: '1', marginTop: '-0.5rem' }}>
              Software Development
            </div>
          </motion.div>
          <motion.p
            style={{
              opacity: isAnimated ? 1 : 0,
              fontSize: '1.2rem', textAlign: 'center',
              lineHeight: '1.5', width: '60%',
              display: 'flex',
              alignItems: 'center',
              minHeight: '32vh',
              maxWidth: '1080px',
              margin: '30px auto',
              fontFamily: 'monospace'
            }}>
            <TypewriterComponent
              options={{
                strings: [
                  "Welcome to MoDevz, your hub for cutting-edge software solutions. From web development to cybersecurity, we've got you covered.",
                  "Our team crafts stunning visuals and lightning-fast, responsive sites. Plus, we future-proof your business with crypto enablement.",
                  "Whether you're a startup or an enterprise, MoDevz fuels your growth and success in the digital world.",
                ],
                autoStart: true,
                loop: true,
                delay: 70,
                deleteSpeed: 25,
              }}
            />
          </motion.p>

          {/* Benefits */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', margin: '20px 0', padding: '20px' }}>
            {benefits.map((benefit, index) => (
              <motion.div key={index} style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '20px', border: '2px solid', borderRadius: '8px', marginBottom: '20px' }} animate={{ x: isAnimated ? 0 : (index % 2 === 0 ? 1000 : -1000) }}>
                <div style={{ textAlign: 'center' }}>
                  <h2 className={` font-bold text-2xl`} style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{benefit.title}</h2>
                  <p style={{ fontFamily: 'monospace', fontSize: '1rem', margin: '0' }}>{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/*<div>
            <motion.div className={`font-bold text-3xl text-center`}>Plans</motion.div>
            <StripePricingTable />
          </div>*/}


        </motion.div>
        {/*<UnderConstructionPage redirectLink="https://sites.google.com/view/modevz/modevz" />*/}
      </div>
    </main>
  );
}

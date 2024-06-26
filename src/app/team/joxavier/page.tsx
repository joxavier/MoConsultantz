'use client'
import Image from "next/image";
import Header from './Header';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import personalPageData from '@/data/personalPage.json';
import socialData from '@/data/social.json'
import contactLinks from '@/data/contactLinks'
import qualificationsData from '@/data/qualifications.json';


import Hero from './Hero';
import Highlights from '../../components/Highlights';

import Feed from '../../components/Feed'
import QualificationsSection from "../../components/Qualifications";

import ExperiencesSection from '../../components/Experiences';
import ContactSection from '../../components/Contact'


export default function Home() {

  const { hero, highlights } = personalPageData;

  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-10 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>
      <Header />

      <div style={{ maxWidth: '1320px' }}>


        <Hero {...hero} />

        <Highlights highlights={highlights} />



        <div className={"aboutMe mt-10"} id={"about"}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '25vh' }}
        >
          <div className={"grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4"}>
            <div className="bio sm:order-first lg:order-last">
              <h1 style={{ color: 'rgb(28, 78, 110)', backgroundColor: 'dark' ? 'white' : 'none', marginBottom: 4 }}>About Me</h1>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '1.5' }}>
                At 21, I was completing my second undergraduate degree and had already made my first $100,000 from various jobs. Despite initial success, I chose a different path after graduating with dual degrees in Computer Science and Business. Instead of pursuing corporate roles, I focused on empowering small businesses in the digital era. Motivated by technology's transformative potential and the COVID-19 pandemic's impact, Mo was established. As Nipsey Hussle said, <strong>'The marathon continues.'</strong> This journey is not just about reaching the finish line but about embracing the challenges, staying committed to the cause, and leaving a lasting legacy that uplifts and empowers others
                <br /><br />
              </p>
            </div>
            <div className="social">
              <Feed imageData={socialData}></Feed>
            </div>

          </div>
          <button className={"customButton w-full sm:w-[full] lg:w-[auto]"}
            style={{
              backgroundColor: 'rgb(28, 78, 110)',
              color: '#fff',
              padding: '10px 20px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              boxShadow: "rgba(0, 0, 0, 0.12) 11px 10px 38px 0px"
            }}
          >
            <Link href="#contact">
              Grow Your Business!
            </Link>
          </button>
        </div>

        < QualificationsSection qualificationsData={qualificationsData} />
        <ExperiencesSection />
        <ContactSection contactLinks={contactLinks} />
      </div >
    </main >

  );
}

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

      <div style={{ maxWidth: '1320px'}}>


        <Hero {...hero} />

        <Highlights highlights={highlights} />



        <div className={"aboutMe mt-10"} id={"about"}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '25vh' }}
        >
          <div className={"grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4"}>
            <div className="bio sm:order-first lg:order-last">
              <h1 style={{ color: 'rgb(28, 78, 110)', backgroundColor: 'dark' ? 'white' : 'none', marginBottom: 4 }}>About Me</h1>
                <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '1.5' }}>
                By the age of 21, I had already completed my second undergraduate degree and amassed over $100,000 through various jobs. Despite this early success, I found myself at a crossroads upon graduating with dual degrees in Computer Science and Business. While many would have pursued lucrative careers with big tech companies, I was drawn to the rapidly evolving landscape of technology, particularly blockchain, and the unprecedented opportunities presented by the COVID-19 pandemic, which accelerated internet adoption worldwide.
                <br />
                Rather than opting for the conventional path, I felt a strong pull to give back to the community that shaped me. Instead of chasing corporate success, I chose to use my skills and resources to empower small businesses to thrive in the digital age. It was a decision rooted in my belief in the transformative power of technology and my desire to make a tangible impact where it mattered most.
                <br />
                On September 24th, 2023, Mo was officially incorporated in Canada. In the words of the late Nipsey Hussle, "The marathon continues." This journey is not just about reaching the finish line but about embracing the challenges, staying committed to the cause, and leaving a lasting legacy that uplifts and empowers others.
                </p>
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

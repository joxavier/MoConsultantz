'use client'
import Image from "next/image";
import Header from './Header';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import styles from '../../global.module.css';


import Feed from '../../components/Feed'
import socialData from '../data/social.json'

const StatCard = ({
  link,
  iconSrc,
  altText,
  title,
  description
}: {
  link: string,
  iconSrc: string,
  altText: string,
  title: string,
  description: string
}) => {
  return (
    <div >
      <a href={link}
        style={{
          alignItems: 'center',
          backgroundColor: "rgb(250, 250, 250)",
          boxShadow: "rgba(0, 0, 0, 0.12) 11px 10px 38px 0px",
          color: "rgb(28, 78, 110)",
          display: 'flex',
          fontSize: '19.2px',
          letterSpacing: '0.48px',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid transparent',
          height: '120px',
          textSizeAdjust: '100%',
          transitionBehavior: 'normal',
          transitionDelay: '0s',
          transitionDuration: '0.3s',
          transitionProperty: 'all',
          transitionTimingFunction: 'ease-in-out',
          visibility: 'visible',
        }}
      >
        <div className="icon mb-3"
          style={{
            display: 'flex',
            width: '60px',
          }}
        >
          <Image src={iconSrc} alt={altText} width={45} height={45} />
        </div>
        <div className="text" style={{ textAlign: 'center', width: '100%' }}>
          <h3 style={{ fontSize: "2rem" }}>{title}</h3>
          <p style={{ color: "#000", fontSize: "1rem" }}>{description}</p>
        </div>
      </a>
    </div>
  );
};

export default function Home() {
  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-10 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>
      <Header />

      <div className="relative mb-8 rounded-xl overflow-hidden w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] xl:h-[100vh]">
        <Image
          src="/hero.jpg"
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          className="rounded-xl hero-image"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-bold">
            <span className="text-shadow-black text-outline-black">
              Tech &
              <br />
              Business
            </span>
          </h1>
          <button
            onClick={() => window.location.href = '#contact'} // Change this to the appropriate navigation method
            className="mt-8 px-8 py-4 bg-black text-white rounded-full transition-all hover:bg-white hover:text-black transform"
          >
            Connect
          </button>
        </div>
      </div>

      <div className={`mb-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8`}
        style={{ transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out', margin: '20px 0', width: "100%" }}>
        <StatCard
          link="#education"
          iconSrc="icons/Award.svg"
          altText="Awarder Web Developer"
          title="2+"
          description="Degrees"
        />
        <StatCard
          link="#experience"
          iconSrc="icons/Target.svg"
          altText="Experienced Web Developer"
          title="9+"
          description="Years of Experience"
        />
        <StatCard
          link="#reviews"
          iconSrc="icons/Customer.svg"
          altText="Top Rated Web Developer"
          title="7+"
          description="Satisfied Clients"
        />
      </div>

        <div className={"aboutMe mt-10"}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}
        >
          <div className={"grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4"}>
            <div className="bio sm:order-first lg:order-last">
              <h1 style={{ color: 'rgb(28, 78, 110)', backgroundColor: 'dark' ? 'white' : 'none', marginBottom:4}}>About Me</h1>
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '1.5' }}
              >I am a Full-Stack Web Developer specializing in Web3 projects.  I am pursuing my CISSP certification to demonstrate my cybersecurity expertise.
                <br></br><strong>Growing your business in my passion</strong></p>
            </div>
            <div className="social">
              <Feed imageData={socialData}></Feed>
            </div>

          </div>
          <button className={`${styles.customButton} w-full sm:w-[full] lg:w-[auto]`}
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


      <div className="contact" id='Contact'></div>

    </main>

  );
}

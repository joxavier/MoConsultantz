'use client'
import Image from "next/image";
import Header from './Header';
import React, { useState, useEffect } from 'react';

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

    <main className="flex min-h-screen flex-col items-center justify-between p-24 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>
      <Header />

      <div className="relative mt-8 rounded-xl overflow-hidden w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] xl:h-[100vh]">
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
          link="#work"
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
    </main>

  );
}

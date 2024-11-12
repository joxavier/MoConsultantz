'use client'
import Image from "next/image";
import Header from '../components/Header';
import Footer from "../components/Footer";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import personalPageData from '../../data/homePage.json';
import Hero from './Hero';
import Highlights from '../components/Highlights';
import TrustedBySlider from "../components/Slider";

export default function Home() {

  const { hero, highlights } = personalPageData;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10 pt-32 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>
      <Header />

      <div style={{ maxWidth: '1320px'}}>

        <Hero {...hero} />

        <Highlights highlights={highlights} />


      </div >

      <div style={{ maxWidth: '620px'}}>

        <TrustedBySlider/>
      </div>

      <Footer />
    </main >
  );
}

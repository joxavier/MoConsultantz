"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import personalPageData from "../../data/homePage.json";
import Hero from "./Hero";
import Highlights from "../components/Highlights";
import TrustedBySlider from "../components/Slider";

export default function Home() {
  const { hero, highlights } = personalPageData;

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-10 pt-32 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: "Anton, sans-serif" }}
    >
      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6">
        <Hero {...hero} />
        <Highlights highlights={highlights} />
      </div>

      <div className="w-full max-w-[620px] mx-auto px-4 sm:px-6 mt-8 mb-8">
        <TrustedBySlider />
      </div>
    </main>
  );
}

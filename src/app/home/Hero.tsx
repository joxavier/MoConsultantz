import Image from 'next/image';
import { HeroData } from '@/data/types/PersonalPage';
import React from 'react';

const Hero: React.FC<HeroData> = ({ imageUrl, altText, title, buttonText, buttonLink }) => {
  return (
    <div className="hero relative mb-8 overflow-hidden flex flex-col md:flex-row items-center justify-center w-full">
      <Image
        src={imageUrl}
        alt={altText}
        width={500}  // Adjust width as needed
        height={300}  // Adjust height as needed
        className="mb-4 sm:mb-0 sm:mr-4 rounded-xl sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2"
      />

      <div className="cta sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 flex flex-col items-center justify-end text-center p-10">
        <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl text-black font-bold">
          <span className="text-shadow-black text-outline-black">{title}
          </span>
        </h1>
        <button
          onClick={() => window.location.href = buttonLink}
          className="mt-8 px-8 py-4 bg-black text-white rounded-full transition-all hover:bg-white hover:text-black transform"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Hero;


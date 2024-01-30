import Image from 'next/image';
import { HeroData } from '@/types/PersonalPage';

const Hero = ({ imageUrl, altText, title, buttonText, buttonLink }: HeroData) => {
  return (
    <div style={{ maxWidth: '1320px' }}>
      <div className="relative mb-8 rounded-xl overflow-hidden w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] xl:h-[100vh]">
        <Image
          src={imageUrl}
          alt={altText}
          layout="fill"
          objectFit="cover"
          className="rounded-xl hero-image"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-bold">
            <span className="text-shadow-black text-outline-black">{title}</span>
          </h1>
          <button
            onClick={() => window.location.href = buttonLink}
            className="mt-8 px-8 py-4 bg-black text-white rounded-full transition-all hover:bg-white hover:text-black transform"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

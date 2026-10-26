// components/TrustedBySlider.tsx
import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//import { EmblaOptionsType } from 'embla-carousel'
//import Autoplay from 'embla-carousel-autoplay'
//import useEmblaCarousel from 'embla-carousel-react'

const TrustedBySlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
  };

  const logos = [
    '/qualifications/bestbuy.png',
    '/qualifications/nissan.jpg',
    '/qualifications/NCR.png',
    '/qualifications/manulife.png',
    '/qualifications/LAFitness.png',
    '/qualifications/metaparlour.png',
  ];

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h3 style={{ padding: '20px' }}>Trusted By:</h3>
      <Slider {...settings} >
        {logos.map((logo, index) => (
          <div key={index} style={{
          }}>
            <Image src={logo} alt={`Logo ${index + 1}`} width={100} height={50} style={{
              margin: ' 0 auto',
            }} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TrustedBySlider;

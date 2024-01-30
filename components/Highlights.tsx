import React from 'react';
import { HighlightData } from '../src/types/PersonalPage';
import Image from "next/image";

interface HighlightsProps {
  highlights: HighlightData[];
}

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

const Highlights: React.FC<HighlightsProps> = ({ highlights }) => {
  return (
    <div className={`mb-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8`}
      style={{ transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out', margin: '20px 0', width: "100%" }}>
      {highlights.map((highlight, index) => (
        <StatCard
          key={index}
          link={highlight.link}
          iconSrc={highlight.iconSrc}
          altText={highlight.altText}
          title={highlight.title}
          description={highlight.description}
        />
      ))}
    </div>
  );
};

export default Highlights;

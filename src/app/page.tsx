'use client'
import Image from "next/image";
import Header from './Header';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import styles from '../../global.module.css';


import Feed from '../../components/Feed'
import socialData from '../data/social.json'
import qualificationsData from '../data/qualifications.json';

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
const QualificationsIcon = ({
  title,
  iconSrc,
  altText,
  onClick
}: {
  title: string,
  iconSrc: string,
  altText: string,
  onClick?: () => void;
}) => {

  const [isHovered, setIsHovered] = useState(false);

  return (
    <li className="has-tooltip" style={{
      animationDelay: '50ms',
      opacity: 1,
      visibility: 'inherit',
      transform: 'translate(0px, 0px)',
      display: 'flex',
      height: '100px',
      width: '100px',
      backgroundColor: 'white',
      boxShadow: "rgba(0, 0, 0, 0.12) 11px 10px 38px 0px",
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '15%',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="skill-container" style={{ textAlign: 'center', position: 'relative' }}>
        <div
          className="skill-icon"
          style={{
            transition: 'opacity 0.3s ease-in-out',
            opacity: isHovered ? 0.4 : 1,
          }}
        >
          <img
            src={iconSrc}
            alt={altText}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
            }} />
        </div>
      </div>
    </li>
  );
};

const DegreeCard = ({
  iconSrc,
  altText,
  degree,
  description,
  institution,
  onClose
}: {
  iconSrc: string,
  altText: string,
  degree: string,
  description?: string,
  institution: string;
  onClose: () => void;
}) => {
  return (
    <div
      className="rounded-rectangle"
      style={{
        width: '300px',
        minHeight: '420px',
        height: '50vh',
        backgroundColor: 'white', // Set your preferred background color
        color: 'black', // Set your preferred text color
        textAlign: 'center',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: '15px',
        boxShadow: "rgba(0, 0, 0, 0.12) 11px 10px 38px 0px",
        zIndex: 999, // Adjust the z-index to make sure it's on top
      }}
    >
      <button
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          marginRight: '4px',
          fontSize: '32px'
        }}
        onClick={onClose}
      >
        X
      </button>
      <div className='p-10'>

        <Image
          src={iconSrc}
          alt={altText}
          width={280}
          height={280}
          style={{ margin: '20px auto 10px auto', display: 'flex', borderRadius: '15px' }}
        />
      </div>
      <h1 style={{ fontSize: '20px', lineHeight: '1.5', padding: '10px' }}>
        {degree}</h1>
      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '1.5' }}>
        {description}
      </p>
      <p><i>{institution}</i></p>
      <div
        style={{
          position: 'absolute',
          top: '-7px',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderBottom: '15px solid white', // Adjust the size and color of the triangle
          boxShadow: "rgba(0, 0, 0, 0.12) 11px 10px 38px 0px",
        }}
      />
    </div>
  );
};


export default function Home() {
  const [activeContent, setActiveContent] = useState<'degrees' | 'skills' | 'tools'>('degrees');

  const switchButtonStyle: React.CSSProperties = {
    // Your common styles for switch buttons
    cursor: 'pointer',
    padding: '8px 16px',
    width: '90px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center', // Center the text vertically
    justifyContent: 'center', // Center the text horizontally
    transition: 'background-color 0.3s, color 0.3s',
    color: 'black',
  };

  const activeSwitchButtonStyle: React.CSSProperties = {
    // Your styles for the active switch button
    backgroundColor: 'black',
    color: 'white',
  };

  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const handleQualificationClick = (title: string) => {
    setSelectedTitle(title);
  };

  const handleCloseModal = () => {
    setSelectedTitle(null);
  };

  interface Qualification {
    id: string;
    title: string;
    iconSrc: string;
    altText: string;
    // Add other properties as needed
  }

  const renderQualificationIcons = (qualifications: Qualification[]) => {
    return qualifications.map((qualification) => (
      <QualificationsIcon
        key={qualification.id}
        title={qualification.title}
        iconSrc={qualification.iconSrc}
        altText={qualification.altText}
        onClick={() => handleQualificationClick(qualification.id)}
      />
    ));
  };

  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-10 sm:p-10 md:p-24 lg:p-32 font"
      style={{ fontFamily: 'Anton, sans-serif' }}>
      <Header />

      <div style={{ maxWidth: '1320px' }}>

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
              <h1 style={{ color: 'rgb(28, 78, 110)', backgroundColor: 'dark' ? 'white' : 'none', marginBottom: 4 }}>About Me</h1>
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

        <div className={"qualifications mt-10"} id='education'
          style={{ minHeight: '50vh' }}
        >
          <div style={{ alignItems: 'center' }}>
            <h1 style={{ color: 'rgb(28, 78, 110)', backgroundColor: 'dark' ? 'white' : 'none', marginBottom: 4 }}>Qualifications</h1>
            <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '1.5', marginBottom: '40px' }}>
              My vast range of experiences qualifies me to execute roles.</p>

            <div className="qualificationsSwitch"
              style={{
                display: 'flex', margin: "15px auto", backgroundColor: '#f0f0f0', border: '2px solid #000',
                borderRadius: '12px', width: 'fit-content'
              }}>
              <div className="switch-button" onClick={() => setActiveContent('degrees')} style={{ ...switchButtonStyle, ...(activeContent === 'degrees' && activeSwitchButtonStyle) }}>Degrees</div>
              <div className="switch-button" onClick={() => setActiveContent('skills')} style={{ ...switchButtonStyle, ...(activeContent === 'skills' && activeSwitchButtonStyle) }}>Skills</div>
              <div className="switch-button" onClick={() => setActiveContent('tools')} style={{ ...switchButtonStyle, ...(activeContent === 'tools' && activeSwitchButtonStyle) }}>Tools</div>
            </div>
          </div>

          <div style={{ display: 'flex', width: 'fit-content', margin: '0 auto' }}>
            <ul className="degrees mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4" style={{ display: activeContent === 'degrees' ? 'grid' : 'none' }}>
              {renderQualificationIcons(qualificationsData.degrees)}
            </ul>

            <ul className="skills mb-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4" style={{
              display: activeContent === 'skills' ? 'grid' : 'none',
            }}>
              {renderQualificationIcons(qualificationsData.skills)}
            </ul>

            <ul className="degrees mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4" style={{ display: activeContent === 'tools' ? 'grid' : 'none' }}>
              {renderQualificationIcons(qualificationsData.tools)}
            </ul>

          </div>

          {selectedTitle && (
            <div>
              {qualificationsData[activeContent]
                .filter(qualification => qualification.id === selectedTitle)
                .map(qualification => (
                  <DegreeCard
                    key={qualification.id}
                    iconSrc={qualification.iconSrcLg}
                    altText={qualification.altText}
                    degree={qualification.degree}
                    description={qualification.description}
                    institution={qualification.institution}
                    onClose={handleCloseModal}
                  />
                ))}
            </div>
          )}
        </div>

        <div className="contact" id='Contact'></div>
      </div >

    </main >

  );
}

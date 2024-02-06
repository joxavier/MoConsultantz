// components/DegreeCard.tsx

import React from 'react';
import Image from 'next/image';

interface DegreeCardProps {
  iconSrc: string;
  altText: string;
  degree: string;
  description?: string;
  institution: string;
  onClose: () => void;
}

const DegreeCard: React.FC<DegreeCardProps> = ({
  iconSrc,
  altText,
  degree,
  description,
  institution,
  onClose
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

export default DegreeCard;

// components/Bio.tsx

import React from 'react';
import { BioData } from '@/types/PersonalPage';

interface BioProps {
  bioData: BioData;
}

const Bio: React.FC<BioProps> = ({ bioData }) => {
  return (
    <div className="aboutMe mt-10" id="about" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bio sm:order-first lg:order-last">
          <h1 style={{ color: 'rgb(28, 78, 110)', backgroundColor: 'dark' ? 'white' : 'none', marginBottom: 4 }}>{bioData.title}</h1>
          <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '1.5' }}>
            {bioData.about}
          </p>
        </div>
        {/* Add your social component here */}
      </div>
      <button className="your-button-styles-here">
        {/* Add your button content */}
      </button>
    </div>
  );
};

export default Bio;
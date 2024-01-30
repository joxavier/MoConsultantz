// components/QualificationsSection.tsx

import React, { useState } from 'react';
import DegreeCard from './DegreeCard'; // Make sure to adjust the import path based on your project structure
import QualificationsIcon from './QualificationIcon';

interface Qualification {
  id: string;
  title: string;
  iconSrc: string;
  iconSrcLg: string;
  altText: string;
  degree: string;
  description?: string;
  institution: string;
}

interface QualificationsSectionProps {
  qualificationsData: {
    degrees: Qualification[];
    skills: Qualification[];
    tools: Qualification[];
  };
}

const QualificationsSection: React.FC<QualificationsSectionProps> = ({ qualificationsData }) => {
  const [activeContent, setActiveContent] = useState<'degrees' | 'skills' | 'tools'>('degrees');
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

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

  const handleQualificationClick = (title: string) => {
    setSelectedTitle(title);
  };

  const handleCloseModal = () => {
    setSelectedTitle(null);
  };

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
    <div className={"qualifications mt-10"} id='qualifications'
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
  );
};

export default QualificationsSection;

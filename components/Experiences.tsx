// components/ExperiencesSection.tsx

import React from 'react';
import QualificationsIcon from './QualificationIcon';

const ExperiencesSection: React.FC = () => {
  return (
    <div className="experience" id="experiences">
      <h1>Experiences</h1>
      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '1.5' }}>
        My years of experience span many organizations
      </p>
      <div style={{ display: 'flex', width: 'fit-content', margin: '0 auto' }}>
        <ul className="skills mt-4 mb-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <QualificationsIcon title="XavierAcademy" iconSrc="qualifications/XavierAcademy.svg" altText="XavierAcademy Logo" />
          <QualificationsIcon title="Metaparlour" iconSrc="https://metaparlour.io/metaparlour.svg" altText="Metaparlour Logo" />
          <QualificationsIcon title="LA Fitness" iconSrc="qualifications/LAFitness.png" altText="LA Fitness Logo" />
          <QualificationsIcon title="NCR" iconSrc="qualifications/NCR.png" altText="NCR Logo" />
          <QualificationsIcon title="Manulife" iconSrc="qualifications/manulife.png" altText="Manulife Logo" />
          <QualificationsIcon title="Nissan" iconSrc="qualifications/nissan.jpg" altText="Nissan Logo" />
          <QualificationsIcon title="Best Buy" iconSrc="qualifications/bestbuy.jpg" altText="BestBuy Logo" />
        </ul>
      </div>
    </div>
  );
};

export default ExperiencesSection;

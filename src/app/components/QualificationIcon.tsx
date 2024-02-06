// components/QualificationsIcon.tsx

import React, { useState } from 'react';

interface QualificationsIconProps {
  title: string;
  iconSrc: string;
  altText: string;
  onClick?: () => void;
}

const QualificationsIcon: React.FC<QualificationsIconProps> = ({
  title,
  iconSrc,
  altText,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className="has-tooltip"
      style={{
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
              width: '110px',
              height: '110px',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    </li>
  );
};

export default QualificationsIcon;

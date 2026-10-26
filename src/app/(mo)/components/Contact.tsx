// components/ContactSection.tsx
import React from 'react';

interface ContactSectionProps {
    contactLinks: ContactLinks[];
  }

  interface ContactLinks {
    icon: React.ReactNode;
    url: string;
  }

  const ContactSection: React.FC<ContactSectionProps> = ({  contactLinks }) => {
  return (
    <div className="contact" id="contact" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <h1>Contact Me</h1>
      <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '1.5' }}>
        Reach out to me! I am available on all platforms
      </p>
      <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <a
          href={'https://booking.setmore.com/scheduleappointment/9c25b029-94d9-4790-bf2e-4791b9dcbc2e'}
          target="_blank"
          style={{
            textDecoration: 'none',
            backgroundColor: '#4CAF50',
            boxShadow: 'rgba(0, 0, 0, 0.12) 11px 10px 38px 0px',
            color: 'white',
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            display: 'inline-block',
          }}
        >
          Book a Free Consultation
        </a>
        <p style={{ fontSize: '12px', color: '#555', lineHeight: '3' }}>Mention "Free Consultation" in comments when booking</p>
      </div>

      <div className="contactLinks flex mt-5" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
        {contactLinks.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
            <h2 style={{ fontSize: '32px', margin: '8px' }}>{link.icon}</h2>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ContactSection;

"use client";
import { FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MobileFooter from './mobile_footer';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

const Footer = () => {
  const isMobile = useIsMobile();

  if (isMobile) return <MobileFooter />;

  return (
    <footer className="py-6">
      <div className="container mx-auto flex justify-center">
        <div className='flex justify-center mt-10 text-xl gap-6'>
          <Link href="https://www.instagram.com/movestmentz/">
            <FaInstagram size={42} />
          </Link>
          <Link href="https://www.tiktok.com/@movestmentz">
            <FaTiktok size={42} />
          </Link>
          <Link href="https://www.twitter.com/@moVestmentz">
            <FaTwitter size={42} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

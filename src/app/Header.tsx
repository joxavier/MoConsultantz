import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Hamburger from 'hamburger-react';
import Link from 'next/link';


const Header = () => {
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsHeaderVisible(scrollTop === 0); // Set visibility based on scroll position
        };
        const handleResize = () => {
            // Check if the screen width is less than a certain threshold (e.g., 768px)
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        handleResize();

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <header style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'fixed',
            width: '100%',
            height: '100px',
            maxWidth: '1300px',
            top: isHeaderVisible ? 0 : '-100px', // Move off-screen when not visible
            transition: 'top 0.3s ease-in-out', // Add transition effect for smoother animation
            zIndex: 1000,
            fontFamily: 'Anton, sans-serif', // Apply Anton font
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '32%', padding: '5px' }}>
                    <Image
                        src="/mo.svg"
                        alt="MO Logo"
                        width={40} // Adjust the width as needed
                        height={40} // Adjust the height as needed
                    />
                </div>
                <div style={{ marginLeft: '15px', marginRight: '30px', fontSize: '2em' }}>JOSHUA XAVIER</div>
            </div>

            {isMobile ? (
                <>
                    <div style={{ marginLeft: 'auto', marginRight: '20px', cursor: 'pointer' }} onClick={toggleMenu}>
                        <Hamburger size={24} color={'white'} toggled={isMenuOpen} toggle={setMenuOpen} />
                    </div>
                    {isMenuOpen &&
                        <div
                            style={{
                                position: 'fixed',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                height: 'calc(100% - 100px)',
                                backgroundColor: 'white',
                                padding: '20px',
                                boxSizing: 'border-box',
                                zIndex: 999,
                            }}
                        >

                            <nav>
                                <ul style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <MenuItem link="#about" text="About" onClick={toggleMenu} />
                                    <MenuItem link="#skills" text="Skills" onClick={toggleMenu} />
                                    <MenuItem link="#work" text="Work" onClick={toggleMenu} />
                                    <MenuItem link="#contact" text="Contact" onClick={toggleMenu} />
                                </ul>
                            </nav>
                        </div>
                    }
                </>


            ) : (
                // Navigation for larger screens
                <nav >
                    <ul style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex' }}>
                        <li style={{ marginRight: '30px' }}><a href="#about" style={{ textDecoration: 'none', color: '#fff' }}>About.</a></li>
                        <li style={{ marginRight: '30px' }}><a href="#skills" style={{ textDecoration: 'none', color: '#fff' }}>Skills.</a></li>
                        <li style={{ marginRight: '30px' }}><a href="#work" style={{ textDecoration: 'none', color: '#fff' }}>Work.</a></li>
                        <li style={{ marginRight: '30px' }}><a href="#contact" style={{ textDecoration: 'none', color: '#fff' }}>Contact.</a></li>
                    </ul>
                </nav>
            )
            }

        </header>
    );
};

interface MenuItemProps {
    link: string;
    text: string;
    onClick: () => void;
  }
  
  const MenuItem: React.FC<MenuItemProps> = ({ link, text, onClick }) => (
    <li style={{ marginBottom: '20px', fontSize: '4em', cursor: 'pointer' }} onClick={onClick}>
      <Link href={link}>
        <h1 style={{ textDecoration: 'none', color: 'black', textAlign: 'center' }}>{text}</h1>
      </Link>
    </li>
  );

export default Header;

"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Hamburger from 'hamburger-react';
import Link from 'next/link';
import servicesData from '../services/services.json'; // Adjust path as needed

interface Service {
    description: string;
    services: Array<{
        service: string;
        features: string[];
    }>;
}

interface ServicesData {
    MoConsultantz: Service;
    MoVestmentz: Service;
    MoDevz: Service;
}

const Header = () => {
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const services: ServicesData = servicesData;

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const handleDropdownToggle = (dropdownName: string) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };

    const closeDropdown = () => {
        setActiveDropdown(null);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsHeaderVisible(scrollTop === 0);
        };
        
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
                closeDropdown();
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        document.addEventListener('click', handleClickOutside);

        handleResize();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [activeDropdown]);

    const renderServicesDropdown = () => {
        const isActive = activeDropdown === 'services';

        return (
            <li className="dropdown-container" style={{ marginRight: '30px', position: 'relative' }}>
                <button
                    onClick={() => handleDropdownToggle('services')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: 'inherit',
                        fontFamily: 'inherit',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    Services.
                    <span style={{ 
                        transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                    }}>
                        ▼
                    </span>
                </button>

                {isActive && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        padding: '25px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
                        zIndex: 1001,
                        marginTop: '15px',
                        width: '600px',
                        maxWidth: '90vw',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '30px'
                    }}>
                        {/* MoConsultantz Column */}
                        <div>
                            <Link 
                                href="/consultantz" 
                                onClick={closeDropdown}
                                style={{ textDecoration: 'none' }}
                            >
                                <h3 style={{
                                    color: '#fff',
                                    fontSize: '1.1em',
                                    marginBottom: '15px',
                                    borderBottom: '2px solid #fff',
                                    paddingBottom: '8px',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease'
                                }}>
                                    MoConsultantz
                                </h3>
                            </Link>
                            <ul style={{
                                listStyle: 'none',
                                padding: '0',
                                margin: '0'
                            }}>
                                {services.MoConsultantz.services.map((service, serviceIndex) => (
                                    <li key={serviceIndex}>
                                        <Link
                                            href={`/services/${encodeURIComponent(service.service)}`}
                                            style={{
                                                color: '#fff',
                                                textDecoration: 'none',
                                                display: 'block',
                                                padding: '8px 0',
                                                fontSize: '0.85em',
                                                borderLeft: '2px solid transparent',
                                                paddingLeft: '8px',
                                                transition: 'all 0.2s ease',
                                                lineHeight: '1.3'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderLeftColor = '#fff';
                                                e.currentTarget.style.paddingLeft = '12px';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderLeftColor = 'transparent';
                                                e.currentTarget.style.paddingLeft = '8px';
                                            }}
                                            onClick={closeDropdown}
                                        >
                                            {service.service}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* MoVestmentz Column */}
                        <div>
                            <Link 
                                href="/vestmentz" 
                                onClick={closeDropdown}
                                style={{ textDecoration: 'none' }}
                            >
                                <h3 style={{
                                    color: '#fff',
                                    fontSize: '1.1em',
                                    marginBottom: '15px',
                                    borderBottom: '2px solid #fff',
                                    paddingBottom: '8px',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease'
                                }}>
                                    MoVestmentz
                                </h3>
                            </Link>
                            <ul style={{
                                listStyle: 'none',
                                padding: '0',
                                margin: '0'
                            }}>
                                {services.MoVestmentz.services.map((service, serviceIndex) => (
                                    <li key={serviceIndex}>
                                        <Link
                                            href={`/services/${encodeURIComponent(service.service)}`}
                                            style={{
                                                color: '#fff',
                                                textDecoration: 'none',
                                                display: 'block',
                                                padding: '8px 0',
                                                fontSize: '0.85em',
                                                borderLeft: '2px solid transparent',
                                                paddingLeft: '8px',
                                                transition: 'all 0.2s ease',
                                                lineHeight: '1.3'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderLeftColor = '#fff';
                                                e.currentTarget.style.paddingLeft = '12px';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderLeftColor = 'transparent';
                                                e.currentTarget.style.paddingLeft = '8px';
                                            }}
                                            onClick={closeDropdown}
                                        >
                                            {service.service}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* MoDevz Column */}
                        <div>
                            <Link 
                                href="/devz" 
                                onClick={closeDropdown}
                                style={{ textDecoration: 'none' }}
                            >
                                <h3 style={{
                                    color: '#fff',
                                    fontSize: '1.1em',
                                    marginBottom: '15px',
                                    borderBottom: '2px solid #fff',
                                    paddingBottom: '8px',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease'
                                }}>
                                    MoDevz
                                </h3>
                            </Link>
                            <ul style={{
                                listStyle: 'none',
                                padding: '0',
                                margin: '0'
                            }}>
                                {services.MoDevz.services.map((service, serviceIndex) => (
                                    <li key={serviceIndex}>
                                        <Link
                                            href={`/services/${encodeURIComponent(service.service)}`}
                                            style={{
                                                color: '#fff',
                                                textDecoration: 'none',
                                                display: 'block',
                                                padding: '8px 0',
                                                fontSize: '0.85em',
                                                borderLeft: '2px solid transparent',
                                                paddingLeft: '8px',
                                                transition: 'all 0.2s ease',
                                                lineHeight: '1.3'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderLeftColor = '#fff';
                                                e.currentTarget.style.paddingLeft = '12px';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderLeftColor = 'transparent';
                                                e.currentTarget.style.paddingLeft = '8px';
                                            }}
                                            onClick={closeDropdown}
                                        >
                                            {service.service}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </li>
        );
    };

    const renderMobileServices = () => {
        const isActive = activeDropdown === 'services';

        return (
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => handleDropdownToggle('services')}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '2.5em',
                        cursor: 'pointer',
                        color: 'black',
                        textAlign: 'center',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        margin: 0,
                        padding: 0
                    }}
                >
                    Services
                    <span style={{ 
                        transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        fontSize: '0.5em'
                    }}>
                        ▼
                    </span>
                </button>

                {isActive && (
                    <div style={{
                        backgroundColor: '#f5f5f5',
                        padding: '20px',
                        borderRadius: '8px',
                        marginTop: '10px'
                    }}>
                        {/* Mobile MoConsultantz */}
                        <div style={{ marginBottom: '25px' }}>
                            <Link href="/consultantz" onClick={toggleMenu} style={{ textDecoration: 'none' }}>
                                <h3 style={{
                                    fontSize: '1.3em',
                                    marginBottom: '15px',
                                    textAlign: 'center',
                                    color: '#333',
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: '8px'
                                }}>
                                    MoConsultantz
                                </h3>
                            </Link>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {services.MoConsultantz.services.map((service, serviceIndex) => (
                                    <Link
                                        key={serviceIndex}
                                        href={`/services/${encodeURIComponent(service.service)}`}
                                        onClick={toggleMenu}
                                        style={{
                                            color: '#333',
                                            textDecoration: 'none',
                                            fontSize: '0.9em',
                                            textAlign: 'center',
                                            padding: '8px',
                                            backgroundColor: 'white',
                                            borderRadius: '4px',
                                            border: '1px solid #eee'
                                        }}
                                    >
                                        {service.service}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Mobile MoVestmentz */}
                        <div style={{ marginBottom: '25px' }}>
                            <Link href="/vestmentz" onClick={toggleMenu} style={{ textDecoration: 'none' }}>
                                <h3 style={{
                                    fontSize: '1.3em',
                                    marginBottom: '15px',
                                    textAlign: 'center',
                                    color: '#333',
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: '8px'
                                }}>
                                    MoVestmentz
                                </h3>
                            </Link>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {services.MoVestmentz.services.map((service, serviceIndex) => (
                                    <Link
                                        key={serviceIndex}
                                        href={`/services/${encodeURIComponent(service.service)}`}
                                        onClick={toggleMenu}
                                        style={{
                                            color: '#333',
                                            textDecoration: 'none',
                                            fontSize: '0.9em',
                                            textAlign: 'center',
                                            padding: '8px',
                                            backgroundColor: 'white',
                                            borderRadius: '4px',
                                            border: '1px solid #eee'
                                        }}
                                    >
                                        {service.service}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Mobile MoDevz */}
                        <div>
                            <Link href="/devz" onClick={toggleMenu} style={{ textDecoration: 'none' }}>
                                <h3 style={{
                                    fontSize: '1.3em',
                                    marginBottom: '15px',
                                    textAlign: 'center',
                                    color: '#333',
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: '8px'
                                }}>
                                    MoDevz
                                </h3>
                            </Link>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {services.MoDevz.services.map((service, serviceIndex) => (
                                    <Link
                                        key={serviceIndex}
                                        href={`/services/${encodeURIComponent(service.service)}`}
                                        onClick={toggleMenu}
                                        style={{
                                            color: '#333',
                                            textDecoration: 'none',
                                            fontSize: '0.9em',
                                            textAlign: 'center',
                                            padding: '8px',
                                            backgroundColor: 'white',
                                            borderRadius: '4px',
                                            border: '1px solid #eee'
                                        }}
                                    >
                                        {service.service}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

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
            top: isHeaderVisible ? 0 : '-100px',
            transition: 'top 0.3s ease-in-out',
            zIndex: 1000,
            fontFamily: 'Anton, sans-serif',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '32%', padding: '5px' }}>
                    <Link href="/" aria-label="MoDevz home">
                        <Image
                            src="/mo.svg"
                            alt="MO Logo"
                            width={40}
                            height={40}
                            style={{ width: '40px', height: '40px' }}
                        />
                    </Link>
                </div>
            </div>

            {isMobile ? (
                <>
                    <div style={{ marginLeft: 'auto', marginRight: '20px', cursor: 'pointer' }} onClick={toggleMenu}>
                        <Hamburger size={24} color={'white'} toggled={isMenuOpen} toggle={setMenuOpen} />
                    </div>
                    {isMenuOpen && (
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
                                overflowY: 'auto'
                            }}
                        >
                            <nav>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <MenuItem link="/about" text="About Us" onClick={toggleMenu} />
                                    {renderMobileServices()}
                                    <MenuItem link="/technical-consulting" text="Work With Us" onClick={toggleMenu} />
                                    <MenuItem link="/moos" text="MoOS" onClick={toggleMenu} />
                                </div>
                            </nav>
                        </div>
                    )}
                </>
            ) : (
                <nav>
                    <ul style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'flex' }}>
                        <li style={{ marginRight: '30px' }}>
                            <a href="/about" style={{ textDecoration: 'none', color: '#fff' }}>About Us.</a>
                        </li>
                        {renderServicesDropdown()}
                        <li style={{ marginRight: '30px' }}>
                            <Link href="/technical-consulting" style={{ textDecoration: 'none', color: '#fff', border: '1px solid #fff', borderRadius: '999px', padding: '10px 16px' }}>Work With Us</Link>
                        </li>
                        <li style={{ marginRight: '30px' }}>
                            <a href="/moos" style={{ textDecoration: 'none', color: '#fff' }}>MoOS.</a>
                        </li>
                    </ul>
                </nav>
            )}
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

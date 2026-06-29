"use client";
import { useState, useRef } from "react";
import Head from "next/head";
import { useTheme } from "next-themes";
import Image from "next/image";
import Highlights from "./Highlights";
import personalPageData from "@/data/personalPage.json";

export default function PersonalPage() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "consultation",
  });
  const moreInfoRef = useRef<HTMLDivElement>(null);
  const { hero, highlights } = personalPageData;

  const handleSaveContact = () => {
    const contact = {
      name: "Joshua Xavier",
      company: "Mo - Where Small Business Happens",
      email: "josh@modevz.ca",
      phone: "+1-647-687-1183",
      website: "https://josh.modevz.ca",
    };

    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
ORG:${contact.company}
EMAIL:${contact.email}
TEL:${contact.phone}
URL:${contact.website}
END:VCARD`;

    const blob = new Blob([vCard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Josh-Xavier-MoDevz-contact.vcf";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBookingSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Here you would integrate with your payment processor
    alert(
      "Booking form submitted! This would integrate with your payment system."
    );
    setShowBookingForm(false);
  };

  const scrollToMoreInfo = () => {
    moreInfoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const socialLinks = [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/joxavier-3299/", icon: "💼" },
    { name: "Twitter", url: "https://x.com/joshuax47", icon: "🐦" },
    {
      name: "Instagram",
      url: "https://www.instagram.com/joshuax32/",
      icon: "📸",
    },
    { name: "Email", url: "mailto:josh@modevz.ca", icon: "✉️" },
  ];

  let darkModeActive = useTheme().systemTheme === "dark";

  // Structured Data Schema for Person/Professional (GEO & SEO Optimization)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Joshua Xavier",
    "url": "https://josh.modevz.ca",
    "image": "https://josh.modevz.ca/hero.jpg",
    "jobTitle": "Technical Consultant & Software Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "MoDevz",
      "url": "https://josh.modevz.ca"
    },
    "description": "Joshua Xavier is a Technical Consultant and Software Developer serving small businesses across Toronto, ON and San Francisco, CA.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Toronto",
      "addressRegion": "ON",
      "addressCountry": "CA"
    },
    "knowsAbout": [
      "Technical Consulting",
      "Web Development",
      "Blockchain Integration",
      "Next.js",
      "Solana",
      "Small Business Strategy"
    ],
    "sameAs": [
      "https://www.linkedin.com/in/joxavier-3299/",
      "https://x.com/joshuax47",
      "https://www.instagram.com/joshuax32/",
      "https://www.facebook.com/Joshuax47",
      "https://www.tiktok.com/@jmojx",
      "https://open.spotify.com/user/mangoesrmyfav",
      "https://www.youtube.com/@realJMOJX",
      "https://www.snapchat.com/@jmojx",
      "https://github.com/joxavier",
      "https://stackoverflow.com/users/18236982/joshua-xavier",
      "https://www.reddit.com/user/joxavier99/",
      "https://ca.pinterest.com/joshuax47/",
      "https://jmojx.metaparlour.io/"
    ]
  };

  return (
    <>
      <Head>
        {/* Optimized Title & Meta Description targeting search keywords and locations */}
        <title>Joshua Xavier | Technical Consultant & Developer | Waterloo, Toronto & Silicon Valley</title>
        <meta
          name="description"
          content="Joshua Xavier is a professional Technical Consultant and Developer at MoDevz. Providing custom Web Development, Blockchain Solutions, and Strategy for small businesses."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Joshua Xavier, Technical Consultant, Software Developer, MoDevz, Toronto Web Development, San Francisco Blockchain Developer" />
        
        {/* Open Graph Meta Tags for Social Media Optimization */}
        <meta property="og:title" content="Joshua Xavier | Technical Consultant & Developer" />
        <meta property="og:description" content="Technical consulting, web development, and blockchain solutions for growing businesses by Joshua Xavier." />
        <meta property="og:url" content="https://josh.modevz.ca" />
        <meta property="og:type" content="profile" />

        {/* Structured Data / JSON-LD Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d1b69 100%)",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <style jsx>{`
          @media (max-width: 768px) {
            .desktop-profile {
              display: none !important;
            }
            .mobile-profile-overlap {
              display: flex !important;
            }
          }

          @media (min-width: 769px) {
            .desktop-profile {
              display: flex !important;
            }
            .mobile-profile-overlap {
              display: none !important;
            }
          }
        `}</style>

        {/* Top Half - SVG Image */}
        <div
          style={{
            height: "50vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d1b69 100%)",
            padding: "20px",
            boxSizing: "border-box",
            position: "relative", // required for Image fill
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src="/mo.svg"
              alt="MoDevz Logo - Where Small Business Happens"
              fill
              style={{
                objectFit: "contain",
                filter: darkModeActive ? "none" : "invert(100%)",
              }}
              className="rounded-xl"
            />
          </div>
        </div>

        <div
          className="mobile-profile-overlap"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            marginTop: "-60px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #8a2be2, #4169e1)",
              padding: "4px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Image
                src="/hero.jpg"
                alt="Joshua Xavier - Headshot"
                width={112}
                height={112}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  display: "block",
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.style.width = "100%";
                  fallback.style.height = "100%";
                  fallback.style.display = "flex";
                  fallback.style.alignItems = "center";
                  fallback.style.justifyContent = "center";
                  fallback.style.fontSize = "48px";
                  fallback.style.color = "#ffffff";
                  fallback.textContent = "👨‍💼";
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Half - Content Section */}
        <div
          style={{
            minHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 20px 40px",
            textAlign: "center",
            background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
          }}
        >
          {/* Desktop Profile Picture */}
          <div
            className="desktop-profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #8a2be2, #4169e1)",
              padding: "3px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Image
                src="/hero.jpg"
                alt="Joshua Xavier - Technical Consultant"
                width={112}
                height={112}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  display: "block",
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.style.width = "100%";
                  fallback.style.height = "100%";
                  fallback.style.display = "flex";
                  fallback.style.alignItems = "center";
                  fallback.style.justifyContent = "center";
                  fallback.style.fontSize = "48px";
                  fallback.style.color = "#ffffff";
                  fallback.textContent = "👨‍💼";
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>
          </div>

          {/* H1 Tag Addition for explicit Search Intent targeting */}
          <h1
            style={{
              color: "#ffffff",
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "4px",
              margin: "0 0 4px 0",
            }}
          >
            Joshua Xavier
          </h1>

          <h2
            style={{
              color: "#a0a0a0",
              fontSize: "18px",
              fontWeight: "500",
              marginBottom: "8px",
              margin: "0 0 8px 0",
            }}
          >
            Technical Consultant & Software Developer
          </h2>

          <p
            style={{
              color: "#cccccc",
              fontSize: "16px",
              marginBottom: "30px",
              margin: "0 0 30px 0",
            }}
          >
            Where Small Business Happens
          </p>

          {/* Social Links */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "40px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "20px",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(138, 43, 226, 0.3)",
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.background =
                    "linear-gradient(45deg, #8a2be2, #4169e1)";
                  target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.background = "rgba(255, 255, 255, 0.1)";
                  target.style.transform = "scale(1)";
                }}
              >
                {link.icon}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            <button
              onClick={handleSaveContact}
              style={{
                padding: "16px 24px",
                borderRadius: "50px",
                border: "2px solid #8a2be2",
                background: "linear-gradient(45deg, #8a2be2, #4169e1)",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.transform =
                  "translateY(-2px)";
                (e.target as HTMLButtonElement).style.boxShadow =
                  "0 10px 25px rgba(138, 43, 226, 0.4)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform =
                  "translateY(0)";
                (e.target as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              💾 Save Contact
            </button>

            <button
              onClick={() => setShowBookingForm(true)}
              style={{
                padding: "16px 24px",
                borderRadius: "50px",
                border: "2px solid #4169e1",
                background: "transparent",
                color: "#4169e1",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = "#4169e1";
                (e.target as HTMLButtonElement).style.color = "#ffffff";
                (e.target as HTMLButtonElement).style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "transparent";
                (e.target as HTMLButtonElement).style.color = "#4169e1";
                (e.target as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              📅 Book Now
            </button>

            <button
              onClick={scrollToMoreInfo}
              style={{
                padding: "16px 24px",
                borderRadius: "50px",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                background: "transparent",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "rgba(255, 255, 255, 0.1)";
                (e.target as HTMLButtonElement).style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background =
                  "transparent";
                (e.target as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              ℹ️ More Info
            </button>
          </div>
        </div>

        {/* More Info Section */}
        <div
          ref={moreInfoRef}
          style={{
            padding: "80px 20px",
            background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "40px",
                background: "linear-gradient(45deg, #8a2be2, #4169e1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              About Me
            </h2>

            <Highlights highlights={highlights} />

            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                padding: "40px",
                marginBottom: "20px",
                borderRadius: "20px",
                textAlign: "left",
                lineHeight: "1.8",
                color: "#e0e0e0",
              }}
            >
              <p style={{ marginBottom: "20px" }}>
                I am an entrepreneurial innovator passionate about leveraging
                next-generation technologies to fulfill evolving consumer needs.
                With a detail-oriented mindset and a commitment to excellence, I
                specialize in crafting interactive, client-centric digital
                solutions that drive real-world impact.
              </p>
              <p style={{ marginBottom: "20px" }}>
                My background in business and technology allows me to bridge
                strategy with execution—developing tools, systems, and platforms
                that help small businesses grow. I’m especially interested in
                integrating blockchain, automation, and AI to enhance customer
                experiences and operational efficiency.
              </p>
              <p>
                I’m known for my strategic foresight and my ability to build
                plans that align with long-term success. Outside of work, I
                enjoy catching up on basketball, blockchain developments, and
                hip-hop culture. My drive for success is rooted in empowering
                communities and helping businesses scale with purpose and
                precision.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "30px",
                marginBottom: "50px",
              }}
            >
              <div
                id="qualifications"
                style={{
                  background: "rgba(138, 43, 226, 0.1)",
                  padding: "30px",
                  borderRadius: "20px",
                  border: "1px solid rgba(138, 43, 226, 0.3)",
                }}
              >
                <h3
                  style={{
                    color: "#8a2be2",
                    marginBottom: "15px",
                    fontSize: "20px",
                  }}
                >
                  🎓 Education
                </h3>
                <p style={{ color: "#cccccc", lineHeight: "1.6" }}>
                  4+ degrees with majors in Business and Computer Science,
                  minors in Marketing and Economics, and certified in
                  Cybersecurity and AI/ML technologies.
                </p>
              </div>

              <div
                id="experience"
                style={{
                  background: "rgba(65, 105, 225, 0.1)",
                  padding: "30px",
                  borderRadius: "20px",
                  border: "1px solid rgba(65, 105, 225, 0.3)",
                }}
              >
                <h3
                  style={{
                    color: "#4169e1",
                    marginBottom: "15px",
                    fontSize: "20px",
                  }}
                >
                  💼 Experience
                </h3>
                <p style={{ color: "#cccccc", lineHeight: "1.6" }}>
                  Years of experience spanning web development, music industry
                  platforms, and blockchain integration.
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: "50px",
                padding: "30px",
                background:
                  "linear-gradient(45deg, rgba(138, 43, 226, 0.2), rgba(65, 105, 225, 0.2))",
                borderRadius: "20px",
                border: "1px solid rgba(138, 43, 226, 0.3)",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  marginBottom: "15px",
                  color: "#ffffff",
                }}
              >
                🎯 Ready to Work Together?
              </h3>
              <p
                style={{
                  color: "#cccccc",
                  marginBottom: "20px",
                  fontSize: "16px",
                }}
              >
                Mention &quot;Free Consultation&quot; in comments when booking
              </p>
              <button
                onClick={() => setShowBookingForm(true)}
                style={{
                  padding: "16px 32px",
                  borderRadius: "50px",
                  border: "none",
                  background: "linear-gradient(45deg, #8a2be2, #4169e1)",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.transform =
                    "scale(1.05)";
                  (e.target as HTMLButtonElement).style.boxShadow =
                    "0 10px 25px rgba(138, 43, 226, 0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "scale(1)";
                  (e.target as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #1a1a1a, #2d1b69)",
                padding: "40px",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "500px",
                maxHeight: "90vh",
                overflowY: "auto",
                border: "1px solid rgba(138, 43, 226, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "30px",
                }}
              >
                <h2
                  style={{
                    color: "#ffffff",
                    fontSize: "24px",
                    margin: 0,
                  }}
                >
                  Book Consultation
                </h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "24px",
                    cursor: "pointer",
                    padding: "5px",
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBookingSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      color: "#ffffff",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.name}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, name: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(138, 43, 226, 0.3)",
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      fontSize: "16px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      color: "#ffffff",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingData.email}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, email: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(138, 43, 226, 0.3)",
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      fontSize: "16px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      color: "#ffffff",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, phone: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(138, 43, 226, 0.3)",
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      fontSize: "16px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div
                  style={{ display: "flex", gap: "15px", marginBottom: "20px" }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        color: "#ffffff",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.date}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, date: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(138, 43, 226, 0.3)",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "#ffffff",
                        fontSize: "16px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        color: "#ffffff",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={bookingData.time}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, time: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "1px solid rgba(138, 43, 226, 0.3)",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "#ffffff",
                        fontSize: "16px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "30px" }}>
                  <label
                    style={{
                      display: "block",
                      color: "#ffffff",
                      marginBottom: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Service Type
                  </label>
                  <select
                    value={bookingData.service}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        service: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(138, 43, 226, 0.3)",
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      fontSize: "16px",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="consultation">Free Consultation</option>
                    <option value="branding">Branding Strategy</option>
                    <option value="web-dev">Web Development</option>
                    <option value="blockchain">Blockchain Integration</option>
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "50px",
                    border: "none",
                    background: "linear-gradient(45deg, #8a2be2, #4169e1)",
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.transform =
                      "translateY(-2px)";
                    (e.target as HTMLButtonElement).style.boxShadow =
                      "0 10px 25px rgba(138, 43, 226, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.transform =
                      "translateY(0)";
                    (e.target as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  Book & Pay Now
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

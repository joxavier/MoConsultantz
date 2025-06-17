"use client";
import { useState, useRef } from "react";
import Head from "next/head";
import { useTheme } from "next-themes";
import Image from "next/image";

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
    { name: "Twitter", url: "#", icon: "🐦" },
    { name: "Instagram", url: "https://www.instagram.com/joshuax32/", icon: "📸" },
    { name: "Email", url: "mailto:josh@modevz.ca", icon: "✉️" },
  ];

  let darkModeActive = useTheme().systemTheme === "dark"; //false;

  return (
    <>
      <Head>
        <title>Mo | Where Small Business Happens</title>
        <meta
          name="description"
          content="Entrepreneurial innovator specializing in high-fashion branding, music industry leadership, and web development."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
              alt="Mo Logo"
              fill
              style={{
                objectFit: "contain",
                filter: darkModeActive ? "invert(100%)" : "none",
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
                fontSize: "48px",
                color: "#ffffff",
              }}
            >
              👨‍💼
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
                fontSize: "40px",
                color: "#ffffff",
              }}
            >
              👨‍💼
            </div>
          </div>

          {/* Title */}
          <h2
            style={{
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
              margin: "0 0 8px 0",
            }}
          >
            Founder & CEO
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
              About Mo
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "30px",
                marginBottom: "50px",
              }}
            >
              <div
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
                  2+ Degrees in entrepreneurial innovation with expertise in
                  high-fashion branding and strategic leadership.
                </p>
              </div>

              <div
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
                background: "rgba(255, 255, 255, 0.05)",
                padding: "40px",
                borderRadius: "20px",
                textAlign: "left",
                lineHeight: "1.8",
                color: "#e0e0e0",
              }}
            >
              <p style={{ marginBottom: "20px" }}>
                I am an entrepreneurial innovator with a keen eye for detail and
                a commitment to excellence. My experience spans high-fashion
                branding, where I develop exclusive, luxury-focused projects, to
                strategic leadership in the music industry, creating platforms
                that empower artists through technology and creative services.
              </p>
              <p style={{ marginBottom: "20px" }}>
                With a strong foundation in web development and tech solutions,
                I craft interactive, client-centric digital experiences using
                the latest frameworks. I am deeply invested in community
                building and mentorship, exploring ways to drive blockchain
                adoption by integrating it into business operations to create
                efficiencies and enhance customer loyalty.
              </p>
              <p>
                Known for my strategic foresight, I create impactful plans that
                blend business acumen with technological integration. Guided by
                an ambitious vision, I consistently pursue unique opportunities
                that push the boundaries of innovation and align with long-term
                success.
              </p>
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

"use client";

import { useState, useRef } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import Highlights from "./Highlights";
import { CredibilityBar } from "./CredibilityBar";
import BookingModal from "../_shared/BookingModal";
import FaqSection, { type Faq } from "../_shared/FaqSection";
import {
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaSpotify,
  FaYoutube,
  FaSnapchat,
  FaGithub,
  FaStackOverflow,
  FaReddit,
  FaPinterest,
} from "react-icons/fa6";

interface PersonalPageClientProps {
  highlights: any; // Replace with your explicit type if available
  faqs: Faq[];
}

const BOOKING_SERVICES = [
  { value: "Free Consultation", label: "Free Consultation" },
  { value: "Branding Strategy", label: "Branding Strategy" },
  { value: "Web Development", label: "Web Development" },
  { value: "Blockchain Integration", label: "Blockchain Integration" },
];

export default function PersonalPageClient({ highlights, faqs }: PersonalPageClientProps) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAllSocials, setShowAllSocials] = useState(false);
  const moreInfoRef = useRef<HTMLDivElement>(null);
  const { systemTheme } = useTheme();

  const handleSaveContact = () => {
    const contact = {
      name: "Joshua Xavier",
      company: "MoDevz",
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

  const scrollToMoreInfo = () => {
    moreInfoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const socialLinks = [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/joxavier-3299/", icon: FaLinkedin },
    { name: "X", url: "https://x.com/joshuax47", icon: FaXTwitter },
    { name: "Instagram", url: "https://www.instagram.com/joshuax32/", icon: FaInstagram },
    { name: "GitHub", url: "https://github.com/joxavier", icon: FaGithub },
    { name: "YouTube", url: "https://www.youtube.com/@realJMOJX", icon: FaYoutube },
    { name: "Facebook", url: "https://www.facebook.com/Joshuax47", icon: FaFacebook },
    { name: "TikTok", url: "https://www.tiktok.com/@jmojx", icon: FaTiktok },
    { name: "Spotify", url: "https://open.spotify.com/user/mangoesrmyfav", icon: FaSpotify },
    { name: "Snapchat", url: "https://www.snapchat.com/@jmojx", icon: FaSnapchat },
    { name: "Stack Overflow", url: "https://stackoverflow.com/users/18236982/joshua-xavier", icon: FaStackOverflow },
    { name: "Reddit", url: "https://www.reddit.com/user/joxavier99/", icon: FaReddit },
    { name: "Pinterest", url: "https://ca.pinterest.com/joshuax47/", icon: FaPinterest },
    { name: "Metaparlour", url: "https://jmojx.metaparlour.io/", image: "https://metaparlour.io/favicon.ico" },
  ];

  const visibleLinks = showAllSocials ? socialLinks : socialLinks.slice(0, 5);
  const darkModeActive = systemTheme === "dark";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d1b69 100%)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-profile { display: none !important; }
          .mobile-profile-overlap { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-profile { display: flex !important; }
          .mobile-profile-overlap { display: none !important; }
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
          background: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d1b69 100%)",
          padding: "20px",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            src="/mo.svg"
            alt="MoDevz Logo - Where Small Business Happens"
            fill
            style={{
              objectFit: "contain",
              filter: !darkModeActive ? "none" : "invert(100%)",
            }}
            className="rounded-xl"
            priority
          />
        </div>
      </div>

      {/* Mobile Profile Photo */}
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
            />
          </div>
        </div>

        <h1 style={{ color: "#ffffff", fontSize: "28px", fontWeight: "700", marginBottom: "4px", margin: "0 0 4px 0" }}>
          Joshua Xavier
        </h1>

        <h2 style={{ color: "#a0a0a0", fontSize: "18px", fontWeight: "500", marginBottom: "8px", margin: "0 0 8px 0" }}>
          Technical Consultant & Software Developer
        </h2>

        <p style={{ color: "#cccccc", fontSize: "16px", marginBottom: "30px", margin: "0 0 30px 0" }}>
          Mo — Where Small Business Happens
        </p>

        {/* Social Links */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "40px", flexWrap: "wrap", justifyContent: "center" }}>
          <div className="flex flex-wrap justify-center gap-5">
            {visibleLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="group flex flex-col items-center gap-2"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted transition-all duration-300 group-hover:scale-105 group-hover:border-primary/30 group-hover:bg-primary/10">
                  {social.image ? (
                    <img src={social.image} alt={social.name} className="h-7 w-7 object-contain" />
                  ) : social.icon ? (
                    <social.icon className="h-6 w-6 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                  ) : null}
                </div>
                <span className="text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {social.name}
                </span>
              </a>
            ))}
          </div>

          {socialLinks.length > 5 && (
            <div className="flex w-full justify-center">
              <button
                onClick={() => setShowAllSocials((prev) => !prev)}
                className="rounded-full border border-border bg-background px-5 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                {showAllSocials ? "Show Less" : "View All"}
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "300px" }}>
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
          >
            📅 Book a Free Consultation
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
          >
            ℹ️ More Info
          </button>
        </div>
      </div>

      <CredibilityBar />

      {/* More Info Section */}
      <div
        ref={moreInfoRef}
        style={{
          padding: "80px 20px",
          background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
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
            About Joshua Xavier
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
              I am an entrepreneurial innovator passionate about leveraging next-generation technologies to fulfill evolving consumer needs.
              With a detail-oriented mindset and a commitment to excellence, I specialize in crafting interactive, client-centric digital
              solutions that drive real-world impact across key markets like <strong>Toronto, Ontario</strong> and <strong>San Francisco, California</strong>.
            </p>
            <p style={{ marginBottom: "20px" }}>
              My background in business and technology allows me to bridge strategy with execution—developing tools, systems, and custom
              software platforms that help small businesses scale effectively. I specialize in integrating secure blockchain applications,
              operational automation, and tailored AI components to optimize customer experiences and elevate efficiency.
            </p>
            <p>
              As the driving force behind <strong>MoDevz</strong>, I build platforms and tech stacks designed for long-term scalability.
              Whether architecting high-performance web applications or coordinating strategic digital infrastructures, my mission is
              centered on empowering small businesses to scale with purpose, clarity, and precision.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px", marginBottom: "50px" }}>
            <div id="qualifications" style={{ background: "rgba(138, 43, 226, 0.1)", padding: "30px", borderRadius: "20px", border: "1px solid rgba(138, 43, 226, 0.3)" }}>
              <h3 style={{ color: "#8a2be2", marginBottom: "15px", fontSize: "20px" }}>🎓 Education</h3>
              <p style={{ color: "#cccccc", lineHeight: "1.6" }}>
                Dual degrees in Business Administration and Computer Science with specialization across core technical matrices.
              </p>
              <h4 style={{ color: "#ffffff", margin: "20px 0 10px", fontSize: "15px", fontWeight: 600 }}>Key courses</h4>
              <ul style={{ display: "inline-block", textAlign: "left", color: "#cccccc", lineHeight: "1.6", paddingLeft: "20px", listStyleType: "disc" }}>
                {["Cybersecurity for Web3", "Environmental Economics", "Game Theory and Digital Marketing"].map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </div>

            <div id="experience" style={{ background: "rgba(65, 105, 225, 0.1)", padding: "30px", borderRadius: "20px", border: "1px solid rgba(65, 105, 225, 0.3)" }}>
              <h3 style={{ color: "#4169e1", marginBottom: "15px", fontSize: "20px" }}>💼 Experience</h3>
              <p style={{ color: "#cccccc", lineHeight: "1.6" }}>
                Years of specialized technical consulting history encompassing custom web frameworks, software architecture, and decentralized applications.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "50px", textAlign: "left" }}>
            <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#ffffff", textAlign: "center" }}>✍️ Articles by Joshua Xavier</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              {[
                { href: "/feed/3", title: "From Ethereum to Exodus: Canada's Blockchain Boom—and Bust?" },
                { href: "/feed/6", title: "2026 Outlook: Canada's Post-Pandemic Economic Outlook" },
                { href: "/articles/tech-adoption-cycle", title: "Understanding the Technology Adoption Cycle" },
              ].map((post) => (
                <Link
                  key={post.href}
                  href={post.href}
                  style={{
                    display: "block",
                    padding: "20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#e0e0e0",
                    fontSize: "15px",
                    fontWeight: 600,
                    lineHeight: 1.5,
                    textDecoration: "none",
                  }}
                >
                  {post.title}
                </Link>
              ))}
            </div>
          </div>

          <FaqSection faqs={faqs} />

          <div style={{ marginTop: "50px", padding: "30px", background: "linear-gradient(45deg, rgba(138, 43, 226, 0.2), rgba(65, 105, 225, 0.2))", borderRadius: "20px", border: "1px solid rgba(138, 43, 226, 0.3)" }}>
            <h3 style={{ fontSize: "24px", marginBottom: "15px", color: "#ffffff" }}>🎯 Ready to Work Together?</h3>
            <p style={{ color: "#cccccc", marginBottom: "20px", fontSize: "16px" }}>
              Book a free consultation to talk through your project. Pick a time that suits you and get a calendar invite right away.
            </p>
            <button onClick={() => setShowBookingForm(true)} style={{ padding: "16px 32px", borderRadius: "50px", border: "none", background: "linear-gradient(45deg, #8a2be2, #4169e1)", color: "#ffffff", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" }}>
              📅 Book a Free Consultation
            </button>
          </div>
        </div>
      </div>

      <BookingModal
        open={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        host="joxavier"
        hostName="Joshua Xavier"
        services={BOOKING_SERVICES}
      />
    </div>
  );
}
"use client";

import { useRef, useState } from "react";
import { FaInstagram } from "react-icons/fa6";
import profile from "@/data/limelightPage.json";
import { splitLinks } from "@/lib/linkedText";
import BookingModal from "../_shared/BookingModal";
import FaqSection, { type Faq } from "../_shared/FaqSection";

// Same layout as Josh's page (josh.modevz.ca): banner, profile, links,
// actions, then About, FAQ and a booking call to action.

const BOOKING_SERVICES = [
  { value: "Consultation", label: "Consultation" },
  { value: "Casting Inquiry", label: "Casting Inquiry" },
  { value: "Project Collaboration", label: "Project Collaboration" },
];

type ListItem = { title: string; detail?: string };

const gradient = "linear-gradient(45deg, #8a2be2, #4169e1)";
const initials = profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2);

function LinkedText({ text }: { text: string }) {
  return (
    <>
      {splitLinks(text).map((part, i) =>
        part.href ? (
          <a key={i} href={part.href} target="_blank" rel="noopener" style={{ color: "#b98cff", textDecoration: "underline" }}>
            {part.text}
          </a>
        ) : (
          part.text
        )
      )}
    </>
  );
}

function Avatar({ size }: { size: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: gradient, padding: size > 110 ? "4px" : "3px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#1f1633", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {profile.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.photo} alt={`${profile.name}, ${profile.role}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span aria-hidden="true" style={{ color: "#ffffff", fontSize: size / 3, fontWeight: 700, letterSpacing: "1px" }}>{initials}</span>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, title, items, color }: { icon: string; title: string; items: ListItem[]; color: string }) {
  return (
    <div style={{ background: `${color}1a`, padding: "30px", borderRadius: "20px", border: `1px solid ${color}4d`, textAlign: "left" }}>
      <h3 style={{ color, marginBottom: "15px", fontSize: "20px" }}>{icon} {title}</h3>
      <ul style={{ color: "#cccccc", lineHeight: 1.6, paddingLeft: "20px", listStyleType: "disc" }}>
        {items.map((item) => (
          <li key={item.title}>
            <strong style={{ color: "#ffffff" }}>{item.title}</strong>
            {item.detail ? ` · ${item.detail}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function LimelightPageClient({ faqs }: { faqs: Faq[] }) {
  const [showBooking, setShowBooking] = useState(false);
  const moreInfoRef = useRef<HTMLDivElement>(null);
  const credits = profile.credits as ListItem[];
  const training = profile.training as ListItem[];

  const socialLinks = [
    { name: "Instagram", url: profile.instagram.url, icon: <FaInstagram style={{ width: 24, height: 24, color: "#ffffff" }} /> },
    // eslint-disable-next-line @next/next/no-img-element
    { name: "Metaparlour", url: profile.metaparlour, icon: <img src="https://metaparlour.io/favicon.ico" alt="" style={{ width: 26, height: 26, objectFit: "contain" }} /> },
  ];

  const handleSaveContact = () => {
    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.name}`,
      `TITLE:${profile.role}`,
      `URL:${profile.siteUrl}`,
      `X-SOCIALPROFILE;type=instagram:${profile.instagram.url}`,
      "END:VCARD",
    ].join("\n");
    const url = window.URL.createObjectURL(new Blob([vCard], { type: "text/vcard" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "Emil-Kiruba-contact.vcf";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const buttonBase: React.CSSProperties = { padding: "16px 24px", borderRadius: "50px", fontSize: "16px", fontWeight: 600, cursor: "pointer", textAlign: "center" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d1b69 100%)", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
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

      {/* Banner: a spotlight on the "limelight" wordmark */}
      <div
        style={{
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse 45% 70% at 50% 0%, rgba(255, 236, 179, 0.35), transparent 70%), linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d1b69 100%)",
          padding: "20px",
        }}
      >
        <p aria-hidden="true" style={{ color: "#fff6dc", fontSize: "clamp(42px, 11vw, 120px)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", textShadow: "0 0 40px rgba(255, 236, 179, 0.45)", margin: 0 }}>
          Limelight
        </p>
      </div>

      {/* Mobile profile photo, overlapping the banner */}
      <div className="mobile-profile-overlap" style={{ position: "relative", display: "flex", justifyContent: "center", marginTop: "-60px", zIndex: 10 }}>
        <Avatar size={120} />
      </div>

      <div style={{ minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 20px 40px", textAlign: "center", background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)" }}>
        <div className="desktop-profile" style={{ marginBottom: "20px" }}>
          <Avatar size={100} />
        </div>

        <h1 style={{ color: "#ffffff", fontSize: "28px", fontWeight: 700, margin: "0 0 4px 0" }}>{profile.name}</h1>
        <h2 style={{ color: "#a0a0a0", fontSize: "18px", fontWeight: 500, margin: "0 0 8px 0" }}>{profile.role}</h2>
        <p style={{ color: "#cccccc", fontSize: "16px", margin: "0 0 30px 0" }}>@{profile.instagram.handle}</p>

        <div style={{ display: "flex", gap: "20px", marginBottom: "40px", flexWrap: "wrap", justifyContent: "center" }}>
          {socialLinks.map((social) => (
            <a key={social.name} href={social.url} target="_blank" rel="noopener" aria-label={social.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textDecoration: "none" }}>
              <span style={{ display: "flex", width: 56, height: 56, alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "1px solid rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.06)" }}>
                {social.icon}
              </span>
              <span style={{ color: "#a0a0a0", fontSize: "12px", fontWeight: 500 }}>{social.name}</span>
            </a>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "300px" }}>
          <button onClick={() => setShowBooking(true)} style={{ ...buttonBase, border: "2px solid #8a2be2", background: gradient, color: "#ffffff" }}>
            📅 Book a Consultation
          </button>
          <button onClick={handleSaveContact} style={{ ...buttonBase, border: "2px solid #4169e1", background: "transparent", color: "#4169e1" }}>
            💾 Save Contact
          </button>
          <button onClick={() => moreInfoRef.current?.scrollIntoView({ behavior: "smooth" })} style={{ ...buttonBase, border: "2px solid rgba(255, 255, 255, 0.3)", background: "transparent", color: "#ffffff" }}>
            ℹ️ More Info
          </button>
        </div>
      </div>

      <div ref={moreInfoRef} style={{ padding: "80px 20px", background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)", color: "#ffffff" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "40px", background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            About {profile.name}
          </h2>

          <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "40px", marginBottom: "20px", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.1)", fontSize: "18px", lineHeight: 1.8, color: "#cccccc", textAlign: "left" }}>
            {profile.bio.map((paragraph) => (
              <p key={paragraph} style={{ marginBottom: "20px" }}>
                <LinkedText text={paragraph} />
              </p>
            ))}
          </div>

          {(credits.length > 0 || training.length > 0) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px", marginBottom: "50px" }}>
              {credits.length > 0 && <InfoCard icon="🎬" title="Credits" items={credits} color="#8a2be2" />}
              {training.length > 0 && <InfoCard icon="🎭" title="Training" items={training} color="#4169e1" />}
            </div>
          )}

          <FaqSection faqs={faqs} />

          <div style={{ marginTop: "50px", padding: "30px", background: "linear-gradient(45deg, rgba(138, 43, 226, 0.2), rgba(65, 105, 225, 0.2))", borderRadius: "20px", border: "1px solid rgba(138, 43, 226, 0.3)" }}>
            <h3 style={{ fontSize: "24px", marginBottom: "15px", color: "#ffffff" }}>🎬 Working on a project?</h3>
            <p style={{ color: "#cccccc", marginBottom: "20px", fontSize: "16px" }}>
              Book a consultation with {profile.name} about casting, a collaboration or anything else. Pick a time and get a calendar invite right away.
            </p>
            <button onClick={() => setShowBooking(true)} style={{ padding: "16px 32px", borderRadius: "50px", border: "none", background: gradient, color: "#ffffff", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}>
              📅 Book a Consultation
            </button>
          </div>
        </div>
      </div>

      <BookingModal open={showBooking} onClose={() => setShowBooking(false)} host="limelight" hostName={profile.name} services={BOOKING_SERVICES} />
    </div>
  );
}

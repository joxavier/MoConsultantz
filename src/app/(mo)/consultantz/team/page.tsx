"use client";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// Import your team members data
import teamMembers from './TeamMembers.json';

export default function TeamPage() {
  return (
    <>
      <Head>
        <title>Our Team | Where Small Business Happens</title>
        <meta
          name="description"
          content="Meet our talented team of innovators, developers, and industry experts."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d1b69 100%)",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          padding: "40px 20px",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
            maxWidth: "800px",
            margin: "0 auto 60px auto",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "700",
              marginBottom: "20px",
              marginTop: "120px",
              background: "linear-gradient(45deg, #8a2be2, #4169e1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: "0 0 20px 0",
            }}
          >
            Our Team
          </h1>
          <p
            style={{
              color: "#cccccc",
              fontSize: "18px",
              lineHeight: "1.6",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Meet the passionate innovators and industry experts who make small business dreams happen.
          </p>
        </div>

        {/* Team Members Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {teamMembers.map((member) => (
            <Link
              key={member.id}
              href={`/team/${member.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "20px",
                  padding: "30px",
                  textAlign: "center",
                  border: "1px solid rgba(138, 43, 226, 0.3)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.transform = "translateY(-10px)";
                  target.style.boxShadow = "0 20px 40px rgba(138, 43, 226, 0.3)";
                  target.style.background = "rgba(138, 43, 226, 0.1)";
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.transform = "translateY(0)";
                  target.style.boxShadow = "none";
                  target.style.background = "rgba(255, 255, 255, 0.05)";
                }}
              >
                {/* Profile Picture */}
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #8a2be2, #4169e1)",
                    padding: "4px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={member.displayPicture}
                      alt={`${member.name} profile picture`}
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>

                {/* Member Info */}
                <h3
                  style={{
                    color: "#ffffff",
                    fontSize: "24px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    margin: "0 0 8px 0",
                  }}
                >
                  {member.name}
                </h3>

                <p
                  style={{
                    color: "#8a2be2",
                    fontSize: "16px",
                    fontWeight: "500",
                    marginBottom: "12px",
                    margin: "0 0 12px 0",
                  }}
                >
                  {member.role}
                </p>

                <p
                  style={{
                    color: "#cccccc",
                    fontSize: "14px",
                    marginBottom: "20px",
                    margin: "0 0 20px 0",
                  }}
                >
                  {member.tagline}
                </p>

                {/* Brief Bio Preview */}
                <p
                  style={{
                    color: "#e0e0e0",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    textAlign: "center",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    margin: "0 0 20px 0",
                  }}
                >
                  {member.bio[0]}
                </p>

                {/* View Profile Button */}
                <div
                  style={{
                    marginTop: "auto",
                    padding: "12px 24px",
                    borderRadius: "25px",
                    background: "linear-gradient(45deg, #8a2be2, #4169e1)",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                >
                  View Profile →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Back to Home Button */}
        <div
          style={{
            textAlign: "center",
            marginTop: "60px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "16px 32px",
              borderRadius: "50px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              background: "transparent",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "600",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLAnchorElement;
              target.style.background = "rgba(255, 255, 255, 0.1)";
              target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLAnchorElement;
              target.style.background = "transparent";
              target.style.transform = "translateY(0)";
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}
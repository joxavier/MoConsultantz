// pages/moos.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import Hero from "../devz/Hero";
import { useTheme } from "next-themes";

interface App {
  id: string;
  name: string;
  description: string;
  link?: string;
  icon: string;
  isActive: boolean;
  category: "ecosystem" | "launchpad";
}

const apps: App[] = [
  // Mo Ecosystem Apps
    {
    id: "0",
    name: "MoCoin",
    description: "Offical Coin of the ecosystem",
    icon: "⚓",
    link: "https://mocoin.modevz.ca",
    isActive: true,
    category: "ecosystem",
  },
  {
    id: "1",
    name: "Metaparlour",
    description: "Wellness Platform",
    icon: "🏛️",
    link: "https://metaparlour.io", 
    isActive: true,
    category: "ecosystem",
  },
  /*{
    id: "2",
    name: "Analytics",
    description: "Deep insights and reporting",
    icon: "📈",
    isActive: false,
    category: "ecosystem",
  },
  {
    id: "3",
    name: "Connect",
    description: "Team collaboration platform",
    icon: "🔗",
    isActive: false,
    category: "ecosystem",
  },
  {
    id: "4",
    name: "Vault",
    description: "Secure data storage",
    icon: "🔐",
    isActive: false,
    category: "ecosystem",
  },
  {
    id: "5",
    name: "Dashboard",
    description: "Central hub for all your data",
    icon: "📊",
    isActive: false,
    category: "ecosystem",
  },
  {
    id: "6",
    name: "Stream",
    description: "Real-time data streaming",
    icon: "🌊",
    isActive: false,
    category: "ecosystem",
  },*/

  // LaunchPad Apps
  {
    id: "7",
    name: "Ank",
    description: "Coming soon to ecosystem",
    icon: "⚓",
    isActive: false,
    category: "launchpad",
  },
    {
    id: "7",
    name: "6Cylndr",
    description: "Coming soon to ecosystem",
    icon: "⚓",
    link: "https://6cylndr.com",
    isActive: true,
    category: "launchpad",
  },
  
];

const MoOS: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const ecosystemApps = apps.filter((app) => app.category === "ecosystem");
  const launchpadApps = apps.filter((app) => app.category === "launchpad");

  const hero = {
    imageUrl: "/mo.svg",
    altText: "MoOS Hero Image",
    title: "",
    buttonText: "Sign In",
    buttonLink: "/team/joxavier",
  };

  const handleSignIn = () => {
    setIsSignedIn(!isSignedIn);
  };

  let darkModeActive = useTheme().systemTheme === "dark"; //false;

  return (
    <>
      <Head>
        <title>MoOS - Mo Operating System</title>
        <meta
          name="description"
          content="Access all your Mo ecosystem apps in one place"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen ">
        <div className="container mt-16 mx-auto px-4 py-8 max-w-6xl">
          {/* Header with Mo Logo and Sign In */}

          <div />
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 pt-4">
            <div className="flex items-center -gap-1 mb-4 sm:mb-0">
              <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Image
                  src={"/mo.svg"}
                  alt={hero.altText}
                  width={700}
                  height={700}
                  //style={{ filter: darkModeActive  ? 'invert(100%)' : 'none' }}
                  className="mb-4 sm:mb-0 sm:mr-4 rounded-xl sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2"
                />
                <div />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-12">OS</h1>
            </div>

            <button
              onClick={handleSignIn}
              className={`px-6 py-3 mt-4 rounded-full font-semibold transition-all duration-200 hover:transform hover:scale-105 shadow-lg ${
                isSignedIn
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-white text-purple-700 hover:bg-blue-50"
              }`}
            >
              {isSignedIn ? "Sign Out" : "Sign In"}
            </button>
          </div>

          {/* Mo Ecosystem Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Mo Ecosystem
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecosystemApps.map((app) => (
                <div
                  key={app.id}
                  className={`relative group transition-all duration-300 ${
                    app.isActive
                      ? "hover:transform hover:scale-105 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`
                      bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20
                      ${app.isActive ? "hover:shadow-2xl hover:bg-white/20" : "bg-gray-400/10"}
                    `}
                    onClick={() => {
                      if (app.isActive && app.link) {
                        window.open(app.link, "_blank", "noopener,noreferrer");
                      }
                    }}
                    style={app.isActive && app.link ? { cursor: "pointer" } : undefined}
                  >
                    <div className="text-center">
                      <div
                        className={`text-4xl mb-4 ${!app.isActive ? "grayscale" : ""}`}
                      >
                        {app.icon}
                      </div>
                      <h3
                        className={`text-xl font-bold mb-2 ${
                          app.isActive ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {app.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          app.isActive ? "text-blue-100" : "text-gray-400"
                        }`}
                      >
                        {app.description}
                      </p>

                      {!app.isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                          <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Coming Soon
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LaunchPad Section */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
              LaunchPad
            </h2>
            <p className="text-blue-100 text-center mb-8 text-lg">
              Apps coming soon
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {launchpadApps.map((app) => (
                <div
                  key={app.id}
                  className="relative group opacity-50 cursor-not-allowed max-w-sm w-full"
                >
                  <div className="bg-gray-400/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                    <div className="text-center">
                      <div className="text-4xl mb-4 grayscale">{app.icon}</div>
                      <h3 className="text-xl font-bold mb-2 text-gray-300">
                        {app.name}
                      </h3>
                      <p className="text-sm text-gray-400">{app.description}</p>

                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                        <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-200 hover:transform hover:scale-105 backdrop-blur-md border border-white/20"
            >
              <svg
                className="w-4 h-4 rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Back to Feed
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoOS;

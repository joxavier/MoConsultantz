"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Bitcoin,
  Coins,
  BarChart3,
  Wallet,
  ArrowUpRight,
  Shield,
  Globe,
  Zap,
  ExternalLink,
} from "lucide-react";

import { useTheme } from "next-themes";
import PreSaleInstructions from "./presale";
import pageData from "../../../data/moCoinPage.json";
import Hero from "../../consultantz/Hero";
import dynamic from "next/dynamic";

// Simulated price data - replace with actual Raydium API calls
const generatePriceData = () => {
  const basePrice = 0.0234;
  return Array.from({ length: 24 }, (_, i) => ({
    time: i,
    price: basePrice + (Math.random() - 0.5) * 0.005,
    volume: Math.random() * 1000000,
  }));
};

type PriceDataPoint = {
  time: number;
  price: number;
  volume: number;
};

const MoCoinChart = ({ priceData }: { priceData: PriceDataPoint[] }) => {
  let darkModeActive = useTheme().theme === "dark";
  const { hero } = pageData;

  if (!priceData || priceData.length === 0) return null;

  const maxPrice = Math.max(...priceData.map((p) => p.price));
  const minPrice = Math.min(...priceData.map((p) => p.price));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border-2 border-gradient-to-r from-[#3ca5de] to-[#8743f7] p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg"></div>
      <svg width="100%" height="100%" className="relative z-10">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3ca5de" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8743f7" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d={`M 0,${
            ((maxPrice - priceData[0].price) / priceRange) * 200 + 20
          } ${priceData
            .map(
              (point, index) =>
                `L ${(index / (priceData.length - 1)) * 400},${
                  ((maxPrice - point.price) / priceRange) * 200 + 20
                }`
            )
            .join(" ")}`}
          fill="none"
          stroke="url(#chartGradient)"
          strokeWidth="3"
          className="drop-shadow-lg"
        />
        <path
          d={`M 0,${
            ((maxPrice - priceData[0].price) / priceRange) * 200 + 20
          } ${priceData
            .map(
              (point, index) =>
                `L ${(index / (priceData.length - 1)) * 400},${
                  ((maxPrice - point.price) / priceRange) * 200 + 20
                }`
            )
            .join(" ")} L 400,220 L 0,220 Z`}
          fill="url(#chartGradient)"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

type TypewriterEffectProps = {
  strings: string[];
  className?: string;
  speed?: number;
};

const TypewriterEffect = ({
  strings,
  className,
  speed = 70,
}: TypewriterEffectProps) => {
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const string = strings[currentStringIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < string.length) {
            setCurrentText(string.substring(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(string.substring(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentStringIndex((prev) => (prev + 1) % strings.length);
          }
        }
      },
      isDeleting ? 50 : speed
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentStringIndex, strings, speed]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

type AssetKey = "CAD" | "USD" | "BTC" | "SOL";

export default function Mocoin() {
  const [selectedAsset, setSelectedAsset] = useState<AssetKey>("CAD");
  const [priceData, setPriceData] = useState(generatePriceData());
  const [swapAmount, setSwapAmount] = useState("");
  const [darkModeActive, setDarkModeActive] = useState(true);

  const chartLink =
    "https://www.dextools.io/app/en/solana/pair-explorer/2mz5eNLTpCk2F6CvP1y9LWdUe6LUh1zqPa7bzPFYWns8?t=1711224539477";

  const handleBookNowClick = () => {
    window.open(
      "https://raydium.io/swap/?inputCurrency=sol&outputCurrency=HHVmXazRvA3VdciVG4ayE7vjgUFUn12t5r7vYm2BJ258&fixed=in",
      "_blank"
    );
  };

  const assetPrices: Record<
    AssetKey,
    { price: number; symbol: string; change: number }
  > = {
    CAD: { price: 0.0312, symbol: "$", change: 5.2 },
    USD: { price: 0.0234, symbol: "$", change: 3.8 },
    BTC: { price: 0.0000005, symbol: "₿", change: -1.2 },
    SOL: { price: 0.00018, symbol: "◎", change: 7.5 },
  };

  const marketData = {
    marketCap: "$21.33M",
    tvl: "$12.8k",
    volume24h: "$2.1k",
    holders: "27",
  };

  useEffect(() => {
    // Simulate price updates - replace with actual Raydium API
    const interval = setInterval(() => {
      setPriceData(generatePriceData());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const hodlFacts = [
    "MoCoin holders get exclusive access to private investment opportunities",
    "Advanced AI algorithms optimize asset allocation for maximum returns",
    "Multi-chain compatibility ensures liquidity across all major networks",
    "Backed by a diversified fund of real-world and digital assets",
    "Early adopters among tomorrow's business leaders gain competitive advantages",
  ];
  const { hero } = pageData;
  /*const hero = {
    "imageUrl": "/mo.svg",
    "altText": "MoCoin Hero Image",
    "title": "MoCoin",
    "buttonText": "Get Started",
    "buttonLink": "#swap"
  };*/

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-10 pt-32 sm:p-10 md:p-24 lg:p-32 font-mono bg-black text-white"
      style={{ fontFamily: "Anton, sans-serif" }}
    >
      {/* Hero Section */}
      <div
        className="p-5 grid grid-cols-1 minHeight-50vh sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8"
        style={{
          transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
          margin: "20px 0",
          width: "100%",
          minHeight: "50vh",
          maxWidth: "1320px",
        }}
      >
        <div className="bg-black">
          <Hero {...hero} />
        </div>

        <span className="bg-clip-text text-transparent text-center text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl bg-gradient-to-b from-[#3ca5de] to-[#8743f7]">
          Official Token of the Mo Ecosystem.
        </span>
      </div>

      {/* MoCoin Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center mb-12 max-w-4xl"
      >
        <p className="text-xl text-gray-300 leading-relaxed font-mono">
          MoCoin is a multi-chain cryptocurrency serving as the ultimate store
          of value, unit of account, and medium of exchange for tomorrow&apos;s
          business leaders.
        </p>
      </motion.div>

      {/* Swap Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md mb-12 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"
        id="swap"
      >
        <div className="p-6 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl border-2 border-gradient-to-r from-[#3ca5de] to-[#8743f7] backdrop-blur-sm">
          <h4 className="text-xl font-semibold mb-4 text-center bg-gradient-to-r from-[#3ca5de] to-[#8743f7] bg-clip-text text-transparent">
            Swap Tokens
          </h4>
          <div className="space-y-4">
            <div>
              <input
                type="number"
                placeholder="Amount to swap"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                className="w-full p-3 bg-white/10 border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:border-[#3ca5de] focus:outline-none"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">For</span>
              <span className="text-[#3ca5de] font-semibold">
                {swapAmount
                  ? (
                      parseFloat(swapAmount) / assetPrices[selectedAsset].price
                    ).toFixed(6)
                  : "0"}{" "}
                MoCoin
              </span>
            </div>
            <button
              onClick={handleBookNowClick}
              className="w-full bg-gradient-to-r from-[#3ca5de] to-[#8743f7] hover:from-[#2a8bb5] hover:to-[#6d35c4] py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <Wallet className="inline-block w-5 h-5 mr-2" />
              HODL NOW!
            </button>
          </div>
        </div>
      </motion.div>

      {/* Price Dashboard */}
      <div className="w-full max-w-6xl mb-16">
        {/*<div className="flex justify-center space-x-4 mb-8 flex-wrap gap-2">
          {Object.keys(assetPrices).map((asset) => (
            <button
              key={asset}
              onClick={() => setSelectedAsset(asset as AssetKey)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedAsset === asset
                  ? "bg-gradient-to-r from-[#3ca5de] to-[#8743f7] text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              MoCoin / {asset}
            </button>
          ))}
        </div>*/}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Price Card */}
          {/*<div className="lg:col-span-2 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border-2 border-gradient-to-r from-[#3ca5de] to-[#8743f7]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-2xl font-bold bg-gradient-to-r from-[#3ca5de] to-[#8743f7] bg-clip-text text-transparent">
                  MoCoin / {selectedAsset}
                </h4>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-3xl font-bold text-white">
                    {assetPrices[selectedAsset].symbol}
                    {assetPrices[selectedAsset].price}
                  </span>
                  <span
                    className={`flex items-center px-2 py-1 rounded-full text-sm font-semibold ${
                      assetPrices[selectedAsset].change > 0
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {assetPrices[selectedAsset].change > 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(assetPrices[selectedAsset].change)}%
                  </span>
                </div>
              </div>
              <div className="text-right text-gray-400">
                <div>24h Volume</div>
                <div className="font-semibold">{marketData.volume24h}</div>
              </div>
            </div>

            <MoCoinChart priceData={priceData} />
          </div>*/}

          {/* Market Stats */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-[#3ca5de]/30">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Market Cap</span>
                <BarChart3 className="w-5 h-5 text-[#3ca5de]" />
              </div>
              <div className="text-xl font-bold text-[#3ca5de]">
                {marketData.marketCap}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-[#8743f7]/30">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">TVL</span>
                <DollarSign className="w-5 h-5 text-[#8743f7]" />
              </div>
              <div className="text-xl font-bold text-[#8743f7]">
                {marketData.tvl}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Holders</span>
                <Coins className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-xl font-bold text-yellow-300">
                {marketData.holders}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HODL Section */}
      <div
        style={{
          padding: "20px",
          fontFamily: "monospace",
          minHeight: "25vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
          HOD·L
        </h1>
        <div className="text-center text-lg text-gray-300 max-w-4xl">
          <TypewriterEffect
            strings={[
              "Crypto investors quickly retrofit HODL as an acronym for 'hold on for dear life,'",
              "An encouragement to other crypto investors not to sell when prices fall",
              "The word 'HODL' originated from a post on the Bitcoin Forum",
              "The term HODL began as an accidental misspelling of 'hold'",
            ]}
            className="text-gray-300"
            speed={70}
          />
        </div>
      </div>

      {/* Chart with Attractive Frame */}
      {/*<div className="w-full max-w-6xl mb-16">
        <div className="p-8 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-xl border-4 border-gradient-to-r from-yellow-400 to-orange-400 shadow-2xl">
          <MoCoinChart priceData={priceData} />
        </div>
      </div>*/}

      {/* Chart and External Links */}
      <div className="flex flex-col gap-4 mb-8">
        <button
          onClick={() => (window.location.href = chartLink)}
          className="px-8 py-4 rounded-full transition-all transform border-2 border-white bg-black text-white hover:bg-white hover:text-black flex items-center justify-center gap-2"
        >
          Chart <ExternalLink className="w-5 h-5" />
        </button>
      </div>

      {/* Embedded Charts */}
      <div style={{ width: "100%", maxWidth: "1000px", margin: "40px 0" }}>
        <div
          className="w-full max-w-6xl mb-16 h-64"
          style={{
            position: "relative",
            //paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            minHeight: "25vh",
            maxWidth: "100%",
            background: "#000",
            marginBottom: "20px",
            borderRadius: "12px",
            border: "2px solid #3ca5de",
          }}
        >
          <iframe
            src="https://dexscreener.com/solana/2mz5eNLTpCk2F6CvP1y9LWdUe6LUh1zqPa7bzPFYWns8?embed=1&theme=dark&trades=0"
            frameBorder="0"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              minHeight: "25vh",
              width: "100%",
              height: "100%",
              borderRadius: "10px",
            }}
            allowFullScreen
          />
        </div>

        {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <iframe
            id="dextools-widget"
            title="DEXTools Trading Chart"
            width="100%"
            height="400"
            src="https://www.dextools.io/widget-chart/en/solana/pe-light/7pgJosWMACBgfrsD8DxwcDL3nFEqSXGa8m9muEawn3Ar?theme=dark&chartType=2&chartResolution=30&drawingToolbars=false"
            style={{ borderRadius: "12px", border: "2px solid #8743f7" }}
          />

          <iframe
            id="dextswap-aggregator-widget"
            title="DEXTswap Aggregator"
            width="100%"
            height="420"
            src="https://www.dextools.io/widget-aggregator/en/swap/solana/HHVmXazRvA3VdciVG4ayE7vjgUFUn12t5r7vYm2BJ258"
            style={{ borderRadius: "12px", border: "2px solid #3ca5de" }}
          />
        </div>*/}
      </div>

      {/* Why HODL MoCoin */}
      <div className="w-full max-w-6xl mb-16">
        <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Why HODL MoCoin?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-xl border border-green-500/30">
            <Shield className="w-12 h-12 text-green-400 mb-4" />
            <h4 className="text-xl font-bold mb-3 text-green-300">
              Store of Value
            </h4>
            <p className="text-gray-300">
              Backed by a mutually held fund of RWA and digital assets with
              exclusive access to private projects.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30">
            <Globe className="w-12 h-12 text-purple-400 mb-4" />
            <h4 className="text-xl font-bold mb-3 text-purple-300">
              Unit of Account
            </h4>
            <p className="text-gray-300">
              Exclusive access provided to those who hold higher amounts makes
              it an optimal unit of account.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl border border-blue-500/30">
            <Zap className="w-12 h-12 text-blue-400 mb-4" />
            <h4 className="text-xl font-bold mb-3 text-blue-300">
              Medium of Exchange
            </h4>
            <p className="text-gray-300">
              Ideal medium of exchange for business in a digital era, adopted by
              tomorrow&apos;s business leaders.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {hodlFacts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
              className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-500/20"
            >
              <ArrowUpRight className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-gray-300 font-mono">{fact}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-[#3ca5de]/20 to-[#8743f7]/20 rounded-xl border-2 border-gradient-to-r from-[#3ca5de] to-[#8743f7]">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#3ca5de] to-[#8743f7] bg-clip-text text-transparent">
            Start Your MoCoin Journey Today
          </h3>
          <p className="text-xl text-gray-300 mb-6 font-mono">
            Join thousands of forward-thinking investors and business leaders
            who are building the future with MoCoin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBookNowClick}
              className="bg-gradient-to-r from-[#3ca5de] to-[#8743f7] hover:from-[#2a8bb5] hover:to-[#6d35c4] py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              <Wallet className="inline-block w-6 h-6 mr-2" />
              Buy MoCoin
            </button>
            <button
              onClick={() => (window.location.href = chartLink)}
              className="border border-[#3ca5de] hover:bg-[#3ca5de]/20 py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-200"
            >
              View Chart
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

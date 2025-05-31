"use client";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface MobileFooterProps {
  className?: string;
}

const MobileFooter: React.FC<MobileFooterProps> = ({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 dark:bg-gray-900/90 dark:border-gray-700 z-50 md:hidden ${className}`}
    >
      
      <div className="relative flex items-center justify-between px-6 py-3 bg-white dark:bg-black">
        {/* Left - Feed */}
        <div className="flex-1 flex justify-center">
          <Link
            href="/feed"
            className={`flex flex-col items-center transition-all duration-200 ${
              isActive("/feed")
                ? "text-blue-600 dark:text-blue-400 scale-105"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <div className="relative">
              <svg
                className="w-7 h-7 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
              {isActive("/feed") && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              )}
            </div>
            <span className="text-sm font-medium">Feed</span>
          </Link>
        </div>

        {/* Center - Mo logo */}
        <div className="relative z-10  px-16">
          <Link href="/" className="flex items-center justify-center">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-xl w-32 h-32 flex justify-center transition-transform duration-300 group hover:scale-110">
              <img
                src="/mo.svg"
                alt="Mo Logo"
                className="mt-5 w-16 h-16 object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Right - MoOS */}
        <div className="flex-1 flex justify-center">
          <Link
            href="/moos"
            className={`flex flex-col items-center transition-all duration-200 ${
              isActive("/moos")
                ? "text-blue-600 dark:text-blue-400 scale-105"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <div className="relative">
              <svg
                className="w-7 h-7 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {isActive("/moos") && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              )}
            </div>
            <span className="text-sm font-medium">MoOS</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;

'use client';

import { useState } from 'react';

export default function AdoptionCurveClient() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const groups = [
    {
      id: "innovators",
      value: "2.5%",
      label: "Innovators",
      color: "purple",
      description: "Risk-takers who try new tech first. They're comfortable with bugs and incomplete features, driving innovation forward.",
    },
    {
      id: "early-adopters",
      value: "13.5%",
      label: "Early Adopters",
      color: "blue",
      description: "Opinion leaders who see the vision. They provide crucial feedback and social proof for wider adoption.",
    },
    {
      id: "early-majority",
      value: "34%",
      label: "Early Majority",
      color: "cyan",
      description: "Pragmatists who adopt after seeing proven value. They need reliability and clear benefits before committing.",
    },
    {
      id: "late-majority",
      value: "34%",
      label: "Late Majority",
      color: "teal",
      description: "Skeptics who wait until adoption is necessary. They need strong peer pressure and robust support systems.",
    },
    {
      id: "laggards",
      value: "16%",
      label: "Laggards",
      color: "gray",
      description: "Traditional adopters who resist change. They adopt only when absolutely necessary or forced by circumstances.",
    },
  ];

  const getColorClasses = (color: string, type: 'text' | 'hover-text' | 'hover-label' | 'gradient' | 'bg' | 'hover-bg' | 'border' | 'hover-border' | 'glow' | 'shadow') => {
    const colors: Record<string, Record<string, string>> = {
      purple: {
        text: 'text-purple-400',
        'hover-text': 'group-hover:text-purple-300',
        'hover-label': 'group-hover:text-purple-400',
        gradient: 'bg-gradient-to-r from-purple-400 to-transparent',
        bg: 'bg-purple-900/20',
        'hover-bg': 'hover:bg-purple-900/40',
        border: 'border-purple-500/30',
        'hover-border': 'hover:border-purple-400/60',
        glow: 'bg-purple-600/20',
        shadow: 'hover:shadow-purple-500/20',
      },
      blue: {
        text: 'text-blue-400',
        'hover-text': 'group-hover:text-blue-300',
        'hover-label': 'group-hover:text-blue-400',
        gradient: 'bg-gradient-to-r from-blue-400 to-transparent',
        bg: 'bg-blue-900/20',
        'hover-bg': 'hover:bg-blue-900/40',
        border: 'border-blue-500/30',
        'hover-border': 'hover:border-blue-400/60',
        glow: 'bg-blue-600/20',
        shadow: 'hover:shadow-blue-500/20',
      },
      cyan: {
        text: 'text-cyan-400',
        'hover-text': 'group-hover:text-cyan-300',
        'hover-label': 'group-hover:text-cyan-400',
        gradient: 'bg-gradient-to-r from-cyan-400 to-transparent',
        bg: 'bg-cyan-900/20',
        'hover-bg': 'hover:bg-cyan-900/40',
        border: 'border-cyan-500/30',
        'hover-border': 'hover:border-cyan-400/60',
        glow: 'bg-cyan-600/20',
        shadow: 'hover:shadow-cyan-500/20',
      },
      teal: {
        text: 'text-teal-400',
        'hover-text': 'group-hover:text-teal-300',
        'hover-label': 'group-hover:text-teal-400',
        gradient: 'bg-gradient-to-r from-teal-400 to-transparent',
        bg: 'bg-teal-900/20',
        'hover-bg': 'hover:bg-teal-900/40',
        border: 'border-teal-500/30',
        'hover-border': 'hover:border-teal-400/60',
        glow: 'bg-teal-600/20',
        shadow: 'hover:shadow-teal-500/20',
      },
      gray: {
        text: 'text-gray-400',
        'hover-text': 'group-hover:text-gray-300',
        'hover-label': 'group-hover:text-gray-400',
        gradient: 'bg-gradient-to-r from-gray-400 to-transparent',
        bg: 'bg-gray-900/20',
        'hover-bg': 'hover:bg-gray-900/40',
        border: 'border-gray-500/30',
        'hover-border': 'hover:border-gray-400/60',
        glow: 'bg-gray-600/20',
        shadow: 'hover:shadow-gray-500/20',
      },
    };
    return colors[color]?.[type] || '';
  };

  return (
    <div className="mb-12">
      {/* Enhanced Stats Overview Bar with Glow Effects */}
      <div className="mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 rounded-3xl blur-3xl" />
        <div className="relative bg-gradient-to-br from-slate-900/90 via-purple-900/20 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-purple-500/20 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
            {groups.map((stat, i) => (
              <div
                key={i}
                onClick={() => setSelectedGroup(selectedGroup === stat.id ? null : stat.id)}
                className={`text-center group cursor-pointer transform transition-all duration-300 hover:scale-110 ${
                  selectedGroup === stat.id ? 'scale-110' : ''
                }`}
              >
                <div
                  className={`text-4xl md:text-5xl font-bold mb-3 transition-all duration-300 ${
                    getColorClasses(stat.color, 'text')
                  } ${getColorClasses(stat.color, 'hover-text')}`}
                >
                  {stat.value}
                </div>
                <div
                  className={`text-xs md:text-sm font-medium transition-colors duration-300 text-gray-400 ${
                    getColorClasses(stat.color, 'hover-label')
                  }`}
                >
                  {stat.label}
                </div>
                <div
                  className={`mt-2 h-1 transition-all duration-500 mx-auto rounded-full ${
                    selectedGroup === stat.id ? 'w-full' : 'w-0 group-hover:w-full'
                  } ${getColorClasses(stat.color, 'gradient')}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Card - Shows only selected group */}
      {selectedGroup && (
        <div className="animate-fadeIn">
          {groups
            .filter((group) => group.id === selectedGroup)
            .map((group) => (
              <div key={group.id} className="group relative max-w-2xl mx-auto">
                <div className={`absolute inset-0 rounded-2xl blur-xl opacity-100 transition-opacity duration-300 ${getColorClasses(group.color, 'glow')}`} />
                <div
                  className={`relative rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    getColorClasses(group.color, 'bg')
                  } ${getColorClasses(group.color, 'hover-bg')} ${
                    getColorClasses(group.color, 'border')
                  } ${getColorClasses(group.color, 'hover-border')} ${
                    getColorClasses(group.color, 'shadow')
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3
                      className={`text-2xl md:text-3xl font-bold transition-colors ${
                        group.color === 'purple'
                          ? 'text-purple-300 group-hover:text-purple-200'
                          : group.color === 'blue'
                          ? 'text-blue-300 group-hover:text-blue-200'
                          : group.color === 'cyan'
                          ? 'text-cyan-300 group-hover:text-cyan-200'
                          : group.color === 'teal'
                          ? 'text-teal-300 group-hover:text-teal-200'
                          : 'text-gray-300 group-hover:text-gray-200'
                      }`}
                    >
                      {group.label}
                    </h3>
                    <span className={`text-3xl md:text-4xl font-bold ${getColorClasses(group.color, 'text')}`}>
                      {group.value}
                    </span>
                  </div>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-base md:text-lg leading-relaxed">
                    {group.description}
                  </p>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="mt-6 text-sm text-gray-400 hover:text-white transition-colors underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
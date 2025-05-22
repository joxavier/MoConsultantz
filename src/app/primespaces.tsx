import React, { useState, useEffect } from 'react';
import { MapPin, Wifi, Clock, Printer, Users, Mail, Phone, Check, Star, ArrowRight, Building, Coffee } from 'lucide-react';

const PrimaLogo = () => (
  <div className="text-center mb-8">
    <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
      PRIMA
    </div>
    <div className="text-lg md:text-xl font-light text-gray-300 tracking-[0.3em]">
      SPACES
    </div>
  </div>
);

export default function OfficeRentalPage() {
  const [activeService, setActiveService] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      icon: <Building className="w-8 h-8" />,
      title: "Private Offices",
      description: "Fully furnished private offices for teams of all sizes",
      features: ["Lockable doors", "Custom branding", "Flexible sizing", "Premium furnishing"]
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Dedicated Desks",
      description: "Your own desk in a shared workspace environment",
      features: ["Personal storage", "Monitor included", "Reserved seating", "24/7 access"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Hot Desks",
      description: "Flexible workspace you can use whenever you need",
      features: ["Book by the hour/day", "Any available desk", "No commitment", "Perfect for freelancers"]
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Virtual Membership",
      description: "Professional business address without the physical space",
      features: ["Business address", "Mail handling", "Phone answering", "Meeting room access"]
    }
  ];

  const amenities = [
    { icon: <Clock className="w-6 h-6" />, title: "24/7 Access", desc: "Work on your schedule" },
    { icon: <Wifi className="w-6 h-6" />, title: "Ultra-Fast WiFi", desc: "Gigabit internet speeds" },
    { icon: <Printer className="w-6 h-6" />, title: "Printing & Scanning", desc: "Full office equipment" },
    { icon: <Users className="w-6 h-6" />, title: "Meeting Rooms", desc: "Professional spaces available" },
    { icon: <Mail className="w-6 h-6" />, title: "Mail Services", desc: "Professional mailbox handling" },
    { icon: <Phone className="w-6 h-6" />, title: "Phone Answering", desc: "Professional call handling" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <PrimaLogo />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Modern, Flexible
              <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Professional Workspace
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Prima Spaces offers modern, flexible private offices and co-working spaces designed for professionals, 
              entrepreneurs, and growing businesses. With high-end amenities, thoughtfully designed workspaces, 
              and a vibrant community atmosphere, Prima Spaces provides the perfect environment to focus, collaborate, and succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
                Book a Tour
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Perfect
            <span className="block text-gray-300">Workspace Solution</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From individual entrepreneurs to growing teams, we have the perfect space for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer ${
                activeService === index ? 'scale-105 border-white/50' : 'hover:scale-102'
              }`}
              onMouseEnter={() => setActiveService(index)}
            >
              <div className="text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-400">
                    <Check className="w-4 h-4 text-white mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities Section */}
      <div className="bg-black/20 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need
              <span className="block text-gray-300">All Included</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Premium amenities and services designed to keep you productive and professional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
              >
                <div className="text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  {amenity.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{amenity.title}</h3>
                <p className="text-gray-400">{amenity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Highlight */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-gray-900/50 to-black/50 rounded-3xl p-12 border border-white/20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Flexible Contracts,
                <span className="block text-gray-300">Maximum Freedom</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                No long-term commitments. Scale up or down as your business grows. 
                Our flexible approach means you only pay for what you need, when you need it.
              </p>
              <div className="space-y-4">
                {[
                  "Month-to-month flexibility",
                  "No setup fees or hidden costs",
                  "Instant online booking",
                  "Scale your team seamlessly"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-4"></div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-white/10 to-gray-800/20 rounded-2xl border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <Building className="w-20 h-20 text-white mx-auto mb-4" />
                  <p className="text-2xl font-semibold text-white">Your Perfect Office Awaits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Ready to Transform
            <span className="block">Your Workspace?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Join hundreds of professionals who&apos;ve made the smart choice. 
            Book your tour today and see why flexible office space is the future of work.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-black text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:scale-105">
              Schedule a Tour
            </button>
            <button className="border-2 border-black text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-black hover:text-white transition-all duration-300">
              Call (905) 712-3434
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-black text-white mb-1 tracking-tight">
              PRIMA
            </div>
            <div className="text-sm font-light text-gray-400 tracking-[0.3em] mb-4">
              SPACES
            </div>
            <p className="text-gray-400 mb-6">Modern, flexible workspace solutions for professionals</p>
            <div className="flex justify-center space-x-8 text-gray-400">
              <span>📍 Multiple Locations</span>
              <span>📞 24/7 Support</span>
              <span>✉️ hello@primaspaces.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Brain, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  Star, 
  Globe, 
  CreditCard, 
  Building, 
  Bitcoin 
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  investmentRange: string;
  accreditationStatus: string;
  paymentMethod: string;
  message: string;
}

interface InvestmentTier {
  name: string;
  range: string;
  description: string;
  benefits: string[];
  color: string;
  popular?: boolean;
}

interface PaymentMethod {
  name: string;
  description: string;
  fee: string;
  feeColor: string;
  icon: React.ElementType;
  iconColor: string;
}

const Domin8AIInvestorPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    investmentRange: '',
    accreditationStatus: '',
    paymentMethod: '',
    message: ''
  });

  const [showForm, setShowForm] = useState<boolean>(false);

  const investmentTiers: InvestmentTier[] = [
    {
      name: 'Seed Partner',
      range: '$10K - $50K',
      description: 'Early equity allocation',
      color: 'purple',
      benefits: [
        'Early equity participation',
        'Quarterly progress reports',
        'Investor community access',
        'Product beta testing'
      ]
    },
    {
      name: 'Growth Partner',
      range: '$50K - $250K',
      description: 'Priority equity terms',
      color: 'pink',
      popular: true,
      benefits: [
        'Priority equity allocation',
        'Board observer rights',
        'Monthly executive calls',
        'Advisory opportunities'
      ]
    },
    {
      name: 'Strategic Partner',
      range: '$250K+',
      description: 'Custom deal structure',
      color: 'blue',
      benefits: [
        'Custom equity terms',
        'Direct board advisory',
        'Strategic partnership',
        'Co-investment opportunities'
      ]
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      name: 'Credit Card Monthly',
      description: 'Split your investment into convenient monthly payments',
      fee: '5% service charge',
      feeColor: 'text-orange-400',
      icon: CreditCard,
      iconColor: 'text-green-400'
    },
    {
      name: 'Bank Transfer',
      description: 'Direct wire transfer for larger investments',
      fee: '3% service charge',
      feeColor: 'text-green-400',
      icon: Building,
      iconColor: 'text-blue-400'
    },
    {
      name: 'Cryptocurrency',
      description: 'Bitcoin, Ethereum, and other major crypto accepted',
      fee: 'No service charge',
      feeColor: 'text-purple-400',
      icon: Bitcoin,
      iconColor: 'text-yellow-400'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      // Here you would typically send the data to your API
      console.log('Investor signup:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Thank you for your interest! We will contact you within 24 hours with next steps.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        investmentRange: '',
        accreditationStatus: '',
        paymentMethod: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your information. Please try again.');
    }
  };

  const scrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      const element = document.getElementById('investor-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const getTierColors = (color: string) => {
    const colors = {
      purple: {
        gradient: 'from-purple-900/50 to-purple-800/30',
        border: 'border-purple-300/30 hover:border-purple-300/50',
        text: 'text-purple-300'
      },
      pink: {
        gradient: 'from-pink-900/50 to-pink-800/30',
        border: 'border-2 border-pink-300/50 hover:border-pink-300/70',
        text: 'text-pink-300'
      },
      blue: {
        gradient: 'from-blue-900/50 to-blue-800/30',
        border: 'border-blue-300/30 hover:border-blue-300/50',
        text: 'text-blue-300'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-purple-500/20 rounded-full px-6 py-2 mb-8 border border-purple-300/30">
              <Shield className="w-5 h-5 text-purple-300 mr-2" />
              <span className="text-purple-300 font-medium">Exclusive Investment Opportunity</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Invest in the Future of
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                Cybersecurity
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join us in building <strong>Domin8AI</strong> — an AI-powered cybersecurity suite designed for the 
              200M+ SME market. Early investors get exclusive equity in our $200M exit roadmap.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={scrollToForm}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-2xl"
              >
                Join as an Investor <ArrowRight className="inline w-5 h-5 ml-2" />
              </button>
              <div className="text-gray-400 text-sm">
                <Lock className="inline w-4 h-4 mr-1" />
                Accredited investors only
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Metrics */}
      <section className="bg-black/30 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">$200B+</div>
              <div className="text-gray-400">Global SMB Cybersecurity Market</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400 mb-2">200M+</div>
              <div className="text-gray-400">Target SME Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">4 Months</div>
              <div className="text-gray-400">To MVP Launch</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">$200M</div>
              <div className="text-gray-400">5-Year Exit Target</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Invest With Us */}
      <section className="py-20 bg-gradient-to-r from-slate-800/50 to-purple-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Invest in Domin8AI</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We&apos;re positioned to capture a massive market with proven technology and experienced leadership
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Market Opportunity</h3>
              <p className="text-gray-300">$200B+ global SMB cybersecurity market with 43% annual growth rate</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <Brain className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">AI Innovation</h3>
              <p className="text-gray-300">Proprietary AI-driven vulnerability scanner with predictive threat analysis</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <Users className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Proven Team</h3>
              <p className="text-gray-300">Founded by cybersecurity veterans with 20+ years combined experience</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <Globe className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Global Reach</h3>
              <p className="text-gray-300">SME-focused platform designed for worldwide deployment and scaling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Tiers */}
      <section id = "Investor" className="py-20 bg-black/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Investment Partnership Tiers</h2>
            <p className="text-xl text-gray-300">Choose your level of involvement in our growth journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {investmentTiers.map((tier, index) => {
              const colors = getTierColors(tier.color);
              return (
                <div 
                  key={index}
                  className={`bg-gradient-to-b ${colors.gradient} rounded-2xl p-8 border ${colors.border} transition-all relative`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        <Star className="inline w-4 h-4 mr-1" />
                        Popular
                      </div>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <div className={`${colors.text} font-semibold text-sm uppercase tracking-wide mb-2`}>
                      {tier.name}
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{tier.range}</div>
                    <div className="text-gray-400">{tier.description}</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-gradient-to-r from-slate-800/50 to-purple-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Flexible Payment Options</h2>
            <p className="text-gray-300">Choose the payment method that works best for your investment strategy</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {paymentMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                  <IconComponent className={`w-12 h-12 ${method.iconColor} mb-4 mx-auto`} />
                  <h3 className="text-xl font-semibold text-white mb-2">{method.name}</h3>
                  <p className="text-gray-300 mb-4">{method.description}</p>
                  <div className={`text-sm ${method.feeColor} font-medium`}>{method.fee}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Investment Form */}
      {showForm && (
        <section id="investor-form" className="py-20 bg-black/60">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-6">Secure Your Investment Position</h2>
                <p className="text-xl text-gray-300">Join the exclusive group of investors backing the future of SME cybersecurity</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                        placeholder="John Smith"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Investment Range *</label>
                      <select
                        name="investmentRange"
                        required
                        value={formData.investmentRange}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                      >
                        <option value="">Select range</option>
                        <option value="10k-25k">$10,000 - $25,000</option>
                        <option value="25k-50k">$25,000 - $50,000</option>
                        <option value="50k-100k">$50,000 - $100,000</option>
                        <option value="100k-250k">$100,000 - $250,000</option>
                        <option value="250k+">$250,000+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Payment Method *</label>
                      <select
                        name="paymentMethod"
                        required
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                      >
                        <option value="">Select method</option>
                        <option value="credit-monthly">Credit Card Monthly (5% fee)</option>
                        <option value="bank-transfer">Bank Transfer (3% fee)</option>
                        <option value="cryptocurrency">Cryptocurrency (0% fee)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Accreditation Status *</label>
                    <select
                      name="accreditationStatus"
                      required
                      value={formData.accreditationStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="">Select status</option>
                      <option value="accredited">Accredited Investor</option>
                      <option value="qualified-purchaser">Qualified Purchaser</option>
                      <option value="institutional">Institutional Investor</option>
                      <option value="family-office">Family Office</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message / Questions</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                      placeholder="Any specific questions about the investment opportunity..."
                    />
                  </div>
                  
                  <div className="text-sm text-gray-400 bg-black/30 p-4 rounded-lg">
                    <Lock className="inline w-4 h-4 mr-2" />
                    <strong>Legal Disclaimer:</strong> This is not a public offering. Investment opportunities are limited to accredited investors only. All investments carry risk of loss. Past performance does not guarantee future results.
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
                  >
                    Secure My Investment Position
                    <ArrowRight className="inline w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black/80 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold text-white mb-4">Domin8AI</div>
              <p className="text-gray-400 mb-4">
                Building the next generation of AI-powered cybersecurity solutions for small and medium enterprises worldwide.
              </p>
              <div className="text-gray-400 text-sm">
                © 2025 Domin8AI. All rights reserved.
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Private Placement Memorandum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Risk Disclosures</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              {/*<ul className="space-y-2 text-gray-400 text-sm">
                <li>investors@domin8ai.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Innovation Drive</li>
                <li>San Francisco, CA 94105</li>
              </ul>*/}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Domin8AIInvestorPage;
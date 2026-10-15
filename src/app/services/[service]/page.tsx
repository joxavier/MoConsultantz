"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import servicesData from '../../services/services.json';

interface ServiceData {
  service: string;
  category: string;
  description: string;
  features: string[];
  benefits: string[];
}

interface ServiceGroup {
  description: string;
  services: Array<{
    service: string;
    features: string[];
  }>;
}

interface ServicesJSON {
  MoConsultantz: ServiceGroup;
  MoVestmentz: ServiceGroup;
  MoDevz: ServiceGroup;
}

// Enhanced service benefits mapping
const serviceBenefits: { [key: string]: string[] } = {
  'Business & Strategy Consulting': [
    'Clear strategic direction and roadmap',
    'Improved market positioning',
    'Enhanced competitive advantage',
    'Sustainable growth pathways',
    'Data-driven decision making'
  ],
  'Continuity & Market Insights': [
    'Reduced business disruption risks',
    'Market opportunity identification',
    'Competitive intelligence insights',
    'Customer behavior understanding',
    'Strategic market positioning'
  ],
  'Legal, Risk & Regulatory Advisory': [
    'Reduced legal exposure and compliance risks',
    'Regulatory compliance assurance',
    'Risk mitigation strategies',
    'Policy clarity and implementation',
    'Legal framework optimization'
  ],
  'People & Sustainability': [
    'Enhanced brand reputation',
    'Improved employee engagement',
    'Sustainable business practices',
    'Stakeholder value creation',
    'ESG compliance and reporting'
  ],
  'Core Financial Services': [
    'Accurate financial records and reporting',
    'Tax optimization strategies',
    'Compliance assurance',
    'Strategic financial insights',
    'Risk management and protection'
  ],
  'Investment & Wealth Management': [
    'Wealth preservation and growth',
    'Tax-efficient investment strategies',
    'Financial security and planning',
    'Legacy and estate planning',
    'Diversified portfolio management'
  ],
  'Digital & Impact Investment': [
    'Access to emerging digital markets',
    'Innovative financial solutions',
    'ESG-aligned investment strategies',
    'Future-ready asset management',
    'Blockchain and DeFi opportunities'
  ],
  'Software & Digital Solutions': [
    'Improved operational efficiency',
    'Enhanced customer experience',
    'Scalable technology solutions',
    'Competitive digital advantage',
    'Automated business processes'
  ],
  'Smart Infrastructure & Real Estate': [
    'Reduced operational costs',
    'Enhanced building performance',
    'Sustainable infrastructure development',
    'Future-ready facilities',
    'Smart technology integration'
  ]
};

// Enhanced service descriptions
const serviceDescriptions: { [key: string]: string } = {
  'Business & Strategy Consulting': 'Comprehensive business strategy development and implementation to drive growth, optimize operations, and achieve competitive advantage in dynamic markets.',
  'Continuity & Market Insights': 'Strategic business continuity planning and in-depth market research to ensure resilience, identify opportunities, and make informed decisions.',
  'Legal, Risk & Regulatory Advisory': 'Expert guidance on legal compliance, risk management, and regulatory requirements to protect your business and ensure adherence to industry standards.',
  'People & Sustainability': 'Human capital development and sustainability initiatives to build resilient, purpose-driven organizations that create lasting value for all stakeholders.',
  'Core Financial Services': 'Professional accounting, auditing, financing, and insurance solutions to maintain financial health, optimize capital structure, and protect your assets.',
  'Investment & Wealth Management': 'Comprehensive investment advisory and wealth management services designed to preserve, grow, and transfer wealth across generations.',
  'Digital & Impact Investment': 'Cutting-edge digital asset management, ESG investing, and DeFi solutions that align financial returns with positive environmental and social impact.',
  'Software & Digital Solutions': 'Custom software development, cloud solutions, and digital transformation services to modernize operations and enhance business capabilities.',
  'Smart Infrastructure & Real Estate': 'Intelligent infrastructure development combining real estate expertise with IoT, PropTech, and smart building technologies for sustainable, efficient properties.'
};

export default function ServicePage() {
  const params = useParams();
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const services: ServicesJSON = servicesData;

  useEffect(() => {
    if (params.service && typeof params.service === 'string') {
      // Decode the URL-encoded service name
      const decodedServiceName = decodeURIComponent(params.service);
      
      // Search through all categories to find the matching service
      let foundService: ServiceData | null = null;
      
      // Check MoConsultantz
      const consultantzService = services.MoConsultantz.services.find(
        s => s.service === decodedServiceName
      );
      if (consultantzService) {
        foundService = {
          service: consultantzService.service,
          category: 'MoConsultantz',
          description: serviceDescriptions[consultantzService.service] || 'Professional consulting services tailored to your business needs.',
          features: consultantzService.features,
          benefits: serviceBenefits[consultantzService.service] || ['Enhanced business performance', 'Strategic advantage', 'Operational efficiency']
        };
      }
      
      // Check MoVestmentz
      if (!foundService) {
        const vestmentzService = services.MoVestmentz.services.find(
          s => s.service === decodedServiceName
        );
        if (vestmentzService) {
          foundService = {
            service: vestmentzService.service,
            category: 'MoVestmentz',
            description: serviceDescriptions[vestmentzService.service] || 'Comprehensive financial and investment services for your wealth management needs.',
            features: vestmentzService.features,
            benefits: serviceBenefits[vestmentzService.service] || ['Financial growth', 'Wealth preservation', 'Risk management']
          };
        }
      }
      
      // Check MoDevz
      if (!foundService) {
        const devzService = services.MoDevz.services.find(
          s => s.service === decodedServiceName
        );
        if (devzService) {
          foundService = {
            service: devzService.service,
            category: 'MoDevz',
            description: serviceDescriptions[devzService.service] || 'Innovative technology solutions and smart infrastructure development.',
            features: devzService.features,
            benefits: serviceBenefits[devzService.service] || ['Technology advancement', 'Digital transformation', 'Smart solutions']
          };
        }
      }
      
      setServiceData(foundService);
    }
  }, [params.service, services]);

  if (!serviceData) {
    return (
      <div>
        <Header />
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          paddingTop: '100px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            color: '#1f2937',
            marginBottom: '24px',
            fontFamily: 'Anton, sans-serif'
          }}>
            Service Not Found
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '32px'
          }}>
            The service you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          <button 
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      
      <main style={{ 
        paddingTop: '120px',
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* Header Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#4f46e5',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px'
            }}>
              {serviceData.category}
            </div>
            
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '24px',
              fontFamily: 'Anton, sans-serif'
            }}>
              {serviceData.service}
            </h1>
            
            <p style={{
              fontSize: '20px',
              color: '#6b7280',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              {serviceData.description}
            </p>
          </div>

          {/* Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '40px',
            marginBottom: '80px'
          }}>
            {/* Features Section */}
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px'
              }}>
                Key Features
              </h2>
              
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {serviceData.features.map((feature, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                    fontSize: '16px',
                    color: '#374151'
                  }}>
                    <span style={{
                      color: '#4f46e5',
                      marginRight: '12px',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits Section */}
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px'
              }}>
                Benefits
              </h2>
              
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {serviceData.benefits.map((benefit, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                    fontSize: '16px',
                    color: '#374151'
                  }}>
                    <span style={{
                      color: '#10b981',
                      marginRight: '12px',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}>
                      ★
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            backgroundColor: '#4f46e5',
            color: 'white',
            padding: '60px 40px',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              Ready to get started?
            </h2>
            
            <p style={{
              fontSize: '18px',
              marginBottom: '32px',
              opacity: 0.9
            }}>
              Let&apos;s discuss how our {serviceData.service} can help your business grow.
            </p>
            
            <button 
              style={{
                backgroundColor: 'white',
                color: '#4f46e5',
                padding: '16px 32px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'scale(1.05)'}
              onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'scale(1)'}
              onClick={() => window.location.href = '/contact'}
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
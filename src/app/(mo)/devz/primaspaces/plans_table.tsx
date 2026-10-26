import React, { useEffect } from 'react';

// Types
interface PlanFeature {
  feature: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  paypalPlanId: string;
  paypalContainerId: string;
  popular: boolean;
  icon: string;
}

interface PayPalButton {
  render: (selector: string) => void;
}

interface PayPalActions {
  subscription: {
    create: (options: { plan_id: string; quantity?: number }) => Promise<string>;
  };
}

interface PayPalData {
  subscriptionID: string;
}

declare global {
  interface Window {
    paypal: {
      Buttons: (options: {
        style?: {
          shape?: string;
          color?: string;
          layout?: string;
          label?: string;
          height?: number;
        };
        createSubscription: (data: any, actions: PayPalActions) => Promise<string>;
        onApprove: (data: PayPalData, actions: any) => void;
        onError?: (err: any) => void;
      }) => PayPalButton;
    };
  }
}

const PlansTable: React.FC = () => {
  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: 150,
      period: 'month',
      description: 'Perfect for getting your real estate business online',
      icon: '🌱',
      popular: false,
      paypalPlanId: 'P-8JC14691BT677231HNA64AZQ',
      paypalContainerId: 'paypal-starter',
      features: [
        { feature: 'Mobile-optimized website', included: true },
        { feature: 'Hosting & domain management', included: true },
        { feature: 'Basic monthly content edits', included: true },
        { feature: 'Performance monitoring', included: true },
        { feature: 'Listings update support', included: false },
        { feature: 'Local SEO optimization', included: false },
        { feature: 'Lead capture forms', included: false },
        { feature: 'Monthly traffic reports', included: false },
        { feature: 'Google Ads & social content strategy', included: false },
        { feature: 'CRM & calendar integrations', included: false },
        { feature: 'Custom feature development', included: false },
        { feature: 'Monthly strategy calls', included: false },
      ]
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      price: 450,
      period: 'month',
      description: 'Ideal for growing your online presence and capturing leads',
      icon: '📈',
      popular: true,
      paypalPlanId: 'P-5SD66057GS867753DNA64ADI',
      paypalContainerId: 'paypal-growth',
      features: [
        { feature: 'Mobile-optimized website', included: true },
        { feature: 'Hosting & domain management', included: true },
        { feature: 'Basic monthly content edits', included: true },
        { feature: 'Performance monitoring', included: true },
        { feature: 'Listings update support', included: true },
        { feature: 'Local SEO optimization', included: true },
        { feature: 'Lead capture forms', included: true },
        { feature: 'Monthly traffic reports', included: true },
        { feature: 'Google Ads & social content strategy', included: false },
        { feature: 'CRM & calendar integrations', included: false },
        { feature: 'Custom feature development', included: false },
        { feature: 'Monthly strategy calls', included: false },
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 950,
      period: 'month',
      description: 'Complete digital marketing solution for serious growth',
      icon: '👑',
      popular: false,
      paypalPlanId: 'P-03439319PS520664VNA635MY',
      paypalContainerId: 'paypal-premium',
      features: [
        { feature: 'Mobile-optimized website', included: true },
        { feature: 'Hosting & domain management', included: true },
        { feature: 'Basic monthly content edits', included: true },
        { feature: 'Performance monitoring', included: true },
        { feature: 'Listings update support', included: true },
        { feature: 'Local SEO optimization', included: true },
        { feature: 'Lead capture forms', included: true },
        { feature: 'Monthly traffic reports', included: true },
        { feature: 'Google Ads & social content strategy', included: true },
        { feature: 'CRM & calendar integrations', included: true },
        { feature: 'Custom feature development', included: true },
        { feature: 'Monthly strategy calls', included: true },
      ]
    }
  ];

  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AUmrec41fT7NU0x2DVe5CaVUb1b2pVyofvNlYV9uWvrvxScPM9qgR-GCMffNLDe5wHU9vdT6x1vdfB_a&vault=true&intent=subscription';
    script.async = true;
    
    script.onload = () => {
      // Initialize PayPal buttons for each plan
      plans.forEach((plan) => {
        if (window.paypal) {
          window.paypal.Buttons({
            style: {
              shape: 'pill',
              color: plan.popular ? 'gold' : plan.id === 'premium' ? 'black' : 'blue',
              layout: 'vertical',
              label: 'subscribe',
              height: 40
            },
            createSubscription: (data, actions) => {
              return actions.subscription.create({
                plan_id: plan.paypalPlanId,
                quantity: 1
              });
            },
            onApprove: (data, actions) => {
              alert(`Thank you for subscribing to the ${plan.name}! Subscription ID: ${data.subscriptionID}`);
              // Redirect to booking page
              window.open('https://joshuauh37.setmore.com/', '_blank');
            },
            onError: (err) => {
              console.error('PayPal Error:', err);
              alert('There was an error processing your payment. Please try again.');
            }
          }).render(`#${plan.paypalContainerId}`);
        }
      });
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Website & Digital Growth Plans
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the perfect plan to elevate Prima Spaces and capture more leads online
        </p>
      </div>

      {/* Features Comparison Table */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-purple-600">
                <th className="px-6 py-8 text-left">
                  <div className="text-white text-lg font-semibold">Features</div>
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className="px-6 py-8 text-center relative">
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    <div className="text-white">
                      <div className="text-4xl mb-2">{plan.icon}</div>
                      <div className="text-xl font-bold">{plan.name}</div>
                      <div className="text-3xl font-bold mt-2">
                        ${plan.price}
                        <span className="text-sm font-normal">/{plan.period}</span>
                      </div>
                      <div className="text-sm opacity-90 mt-2">{plan.description}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Features Body */}
            <tbody>
              {plans[0].features.map((_, featureIndex) => (
                <tr key={featureIndex} className={featureIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {plans[0].features[featureIndex].feature}
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center">
                      {plan.features[featureIndex].included ? (
                        <div className="flex justify-center">
                          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Payment Buttons Row */}
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <td className="px-6 py-8 font-bold text-gray-900 text-lg">
                  Get Started
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-8 text-center">
                    <div className="space-y-4">
                      <div id={plan.paypalContainerId}></div>
                      <div className="text-sm text-gray-600">
                        <a 
                          href="https://joshuauh37.setmore.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Book Free Consultation
                        </a>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Real Estate Business?</h2>
        <p className="text-lg opacity-90 mb-6">
          Get a free consultation to discuss your goals and find the perfect plan for Prima Spaces
        </p>
        <a 
          href="https://joshuauh37.setmore.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-200"
        >
          📅 Schedule Free Consultation
        </a>
      </div>
    </div>
  );
};

export default PlansTable;
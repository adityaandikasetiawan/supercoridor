import { Link } from 'react-router-dom';
import { Shield, Lock, Settings, BarChart, HeadphonesIcon, ArrowRight } from 'lucide-react';
import { usePageContent } from '../../hooks/usePageContent';

export function ValueAddedServices() {
  const content = usePageContent('solutions-value-added-services', {
    title: 'Value-Added Services',
    subtitle: 'Enhanced security, managed services, and custom solutions designed to maximize the value of your network infrastructure.',
    description: 'Beyond connectivity, we offer a suite of managed services designed to protect, optimize, and enhance your network infrastructure.',
    services: [
      {
        title: 'DDoS Protection',
        description: 'Advanced threat detection and mitigation to protect your network from distributed denial-of-service attacks.',
        bullets: ['Real-time traffic analysis', 'Automatic mitigation', '24/7 security monitoring'],
      },
      {
        title: 'Managed Firewall',
        description: 'Enterprise-grade firewall management with continuous monitoring and policy optimization.',
        bullets: ['Custom security policies', 'Intrusion prevention', 'Regular updates & patches'],
      },
      {
        title: 'Managed SD-WAN',
        description: 'Software-defined wide area network solutions for optimized multi-site connectivity.',
        bullets: ['Intelligent path selection', 'Application-aware routing', 'Centralized management'],
      },
      {
        title: 'Network Analytics',
        description: 'Comprehensive visibility into network performance with real-time monitoring and reporting.',
        bullets: ['Traffic flow analysis', 'Performance metrics', 'Custom dashboards'],
      },
      {
        title: 'Premium Support',
        description: 'Dedicated technical support with priority response times and proactive monitoring.',
        bullets: ['24/7/365 availability', 'Dedicated account manager', 'Priority escalation'],
      },
      {
        title: 'Custom Solutions',
        description: 'Tailored network solutions designed to meet your unique business requirements.',
        bullets: ['Consultation & design', 'Implementation support', 'Ongoing optimization'],
      },
    ],
    benefits: [
      { title: 'Enhanced Security', description: 'Protect your network infrastructure with multiple layers of security, from DDoS protection to managed firewalls.' },
      { title: 'Reduced Complexity', description: 'Let our experts handle the technical details while you focus on your core business operations.' },
      { title: 'Cost Efficiency', description: 'Avoid the overhead of building in-house expertise and infrastructure for specialized services.' },
      { title: 'Peace of Mind', description: '24/7 monitoring and support ensures your network stays secure and operational at all times.' },
    ],
    ctaTitle: 'Enhance Your Network with Value-Added Services',
    ctaDescription: 'Talk to our specialists about which services best fit your needs.',
    ctaButtonText: 'Contact Us',
  });

  const serviceIcons = [Shield, Lock, Settings, BarChart, HeadphonesIcon, Settings];
  const colorCycle = ['orange', 'blue', 'green'] as const;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">{content.title}</h1>
            <p className="text-xl opacity-90">{content.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {content.services.map((service, index) => {
              const color = colorCycle[index % 3];
              const Icon = serviceIcons[index % serviceIcons.length];
              const borderHover = color === 'orange' ? 'hover:border-orange-500' : color === 'blue' ? 'hover:border-blue-600' : 'hover:border-green-600';
              const iconBg = color === 'orange' ? 'bg-orange-100 text-orange-500' : color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600';
              const bulletColor = color === 'orange' ? 'bg-orange-500' : color === 'blue' ? 'bg-blue-600' : 'bg-green-600';

              return (
                <div key={index} className={`bg-white border-2 border-gray-200 rounded-lg p-6 ${borderHover} hover:shadow-lg transition-all`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${iconBg} rounded-full mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 text-gray-700">
                    {service.bullets.map((bullet, bIndex) => (
                      <li key={bIndex} className="flex items-center">
                        <span className={`w-1.5 h-1.5 ${bulletColor} rounded-full mr-2`}></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl mb-6 text-center">Why Add These Services?</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {content.benefits.map((benefit, index) => {
                const color = colorCycle[index % 3];
                const textColor = color === 'orange' ? 'text-orange-600' : color === 'blue' ? 'text-blue-600' : 'text-green-600';
                return (
                  <div key={index}>
                    <h3 className={`text-xl mb-3 ${textColor}`}>{benefit.title}</h3>
                    <p className="text-gray-700">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl mb-4">{content.ctaTitle}</h2>
            <p className="text-xl opacity-90 mb-6">{content.ctaDescription}</p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {content.ctaButtonText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

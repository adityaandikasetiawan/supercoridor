import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Cloud, Zap, Lock } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { usePageContent } from '../../hooks/usePageContent';

export function CloudInterconnection() {
  const content = usePageContent('solutions-cloud-interconnection', {
    title: 'Cloud & Interconnection Services',
    subtitle: 'Direct, low-latency connections to major cloud providers and internet exchanges for optimal performance and security.',
    description: 'Connect directly to AWS, Google Cloud, Microsoft Azure, and other leading cloud platforms through our private interconnection services. Bypass the public internet for improved security, lower latency, and predictable performance.',
    features: [
      { title: 'Multi-Cloud Access', description: 'Direct connections to AWS, Azure, Google Cloud, and more' },
      { title: 'Low Latency', description: 'Sub-millisecond latency with dedicated private links' },
      { title: 'High Availability', description: 'Redundant paths with automatic failover for 99.99% uptime' },
      { title: 'Flexible Bandwidth', description: 'Scale from 50 Mbps to 100 Gbps based on your needs' },
      { title: 'Enhanced Security', description: 'Private connections keep your data off the public internet, reducing security risks' },
    ],
    cloudPartners: [
      { title: 'Amazon Web Services', description: 'AWS Direct Connect for dedicated network connections to AWS cloud.' },
      { title: 'Microsoft Azure', description: 'Azure ExpressRoute for private connections to Microsoft Cloud services.' },
      { title: 'Google Cloud', description: 'Cloud Interconnect for direct peering with Google Cloud Platform.' },
    ],
    useCases: [
      { title: 'Hybrid Cloud Deployments', description: 'Securely extend your on-premises infrastructure to the cloud.' },
      { title: 'Data Migration', description: 'Fast, secure transfer of large datasets to cloud storage.' },
      { title: 'Disaster Recovery', description: 'Reliable backup and recovery solutions with cloud-based redundancy.' },
      { title: 'Application Hosting', description: 'Host business-critical applications with optimal cloud performance.' },
    ],
    ctaTitle: 'Connect to the Cloud with Confidence',
    ctaDescription: 'Discover how our cloud interconnection services can accelerate your digital transformation.',
    ctaButtonText: 'Get Started',
  });

  const featureIcons = [Zap, Lock, Cloud];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
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
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl mb-6">Seamless Cloud Connectivity</h2>
              <p className="text-gray-600 mb-6">{content.description}</p>
              <ul className="space-y-4">
                {content.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{feature.description}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1667984390553-7f439e6ae401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY3Mjk4NDA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Cloud Computing"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Cloud Partners */}
          <div className="mb-16">
            <h2 className="text-3xl mb-8 text-center">Supported Cloud Platforms</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.cloudPartners.map((partner, index) => (
                <div key={index} className="bg-green-50 p-6 rounded-lg text-center">
                  <h3 className="text-xl mb-3 text-green-600">{partner.title}</h3>
                  <p className="text-gray-700">{partner.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl mb-8 text-center">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.features.slice(0, 3).map((feature, index) => {
                const Icon = featureIcons[index % featureIcons.length];
                return (
                  <div key={index} className="text-center p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Use Cases */}
          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl mb-6 text-center">Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {content.useCases.map((useCase, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="mb-2">{useCase.title}</h3>
                    <p className="text-gray-700">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl mb-4">{content.ctaTitle}</h2>
            <p className="text-xl opacity-90 mb-6">{content.ctaDescription}</p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
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

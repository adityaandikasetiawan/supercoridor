import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { usePageContent } from '../../hooks/usePageContent';

export function DedicatedConnectivity() {
  const content = usePageContent('solutions-dedicated-connectivity', {
    title: 'Dedicated Connectivity',
    subtitle: 'Private, secure fiber-optic connections with guaranteed bandwidth and SLA-backed performance for your mission-critical applications.',
    description: "SuperCorridor's dedicated connectivity solutions provide your business with exclusive, high-performance network access. Our fiber-optic infrastructure ensures maximum reliability and security for your data transmission needs.",
    features: [
      { title: 'Dedicated bandwidth from 10 Mbps to 100 Gbps', description: '' },
      { title: '99.99% uptime SLA guarantee', description: '' },
      { title: 'Low latency and jitter for real-time applications', description: '' },
      { title: 'Symmetric upload and download speeds', description: '' },
      { title: '24/7 network monitoring and support', description: '' },
    ],
    useCases: [
      { title: 'Financial Services', description: 'High-frequency trading, secure transactions, and real-time data synchronization.' },
      { title: 'Healthcare', description: 'HIPAA-compliant connections for telemedicine, medical imaging, and patient data.' },
      { title: 'Media & Entertainment', description: 'Large file transfers, live streaming, and content distribution networks.' },
    ],
    ctaTitle: 'Get Started with Dedicated Connectivity',
    ctaDescription: 'Contact our team to discuss your bandwidth requirements and receive a custom quote.',
    ctaButtonText: 'Contact Sales',
  });

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
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl mb-6">Enterprise-Grade Dedicated Connections</h2>
              <p className="text-gray-600 mb-6">{content.description}</p>
              <ul className="space-y-4">
                {content.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{feature.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761507321147-c21f673f9f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWJlciUyMG9wdGljJTIwY2FibGVzfGVufDF8fHx8MTc2NzE5NTc0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Fiber Optic Connection"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-16">
            <h2 className="text-3xl mb-8 text-center">Perfect For</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.useCases.map((useCase, index) => {
                const colors = [
                  { bg: 'bg-orange-50', text: 'text-orange-600' },
                  { bg: 'bg-blue-50', text: 'text-blue-600' },
                  { bg: 'bg-green-50', text: 'text-green-600' },
                ];
                const c = colors[index % 3];
                return (
                  <div key={index} className={`${c.bg} p-6 rounded-lg`}>
                    <h3 className={`text-xl mb-3 ${c.text}`}>{useCase.title}</h3>
                    <p className="text-gray-700">{useCase.description}</p>
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

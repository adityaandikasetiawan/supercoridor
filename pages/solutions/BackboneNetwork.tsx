import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Network, Server, Shield } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { usePageContent } from '../../hooks/usePageContent';
import { getHeroGradient } from '../../components/HeroGradient';

export function BackboneNetwork() {
  const content = usePageContent('solutions-backbone-network', {
    title: 'Backbone & Network Infrastructure',
    subtitle: 'Robust, scalable network backbone with redundant paths, advanced routing, and carrier-grade reliability.',
    heroImage: 'https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwc2VydmVyc3xlbnwxfHx8fDE3NjcyNzUyOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Our extensive fiber-optic backbone network spans across major cities and business districts, providing unmatched reliability and performance. With multiple redundant paths and diverse routing, we ensure your connectivity stays active even in the most challenging scenarios.',
    features: [
      { title: 'Nationwide Coverage', description: 'Extensive fiber optic network spanning major cities' },
      { title: 'Redundant Paths', description: 'Multiple routes ensure network resilience' },
      { title: 'Carrier-Grade Equipment', description: 'Enterprise-level hardware for maximum reliability' },
      { title: 'Scalable Bandwidth', description: 'Easily upgrade capacity as your needs grow' },
    ],
    benefits: [
      { title: 'Scalability', description: 'Easily scale bandwidth from Mbps to multiple Gbps as your business grows.' },
      { title: 'Low Latency', description: 'Optimized routing ensures minimal latency for time-sensitive applications.' },
      { title: 'High Availability', description: 'Redundant infrastructure provides continuous uptime for critical services.' },
      { title: 'Global Connectivity', description: 'Direct connections to international carriers and internet exchanges.' },
    ],
    ctaTitle: 'Build on Our Robust Infrastructure',
    ctaDescription: "Let's discuss how our backbone network can support your business requirements.",
    ctaButtonText: 'Contact Our Team',
  });

  const featureIcons = [Network, Server, Shield];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-bold text-4xl lg:text-5xl mb-6">{content.title}</h1>
            <p className="text-xl opacity-90">{content.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <ImageWithFallback
                src={content.heroImage}
                alt="Network Infrastructure"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-bold text-3xl mb-6">Carrier-Grade Network Infrastructure</h2>
              <p className="text-gray-600 mb-6">{content.description}</p>
              <ul className="space-y-4">
                {content.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                    <div className="text-gray-700">
                      {feature.description.includes('\n') ? (
                        feature.description.split('\n').filter(l => l.trim()).map((line, i) => (
                          <p key={i}>{line.trim().startsWith('•') || line.trim().startsWith('-') ? line.trim() : `• ${line.trim()}`}</p>
                        ))
                      ) : (
                        <span>{feature.description}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="font-bold text-3xl mb-8 text-center">Infrastructure Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.features.slice(0, 3).map((feature, index) => {
                const Icon = featureIcons[index % featureIcons.length];
                return (
                  <div key={index} className="text-center p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 rounded-lg p-8 mb-16">
            <h2 className="font-bold text-3xl mb-6 text-center">Network Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">{benefit.title}</h3>
                    <p className="text-gray-700">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 text-center">
            <h2 className="font-bold text-3xl mb-4">{content.ctaTitle}</h2>
            <p className="text-xl opacity-90 mb-6">{content.ctaDescription}</p>
            <Link
              to="/contact-us"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
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

import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Network, Server, Shield } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function BackboneNetwork() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">Backbone & Network Infrastructure</h1>
            <p className="text-xl opacity-90">
              Robust, scalable network backbone with redundant paths, advanced routing, and carrier-grade reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <ImageWithFallback
                src="https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwY2VudGVyJTIwc2VydmVyc3xlbnwxfHx8fDE3NjcyNzUyOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Network Infrastructure"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl mb-6">Carrier-Grade Network Infrastructure</h2>
              <p className="text-gray-600 mb-6">
                Our extensive fiber-optic backbone network spans across major cities and business districts, providing unmatched reliability and performance. With multiple redundant paths and diverse routing, we ensure your connectivity stays active even in the most challenging scenarios.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Multi-terabit backbone capacity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Geographic and path diversity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">BGP routing with automatic failover</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Peering with Tier 1 carriers globally</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Advanced DDoS protection</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl mb-8 text-center">Infrastructure Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                  <Network className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-3">Redundant Architecture</h3>
                <p className="text-gray-600">
                  Multiple network paths ensure continuous connectivity with automatic failover capabilities.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                  <Server className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-3">Advanced Routing</h3>
                <p className="text-gray-600">
                  Intelligent traffic routing optimizes performance and minimizes latency across our network.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-3">Proactive Monitoring</h3>
                <p className="text-gray-600">
                  24/7 NOC monitoring with real-time alerts and rapid incident response.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl mb-6 text-center">Network Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2">Scalability</h3>
                  <p className="text-gray-700">Easily scale bandwidth from Mbps to multiple Gbps as your business grows.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2">Low Latency</h3>
                  <p className="text-gray-700">Optimized routing ensures minimal latency for time-sensitive applications.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2">High Availability</h3>
                  <p className="text-gray-700">Redundant infrastructure provides continuous uptime for critical services.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2">Global Connectivity</h3>
                  <p className="text-gray-700">Direct connections to international carriers and internet exchanges.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl mb-4">Build on Our Robust Infrastructure</h2>
            <p className="text-xl opacity-90 mb-6">
              Let's discuss how our backbone network can support your business requirements.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Our Team
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

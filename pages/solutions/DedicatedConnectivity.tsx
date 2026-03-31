import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function DedicatedConnectivity() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">Dedicated Connectivity</h1>
            <p className="text-xl opacity-90">
              Private, secure fiber-optic connections with guaranteed bandwidth and SLA-backed performance for your mission-critical applications.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl mb-6">Enterprise-Grade Dedicated Connections</h2>
              <p className="text-gray-600 mb-6">
                SuperCorridor's dedicated connectivity solutions provide your business with exclusive, high-performance network access. Our fiber-optic infrastructure ensures maximum reliability and security for your data transmission needs.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Dedicated bandwidth from 10 Mbps to 100 Gbps</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">99.99% uptime SLA guarantee</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Low latency and jitter for real-time applications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Symmetric upload and download speeds</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">24/7 network monitoring and support</span>
                </li>
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
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl mb-3 text-orange-600">Financial Services</h3>
                <p className="text-gray-700">
                  High-frequency trading, secure transactions, and real-time data synchronization.
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl mb-3 text-orange-600">Healthcare</h3>
                <p className="text-gray-700">
                  HIPAA-compliant connections for telemedicine, medical imaging, and patient data.
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl mb-3 text-orange-600">Media & Entertainment</h3>
                <p className="text-gray-700">
                  Large file transfers, live streaming, and content distribution networks.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl mb-4">Get Started with Dedicated Connectivity</h2>
            <p className="text-xl opacity-90 mb-6">
              Contact our team to discuss your bandwidth requirements and receive a custom quote.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Sales
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

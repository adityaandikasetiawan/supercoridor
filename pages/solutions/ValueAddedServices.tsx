import { Link } from 'react-router-dom';
import { Shield, Lock, Settings, BarChart, HeadphonesIcon, ArrowRight } from 'lucide-react';

export function ValueAddedServices() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">Value-Added Services</h1>
            <p className="text-xl opacity-90">
              Enhanced security, managed services, and custom solutions designed to maximize the value of your network infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-orange-500 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-500 rounded-full mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-3">DDoS Protection</h3>
              <p className="text-gray-600 mb-4">
                Advanced threat detection and mitigation to protect your network from distributed denial-of-service attacks.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                  Real-time traffic analysis
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                  Automatic mitigation
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                  24/7 security monitoring
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-600 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-3">Managed Firewall</h3>
              <p className="text-gray-600 mb-4">
                Enterprise-grade firewall management with continuous monitoring and policy optimization.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Custom security policies
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Intrusion prevention
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Regular updates & patches
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-green-600 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-3">Managed SD-WAN</h3>
              <p className="text-gray-600 mb-4">
                Software-defined wide area network solutions for optimized multi-site connectivity.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                  Intelligent path selection
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                  Application-aware routing
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                  Centralized management
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-orange-500 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-500 rounded-full mb-4">
                <BarChart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-3">Network Analytics</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive visibility into network performance with real-time monitoring and reporting.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                  Traffic flow analysis
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                  Performance metrics
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                  Custom dashboards
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-600 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <HeadphonesIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-3">Premium Support</h3>
              <p className="text-gray-600 mb-4">
                Dedicated technical support with priority response times and proactive monitoring.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  24/7/365 availability
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Dedicated account manager
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Priority escalation
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-green-600 hover:shadow-lg transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="text-2xl mb-3">Custom Solutions</h3>
              <p className="text-gray-600 mb-4">
                Tailored network solutions designed to meet your unique business requirements.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                  Consultation & design
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                  Implementation support
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                  Ongoing optimization
                </li>
              </ul>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl mb-6 text-center">Why Add These Services?</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-xl mb-3 text-orange-600">Enhanced Security</h3>
                <p className="text-gray-700">
                  Protect your network infrastructure with multiple layers of security, from DDoS protection to managed firewalls.
                </p>
              </div>
              <div>
                <h3 className="text-xl mb-3 text-blue-600">Reduced Complexity</h3>
                <p className="text-gray-700">
                  Let our experts handle the technical details while you focus on your core business operations.
                </p>
              </div>
              <div>
                <h3 className="text-xl mb-3 text-green-600">Cost Efficiency</h3>
                <p className="text-gray-700">
                  Avoid the overhead of building in-house expertise and infrastructure for specialized services.
                </p>
              </div>
              <div>
                <h3 className="text-xl mb-3 text-orange-600">Peace of Mind</h3>
                <p className="text-gray-700">
                  24/7 monitoring and support ensures your network stays secure and operational at all times.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl mb-4">Enhance Your Network with Value-Added Services</h2>
            <p className="text-xl opacity-90 mb-6">
              Talk to our specialists about which services best fit your needs.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

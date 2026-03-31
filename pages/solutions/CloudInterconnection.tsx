import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Cloud, Zap, Lock } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function CloudInterconnection() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">Cloud & Interconnection Services</h1>
            <p className="text-xl opacity-90">
              Direct, low-latency connections to major cloud providers and internet exchanges for optimal performance and security.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl mb-6">Seamless Cloud Connectivity</h2>
              <p className="text-gray-600 mb-6">
                Connect directly to AWS, Google Cloud, Microsoft Azure, and other leading cloud platforms through our private interconnection services. Bypass the public internet for improved security, lower latency, and predictable performance.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Direct connections to major cloud providers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Private, secure connectivity bypassing public internet</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Reduced data transfer costs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Consistent, predictable network performance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Flexible bandwidth options</span>
                </li>
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
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="text-xl mb-3 text-green-600">Amazon Web Services</h3>
                <p className="text-gray-700">
                  AWS Direct Connect for dedicated network connections to AWS cloud.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="text-xl mb-3 text-green-600">Microsoft Azure</h3>
                <p className="text-gray-700">
                  Azure ExpressRoute for private connections to Microsoft Cloud services.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="text-xl mb-3 text-green-600">Google Cloud</h3>
                <p className="text-gray-700">
                  Cloud Interconnect for direct peering with Google Cloud Platform.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl mb-8 text-center">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-3">Low Latency</h3>
                <p className="text-gray-600">
                  Direct paths to cloud providers minimize latency for faster application performance.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-3">Enhanced Security</h3>
                <p className="text-gray-600">
                  Private connections keep your data off the public internet, reducing security risks.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  <Cloud className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-3">Multi-Cloud Ready</h3>
                <p className="text-gray-600">
                  Connect to multiple cloud providers simultaneously through a single interface.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl mb-6 text-center">Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2">Hybrid Cloud Deployments</h3>
                  <p className="text-gray-700">Securely extend your on-premises infrastructure to the cloud.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2">Data Migration</h3>
                  <p className="text-gray-700">Fast, secure transfer of large datasets to cloud storage.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2">Disaster Recovery</h3>
                  <p className="text-gray-700">Reliable backup and recovery solutions with cloud-based redundancy.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2">Application Hosting</h3>
                  <p className="text-gray-700">Host business-critical applications with optimal cloud performance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl mb-4">Connect to the Cloud with Confidence</h2>
            <p className="text-xl opacity-90 mb-6">
              Discover how our cloud interconnection services can accelerate your digital transformation.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

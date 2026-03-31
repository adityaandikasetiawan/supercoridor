import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Globe, Users, Award, TrendingUp } from 'lucide-react';

export function CompanyOverview() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">Company Overview</h1>
            <p className="text-xl opacity-90">
              Leading the future of enterprise connectivity with innovation, reliability, and exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl mb-6">About SuperCorridor</h2>
              <p className="text-gray-600 mb-4">
                Founded with a vision to transform enterprise connectivity, SuperCorridor has grown to become one of Indonesia's leading internet service providers. We specialize in delivering high-performance, reliable network solutions to businesses of all sizes.
              </p>
              <p className="text-gray-600 mb-4">
                Our extensive fiber-optic infrastructure spans across major business districts, connecting enterprises to the digital world with unmatched speed and reliability. We serve over 500 corporate clients, from startups to Fortune 500 companies.
              </p>
              <p className="text-gray-600">
                At SuperCorridor, we believe that connectivity is the foundation of modern business. That's why we're committed to delivering not just internet service, but complete network solutions that empower organizations to achieve their digital transformation goals.
              </p>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1674981208693-de5a9c4c4f44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NjczMjAwMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="SuperCorridor Office"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full mb-4">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-3xl mb-2 text-orange-600">500+</div>
              <div className="text-gray-700">Enterprise Clients</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <div className="text-3xl mb-2 text-blue-600">50+</div>
              <div className="text-gray-700">Cities Covered</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="text-3xl mb-2 text-green-600">99.99%</div>
              <div className="text-gray-700">Network Uptime</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full mb-4">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-3xl mb-2 text-orange-600">15+</div>
              <div className="text-gray-700">Years Experience</div>
            </div>
          </div>

          {/* Core Values */}
          <div>
            <h2 className="text-3xl mb-8 text-center">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl mb-3 text-blue-600">Innovation</h3>
                <p className="text-gray-700">
                  We continuously invest in cutting-edge technology to provide our clients with the most advanced connectivity solutions.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl mb-3 text-green-600">Reliability</h3>
                <p className="text-gray-700">
                  Our commitment to uptime and performance ensures your business stays connected when it matters most.
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl mb-3 text-orange-600">Customer Focus</h3>
                <p className="text-gray-700">
                  We put our clients first, delivering personalized service and support tailored to their unique needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Target, Eye, Compass } from 'lucide-react';

export function VisionMission() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">Vision & Mission</h1>
            <p className="text-xl opacity-90">
              Guiding principles that drive our commitment to excellence in enterprise connectivity.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vision */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full">
                <Eye className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-3xl mb-6 text-center text-blue-600">Our Vision</h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xl text-gray-700 leading-relaxed">
                To be the most trusted and innovative provider of enterprise connectivity solutions in Southeast Asia, empowering businesses to thrive in the digital age through exceptional network infrastructure and unwavering reliability.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full">
                <Target className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-3xl mb-6 text-center text-green-600">Our Mission</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl mb-3 text-green-700">Deliver Excellence</h3>
                  <p className="text-gray-700">
                    Provide world-class connectivity solutions with guaranteed uptime, exceptional performance, and comprehensive support.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl mb-3 text-green-700">Drive Innovation</h3>
                  <p className="text-gray-700">
                    Continuously invest in cutting-edge technology and infrastructure to meet the evolving needs of modern enterprises.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl mb-3 text-green-700">Build Partnerships</h3>
                  <p className="text-gray-700">
                    Foster long-term relationships with our clients by understanding their unique challenges and delivering tailored solutions.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl mb-3 text-green-700">Ensure Security</h3>
                  <p className="text-gray-700">
                    Maintain the highest standards of network security and data protection to safeguard our clients' critical business operations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Priorities */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 text-orange-500 rounded-full">
                <Compass className="w-10 h-10" />
              </div>
            </div>
            <h2 className="text-3xl mb-6 text-center text-orange-600">Strategic Priorities</h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-start bg-orange-50 p-6 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-4">
                    1
                  </div>
                  <div>
                    <h3 className="mb-2 text-orange-700">Network Expansion</h3>
                    <p className="text-gray-700">
                      Extend our fiber-optic infrastructure to reach more cities and business districts across the region.
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-blue-50 p-6 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
                    2
                  </div>
                  <div>
                    <h3 className="mb-2 text-blue-700">Technology Leadership</h3>
                    <p className="text-gray-700">
                      Stay at the forefront of networking technology, adopting innovations like SD-WAN, edge computing, and 5G integration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-green-50 p-6 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-4">
                    3
                  </div>
                  <div>
                    <h3 className="mb-2 text-green-700">Customer Experience</h3>
                    <p className="text-gray-700">
                      Enhance our service delivery with proactive support, transparent communication, and personalized solutions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start bg-orange-50 p-6 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-4">
                    4
                  </div>
                  <div>
                    <h3 className="mb-2 text-orange-700">Sustainability</h3>
                    <p className="text-gray-700">
                      Build and operate our network infrastructure with environmental responsibility and energy efficiency in mind.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cable, MapPin, Calendar, Zap, Shield, Globe, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function TGCSProject() {
  const [tgcsData, setTgcsData] = useState(() => {
    const saved = localStorage.getItem('tgcs_data');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      hero: {
        title: 'SuperCorridor TGCS',
        subtitle: 'Trans Gunung Cyber Subsea Cable System',
        description: 'A state-of-the-art submarine cable system connecting strategic locations across Indonesia with world-class reliability and capacity.',
        enabled: true,
      },
      statistics: {
        cableLength: '1,200+ KM',
        fiberPairs: '12',
        capacity: '40 Tbps',
        rfsSchedule: 'Q2 2025',
      },
    };
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('tgcs_data');
      if (saved) {
        setTgcsData(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] lg:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1563302485-d549ad5a73c8?w=1920&q=80"
            alt="Submarine Cable"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-teal-800/70"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-full mb-6">
              <Cable className="w-5 h-5" />
              <span className="text-sm">Flagship Project</span>
            </div>
            <h1 className="text-5xl lg:text-6xl mb-4">{tgcsData.hero.title}</h1>
            <h2 className="text-2xl lg:text-3xl mb-6 text-blue-100">{tgcsData.hero.subtitle}</h2>
            <p className="text-xl text-gray-200">{tgcsData.hero.description}</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm text-center">
              <div className="text-4xl lg:text-5xl text-orange-600 mb-2">{tgcsData.statistics.cableLength}</div>
              <div className="text-sm lg:text-base text-gray-600">Cable Length</div>
            </div>
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm text-center">
              <div className="text-4xl lg:text-5xl text-blue-600 mb-2">{tgcsData.statistics.fiberPairs}</div>
              <div className="text-sm lg:text-base text-gray-600">Fiber Pairs</div>
            </div>
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm text-center">
              <div className="text-4xl lg:text-5xl text-green-600 mb-2">{tgcsData.statistics.capacity}</div>
              <div className="text-sm lg:text-base text-gray-600">Total Capacity</div>
            </div>
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm text-center">
              <div className="text-4xl lg:text-5xl text-purple-600 mb-2">{tgcsData.statistics.rfsSchedule}</div>
              <div className="text-sm lg:text-base text-gray-600">RFS Schedule</div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">Project Overview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SuperCorridor TGCS represents a significant investment in Indonesia's digital infrastructure, 
              providing unparalleled connectivity across key economic zones.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
                alt="Network Infrastructure"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
            <div>
              <h3 className="text-2xl lg:text-3xl text-gray-900 mb-4">Strategic Connectivity</h3>
              <p className="text-lg text-gray-600 mb-6">
                The Trans Gunung Cyber Subsea Cable System (TGCS) is designed to connect major 
                business hubs across Indonesia, providing low-latency, high-capacity connectivity 
                that supports the growing demands of digital transformation.
              </p>
              <p className="text-lg text-gray-600">
                With 12 fiber pairs and a total capacity of 40 Tbps, TGCS ensures future-proof 
                infrastructure that can scale with Indonesia's digital economy.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl lg:text-3xl text-gray-900 mb-4">World-Class Infrastructure</h3>
              <p className="text-lg text-gray-600 mb-6">
                Utilizing the latest submarine cable technology, TGCS is built to the highest 
                international standards, ensuring maximum reliability and performance.
              </p>
              <p className="text-lg text-gray-600">
                The system features advanced monitoring and maintenance capabilities, with 24/7 
                network operations ensuring minimal downtime and rapid response to any issues.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
                alt="Fiber Optic Technology"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600">Built for performance, reliability, and scalability</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Cable className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">Advanced Technology</h3>
              <p className="text-gray-600">
                State-of-the-art submarine cable technology with 12 fiber pairs delivering 
                exceptional capacity and redundancy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">Strategic Route</h3>
              <p className="text-gray-600">
                Connecting key economic zones across Indonesia, providing optimal routing for 
                business-critical traffic.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">On Schedule</h3>
              <p className="text-gray-600">
                Project is progressing on schedule with RFS (Ready for Service) targeted for Q2 2025.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">High Capacity</h3>
              <p className="text-gray-600">
                40 Tbps total capacity ensures future-proof infrastructure that can handle growing 
                data demands.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">Reliability</h3>
              <p className="text-gray-600">
                Designed for 99.99% uptime with redundant systems and advanced fault detection.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">Global Standards</h3>
              <p className="text-gray-600">
                Built to international standards with certifications from leading industry bodies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-900 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl mb-4">Interested in TGCS Connectivity?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Get in touch with our team to learn more about SuperCorridor TGCS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 rounded-full hover:bg-gray-100 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/solutions/dedicated-connectivity"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white/10 transition-colors"
            >
              View Solutions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

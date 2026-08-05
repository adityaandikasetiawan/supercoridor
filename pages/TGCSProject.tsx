import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cable, MapPin, Calendar, Zap, Shield, Globe, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { AnimatedStat } from '../components/AnimatedStat';

interface TGCSFeature {
  title: string;
  description: string;
}

interface OverviewSection {
  title: string;
  paragraph1: string;
  paragraph2: string;
  image: string;
}

const featureIcons = [Cable, MapPin, Calendar, Zap, Shield, Globe];
const featureColors = [
  { bg: 'bg-orange-100', text: 'text-orange-600' },
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-green-100', text: 'text-green-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'bg-red-100', text: 'text-red-600' },
  { bg: 'bg-teal-100', text: 'text-teal-600' },
];

export function TGCSProject() {
  const [tgcsData, setTgcsData] = useState(() => ({
    hero: {
      title: '',
      subtitle: '',
      description: '',
      heroImage: 'https://images.unsplash.com/photo-1563302485-d549ad5a73c8?w=1920&q=80',
      enabled: true,
    },
    statistics: {
      cableLength: '',
      fiberPairs: '',
      capacity: '',
      rfsSchedule: '',
    },
  }));

  const [extendedData, setExtendedData] = useState<{
    overview: { title: string; description: string; sections: OverviewSection[] };
    features: TGCSFeature[];
    cta: { title: string; description: string };
  }>({
    overview: {
      title: 'Project Overview',
      description: 'SuperCorridor TGCS represents a significant investment in Indonesia\'s digital infrastructure, providing unparalleled connectivity across key economic zones.',
      sections: [
        { title: 'Strategic Connectivity', paragraph1: 'The Trans Global Cable System (TGCS) is designed to connect major business hubs across Indonesia, providing low-latency, high-capacity connectivity that supports the growing demands of digital transformation.', paragraph2: 'With 12 fiber pairs and a total capacity of 40 Tbps, TGCS ensures future-proof infrastructure that can scale with Indonesia\'s digital economy.', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80' },
        { title: 'World-Class Infrastructure', paragraph1: 'Utilizing the latest submarine cable technology, TGCS is built to the highest international standards, ensuring maximum reliability and performance.', paragraph2: 'The system features advanced monitoring and maintenance capabilities, with 24/7 network operations ensuring minimal downtime and rapid response to any issues.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80' },
      ],
    },
    features: [
      { title: 'Advanced Technology', description: 'State-of-the-art submarine cable technology with 12 fiber pairs delivering exceptional capacity and redundancy.' },
      { title: 'Strategic Route', description: 'Connecting key economic zones across Indonesia, providing optimal routing for business-critical traffic.' },
      { title: 'On Schedule', description: 'Project is progressing on schedule with RFS (Ready for Service) targeted for Q2 2025.' },
      { title: 'High Capacity', description: '40 Tbps total capacity ensures future-proof infrastructure that can handle growing data demands.' },
      { title: 'Reliability', description: 'Designed for 99.99% uptime with redundant systems and advanced fault detection.' },
      { title: 'Global Standards', description: 'Built to international standards with certifications from leading industry bodies.' },
    ],
    cta: {
      title: 'Interested in Subsea Cable System?',
      description: 'Get in touch with our team to learn more about our Subsea Cable System',
    },
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Load basic TGCS data with cache-busting to ensure fresh data on all devices
      const cacheBust = `_t=${Date.now()}`;
      try {
        const response = await fetch(`/api/content/tgcs?${cacheBust}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.tgcs) {
            const apiStats = data.tgcs.statistics;
            const apiHero = data.tgcs.hero;
            setTgcsData({
              hero: {
                title: apiHero?.title ?? 'Subsea Cable System',
                subtitle: apiHero?.subtitle ?? 'Trans Global Cable System',
                description: apiHero?.description ?? '',
                heroImage: 'https://images.unsplash.com/photo-1563302485-d549ad5a73c8?w=1920&q=80',
                enabled: apiHero?.enabled ?? true,
              },
              statistics: {
                cableLength: apiStats?.cableLength ?? '1,200+ KM',
                fiberPairs: apiStats?.fiberPairs ?? '12',
                capacity: apiStats?.capacity ?? '40 Tbps',
                rfsSchedule: apiStats?.rfsSchedule ?? 'Q2 2025',
              },
            });
          }
        }
      } catch (e) {
        // Retry once on failure
        try {
          const retryRes = await fetch(`/api/content/tgcs?_t=${Date.now()}`);
          if (retryRes.ok) {
            const data = await retryRes.json();
            if (data.tgcs) {
              const apiStats = data.tgcs.statistics;
              const apiHero = data.tgcs.hero;
              setTgcsData({
                hero: {
                  title: apiHero?.title ?? 'Subsea Cable System',
                  subtitle: apiHero?.subtitle ?? 'Trans Global Cable System',
                  description: apiHero?.description ?? '',
                  heroImage: 'https://images.unsplash.com/photo-1563302485-d549ad5a73c8?w=1920&q=80',
                  enabled: apiHero?.enabled ?? true,
                },
                statistics: {
                  cableLength: apiStats?.cableLength ?? '1,200+ KM',
                  fiberPairs: apiStats?.fiberPairs ?? '12',
                  capacity: apiStats?.capacity ?? '40 Tbps',
                  rfsSchedule: apiStats?.rfsSchedule ?? 'Q2 2025',
                },
              });
            }
          }
        } catch (_) { /* ignore retry failure */ }
      }
      // Load extended data (overview, features, cta, heroImage)
      try {
        const extRes = await fetch(`/api/content/pages/tgcs-extended?${cacheBust}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
        });
        if (extRes.ok) {
          const extData = await extRes.json();
          if (extData.data) {
            setExtendedData(prev => ({
              ...prev,
              ...(extData.data.overview ? { overview: extData.data.overview } : {}),
              ...(extData.data.features ? { features: extData.data.features } : {}),
              ...(extData.data.cta ? { cta: extData.data.cta } : {}),
            }));
            if (extData.data.hero?.heroImage) {
              setTgcsData(prev => ({ ...prev, hero: { ...prev.hero, heroImage: extData.data.hero.heroImage } }));
            }
          }
        }
      } catch (_) { /* ignore */ }
      setIsLoaded(true);
    };
    void load();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] lg:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={tgcsData.hero.heroImage}
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
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">{tgcsData.hero.title}</h1>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-blue-100">{tgcsData.hero.subtitle}</h2>
            <p className="text-xl text-gray-200">{tgcsData.hero.description}</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {tgcsData.statistics.cableLength && (
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center">
              <AnimatedStat value={tgcsData.statistics.cableLength} className="text-2xl lg:text-3xl text-orange-600 mb-2" />
              <div className="text-sm lg:text-base text-gray-600">Cable Length</div>
            </div>
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center">
              <AnimatedStat value={tgcsData.statistics.fiberPairs} className="text-2xl lg:text-3xl text-blue-600 mb-2" />
              <div className="text-sm lg:text-base text-gray-600">Fiber Pairs</div>
            </div>
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center">
              <AnimatedStat value={tgcsData.statistics.capacity} className="text-2xl lg:text-3xl text-green-600 mb-2" />
              <div className="text-sm lg:text-base text-gray-600">Total Capacity</div>
            </div>
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center">
              <AnimatedStat value={tgcsData.statistics.rfsSchedule} className="text-2xl lg:text-3xl text-purple-600 mb-2" />
              <div className="text-sm lg:text-base text-gray-600">RFS Schedule</div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Project Overview */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{extendedData.overview.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {extendedData.overview.description}
            </p>
          </div>

          {extendedData.overview.sections.map((section, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index > 0 ? 'mt-16' : ''}`}>
              <div className={index % 2 === 1 ? 'order-2 lg:order-1' : ''}>
                {index % 2 === 0 ? (
                  <ImageWithFallback
                    src={section.image}
                    alt={section.title}
                    className="rounded-2xl w-full"
                  />
                ) : (
                  <>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{section.title}</h3>
                    <p className="text-lg text-gray-600 mb-6">{section.paragraph1}</p>
                    <p className="text-lg text-gray-600">{section.paragraph2}</p>
                  </>
                )}
              </div>
              <div className={index % 2 === 1 ? 'order-1 lg:order-2' : ''}>
                {index % 2 === 0 ? (
                  <>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{section.title}</h3>
                    <p className="text-lg text-gray-600 mb-6">{section.paragraph1}</p>
                    <p className="text-lg text-gray-600">{section.paragraph2}</p>
                  </>
                ) : (
                  <ImageWithFallback
                    src={section.image}
                    alt={section.title}
                    className="rounded-2xl w-full"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600">Built for performance, reliability, and scalability</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {extendedData.features.map((feature, index) => {
              const Icon = featureIcons[index % featureIcons.length];
              const color = featureColors[index % featureColors.length];
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
                  <div className={`w-16 h-16 ${color.bg} rounded-full flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${color.text}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-900 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{extendedData.cta.title}</h2>
          <p className="text-xl mb-8 text-blue-100">
            {extendedData.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact-us"
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

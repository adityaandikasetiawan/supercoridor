import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle, Globe } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import { getHeroGradient } from '../components/HeroGradient';
import {
  InteractiveNetworkMap,
  type MapCity,
  type NetworkRoute,
  type LegendItem,
} from '../components/InteractiveNetworkMap';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoverageCity {
  id: string;
  name: string;
  province: string;
  pops: number;
  status: 'active' | 'coming-soon';
  x?: number;
  y?: number;
  iconType?: MapCity['iconType'];
  iconColor?: MapCity['iconColor'];
  connectionType?: MapCity['connectionType'];
}

interface CoverageData {
  title: string;
  description: string;
  totalPops: number;
  totalCities: number;
  cities: CoverageCity[];
  mapEmbedUrl?: string;
  mapImage?: string;
  mapApiKey?: string;
  routes?: NetworkRoute[];
  legend?: LegendItem[];
  stats?: { id: string; value: string; label: string; color: string }[];
  infrastructure?: { id: string; title: string; color: string; items: string[] }[];
}

// ─── Default fallback regions ─────────────────────────────────────────────────

const defaultRegions = [
  { name: 'Jakarta & Greater Area', cities: ['Jakarta', 'Tangerang', 'Bekasi', 'Depok', 'Bogor'], color: 'orange' },
  { name: 'Java Region', cities: ['Bandung', 'Semarang', 'Surabaya', 'Yogyakarta', 'Malang'], color: 'blue' },
  { name: 'Sumatra Region', cities: ['Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Lampung'], color: 'green' },
  { name: 'Kalimantan Region', cities: ['Balikpapan', 'Samarinda', 'Pontianak', 'Banjarmasin'], color: 'orange' },
  { name: 'Sulawesi Region', cities: ['Makassar', 'Manado', 'Palu', 'Kendari'], color: 'blue' },
  { name: 'Bali & Eastern Indonesia', cities: ['Denpasar', 'Mataram', 'Kupang', 'Jayapura'], color: 'green' },
];

function hasInteractiveData(data: CoverageData | null): boolean {
  if (!data?.mapImage) return false;
  return (data.cities ?? []).some((c) => c.x !== undefined && c.y !== undefined);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NetworkCoverage() {
  const pageContent = usePageContent('page-network-coverage', {
    heroTitle: 'Network & Coverage',
    heroSubtitle: 'Extensive fiber-optic infrastructure spanning across 50+ cities, connecting your business to the digital world.',
    heroGradient: 'green',
  });

  const [coverageData, setCoverageData] = useState<CoverageData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/content/network-coverage');
        if (response.ok) {
          const data = await response.json();
          if (data.networkCoverage) setCoverageData(data.networkCoverage as CoverageData);
        }
      } catch { /* use defaults */ }
    };
    void load();
  }, []);

  const apiCities = coverageData?.cities?.filter((c) => c.status === 'active') ?? [];
  const hasApiCities = apiCities.length > 0;

  // Build region groups — grouped by province from API or fallback defaults
  const cityGroups = hasApiCities
    ? Object.entries(
        apiCities.reduce<Record<string, CoverageCity[]>>((acc, city) => {
          if (!acc[city.province]) acc[city.province] = [];
          acc[city.province].push(city);
          return acc;
        }, {})
      ).map(([province, cities], index) => ({
        name: province,
        cities,
        color: ['orange', 'blue', 'green'][index % 3],
      }))
    : defaultRegions.map((r) => ({
        ...r,
        cities: r.cities.map((name) => ({
          id: name, name, province: r.name, pops: 0, status: 'active' as const,
        })),
      }));

  const totalCities = coverageData?.totalCities ?? 50;
  const totalPops = coverageData?.totalPops ?? 150;
  const interactive = hasInteractiveData(coverageData);

  return (
    <div>
      {/* ── Hero ── */}
      <section className={`${getHeroGradient(pageContent.heroGradient)} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-bold text-4xl lg:text-5xl mb-6">{pageContent.heroTitle}</h1>
            <p className="text-xl opacity-90">{pageContent.heroSubtitle}</p>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {(coverageData?.stats ?? [
              { id: '1', value: `${totalCities}+`, label: 'Cities Covered',     color: 'orange' },
              { id: '2', value: `${totalPops}+`,   label: 'Points of Presence', color: 'blue'   },
              { id: '3', value: '99.99%',           label: 'Network Uptime',     color: 'green'  },
            ]).map((stat) => {
              const bgGradient  = stat.color === 'orange' ? 'from-orange-50 to-orange-100' : stat.color === 'blue' ? 'from-blue-50 to-blue-100' : 'from-green-50 to-green-100';
              const iconBg      = stat.color === 'orange' ? 'bg-orange-500' : stat.color === 'blue' ? 'bg-blue-600' : 'bg-green-600';
              const textColor   = stat.color === 'orange' ? 'text-orange-600' : stat.color === 'blue' ? 'text-blue-600' : 'text-green-600';
              const Icon        = stat.color === 'orange' ? MapPin : stat.color === 'blue' ? Globe : CheckCircle;
              return (
                <div key={stat.id} className={`text-center p-6 bg-gradient-to-br ${bgGradient} rounded-lg`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${iconBg} text-white rounded-full mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className={`text-4xl mb-2 ${textColor}`}>{stat.value}</div>
                  <div className="text-xl text-gray-700">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* ── Map — full width ── */}
          <div className="mb-0">
            {interactive ? (
              <InteractiveNetworkMap
                mapImage={coverageData!.mapImage!}
                cities={(coverageData!.cities ?? []) as MapCity[]}
                routes={coverageData!.routes ?? []}
                legend={coverageData!.legend}
                fullWidth
              />
            ) : coverageData?.mapEmbedUrl ? (
              <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <iframe src={coverageData.mapEmbedUrl} title="Network Coverage Map"
                  className="w-full h-[450px]" style={{ border: 0 }} allowFullScreen loading="lazy" />
              </div>
            ) : coverageData?.mapImage ? (
              <div className="rounded-xl overflow-hidden">
                <img src={coverageData.mapImage} alt="Network Coverage Map" className="w-full h-auto rounded-xl" />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-16 text-center">
                <Globe className="w-24 h-24 mx-auto mb-4 text-gray-400" />
                <h3 className="font-bold text-2xl mb-2 text-gray-700">Interactive Coverage Map</h3>
                <p className="text-gray-600">Our fiber-optic network spans across Indonesia's major business districts</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Regional Coverage — merged with city list from sidebar ── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-bold text-3xl mb-3 text-center">Regional Coverage</h2>
          <p className="text-center text-gray-500 mb-8">Klik region untuk melihat detail kota yang tercakup</p>

          {/* Region tab pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedRegion(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedRegion === null ? 'bg-green-600 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'
              }`}
            >
              Semua Region
            </button>
            {cityGroups.map((region) => (
              <button
                key={region.name}
                onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedRegion === region.name
                    ? region.color === 'orange' ? 'bg-orange-500 text-white shadow'
                      : region.color === 'blue' ? 'bg-blue-600 text-white shadow'
                      : 'bg-green-600 text-white shadow'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>

          {/* City cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cityGroups
              .filter((r) => selectedRegion === null || r.name === selectedRegion)
              .map((region) => (
                <div
                  key={region.name}
                  className={`p-5 rounded-xl border-2 ${
                    region.color === 'orange' ? 'bg-orange-50 border-orange-200'
                    : region.color === 'blue'   ? 'bg-blue-50 border-blue-200'
                    : 'bg-green-50 border-green-200'
                  }`}
                >
                  <h3 className={`font-bold text-base mb-3 ${
                    region.color === 'orange' ? 'text-orange-600'
                    : region.color === 'blue'   ? 'text-blue-600'
                    : 'text-green-600'
                  }`}>
                    {region.name}
                  </h3>
                  <ul className="space-y-1.5">
                    {region.cities.map((city, i) => {
                      const cityName = typeof city === 'string' ? city : city.name;
                      const pops     = typeof city === 'string' ? null : city.pops;
                      const status   = typeof city === 'string' ? 'active' : city.status;
                      return (
                        <li key={i} className="flex items-center justify-between text-gray-700">
                          <span className="flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 flex-shrink-0 ${
                              region.color === 'orange' ? 'text-orange-500'
                              : region.color === 'blue'   ? 'text-blue-600'
                              : 'text-green-600'
                            }`} />
                            <span className="text-sm">{cityName}</span>
                          </span>
                          <span className="flex items-center gap-2 flex-shrink-0">
                            {pops !== null && pops > 0 && (
                              <span className="text-xs text-gray-400">{pops} PoPs</span>
                            )}
                            {status === 'coming-soon' && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">Soon</span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── Infrastructure ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-bold text-3xl mb-8 text-center">Network Infrastructure</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {(coverageData?.infrastructure ?? [
              { id: '1', title: 'Fiber-Optic Backbone', color: 'orange', items: ['Dense Wave Division Multiplexing (DWDM) technology', 'Multiple redundant paths for high availability', 'Geographic diversity for disaster resilience'] },
              { id: '2', title: 'Data Centers',         color: 'blue',   items: ['Tier III certified facilities in major cities', '24/7 physical and network security', 'Redundant power and cooling systems'] },
              { id: '3', title: 'Internet Exchanges',   color: 'green',  items: ['Direct peering with major content providers', 'Connections to international submarine cables', 'Low-latency access to global networks'] },
              { id: '4', title: 'Network Operations',   color: 'orange', items: ['24/7 Network Operations Center (NOC)', 'Proactive monitoring and incident response', 'Rapid fault detection and resolution'] },
            ]).map((card) => {
              const titleColor = card.color === 'orange' ? 'text-orange-600' : card.color === 'blue' ? 'text-blue-600' : 'text-green-600';
              const checkColor = card.color === 'orange' ? 'text-orange-500' : card.color === 'blue' ? 'text-blue-600' : 'text-green-600';
              return (
                <div key={card.id} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className={`font-bold text-xl mb-4 ${titleColor}`}>{card.title}</h3>
                  <ul className="space-y-3">
                    {card.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className={`w-5 h-5 ${checkColor} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-3xl mb-4">Check Coverage in Your Area</h2>
          <p className="text-xl opacity-90 mb-6">
            Contact our sales team to learn more about our network availability and services in your location.
          </p>
          <Link to="/contact-us" className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

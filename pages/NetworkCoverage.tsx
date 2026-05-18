import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle, Globe } from 'lucide-react';

interface CoverageCity {
  id: string;
  name: string;
  province: string;
  pops: number;
  status: 'active' | 'coming-soon';
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
}

const defaultRegions = [
  {
    name: 'Jakarta & Greater Area',
    cities: ['Jakarta', 'Tangerang', 'Bekasi', 'Depok', 'Bogor'],
    color: 'orange',
  },
  {
    name: 'Java Region',
    cities: ['Bandung', 'Semarang', 'Surabaya', 'Yogyakarta', 'Malang'],
    color: 'blue',
  },
  {
    name: 'Sumatra Region',
    cities: ['Medan', 'Palembang', 'Pekanbaru', 'Batam', 'Lampung'],
    color: 'green',
  },
  {
    name: 'Kalimantan Region',
    cities: ['Balikpapan', 'Samarinda', 'Pontianak', 'Banjarmasin'],
    color: 'orange',
  },
  {
    name: 'Sulawesi Region',
    cities: ['Makassar', 'Manado', 'Palu', 'Kendari'],
    color: 'blue',
  },
  {
    name: 'Bali & Eastern Indonesia',
    cities: ['Denpasar', 'Mataram', 'Kupang', 'Jayapura'],
    color: 'green',
  },
];

export function NetworkCoverage() {
  const [coverageData, setCoverageData] = useState<CoverageData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/content/network-coverage');
        if (response.ok) {
          const data = await response.json();
          if (data.networkCoverage) {
            setCoverageData(data.networkCoverage);
          }
        }
      } catch {
        // use default display
      }
    };
    void load();
  }, []);

  // Group cities by province for display if we have API data
  const apiCities = coverageData?.cities?.filter((c) => c.status === 'active') ?? [];
  const hasApiCities = apiCities.length > 0;

  // Group API cities by province
  const cityGroups = hasApiCities
    ? Object.entries(
        apiCities.reduce<Record<string, string[]>>((acc, city) => {
          if (!acc[city.province]) acc[city.province] = [];
          acc[city.province].push(city.name);
          return acc;
        }, {})
      ).map(([province, cities], index) => ({
        name: province,
        cities,
        color: ['orange', 'blue', 'green'][index % 3],
      }))
    : defaultRegions;

  const totalCities = coverageData?.totalCities ?? 50;
  const totalPops = coverageData?.totalPops ?? 150;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6">
              {coverageData?.title ?? 'Network & Coverage'}
            </h1>
            <p className="text-xl opacity-90">
              {coverageData?.description ??
                'Extensive fiber-optic infrastructure spanning across 50+ cities, connecting your business to the digital world.'}
            </p>
          </div>
        </div>
      </section>

      {/* Coverage Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="text-4xl mb-2 text-orange-600">{totalCities}+</div>
              <div className="text-xl text-gray-700">Cities Covered</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <div className="text-4xl mb-2 text-blue-600">{totalPops}+</div>
              <div className="text-xl text-gray-700">Points of Presence</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="text-4xl mb-2 text-green-600">99.99%</div>
              <div className="text-xl text-gray-700">Network Uptime</div>
            </div>
          </div>

          {/* Coverage Map */}
          <div className="mb-16">
            {coverageData?.mapEmbedUrl ? (
              <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <iframe
                  src={coverageData.mapEmbedUrl}
                  title="Network Coverage Map"
                  className="w-full h-[400px]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : coverageData?.mapImage ? (
              <div className="rounded-lg overflow-hidden">
                <img src={coverageData.mapImage} alt="Network Coverage Map" className="w-full h-auto rounded-lg" />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <Globe className="w-24 h-24 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl mb-2 text-gray-700">Interactive Coverage Map</h3>
                <p className="text-gray-600">
                  Our fiber-optic network spans across Indonesia's major business districts
                </p>
              </div>
            )}
          </div>

          {/* Regional Coverage */}
          <div>
            <h2 className="text-3xl mb-8 text-center">Regional Coverage</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityGroups.map((region, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg ${
                    region.color === 'orange'
                      ? 'bg-orange-50 border-2 border-orange-200'
                      : region.color === 'blue'
                      ? 'bg-blue-50 border-2 border-blue-200'
                      : 'bg-green-50 border-2 border-green-200'
                  }`}
                >
                  <h3
                    className={`text-xl mb-4 ${
                      region.color === 'orange'
                        ? 'text-orange-600'
                        : region.color === 'blue'
                        ? 'text-blue-600'
                        : 'text-green-600'
                    }`}
                  >
                    {region.name}
                  </h3>
                  <ul className="space-y-2">
                    {region.cities.map((city, cityIndex) => (
                      <li key={cityIndex} className="flex items-center text-gray-700">
                        <CheckCircle
                          className={`w-4 h-4 mr-2 ${
                            region.color === 'orange'
                              ? 'text-orange-500'
                              : region.color === 'blue'
                              ? 'text-blue-600'
                              : 'text-green-600'
                          }`}
                        />
                        {city}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-8 text-center">Network Infrastructure</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl mb-4 text-orange-600">Fiber-Optic Backbone</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Dense Wave Division Multiplexing (DWDM) technology</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Multiple redundant paths for high availability</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Geographic diversity for disaster resilience</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl mb-4 text-blue-600">Data Centers</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Tier III certified facilities in major cities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">24/7 physical and network security</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Redundant power and cooling systems</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl mb-4 text-green-600">Internet Exchanges</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Direct peering with major content providers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Connections to international submarine cables</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Low-latency access to global networks</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl mb-4 text-orange-600">Network Operations</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">24/7 Network Operations Center (NOC)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Proactive monitoring and incident response</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Rapid fault detection and resolution</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">Check Coverage in Your Area</h2>
          <p className="text-xl opacity-90 mb-6">
            Contact our sales team to learn more about our network availability and services in your location.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

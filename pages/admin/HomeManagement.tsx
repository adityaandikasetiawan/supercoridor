import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Save, Image as ImageIcon } from 'lucide-react';

export function AdminHomeManagement() {
  const [heroData, setHeroData] = useState({
    title: 'Empowering Business Connectivity Across Indonesia',
    subtitle: 'Enterprise-grade internet solutions with 99.99% uptime guarantee',
    ctaText: 'Get Started',
    ctaLink: '/contact',
    backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
  });

  const [stats, setStats] = useState([
    { label: 'Network Coverage', value: '50+', suffix: 'Cities' },
    { label: 'Enterprise Clients', value: '1,000+', suffix: 'Companies' },
    { label: 'Network Uptime', value: '99.99%', suffix: 'SLA' },
    { label: 'Data Centers', value: '15+', suffix: 'Locations' },
  ]);

  const [features] = useState([
    {
      title: 'Ultra-Fast Connectivity',
      description: 'Dedicated fiber optic infrastructure with speeds up to 100Gbps',
      icon: 'Zap',
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock technical support and monitoring',
      icon: 'HeadphonesIcon',
    },
    {
      title: 'Scalable Solutions',
      description: 'Flexible bandwidth options that grow with your business',
      icon: 'TrendingUp',
    },
    {
      title: 'Enterprise Security',
      description: 'Advanced DDoS protection and network security',
      icon: 'Shield',
    },
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl text-gray-900">Home Page Management</h1>
          <p className="text-gray-600 mt-1">Manage homepage content and sections</p>
        </div>

        {/* Success Message */}
        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Changes saved successfully!
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">Hero Section</h2>
          <form onSubmit={handleSaveHero} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Main Title</label>
              <input
                type="text"
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={heroData.ctaText}
                  onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">CTA Link</label>
                <input
                  type="text"
                  value={heroData.ctaLink}
                  onChange={(e) => setHeroData({ ...heroData, ctaLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Background Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={heroData.backgroundImage}
                  onChange={(e) =>
                    setHeroData({ ...heroData, backgroundImage: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="button"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
              {heroData.backgroundImage && (
                <img
                  src={heroData.backgroundImage}
                  alt="Hero background preview"
                  className="mt-2 w-full h-32 object-cover rounded-lg"
                />
              )}
            </div>
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Hero Section
            </button>
          </form>
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">Statistics Section</h2>
          <form onSubmit={handleSaveStats} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm text-gray-700 mb-3">Statistic {index + 1}</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Label"
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Suffix"
                      value={stat.suffix}
                      onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Statistics
            </button>
          </form>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">Features Section (Preview)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Feature content is hardcoded. Contact developer to customize.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

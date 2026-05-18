import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Save, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { apiFetch } from '../../utils/storage';
import { ImageUpload } from '../../components/ImageUpload';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  order: number;
}

interface StatItem {
  label: string;
  value: string;
  suffix: string;
}

interface FeatureItem {
  title: string;
  description: string;
}

export function AdminHomeManagement() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      id: 1,
      title: 'Empowering Business Connectivity',
      subtitle: 'Across Indonesia',
      description: 'Enterprise-grade internet solutions with 99.99% uptime guarantee',
      ctaText: 'Get Started',
      ctaLink: '/contact',
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
      order: 1,
    },
  ]);

  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Network Coverage', value: '50+', suffix: 'Cities' },
    { label: 'Enterprise Clients', value: '1,000+', suffix: 'Companies' },
    { label: 'Network Uptime', value: '99.99%', suffix: 'SLA' },
    { label: 'Data Centers', value: '15+', suffix: 'Locations' },
  ]);

  const [features, setFeatures] = useState<FeatureItem[]>([
    { title: 'Ultra-Fast Connectivity', description: 'Dedicated fiber optic infrastructure with speeds up to 100Gbps' },
    { title: '24/7 Support', description: 'Round-the-clock technical support and monitoring' },
    { title: 'Scalable Solutions', description: 'Flexible bandwidth options that grow with your business' },
    { title: 'Enterprise Security', description: 'Advanced DDoS protection and network security' },
  ]);

  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'slides' | 'stats' | 'features'>('slides');

  useEffect(() => {
    const load = async () => {
      // Load hero slides
      const slidesRes = await apiFetch('/api/admin/content/hero-slides', { method: 'GET' });
      if (slidesRes.ok) {
        const data = await slidesRes.json();
        if (data.heroSlides && data.heroSlides.length > 0) {
          setHeroSlides(data.heroSlides);
        }
      }
      // Load stats & features from home-management
      const homeRes = await apiFetch('/api/admin/content/home-management', { method: 'GET' });
      if (homeRes.ok) {
        const data = await homeRes.json();
        if (data.homeManagement) {
          if (data.homeManagement.stats) setStats(data.homeManagement.stats);
          if (data.homeManagement.features) setFeatures(data.homeManagement.features);
        }
      }
    };
    void load();
  }, []);

  const saveSlides = async () => {
    const sorted = heroSlides.map((s, i) => ({ ...s, order: i + 1 }));
    const response = await apiFetch('/api/admin/content/hero-slides', {
      method: 'PUT',
      body: JSON.stringify({ heroSlides: sorted }),
    });
    if (response.ok) {
      setHeroSlides(sorted);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const saveStatsAndFeatures = async () => {
    const response = await apiFetch('/api/admin/content/home-management', {
      method: 'PUT',
      body: JSON.stringify({
        homeManagement: {
          heroData: { title: '', subtitle: '', ctaText: '', ctaLink: '', backgroundImage: '' },
          stats,
          features,
        },
      }),
    });
    if (response.ok) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  // --- Slide handlers ---
  const addSlide = () => {
    const newId = Math.max(0, ...heroSlides.map((s) => s.id)) + 1;
    setHeroSlides([
      ...heroSlides,
      {
        id: newId,
        title: 'New Slide',
        subtitle: 'Subtitle',
        description: 'Description text',
        ctaText: 'Learn More',
        ctaLink: '/contact',
        backgroundImage: '',
        order: heroSlides.length + 1,
      },
    ]);
  };

  const removeSlide = (id: number) => {
    if (heroSlides.length <= 1) return;
    if (!window.confirm('Delete this slide?')) return;
    setHeroSlides(heroSlides.filter((s) => s.id !== id));
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...heroSlides];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newSlides.length) return;
    [newSlides[index], newSlides[target]] = [newSlides[target], newSlides[index]];
    setHeroSlides(newSlides);
  };

  const updateSlide = (id: number, field: keyof HeroSlide, value: string | number) => {
    setHeroSlides(heroSlides.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // --- Stats handlers ---
  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  // --- Features handlers ---
  const updateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFeatures(newFeatures);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900">Home Page Management</h1>
            <p className="text-gray-600 mt-1">Manage all homepage sections</p>
          </div>
        </div>

        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Changes saved successfully!
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            {(['slides', 'stats', 'features'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'slides' ? 'Hero Slides' : tab === 'stats' ? 'Statistics' : 'Features'}
              </button>
            ))}
          </nav>
        </div>

        {/* Hero Slides Tab */}
        {activeTab === 'slides' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Manage the hero carousel slides shown on the homepage.</p>
              <button
                onClick={addSlide}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Slide
              </button>
            </div>

            {heroSlides.map((slide, index) => (
              <div key={slide.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-gray-900">Slide {index + 1}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => moveSlide(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveSlide(index, 'down')} disabled={index === heroSlides.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                      <MoveDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeSlide(slide.id)} className="p-1 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Title</label>
                    <input type="text" value={slide.title} onChange={(e) => updateSlide(slide.id, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Subtitle</label>
                    <input type="text" value={slide.subtitle} onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">Description</label>
                    <input type="text" value={slide.description} onChange={(e) => updateSlide(slide.id, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">CTA Text</label>
                    <input type="text" value={slide.ctaText} onChange={(e) => updateSlide(slide.id, 'ctaText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">CTA Link</label>
                    <input type="text" value={slide.ctaLink} onChange={(e) => updateSlide(slide.id, 'ctaLink', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload
                      value={slide.backgroundImage}
                      onChange={(url) => updateSlide(slide.id, 'backgroundImage', url)}
                      label="Background Image"
                      previewClassName="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={saveSlides}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Hero Slides
            </button>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Manage the statistics counter section shown below the hero.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <h3 className="text-sm text-gray-700 mb-3">Statistic {index + 1}</h3>
                  <div className="space-y-2">
                    <input type="text" placeholder="Value (e.g. 50+)" value={stat.value} onChange={(e) => updateStat(index, 'value', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                    <input type="text" placeholder="Label (e.g. Network Coverage)" value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                    <input type="text" placeholder="Suffix (e.g. Cities)" value={stat.suffix} onChange={(e) => updateStat(index, 'suffix', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={saveStatsAndFeatures}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Statistics
            </button>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Manage the "Why Choose SuperCorridor" features section.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <h3 className="text-sm text-gray-700 mb-3">Feature {index + 1}</h3>
                  <div className="space-y-2">
                    <input type="text" placeholder="Title" value={feature.title} onChange={(e) => updateFeature(index, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                    <textarea placeholder="Description" value={feature.description} onChange={(e) => updateFeature(index, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" rows={2} />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={saveStatsAndFeatures}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Features
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

import { useEffect, useState } from 'react';
import { Save, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { apiFetch } from '../../utils/storage';
import { ImageUpload } from '../../components/ImageUpload';

interface TGCSFeature {
  title: string;
  description: string;
}

interface TGCSData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
    enabled: boolean;
  };
  statistics: {
    cableLength: string;
    fiberPairs: string;
    capacity: string;
    rfsSchedule: string;
  };
  overview: {
    title: string;
    description: string;
    sections: { title: string; paragraph1: string; paragraph2: string; image: string }[];
  };
  features: TGCSFeature[];
  cta: {
    title: string;
    description: string;
  };
}

export function AdminTGCSManagement() {
  const [tgcsData, setTgcsData] = useState<TGCSData>({
    hero: {
      title: 'SuperCorridor TGCS',
      subtitle: 'Trans Global Cable System',
      description: 'A state-of-the-art submarine cable system connecting strategic locations across Indonesia with world-class reliability and capacity.',
      heroImage: 'https://images.unsplash.com/photo-1563302485-d549ad5a73c8?w=1920&q=80',
      enabled: true,
    },
    statistics: {
      cableLength: '1,200+ KM',
      fiberPairs: '12',
      capacity: '40 Tbps',
      rfsSchedule: 'Q2 2025',
    },
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
      title: 'Interested in TGCS Connectivity?',
      description: 'Get in touch with our team to learn more about SuperCorridor TGCS',
    },
  });

  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'overview' | 'features' | 'cta'>('hero');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Load basic TGCS data (hero + statistics)
      const res = await apiFetch('/api/admin/content/tgcs', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data.tgcs) {
          setTgcsData((prev) => ({
            ...prev,
            hero: { ...prev.hero, ...data.tgcs.hero },
            statistics: { ...prev.statistics, ...data.tgcs.statistics },
          }));
        }
      }
      // Load extended TGCS data (overview, features, cta)
      const extRes = await apiFetch('/api/admin/content/pages/tgcs-extended', { method: 'GET' });
      if (extRes.ok) {
        const extData = await extRes.json();
        if (extData.data) {
          setTgcsData((prev) => ({
            ...prev,
            ...(extData.data.overview ? { overview: extData.data.overview } : {}),
            ...(extData.data.features ? { features: extData.data.features } : {}),
            ...(extData.data.cta ? { cta: extData.data.cta } : {}),
            ...(extData.data.hero?.heroImage ? { hero: { ...prev.hero, heroImage: extData.data.hero.heroImage } } : {}),
          }));
        }
      }
    };
    void load();
  }, []);

  const handleSave = async () => {
    // Save hero + statistics to the existing TGCS endpoint
    const tgcsPayload = {
      tgcs: {
        hero: { title: tgcsData.hero.title, subtitle: tgcsData.hero.subtitle, description: tgcsData.hero.description, enabled: tgcsData.hero.enabled },
        statistics: tgcsData.statistics,
      },
    };
    const res1 = await apiFetch('/api/admin/content/tgcs', { method: 'PUT', body: JSON.stringify(tgcsPayload) });

    // Save extended data (overview, features, cta, heroImage)
    const extPayload = {
      data: {
        hero: { heroImage: tgcsData.hero.heroImage },
        overview: tgcsData.overview,
        features: tgcsData.features,
        cta: tgcsData.cta,
      },
    };
    const res2 = await apiFetch('/api/admin/content/pages/tgcs-extended', { method: 'PUT', body: JSON.stringify(extPayload) });

    if (res1.ok && res2.ok) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const updateFeature = (index: number, field: keyof TGCSFeature, value: string) => {
    const newFeatures = [...tgcsData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setTgcsData({ ...tgcsData, features: newFeatures });
  };

  const addFeature = () => {
    setTgcsData({ ...tgcsData, features: [...tgcsData.features, { title: '', description: '' }] });
  };

  const removeFeature = (index: number) => {
    setTgcsData({ ...tgcsData, features: tgcsData.features.filter((_, i) => i !== index) });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900">TGCS Project Management</h1>
            <p className="text-gray-600 mt-1">Manage all sections of the TGCS project page</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTgcsData({ ...tgcsData, hero: { ...tgcsData.hero, enabled: !tgcsData.hero.enabled } })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${tgcsData.hero.enabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {tgcsData.hero.enabled ? <><Eye className="w-4 h-4" /><span>Visible</span></> : <><EyeOff className="w-4 h-4" /><span>Hidden</span></>}
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <Save className="w-4 h-4" /> Save All
            </button>
          </div>
        </div>

        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">Changes saved successfully!</div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            {(['hero', 'stats', 'overview', 'features', 'cta'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-1 border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {tab === 'stats' ? 'Statistics' : tab === 'cta' ? 'CTA' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Hero Tab */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-lg text-gray-900 mb-2">Hero Section</h2>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Title</label>
              <input type="text" value={tgcsData.hero.title} onChange={(e) => setTgcsData({ ...tgcsData, hero: { ...tgcsData.hero, title: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Subtitle</label>
              <input type="text" value={tgcsData.hero.subtitle} onChange={(e) => setTgcsData({ ...tgcsData, hero: { ...tgcsData.hero, subtitle: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Description</label>
              <textarea value={tgcsData.hero.description} onChange={(e) => setTgcsData({ ...tgcsData, hero: { ...tgcsData.hero, description: e.target.value } })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
            <ImageUpload value={tgcsData.hero.heroImage} onChange={(url) => setTgcsData({ ...tgcsData, hero: { ...tgcsData.hero, heroImage: url } })} label="Hero Background Image" previewClassName="w-full h-32 object-cover rounded-lg" />
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-lg text-gray-900 mb-2">Statistics</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Cable Length</label>
                <input type="text" value={tgcsData.statistics.cableLength} onChange={(e) => setTgcsData({ ...tgcsData, statistics: { ...tgcsData.statistics, cableLength: e.target.value } })} placeholder="e.g., 1,200+ KM" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Fiber Pairs</label>
                <input type="text" value={tgcsData.statistics.fiberPairs} onChange={(e) => setTgcsData({ ...tgcsData, statistics: { ...tgcsData.statistics, fiberPairs: e.target.value } })} placeholder="e.g., 12" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Total Capacity</label>
                <input type="text" value={tgcsData.statistics.capacity} onChange={(e) => setTgcsData({ ...tgcsData, statistics: { ...tgcsData.statistics, capacity: e.target.value } })} placeholder="e.g., 40 Tbps" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">RFS Schedule</label>
                <input type="text" value={tgcsData.statistics.rfsSchedule} onChange={(e) => setTgcsData({ ...tgcsData, statistics: { ...tgcsData.statistics, rfsSchedule: e.target.value } })} placeholder="e.g., Q2 2025" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <h2 className="text-lg text-gray-900 mb-2">Project Overview Header</h2>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Section Title</label>
                <input type="text" value={tgcsData.overview.title} onChange={(e) => setTgcsData({ ...tgcsData, overview: { ...tgcsData.overview, title: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Section Description</label>
                <textarea value={tgcsData.overview.description} onChange={(e) => setTgcsData({ ...tgcsData, overview: { ...tgcsData.overview, description: e.target.value } })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
            </div>

            {tgcsData.overview.sections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h3 className="text-lg text-gray-900">Content Block {index + 1}</h3>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Title</label>
                  <input type="text" value={section.title} onChange={(e) => { const s = [...tgcsData.overview.sections]; s[index] = { ...s[index], title: e.target.value }; setTgcsData({ ...tgcsData, overview: { ...tgcsData.overview, sections: s } }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Paragraph 1</label>
                  <textarea value={section.paragraph1} onChange={(e) => { const s = [...tgcsData.overview.sections]; s[index] = { ...s[index], paragraph1: e.target.value }; setTgcsData({ ...tgcsData, overview: { ...tgcsData.overview, sections: s } }); }} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Paragraph 2</label>
                  <textarea value={section.paragraph2} onChange={(e) => { const s = [...tgcsData.overview.sections]; s[index] = { ...s[index], paragraph2: e.target.value }; setTgcsData({ ...tgcsData, overview: { ...tgcsData.overview, sections: s } }); }} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <ImageUpload value={section.image} onChange={(url) => { const s = [...tgcsData.overview.sections]; s[index] = { ...s[index], image: url }; setTgcsData({ ...tgcsData, overview: { ...tgcsData.overview, sections: s } }); }} label="Section Image" previewClassName="w-full h-24 object-cover rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Manage the "Key Features" section cards.</p>
              <button onClick={addFeature} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center text-sm">
                <Plus className="w-4 h-4 mr-2" /> Add Feature
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {tgcsData.features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm text-gray-500">Feature {index + 1}</span>
                    <button onClick={() => removeFeature(index)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input type="text" placeholder="Feature title" value={feature.title} onChange={(e) => updateFeature(index, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                    <textarea placeholder="Feature description" value={feature.description} onChange={(e) => updateFeature(index, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Tab */}
        {activeTab === 'cta' && (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-lg text-gray-900 mb-2">Call to Action Section</h2>
            <div>
              <label className="block text-sm text-gray-700 mb-1">CTA Title</label>
              <input type="text" value={tgcsData.cta.title} onChange={(e) => setTgcsData({ ...tgcsData, cta: { ...tgcsData.cta, title: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">CTA Description</label>
              <textarea value={tgcsData.cta.description} onChange={(e) => setTgcsData({ ...tgcsData, cta: { ...tgcsData.cta, description: e.target.value } })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Save, Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { toast } from 'sonner';
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
      ctaLink: '/contact-us',
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
  const [activeTab, setActiveTab] = useState<'slides' | 'stats' | 'features' | 'solutions'>('slides');

  const [solutionsSection, setSolutionsSection] = useState({
    title: 'Solutions designed for your business',
    subtitle: 'Choose your business type to see relevant solutions',
    small: {
      featuredBadge: 'Featured',
      featuredTitle: 'Reliable connectivity for growing businesses',
      featuredDesc: 'Fast, affordable internet solutions to help your small business stay connected and competitive.',
      featuredLink: '/solutions/dedicated-connectivity',
      cards: [
        { title: 'Business Internet', desc: 'High-speed fiber internet up to 1 Gbps with dedicated bandwidth.', link: '/solutions/dedicated-connectivity', icon: 'Smartphone' },
        { title: 'Security Solutions', desc: 'Protect your business with firewall and DDoS protection.', link: '/solutions/value-added-services', icon: 'Shield' },
      ],
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    },
    enterprise: {
      featuredBadge: 'Featured',
      featuredTitle: 'Helping enterprises scale and innovate',
      featuredDesc: 'Enterprise-grade connectivity and network infrastructure designed for digital transformation.',
      featuredLink: '/solutions/dedicated-connectivity',
      cards: [
        { title: 'Dedicated Connectivity', desc: 'Private fiber connections up to 100 Gbps with 99.99% uptime SLA.', link: '/solutions/dedicated-connectivity', icon: 'Network', badge: 'Popular' },
        { title: 'Cloud Connect', desc: 'Direct, secure connectivity to AWS, Azure, and Google Cloud.', link: '/solutions/cloud-interconnection', icon: 'Zap', badge: 'New' },
      ],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    },
  });

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
          if (data.homeManagement.solutionsSection) setSolutionsSection((prev: typeof solutionsSection) => ({ ...prev, ...data.homeManagement.solutionsSection }));
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
      toast.success('Hero slides berhasil disimpan!');
    } else {
      toast.error('Gagal menyimpan hero slides.');
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
          solutionsSection,
        },
      }),
    });
    if (response.ok) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      toast.success('Berhasil disimpan!');
    } else {
      toast.error('Gagal menyimpan. Coba lagi.');
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
        ctaLink: '/contact-us',
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
            {(['slides', 'stats', 'features', 'solutions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'slides' ? 'Hero Slides' : tab === 'stats' ? 'Statistics' : tab === 'features' ? 'Features' : 'Solutions'}
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

        {/* Solutions Tab */}
        {activeTab === 'solutions' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">Manage the "Solutions designed for your business" section on the homepage.</p>

            {/* Section Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Section Header</h3>
              <input type="text" placeholder="Title" value={solutionsSection.title} onChange={e => setSolutionsSection({...solutionsSection, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <input type="text" placeholder="Subtitle" value={solutionsSection.subtitle} onChange={e => setSolutionsSection({...solutionsSection, subtitle: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>

            {/* Small Business Tab */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Small Business Tab</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500">Featured Badge</label><input type="text" value={solutionsSection.small.featuredBadge} onChange={e => setSolutionsSection({...solutionsSection, small: {...solutionsSection.small, featuredBadge: e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs text-gray-500">Featured Link</label><input type="text" value={solutionsSection.small.featuredLink} onChange={e => setSolutionsSection({...solutionsSection, small: {...solutionsSection.small, featuredLink: e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div><label className="text-xs text-gray-500">Featured Title</label><input type="text" value={solutionsSection.small.featuredTitle} onChange={e => setSolutionsSection({...solutionsSection, small: {...solutionsSection.small, featuredTitle: e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="text-xs text-gray-500">Featured Description</label><textarea value={solutionsSection.small.featuredDesc} onChange={e => setSolutionsSection({...solutionsSection, small: {...solutionsSection.small, featuredDesc: e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" rows={2} /></div>
              <div><label className="text-xs text-gray-500">Image URL</label><ImageUpload value={solutionsSection.small.image} onChange={url => setSolutionsSection({...solutionsSection, small: {...solutionsSection.small, image: url}})} label="Small Business Image" /></div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500 font-medium">Cards ({solutionsSection.small.cards.length})</p>
                <button type="button" onClick={() => setSolutionsSection({...solutionsSection, small: {...solutionsSection.small, cards: [...solutionsSection.small.cards, { title: '', desc: '', link: '/', icon: 'Smartphone' }]}})} className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Tambah Card</button>
              </div>
              {solutionsSection.small.cards.map((card, i) => (
                <div key={i} className="border border-gray-100 rounded p-3 space-y-2 relative">
                  <button type="button" onClick={() => { const cards = solutionsSection.small.cards.filter((_, idx) => idx !== i); setSolutionsSection({...solutionsSection, small: {...solutionsSection.small, cards}}); }} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" placeholder="Title" value={card.title} onChange={e => { const cards = [...solutionsSection.small.cards]; cards[i] = {...cards[i], title: e.target.value}; setSolutionsSection({...solutionsSection, small: {...solutionsSection.small, cards}}); }} className="px-2 py-1.5 border rounded text-sm" />
                    <input type="text" placeholder="Link" value={card.link} onChange={e => { const cards = [...solutionsSection.small.cards]; cards[i] = {...cards[i], link: e.target.value}; setSolutionsSection({...solutionsSection, small: {...solutionsSection.small, cards}}); }} className="px-2 py-1.5 border rounded text-sm" />
                    <select value={card.icon || 'Smartphone'} onChange={e => { const cards = [...solutionsSection.small.cards]; cards[i] = {...cards[i], icon: e.target.value}; setSolutionsSection({...solutionsSection, small: {...solutionsSection.small, cards}}); }} className="px-2 py-1.5 border rounded text-sm">
                      <option value="Smartphone">Smartphone</option><option value="Shield">Shield</option><option value="Network">Network</option><option value="Zap">Zap</option><option value="Headphones">Headphones</option><option value="Cable">Cable</option>
                    </select>
                  </div>
                  <input type="text" placeholder="Description" value={card.desc} onChange={e => { const cards = [...solutionsSection.small.cards]; cards[i] = {...cards[i], desc: e.target.value}; setSolutionsSection({...solutionsSection, small: {...solutionsSection.small, cards}}); }} className="w-full px-2 py-1.5 border rounded text-sm" />
                </div>
              ))}
            </div>

            {/* Enterprise Tab */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Enterprise Tab</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500">Featured Badge</label><input type="text" value={solutionsSection.enterprise.featuredBadge} onChange={e => setSolutionsSection({...solutionsSection, enterprise: {...solutionsSection.enterprise, featuredBadge: e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs text-gray-500">Featured Link</label><input type="text" value={solutionsSection.enterprise.featuredLink} onChange={e => setSolutionsSection({...solutionsSection, enterprise: {...solutionsSection.enterprise, featuredLink: e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </div>
              <div><label className="text-xs text-gray-500">Featured Title</label><input type="text" value={solutionsSection.enterprise.featuredTitle} onChange={e => setSolutionsSection({...solutionsSection, enterprise: {...solutionsSection.enterprise, featuredTitle: e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="text-xs text-gray-500">Featured Description</label><textarea value={solutionsSection.enterprise.featuredDesc} onChange={e => setSolutionsSection({...solutionsSection, enterprise: {...solutionsSection.enterprise, featuredDesc: e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" rows={2} /></div>
              <div><label className="text-xs text-gray-500">Image URL</label><ImageUpload value={solutionsSection.enterprise.image} onChange={url => setSolutionsSection({...solutionsSection, enterprise: {...solutionsSection.enterprise, image: url}})} label="Enterprise Image" /></div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500 font-medium">Cards ({solutionsSection.enterprise.cards.length})</p>
                <button type="button" onClick={() => setSolutionsSection({...solutionsSection, enterprise: {...solutionsSection.enterprise, cards: [...solutionsSection.enterprise.cards, { title: '', desc: '', link: '/', icon: 'Network', badge: '' }]}})} className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Tambah Card</button>
              </div>
              {solutionsSection.enterprise.cards.map((card, i) => (
                <div key={i} className="border border-gray-100 rounded p-3 space-y-2 relative">
                  <button type="button" onClick={() => { const cards = solutionsSection.enterprise.cards.filter((_, idx) => idx !== i); setSolutionsSection({...solutionsSection, enterprise: {...solutionsSection.enterprise, cards}}); }} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  <div className="grid grid-cols-4 gap-2">
                    <input type="text" placeholder="Title" value={card.title} onChange={e => { const cards = [...solutionsSection.enterprise.cards]; cards[i] = {...cards[i], title: e.target.value}; setSolutionsSection({...solutionsSection, enterprise: {...solutionsSection.enterprise, cards}}); }} className="px-2 py-1.5 border rounded text-sm" />
                    <input type="text" placeholder="Link" value={card.link} onChange={e => { const cards = [...solutionsSection.enterprise.cards]; cards[i] = {...cards[i], link: e.target.value}; setSolutionsSection({...solutionsSection, enterprise: {...solutionsSection.enterprise, cards}}); }} className="px-2 py-1.5 border rounded text-sm" />
                    <input type="text" placeholder="Badge (optional)" value={card.badge ?? ''} onChange={e => { const cards = [...solutionsSection.enterprise.cards]; cards[i] = {...cards[i], badge: e.target.value}; setSolutionsSection({...solutionsSection, enterprise: {...solutionsSection.enterprise, cards}}); }} className="px-2 py-1.5 border rounded text-sm" />
                    <select value={card.icon || 'Network'} onChange={e => { const cards = [...solutionsSection.enterprise.cards]; cards[i] = {...cards[i], icon: e.target.value}; setSolutionsSection({...solutionsSection, enterprise: {...solutionsSection.enterprise, cards}}); }} className="px-2 py-1.5 border rounded text-sm">
                      <option value="Network">Network</option><option value="Zap">Zap</option><option value="Shield">Shield</option><option value="Smartphone">Smartphone</option><option value="Headphones">Headphones</option><option value="Cable">Cable</option>
                    </select>
                  </div>
                  <input type="text" placeholder="Description" value={card.desc} onChange={e => { const cards = [...solutionsSection.enterprise.cards]; cards[i] = {...cards[i], desc: e.target.value}; setSolutionsSection({...solutionsSection, enterprise: {...solutionsSection.enterprise, cards}}); }} className="w-full px-2 py-1.5 border rounded text-sm" />
                </div>
              ))}
            </div>

            <button
              onClick={saveStatsAndFeatures}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Solutions
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

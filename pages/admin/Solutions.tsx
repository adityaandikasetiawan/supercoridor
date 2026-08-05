import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Save, ArrowLeft, Eye, EyeOff, Network } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../../utils/storage';
import { ImageUpload } from '../../components/ImageUpload';
import { GradientPicker } from '../../components/GradientPicker';

interface SolutionPage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  heroGradient: string;
  description: string;
  features: { title: string; description: string }[];
  packages: { name: string; speed: string; price: string; features: string[] }[];
  published: boolean;
}

const defaultSolutions: SolutionPage[] = [
  {
    id: '1',
    slug: 'dedicated-connectivity',
    title: 'Dedicated Connectivity Solutions',
    subtitle: 'Reliable, high-speed dedicated internet access for your business',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    description: 'Our dedicated connectivity solutions provide your business with guaranteed bandwidth and superior performance.',
    features: [
      { title: 'Guaranteed Bandwidth', description: 'Dedicated line with no contention' },
      { title: 'Symmetric Speed', description: 'Equal upload and download speeds' },
      { title: '99.99% SLA', description: 'Industry-leading uptime guarantee' },
      { title: '24/7 Support', description: 'Round-the-clock technical support' },
    ],
    packages: [
      { name: 'Starter', speed: '10 Mbps', price: 'IDR 5,000,000', features: ['Dedicated Line', 'SLA 99.9%'] },
      { name: 'Business', speed: '50 Mbps', price: 'IDR 15,000,000', features: ['Dedicated Line', 'SLA 99.99%', '24/7 Support'] },
      { name: 'Enterprise', speed: '100 Mbps+', price: 'Custom', features: ['Dedicated Line', 'SLA 99.99%', 'Managed Services'] },
    ],
    published: true,
  },
  {
    id: '2',
    slug: 'backbone-network',
    title: 'Backbone & Network Infrastructure',
    subtitle: 'Robust network infrastructure connecting Indonesia',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    description: 'Our extensive backbone network provides the foundation for reliable, high-performance connectivity.',
    features: [
      { title: 'Nationwide Coverage', description: 'Extensive fiber optic network' },
      { title: 'Redundant Paths', description: 'Multiple routes ensure resilience' },
      { title: 'Carrier-Grade Equipment', description: 'Enterprise-level hardware' },
      { title: 'Scalable Bandwidth', description: 'Easily upgrade capacity' },
    ],
    packages: [],
    published: true,
  },
  {
    id: '3',
    slug: 'cloud-interconnection',
    title: 'Cloud & Interconnection Services',
    subtitle: 'Direct, low-latency connections to major cloud providers',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    description: 'Connect directly to AWS, Azure, Google Cloud with dedicated, low-latency links.',
    features: [
      { title: 'Multi-Cloud Access', description: 'Direct connections to AWS, Azure, Google Cloud' },
      { title: 'Low Latency', description: 'Sub-millisecond latency with dedicated links' },
      { title: 'High Availability', description: 'Redundant paths with automatic failover' },
      { title: 'Flexible Bandwidth', description: 'Scale from 50 Mbps to 100 Gbps' },
    ],
    packages: [],
    published: true,
  },
  {
    id: '4',
    slug: 'value-added-services',
    title: 'Value-Added Services',
    subtitle: 'Comprehensive managed services to enhance your connectivity',
    heroImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
    description: 'Beyond connectivity, we offer managed services to protect and enhance your network.',
    features: [
      { title: 'DDoS Protection', description: 'Advanced threat mitigation' },
      { title: 'Managed SD-WAN', description: 'Intelligent traffic routing' },
      { title: 'Network Monitoring', description: '24/7 proactive monitoring' },
      { title: 'Managed Firewall', description: 'Enterprise-grade firewall management' },
    ],
    packages: [],
    published: true,
  },
];

export function AdminSolutions() {
  const [solutions, setSolutions] = useState<SolutionPage[]>(defaultSolutions);
  const [editingSolution, setEditingSolution] = useState<SolutionPage | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch('/api/admin/content/pages/solutions-all', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          if (data.data?.solutions && data.data.solutions.length > 0) {
            setSolutions(data.data.solutions);
          }
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const saveAll = async (updatedSolutions: SolutionPage[]) => {
    const res = await apiFetch('/api/admin/content/pages/solutions-all', {
      method: 'PUT',
      body: JSON.stringify({ data: { solutions: updatedSolutions } }),
    });
    if (res.ok) {
      // Also save each individual solution page for the public pages to read
      // We merge with existing data so we don't overwrite public-page-specific fields
      for (const sol of updatedSolutions) {
        // First fetch existing data for this solution
        let existingData: Record<string, unknown> = {};
        try {
          const existingRes = await apiFetch(`/api/admin/content/pages/solutions-${sol.slug}`, { method: 'GET' });
          if (existingRes.ok) {
            const existingJson = await existingRes.json();
            if (existingJson.data && typeof existingJson.data === 'object') {
              existingData = existingJson.data;
            }
          }
        } catch {
          // ignore - will just save fresh data
        }

        // Merge: admin fields override, but keep other fields (useCases, ctaTitle, etc.)
        await apiFetch(`/api/admin/content/pages/solutions-${sol.slug}`, {
          method: 'PUT',
          body: JSON.stringify({
            data: {
              ...existingData,
              title: sol.title,
              subtitle: sol.subtitle,
              heroImage: sol.heroImage,
              heroGradient: sol.heroGradient,
              description: sol.description,
              features: sol.features,
              packages: sol.packages,
              published: sol.published,
            },
          }),
        });
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      toast.success('Solutions berhasil disimpan!');
    } else {
      toast.error('Gagal menyimpan solutions.');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingSolution) return;
    const exists = solutions.find((s) => s.id === editingSolution.id);
    const updated = exists
      ? solutions.map((s) => (s.id === editingSolution.id ? editingSolution : s))
      : [...solutions, editingSolution];
    setSolutions(updated);
    await saveAll(updated);
    setEditingSolution(null);
  };

  const handleAdd = () => {
    const newSolution: SolutionPage = {
      id: Date.now().toString(),
      slug: '',
      title: 'New Solution',
      subtitle: 'Solution subtitle',
      heroImage: '',
      heroGradient: 'orange',
      description: 'Solution description',
      features: [{ title: 'Feature 1', description: 'Description' }],
      packages: [],
      published: false,
    };
    setEditingSolution(newSolution);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this solution page?')) return;
    const updated = solutions.filter((s) => s.id !== id);
    setSolutions(updated);
    await saveAll(updated);
  };

  const togglePublished = async (id: string) => {
    const updated = solutions.map((s) => (s.id === id ? { ...s, published: !s.published } : s));
    setSolutions(updated);
    await saveAll(updated);
  };

  const addFeature = () => {
    if (!editingSolution) return;
    setEditingSolution({
      ...editingSolution,
      features: [...editingSolution.features, { title: '', description: '' }],
    });
  };

  const removeFeature = (index: number) => {
    if (!editingSolution) return;
    setEditingSolution({
      ...editingSolution,
      features: editingSolution.features.filter((_, i) => i !== index),
    });
  };

  const addPackage = () => {
    if (!editingSolution) return;
    setEditingSolution({
      ...editingSolution,
      packages: [...editingSolution.packages, { name: '', speed: '', price: '', features: [] }],
    });
  };

  const removePackage = (index: number) => {
    if (!editingSolution) return;
    setEditingSolution({
      ...editingSolution,
      packages: editingSolution.packages.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  // Edit view
  if (editingSolution) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setEditingSolution(null)} className="p-2 hover:bg-gray-200 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl text-gray-900">
                {solutions.find((s) => s.id === editingSolution.id) ? 'Edit Solution' : 'New Solution'}
              </h1>
              <p className="text-gray-600 mt-1">Configure solution page content</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Page Title</label>
                    <input type="text" value={editingSolution.title} onChange={(e) => setEditingSolution({ ...editingSolution, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">URL Slug</label>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-1">/solutions/</span>
                      <input type="text" value={editingSolution.slug} onChange={(e) => setEditingSolution({ ...editingSolution, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="my-solution" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Subtitle</label>
                  <input type="text" value={editingSolution.subtitle} onChange={(e) => setEditingSolution({ ...editingSolution, subtitle: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <ImageUpload
                    value={editingSolution.heroImage}
                    onChange={(url) => setEditingSolution({ ...editingSolution, heroImage: url })}
                    label="Hero Image"
                    previewClassName="w-full h-24 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <GradientPicker value={editingSolution.heroGradient ?? 'orange'} onChange={(v) => setEditingSolution({ ...editingSolution, heroGradient: v })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Description</label>
                  <textarea value={editingSolution.description} onChange={(e) => setEditingSolution({ ...editingSolution, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" rows={4} />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg text-gray-900">Features</h2>
                <button onClick={addFeature} className="text-sm text-orange-600 hover:text-orange-700 flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Add Feature
                </button>
              </div>
              <div className="space-y-3">
                {editingSolution.features.map((feature, index) => (
                  <div key={index} className="flex gap-3 items-start border border-gray-200 rounded-lg p-3">
                    <div className="flex-1 space-y-2">
                      <input type="text" placeholder="Feature title" value={feature.title} onChange={(e) => { const f = [...editingSolution.features]; f[index] = { ...f[index], title: e.target.value }; setEditingSolution({ ...editingSolution, features: f }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                      <input type="text" placeholder="Feature description" value={feature.description} onChange={(e) => { const f = [...editingSolution.features]; f[index] = { ...f[index], description: e.target.value }; setEditingSolution({ ...editingSolution, features: f }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                    </div>
                    <button onClick={() => removeFeature(index)} className="p-2 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Packages */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg text-gray-900">Pricing Packages (Optional)</h2>
                <button onClick={addPackage} className="text-sm text-orange-600 hover:text-orange-700 flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Add Package
                </button>
              </div>
              <div className="space-y-3">
                {editingSolution.packages.map((pkg, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm text-gray-500">Package {index + 1}</span>
                      <button onClick={() => removePackage(index)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <input type="text" placeholder="Name" value={pkg.name} onChange={(e) => { const p = [...editingSolution.packages]; p[index] = { ...p[index], name: e.target.value }; setEditingSolution({ ...editingSolution, packages: p }); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <input type="text" placeholder="Speed" value={pkg.speed} onChange={(e) => { const p = [...editingSolution.packages]; p[index] = { ...p[index], speed: e.target.value }; setEditingSolution({ ...editingSolution, packages: p }); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <input type="text" placeholder="Price" value={pkg.price} onChange={(e) => { const p = [...editingSolution.packages]; p[index] = { ...p[index], price: e.target.value }; setEditingSolution({ ...editingSolution, packages: p }); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                ))}
                {editingSolution.packages.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No packages added. Click "Add Package" to create pricing tiers.</p>
                )}
              </div>
            </div>

            {/* Save */}
            <div className="flex gap-3">
              <button onClick={handleSaveEdit} className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
                <Save className="w-5 h-5 mr-2" /> Save Solution
              </button>
              <button onClick={() => setEditingSolution(null)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // List view
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900">Solutions Management</h1>
            <p className="text-gray-600 mt-1">Manage solution pages and sub-pages</p>
          </div>
          <button onClick={handleAdd} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
            <Plus className="w-5 h-5 mr-2" /> Add Solution Page
          </button>
        </div>

        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Changes saved successfully!
          </div>
        )}

        {/* Solutions List */}
        <div className="space-y-4">
          {solutions.map((solution) => (
            <div key={solution.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg text-gray-900">{solution.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${solution.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {solution.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{solution.subtitle}</p>
                  <p className="text-xs text-gray-500">
                    URL: /solutions/{solution.slug} • {solution.features.length} features • {solution.packages.length} packages
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => togglePublished(solution.id)} className="p-2 text-gray-400 hover:text-gray-600 rounded" title={solution.published ? 'Unpublish' : 'Publish'}>
                    {solution.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setEditingSolution({ ...solution })} className="p-2 text-blue-600 hover:text-blue-700 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(solution.id)} className="p-2 text-red-600 hover:text-red-700 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {solutions.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <Network className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2">No solution pages yet</h3>
            <p className="text-gray-600 mb-4">Create your first solution page to get started.</p>
            <button onClick={handleAdd} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
              Add Solution Page
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

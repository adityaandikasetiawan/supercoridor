import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Save, ArrowLeft, Eye, EyeOff, Cpu } from 'lucide-react';
import { apiFetch } from '../../utils/storage';
import { ImageUpload } from '../../components/ImageUpload';

interface TechnologyPage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  features: { title: string; description: string }[];
  published: boolean;
}

const defaultTechnologies: TechnologyPage[] = [
  {
    id: '1',
    slug: 'backbone-network',
    title: 'Fiber Optic Network',
    subtitle: 'High-capacity fiber optic backbone spanning across Indonesia',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    description: 'Our fiber optic network infrastructure provides the backbone for all connectivity services, delivering ultra-low latency and massive bandwidth capacity.',
    features: [
      { title: 'DWDM Technology', description: 'Dense Wave Division Multiplexing for maximum capacity' },
      { title: 'Redundant Paths', description: 'Multiple fiber routes for high availability' },
      { title: 'Low Latency', description: 'Sub-millisecond latency between major cities' },
    ],
    published: true,
  },
  {
    id: '2',
    slug: 'cloud-interconnection',
    title: 'Cloud Infrastructure',
    subtitle: 'Direct connections to major cloud platforms',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    description: 'Enterprise-grade cloud interconnection services providing direct, private access to AWS, Azure, Google Cloud and other platforms.',
    features: [
      { title: 'Multi-Cloud', description: 'Connect to multiple cloud providers simultaneously' },
      { title: 'Private Peering', description: 'Dedicated connections bypassing public internet' },
      { title: 'Scalable', description: 'From 50 Mbps to 100 Gbps on demand' },
    ],
    published: true,
  },
  {
    id: '3',
    slug: 'value-added-services',
    title: 'Network Security',
    subtitle: 'Advanced security solutions to protect your infrastructure',
    heroImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
    description: 'Comprehensive network security services including DDoS protection, managed firewall, and 24/7 threat monitoring.',
    features: [
      { title: 'DDoS Protection', description: 'Real-time threat detection and mitigation' },
      { title: 'Managed Firewall', description: 'Enterprise-grade firewall management' },
      { title: '24/7 SOC', description: 'Security Operations Center monitoring' },
    ],
    published: true,
  },
];

export function AdminTechnology() {
  const [technologies, setTechnologies] = useState<TechnologyPage[]>(defaultTechnologies);
  const [editingTech, setEditingTech] = useState<TechnologyPage | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch('/api/admin/content/pages/technology-all', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          if (data.data?.technologies && data.data.technologies.length > 0) {
            setTechnologies(data.data.technologies);
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

  const saveAll = async (updated: TechnologyPage[]) => {
    const res = await apiFetch('/api/admin/content/pages/technology-all', {
      method: 'PUT',
      body: JSON.stringify({ data: { technologies: updated } }),
    });
    if (res.ok) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingTech) return;
    const exists = technologies.find((t) => t.id === editingTech.id);
    const updated = exists
      ? technologies.map((t) => (t.id === editingTech.id ? editingTech : t))
      : [...technologies, editingTech];
    setTechnologies(updated);
    await saveAll(updated);
    setEditingTech(null);
  };

  const handleAdd = () => {
    setEditingTech({
      id: Date.now().toString(),
      slug: '',
      title: 'New Technology',
      subtitle: '',
      heroImage: '',
      description: '',
      features: [{ title: '', description: '' }],
      published: false,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this technology page?')) return;
    const updated = technologies.filter((t) => t.id !== id);
    setTechnologies(updated);
    await saveAll(updated);
  };

  const togglePublished = async (id: string) => {
    const updated = technologies.map((t) => (t.id === id ? { ...t, published: !t.published } : t));
    setTechnologies(updated);
    await saveAll(updated);
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
  if (editingTech) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setEditingTech(null)} className="p-2 hover:bg-gray-200 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl text-gray-900">
                {technologies.find((t) => t.id === editingTech.id) ? 'Edit Technology' : 'New Technology'}
              </h1>
              <p className="text-gray-600 mt-1">Configure technology page content</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Title</label>
                    <input type="text" value={editingTech.title} onChange={(e) => setEditingTech({ ...editingTech, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">URL Slug</label>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-1">/solutions/</span>
                      <input type="text" value={editingTech.slug} onChange={(e) => setEditingTech({ ...editingTech, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="my-technology" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Subtitle</label>
                  <input type="text" value={editingTech.subtitle} onChange={(e) => setEditingTech({ ...editingTech, subtitle: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                  <ImageUpload value={editingTech.heroImage} onChange={(url) => setEditingTech({ ...editingTech, heroImage: url })} label="Hero Image" previewClassName="w-full h-24 object-cover rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Description</label>
                  <textarea value={editingTech.description} onChange={(e) => setEditingTech({ ...editingTech, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" rows={4} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg text-gray-900">Features</h2>
                <button onClick={() => setEditingTech({ ...editingTech, features: [...editingTech.features, { title: '', description: '' }] })} className="text-sm text-orange-600 hover:text-orange-700 flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Add Feature
                </button>
              </div>
              <div className="space-y-3">
                {editingTech.features.map((feature, index) => (
                  <div key={index} className="flex gap-3 items-start border border-gray-200 rounded-lg p-3">
                    <div className="flex-1 space-y-2">
                      <input type="text" placeholder="Feature title" value={feature.title} onChange={(e) => { const f = [...editingTech.features]; f[index] = { ...f[index], title: e.target.value }; setEditingTech({ ...editingTech, features: f }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                      <input type="text" placeholder="Feature description" value={feature.description} onChange={(e) => { const f = [...editingTech.features]; f[index] = { ...f[index], description: e.target.value }; setEditingTech({ ...editingTech, features: f }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" />
                    </div>
                    <button onClick={() => setEditingTech({ ...editingTech, features: editingTech.features.filter((_, i) => i !== index) })} className="p-2 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSaveEdit} className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
                <Save className="w-5 h-5 mr-2" /> Save Technology
              </button>
              <button onClick={() => setEditingTech(null)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
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
            <h1 className="text-2xl text-gray-900">Technology Management</h1>
            <p className="text-gray-600 mt-1">Manage technology pages shown in the Technology menu</p>
          </div>
          <button onClick={handleAdd} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
            <Plus className="w-5 h-5 mr-2" /> Add Technology
          </button>
        </div>

        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Changes saved successfully!
          </div>
        )}

        <div className="space-y-4">
          {technologies.map((tech) => (
            <div key={tech.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg text-gray-900">{tech.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${tech.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {tech.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{tech.subtitle}</p>
                  <p className="text-xs text-gray-500">
                    Links to: /solutions/{tech.slug} • {tech.features.length} features
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => togglePublished(tech.id)} className="p-2 text-gray-400 hover:text-gray-600 rounded" title={tech.published ? 'Unpublish' : 'Publish'}>
                    {tech.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setEditingTech({ ...tech })} className="p-2 text-blue-600 hover:text-blue-700 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(tech.id)} className="p-2 text-red-600 hover:text-red-700 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {technologies.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <Cpu className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2">No technology pages yet</h3>
            <p className="text-gray-600 mb-4">Create your first technology page to get started.</p>
            <button onClick={handleAdd} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
              Add Technology
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

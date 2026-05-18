import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { apiFetch } from '../../utils/storage';
import { ImageUpload } from '../../components/ImageUpload';
import { RichTextEditor } from '../../components/RichTextEditor';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
  image: string;
  published: boolean;
}

export function AdminResourcesCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([
    {
      id: '1',
      title: 'Enterprise Network Transformation',
      client: 'Global Tech Corp',
      industry: 'Technology',
      challenge: 'Legacy infrastructure causing downtime',
      solution: 'Deployed fiber optic backbone with redundancy',
      results: '99.99% uptime, 50% cost reduction',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      published: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch('/api/admin/content/resources/case-studies');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.ok && Array.isArray(data.caseStudies)) {
          setCaseStudies(data.caseStudies);
        }
      } catch (err) {
        void err;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistCaseStudies = async (nextCaseStudies: CaseStudy[]) => {
    try {
      await apiFetch('/api/admin/content/resources/case-studies', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ caseStudies: nextCaseStudies }),
      });
    } catch (err) {
      void err;
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    industry: '',
    challenge: '',
    solution: '',
    results: '',
    image: '',
    published: true,
  });

  const handleOpenModal = (study?: CaseStudy) => {
    if (study) {
      setEditingStudy(study);
      setFormData(study);
    } else {
      setEditingStudy(null);
      setFormData({
        title: '',
        client: '',
        industry: '',
        challenge: '',
        solution: '',
        results: '',
        image: '',
        published: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let nextCaseStudies: CaseStudy[];
    if (editingStudy) {
      nextCaseStudies = caseStudies.map((cs) =>
        cs.id === editingStudy.id ? { ...formData, id: cs.id } : cs
      );
    } else {
      nextCaseStudies = [...caseStudies, { ...formData, id: Date.now().toString() }];
    }
    setCaseStudies(nextCaseStudies);
    await persistCaseStudies(nextCaseStudies);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this case study?')) {
      const nextCaseStudies = caseStudies.filter((cs) => cs.id !== id);
      setCaseStudies(nextCaseStudies);
      await persistCaseStudies(nextCaseStudies);
    }
  };

  const filteredCaseStudies = caseStudies.filter(
    (study) =>
      study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl text-gray-900">Case Studies</h1>
            <p className="text-gray-600 mt-1">Manage customer success stories</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Case Study
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search case studies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Case Studies Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCaseStudies.map((study) => (
                <tr key={study.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{study.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{study.client}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {study.industry}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        study.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {study.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(study)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(study.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCaseStudies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No case studies found</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">
                  {editingStudy ? 'Edit Case Study' : 'Add New Case Study'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Industry</label>
                      <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <RichTextEditor
                      value={formData.challenge}
                      onChange={(val) => setFormData({ ...formData, challenge: val })}
                      label="Challenge"
                      placeholder="Describe the client's challenge..."
                      height="200px"
                    />
                  </div>
                  <div>
                    <RichTextEditor
                      value={formData.solution}
                      onChange={(val) => setFormData({ ...formData, solution: val })}
                      label="Solution"
                      placeholder="Describe the solution provided..."
                      height="200px"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Results (separate with semicolons)</label>
                    <textarea
                      value={formData.results}
                      onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                      required
                      placeholder="99.99% uptime; 50% cost reduction; 3x faster deployment"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate each result with a semicolon (;)</p>
                  </div>
                  <div>
                    <ImageUpload
                      value={formData.image}
                      onChange={(url) => setFormData({ ...formData, image: url })}
                      label="Case Study Image"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) =>
                        setFormData({ ...formData, published: e.target.checked })
                      }
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="published" className="ml-2 text-sm text-gray-700">
                      Publish immediately
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      {editingStudy ? 'Update' : 'Create'} Case Study
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

import { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

export function AdminResourcesFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'What is the typical installation time?',
      answer: 'Installation typically takes 5-10 business days depending on location and service type.',
      category: 'General',
      order: 1,
      published: true,
    },
    {
      id: '2',
      question: 'Do you offer 24/7 support?',
      answer: 'Yes, we provide round-the-clock technical support for all enterprise customers.',
      category: 'Support',
      order: 2,
      published: true,
    },
    {
      id: '3',
      question: 'What are your SLA guarantees?',
      answer: 'We guarantee 99.99% uptime for enterprise services with proactive monitoring.',
      category: 'Technical',
      order: 3,
      published: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order: 0,
    published: true,
  });

  const handleOpenModal = (faq?: FAQ) => {
    if (faq) {
      setEditingFAQ(faq);
      setFormData(faq);
    } else {
      setEditingFAQ(null);
      setFormData({
        question: '',
        answer: '',
        category: '',
        order: faqs.length + 1,
        published: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFAQ) {
      setFaqs(faqs.map((f) => (f.id === editingFAQ.id ? { ...formData, id: f.id } : f)));
    } else {
      setFaqs([...faqs, { ...formData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter((f) => f.id !== id));
    }
  };

  const filteredFAQs = faqs
    .filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.order - b.order);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl text-gray-900">FAQ Management</h1>
            <p className="text-gray-600 mt-1">Manage frequently asked questions</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add FAQ
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="p-4">
              <div className="flex items-start justify-between">
                <button
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-start gap-3">
                    {expandedId === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {faq.category}
                        </span>
                        <span className="text-xs text-gray-500">Order: {faq.order}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            faq.published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {faq.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h3 className="text-gray-900 mb-2">{faq.question}</h3>
                      {expandedId === faq.id && (
                        <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                      )}
                    </div>
                  </div>
                </button>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleOpenModal(faq)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No FAQs found</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">
                  {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Question</label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Answer</label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="General">General</option>
                        <option value="Technical">Technical</option>
                        <option value="Support">Support</option>
                        <option value="Billing">Billing</option>
                        <option value="Services">Services</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Display Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: parseInt(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        min="1"
                        required
                      />
                    </div>
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
                      {editingFAQ ? 'Update' : 'Create'} FAQ
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

import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { apiFetch } from '../../utils/storage';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  published: boolean;
}

export function AdminResourcesInsights() {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: '5G Technology and the Future of Business Connectivity',
      excerpt: 'Explore how 5G is transforming business operations',
      content: 'Full article content here...',
      author: 'John Doe',
      date: '2024-01-15',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      published: true,
    },
    {
      id: '2',
      title: 'The Importance of Network Security in 2024',
      excerpt: 'Understanding modern security challenges',
      content: 'Full article content here...',
      author: 'Jane Smith',
      date: '2024-01-10',
      category: 'Security',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
      published: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch('/api/admin/content/resources/insights');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.ok && Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
      } catch (err) {
        void err;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistArticles = async (nextArticles: Article[]) => {
    try {
      await apiFetch('/api/admin/content/resources/insights', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ articles: nextArticles }),
      });
    } catch (err) {
      void err;
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: '',
    category: '',
    image: '',
    published: true,
  });

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData(article);
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        image: '',
        published: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let nextArticles: Article[];
    if (editingArticle) {
      nextArticles = articles.map((a) =>
        a.id === editingArticle.id ? { ...formData, id: a.id } : a
      );
    } else {
      nextArticles = [...articles, { ...formData, id: Date.now().toString() }];
    }
    setArticles(nextArticles);
    await persistArticles(nextArticles);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const nextArticles = articles.filter((a) => a.id !== id);
      setArticles(nextArticles);
      await persistArticles(nextArticles);
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl text-gray-900">Insights & Articles</h1>
            <p className="text-gray-600 mt-1">Manage your blog posts and articles</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Article
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      article.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {article.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{article.author}</span>
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(article)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No articles found</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">
                  {editingArticle ? 'Edit Article' : 'Add New Article'}
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
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Excerpt</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={2}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Content</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={6}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Author</label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
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
                        <option value="Technology">Technology</option>
                        <option value="Security">Security</option>
                        <option value="Innovation">Innovation</option>
                        <option value="Industry">Industry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      {editingArticle ? 'Update' : 'Create'} Article
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

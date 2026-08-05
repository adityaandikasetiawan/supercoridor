import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../../utils/storage';
import { ImageUpload } from '../../components/ImageUpload';
import { RichTextEditor } from '../../components/RichTextEditor';
import { GradientPicker } from '../../components/GradientPicker';

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

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select type
}

interface EventItem {
  id: string;
  title: string;
  location: string;
  date: string;
  image: string;
  registrationOpen?: boolean;
  maxParticipants?: number;
  formFields?: FormField[];
}

export function AdminResourcesInsights() {
  const [activeTab, setActiveTab] = useState<'articles' | 'events' | 'registrations' | 'settings'>('articles');

  // Page header state
  const [heroTitle, setHeroTitle] = useState('Articles & Events');
  const [heroSubtitle, setHeroSubtitle] = useState('Expert perspectives on enterprise connectivity, network technology, and digital transformation.');
  const [heroGradient, setHeroGradient] = useState('green');

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Events state
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventForm, setEventForm] = useState<{ title: string; location: string; date: string; image: string; registrationOpen: boolean; maxParticipants: number; formFields: FormField[] }>({ title: '', location: '', date: '', image: '', registrationOpen: false, maxParticipants: 0, formFields: [] });

  // Registrations state
  const [registrations, setRegistrations] = useState<Array<{ id: string; eventId: string; name: string; email: string; phone: string; company: string; notes: string; status: string; registeredAt: string }>>([]);
  const [regFilterEvent, setRegFilterEvent] = useState('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Load articles
      try {
        const res = await apiFetch('/api/admin/content/resources/insights');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data?.ok && Array.isArray(data.articles)) {
            setArticles(data.articles);
          }
        }
      } catch { /* ignore */ }

      // Load events
      try {
        const evRes = await apiFetch('/api/admin/content/pages/page-events', { method: 'GET' });
        if (evRes.ok) {
          const evData = await evRes.json();
          if (!cancelled && evData.data?.events && Array.isArray(evData.data.events)) {
            setEvents(evData.data.events);
          }
        }
      } catch { /* ignore */ }

      // Load page header
      try {
        const hRes = await apiFetch('/api/admin/content/pages/page-insights', { method: 'GET' });
        if (hRes.ok) {
          const hData = await hRes.json();
          if (!cancelled && hData.data) {
            if (hData.data.heroTitle) setHeroTitle(hData.data.heroTitle);
            if (hData.data.heroSubtitle) setHeroSubtitle(hData.data.heroSubtitle);
            if (hData.data.heroGradient) setHeroGradient(hData.data.heroGradient);
          }
        }
      } catch { /* ignore */ }

      // Load registrations
      try {
        const regRes = await apiFetch('/api/admin/events/registrations', { method: 'GET' });
        if (regRes.ok) {
          const regData = await regRes.json();
          if (!cancelled && regData.registrations) setRegistrations(regData.registrations);
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, []);

  // Article handlers
  const persistArticles = async (nextArticles: Article[]) => {
    try {
      const response = await apiFetch('/api/admin/content/resources/insights', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ articles: nextArticles }),
      });
      if (response.ok) toast.success('Artikel berhasil disimpan!');
      else toast.error('Gagal menyimpan artikel.');
    } catch {
      toast.error('Gagal menyimpan. Periksa koneksi internet.');
    }
  };

  const handleOpenModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData(article);
    } else {
      setEditingArticle(null);
      setFormData({ title: '', excerpt: '', content: '', author: '', date: new Date().toISOString().split('T')[0], category: '', image: '', published: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let nextArticles: Article[];
    if (editingArticle) {
      nextArticles = articles.map((a) => a.id === editingArticle.id ? { ...formData, id: a.id } : a);
    } else {
      nextArticles = [...articles, { ...formData, id: Date.now().toString() }];
    }
    setArticles(nextArticles);
    await persistArticles(nextArticles);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus artikel ini?')) {
      const nextArticles = articles.filter((a) => a.id !== id);
      setArticles(nextArticles);
      await persistArticles(nextArticles);
    }
  };

  // Event handlers
  const persistEvents = async (nextEvents: EventItem[]) => {
    try {
      const res = await apiFetch('/api/admin/content/pages/page-events', {
        method: 'PUT',
        body: JSON.stringify({ data: { events: nextEvents } }),
      });
      if (res.ok) toast.success('Event berhasil disimpan!');
      else toast.error('Gagal menyimpan event.');
    } catch {
      toast.error('Gagal menyimpan. Periksa koneksi internet.');
    }
  };

  const handleOpenEventModal = (event?: EventItem) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        location: event.location,
        date: event.date,
        image: event.image,
        registrationOpen: event.registrationOpen ?? false,
        maxParticipants: event.maxParticipants ?? 0,
        formFields: event.formFields ?? [
          { id: 'name', label: 'Nama Lengkap', type: 'text', required: true, placeholder: 'John Doe' },
          { id: 'email', label: 'Email', type: 'email', required: true, placeholder: 'john@company.com' },
          { id: 'phone', label: 'No. Telepon', type: 'tel', required: false, placeholder: '08123456789' },
          { id: 'company', label: 'Perusahaan', type: 'text', required: false, placeholder: 'PT ABC' },
        ],
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: '', location: '', date: '', image: '', registrationOpen: false, maxParticipants: 0,
        formFields: [
          { id: 'name', label: 'Nama Lengkap', type: 'text', required: true, placeholder: 'John Doe' },
          { id: 'email', label: 'Email', type: 'email', required: true, placeholder: 'john@company.com' },
          { id: 'phone', label: 'No. Telepon', type: 'tel', required: false, placeholder: '08123456789' },
          { id: 'company', label: 'Perusahaan', type: 'text', required: false, placeholder: 'PT ABC' },
        ],
      });
    }
    setIsEventModalOpen(true);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let nextEvents: EventItem[];
    const eventData: EventItem = {
      id: editingEvent?.id ?? Date.now().toString(),
      title: eventForm.title,
      location: eventForm.location,
      date: eventForm.date,
      image: eventForm.image,
      registrationOpen: eventForm.registrationOpen,
      maxParticipants: eventForm.maxParticipants,
      formFields: eventForm.formFields,
    };
    if (editingEvent) {
      nextEvents = events.map((ev) => ev.id === editingEvent.id ? eventData : ev);
    } else {
      nextEvents = [...events, eventData];
    }
    setEvents(nextEvents);
    await persistEvents(nextEvents);
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus event ini?')) {
      const nextEvents = events.filter((ev) => ev.id !== id);
      setEvents(nextEvents);
      await persistEvents(nextEvents);
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
        <div>
          <h1 className="text-2xl text-gray-900">Articles & Events</h1>
          <p className="text-gray-600 mt-1">Manage articles and events for the public page</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('articles')}
              className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'articles' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Articles
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'events' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'registrations' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Registrations {registrations.length > 0 && <span className="ml-1 bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5 rounded-full">{registrations.length}</span>}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 px-1 border-b-2 transition-colors ${activeTab === 'settings' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Page Settings
            </button>
          </nav>
        </div>

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <>
            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Article
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">{article.category}</span>
                      <span className={`text-xs px-2 py-1 rounded ${article.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
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
                      <button onClick={() => handleOpenModal(article)} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button onClick={() => handleDelete(article.id)} className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center">
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
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
          </>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Kelola event yang tampil di slider halaman Articles & Events.</p>
              <button
                onClick={() => handleOpenEventModal()}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-48">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{event.title}</h3>
                      {event.registrationOpen && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Open</span>}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{event.location}</p>
                    <p className="text-sm text-gray-500 mb-3">{event.date}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEventModal(event)} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center">
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {events.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">Belum ada event. Klik "Add Event" untuk menambahkan.</p>
              </div>
            )}
          </>
        )}

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <select value={regFilterEvent} onChange={(e) => setRegFilterEvent(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="all">All Events</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                </select>
                <span className="text-sm text-gray-500">
                  {registrations.filter(r => regFilterEvent === 'all' || r.eventId === regFilterEvent).length} registrations
                </span>
              </div>
              <button
                onClick={() => {
                  import('xlsx').then(XLSX => {
                    const filtered = registrations.filter(r => regFilterEvent === 'all' || r.eventId === regFilterEvent);
                    const data = filtered.map(r => ({
                      'Event': events.find(e => e.id === r.eventId)?.title ?? r.eventId,
                      'Name': r.name,
                      'Email': r.email,
                      'Phone': r.phone,
                      'Company': r.company,
                      'Notes': r.notes,
                      'Status': r.status.charAt(0).toUpperCase() + r.status.slice(1),
                      'Registered At': new Date(r.registeredAt).toLocaleString('id-ID'),
                    }));
                    const ws = XLSX.utils.json_to_sheet(data);
                    // Auto column widths
                    const colWidths = Object.keys(data[0] || {}).map(key => ({
                      wch: Math.max(key.length, ...data.map(row => String(row[key as keyof typeof row] ?? '').length)) + 2
                    }));
                    ws['!cols'] = colWidths;
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
                    XLSX.writeFile(wb, `event-registrations-${new Date().toISOString().split('T')[0]}.xlsx`);
                    toast.success('Excel exported!');
                  });
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
              >
                Export Excel
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-600">Name</th>
                    <th className="text-left px-4 py-3 text-gray-600">Email</th>
                    <th className="text-left px-4 py-3 text-gray-600">Event</th>
                    <th className="text-left px-4 py-3 text-gray-600">Company</th>
                    <th className="text-left px-4 py-3 text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 text-gray-600">Date</th>
                    <th className="text-left px-4 py-3 text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations
                    .filter(r => regFilterEvent === 'all' || r.eventId === regFilterEvent)
                    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
                    .map(reg => (
                      <tr key={reg.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{reg.name}</td>
                        <td className="px-4 py-3 text-gray-600">{reg.email}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{events.find(e => e.id === reg.eventId)?.title ?? '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{reg.company || '-'}</td>
                        <td className="px-4 py-3">
                          <select
                            value={reg.status}
                            onChange={async (e) => {
                              const res = await apiFetch(`/api/admin/events/registrations/${reg.id}`, { method: 'PUT', body: JSON.stringify({ status: e.target.value }) });
                              if (res.ok) {
                                setRegistrations(registrations.map(r => r.id === reg.id ? { ...r, status: e.target.value } : r));
                                toast.success('Status updated');
                              }
                            }}
                            className={`text-xs px-2 py-1 rounded border ${reg.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : reg.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(reg.registeredAt).toLocaleDateString('id-ID')}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={async () => {
                              if (!window.confirm('Hapus registrasi ini?')) return;
                              const res = await apiFetch(`/api/admin/events/registrations/${reg.id}`, { method: 'DELETE' });
                              if (res.ok) {
                                setRegistrations(registrations.filter(r => r.id !== reg.id));
                                toast.success('Registrasi dihapus');
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {registrations.filter(r => regFilterEvent === 'all' || r.eventId === regFilterEvent).length === 0 && (
                <div className="text-center py-12 text-gray-500">Belum ada registrasi.</div>
              )}
            </div>
          </>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <h2 className="text-lg text-gray-900">Page Header</h2>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Title</label>
                <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Subtitle</label>
                <textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <GradientPicker value={heroGradient} onChange={setHeroGradient} />
              <button
                onClick={async () => {
                  const res = await apiFetch('/api/admin/content/pages/page-insights', {
                    method: 'PUT',
                    body: JSON.stringify({ data: { heroTitle, heroSubtitle, heroGradient } }),
                  });
                  if (res.ok) toast.success('Page header berhasil disimpan!');
                  else toast.error('Gagal menyimpan page header.');
                }}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Save Page Settings
              </button>
            </div>
          </div>
        )}

        {/* Article Modal */}
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
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Excerpt</label>
                    <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" rows={2} required />
                  </div>
                  <div>
                    <RichTextEditor value={formData.content} onChange={(val) => setFormData({ ...formData, content: val })} label="Article Content" placeholder="Write your article content here..." height="400px" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Author</label>
                      <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Date</label>
                      <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Category</label>
                      <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required>
                        <option value="">Select Category</option>
                        <option value="Technology">Technology</option>
                        <option value="Security">Security</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Business">Business</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Innovation">Innovation</option>
                        <option value="Industry">Industry</option>
                      </select>
                    </div>
                    <div>
                      <ImageUpload value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} label="Article Image" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                    <label htmlFor="published" className="ml-2 text-sm text-gray-700">Publish immediately</label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      {editingArticle ? 'Update' : 'Create'} Article
                    </button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Event Modal */}
        {isEventModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Event Title</label>
                    <input type="text" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Location</label>
                    <input type="text" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="e.g., JCC Senayan | Jakarta" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Date</label>
                    <input type="text" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} placeholder="e.g., March 15, 2026" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <ImageUpload value={eventForm.image} onChange={(url) => setEventForm({ ...eventForm, image: url })} label="Event Image" previewClassName="w-full h-32 object-cover rounded-lg" />
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={eventForm.registrationOpen} onChange={(e) => setEventForm({ ...eventForm, registrationOpen: e.target.checked })} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                      <span className="text-sm text-gray-700">Open Registration</span>
                    </label>
                    {eventForm.registrationOpen && (
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Max Peserta:</label>
                        <input type="number" min="0" value={eventForm.maxParticipants || ''} onChange={(e) => setEventForm({ ...eventForm, maxParticipants: Number(e.target.value) || 0 })} placeholder="0 = unlimited" className="w-24 px-2 py-1 border border-gray-300 rounded text-sm" />
                      </div>
                    )}
                  </div>

                  {/* Custom Form Fields Editor */}
                  {eventForm.registrationOpen && (
                    <div className="border border-gray-200 rounded-lg p-4 mt-3">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Form Fields (Registration)</h4>
                        <button type="button" onClick={() => setEventForm({ ...eventForm, formFields: [...eventForm.formFields, { id: Date.now().toString(), label: '', type: 'text', required: false, placeholder: '' }] })} className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center">
                          <Plus className="w-3 h-3 mr-1" /> Add Field
                        </button>
                      </div>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {eventForm.formFields.map((field, idx) => (
                          <div key={field.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                            <input type="text" value={field.label} onChange={(e) => { const f = [...eventForm.formFields]; f[idx] = { ...f[idx], label: e.target.value }; setEventForm({ ...eventForm, formFields: f }); }} placeholder="Label" className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs" />
                            <select value={field.type} onChange={(e) => { const f = [...eventForm.formFields]; f[idx] = { ...f[idx], type: e.target.value as FormField['type'] }; setEventForm({ ...eventForm, formFields: f }); }} className="px-2 py-1 border border-gray-300 rounded text-xs w-20">
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="tel">Phone</option>
                              <option value="textarea">Textarea</option>
                              <option value="select">Dropdown</option>
                            </select>
                            <label className="flex items-center gap-1 text-xs cursor-pointer whitespace-nowrap">
                              <input type="checkbox" checked={field.required} onChange={(e) => { const f = [...eventForm.formFields]; f[idx] = { ...f[idx], required: e.target.checked }; setEventForm({ ...eventForm, formFields: f }); }} className="w-3 h-3" />
                              Wajib
                            </label>
                            <input type="text" value={field.placeholder ?? ''} onChange={(e) => { const f = [...eventForm.formFields]; f[idx] = { ...f[idx], placeholder: e.target.value }; setEventForm({ ...eventForm, formFields: f }); }} placeholder="Placeholder" className="w-24 px-2 py-1 border border-gray-300 rounded text-xs" />
                            {field.type === 'select' && (
                              <input type="text" value={(field.options ?? []).join(',')} onChange={(e) => { const f = [...eventForm.formFields]; f[idx] = { ...f[idx], options: e.target.value.split(',').map(s => s.trim()) }; setEventForm({ ...eventForm, formFields: f }); }} placeholder="opt1,opt2" className="w-24 px-2 py-1 border border-gray-300 rounded text-xs" title="Comma-separated options" />
                            )}
                            <button type="button" onClick={() => { const f = eventForm.formFields.filter((_, i) => i !== idx); setEventForm({ ...eventForm, formFields: f }); }} className="text-red-400 hover:text-red-600">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      {editingEvent ? 'Update' : 'Create'} Event
                    </button>
                    <button type="button" onClick={() => setIsEventModalOpen(false)} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
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

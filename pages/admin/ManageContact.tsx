import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Search, Mail, Phone, Calendar, Eye, Trash2, Check } from 'lucide-react';
import { apiFetch } from '../../utils/storage';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'responded';
}

export function ManageContact() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch('/api/admin/content/contact-messages', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages ?? []);
        }
      } catch {
        // silently fail, show empty state
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, status: 'read' as const } : m));
    setMessages(updated);
    await apiFetch('/api/admin/content/contact-messages', {
      method: 'PUT',
      body: JSON.stringify({ messages: updated }),
    });
  };

  const handleMarkAsResponded = async (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, status: 'responded' as const } : m));
    setMessages(updated);
    await apiFetch('/api/admin/content/contact-messages', {
      method: 'PUT',
      body: JSON.stringify({ messages: updated }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    await apiFetch('/api/admin/content/contact-messages', {
      method: 'PUT',
      body: JSON.stringify({ messages: updated }),
    });
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || msg.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">New</span>;
      case 'read':
        return <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Read</span>;
      case 'responded':
        return <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Responded</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Contact Messages</h1>
        <p className="text-gray-600">Manage and respond to customer inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Messages</span>
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl">{messages.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">New</span>
            <Mail className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl text-orange-600">
            {messages.filter((m) => m.status === 'new').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Read</span>
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl text-blue-600">
            {messages.filter((m) => m.status === 'read').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Responded</span>
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl text-green-600">
            {messages.filter((m) => m.status === 'responded').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, company, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all hover:shadow-lg ${
              msg.status === 'new' ? 'border-orange-200' : 'border-gray-100'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg">{msg.name}</h3>
                  {getStatusBadge(msg.status)}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {msg.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {msg.phone}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {msg.date}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(msg.id)}
                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Company</p>
              <p className="font-medium">{msg.company}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Subject</p>
              <p className="font-medium">{msg.subject}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Message</p>
              <p className="text-gray-700">{msg.message}</p>
            </div>

            <div className="flex gap-3">
              {msg.status === 'new' && (
                <button
                  onClick={() => handleMarkAsRead(msg.id)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Mark as Read
                </button>
              )}
              {msg.status !== 'responded' && (
                <button
                  onClick={() => handleMarkAsResponded(msg.id)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Mark as Responded
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 border-2 border-gray-100 text-center">
          <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl mb-2">No messages found</h3>
          <p className="text-gray-600">
            {messages.length === 0
              ? 'No contact messages have been received yet'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      )}
    </AdminLayout>
  );
}

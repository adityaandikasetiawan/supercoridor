import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, History, HardDrive, Settings } from 'lucide-react';
import { EnterpriseLayout } from './EnterpriseLayout';
import { enterpriseApi } from './api';
import { Quote } from './types';

export function EnterpriseDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    enterpriseApi.quotes.getAll().then(setQuotes).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    submitted: quotes.filter(q => q.status === 'submitted').length,
    approved: quotes.filter(q => q.status === 'approved').length,
  };

  const actions = [
    { title: 'New Quotation', desc: 'Buat kalkulasi harga baru', icon: Calculator, link: '/enterprise/quotation', color: 'bg-purple-100 text-purple-600' },
    { title: 'History', desc: 'Lihat riwayat quotation', icon: History, link: '/enterprise/history', color: 'bg-blue-100 text-blue-600' },
    { title: 'Devices', desc: 'Kelola database perangkat', icon: HardDrive, link: '/enterprise/devices', color: 'bg-green-100 text-green-600' },
    { title: 'Config', desc: 'Atur biaya teknis', icon: Settings, link: '/enterprise/config', color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-gray-900">Solusi Enterprise</h1>
          <p className="text-gray-600">Pricing & Quotation System</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm"><p className="text-sm text-gray-500">Total Quotes</p><p className="text-2xl text-gray-900">{stats.total}</p></div>
          <div className="bg-white p-4 rounded-lg shadow-sm"><p className="text-sm text-gray-500">Draft</p><p className="text-2xl text-yellow-600">{stats.draft}</p></div>
          <div className="bg-white p-4 rounded-lg shadow-sm"><p className="text-sm text-gray-500">Submitted</p><p className="text-2xl text-blue-600">{stats.submitted}</p></div>
          <div className="bg-white p-4 rounded-lg shadow-sm"><p className="text-sm text-gray-500">Approved</p><p className="text-2xl text-green-600">{stats.approved}</p></div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((a) => (
            <Link key={a.link} to={a.link} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className={`inline-flex p-3 rounded-lg ${a.color} mb-3`}><a.icon className="w-5 h-5" /></div>
              <h3 className="font-medium text-gray-900">{a.title}</h3>
              <p className="text-sm text-gray-500">{a.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent Quotes */}
        {!loading && quotes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg text-gray-900 mb-4">Recent Quotations</h2>
            <div className="space-y-3">
              {quotes.slice(0, 5).map((q) => (
                <div key={q.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{q.namaKlien || 'Untitled'}</p>
                    <p className="text-xs text-gray-500">{q.segmen} • {q.region} • {new Date(q.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${q.status === 'approved' ? 'bg-green-100 text-green-700' : q.status === 'submitted' ? 'bg-blue-100 text-blue-700' : q.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{q.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </EnterpriseLayout>
  );
}

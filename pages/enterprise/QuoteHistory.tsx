import { useEffect, useState } from 'react';
import { EnterpriseLayout } from './EnterpriseLayout';
import { enterpriseApi } from './api';
import { Quote } from './types';
import { Trash2, Eye, Send, CheckCircle, XCircle } from 'lucide-react';

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export function EnterpriseHistory() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const loadQuotes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await enterpriseApi.quotes.getAll();
      setQuotes(Array.isArray(data) ? data : []);
    } catch {
      setError('Gagal memuat data quotation. Pastikan server berjalan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadQuotes(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this quotation?')) return;
    try {
      await enterpriseApi.quotes.remove(id);
      setQuotes(quotes.filter(q => q.id !== id));
    } catch { setError('Gagal menghapus'); }
  };

  const handleSubmit = async (id: string) => {
    try {
      const updated = await enterpriseApi.quotes.submit(id);
      setQuotes(quotes.map(q => q.id === id ? { ...q, ...updated } : q));
    } catch { setError('Gagal submit'); }
  };

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      const updated = await enterpriseApi.quotes.approve(id, approved, '');
      setQuotes(quotes.map(q => q.id === id ? { ...q, ...updated } : q));
    } catch { setError('Gagal approve/reject'); }
  };

  const getStatusColor = (s: string) => s === 'approved' ? 'bg-green-100 text-green-700' : s === 'submitted' ? 'bg-blue-100 text-blue-700' : s === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700';

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h1 className="text-2xl text-gray-900">Quote History</h1><p className="text-gray-600 text-sm">{quotes.length} quotation(s)</p></div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center"><p className="text-gray-500">Loading...</p></div>
        ) : quotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center"><p className="text-gray-500">No quotations yet. Create one from the Quotation page.</p></div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Segmen</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Region</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Harga/bln</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Actions</th>
              </tr></thead>
              <tbody className="divide-y">
                {quotes.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{q.namaKlien || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{q.segmen}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{q.region}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{q.calculation ? rp(q.calculation.hargaNetBulan) : '-'}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded ${getStatusColor(q.status)}`}>{q.status}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setSelectedQuote(q)} className="p-1 text-blue-600 hover:text-blue-700" title="View"><Eye className="w-4 h-4" /></button>
                        {q.status === 'draft' && <button onClick={() => handleSubmit(q.id)} className="p-1 text-orange-600 hover:text-orange-700" title="Submit"><Send className="w-4 h-4" /></button>}
                        {q.status === 'submitted' && <>
                          <button onClick={() => handleApprove(q.id, true)} className="p-1 text-green-600 hover:text-green-700" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => handleApprove(q.id, false)} className="p-1 text-red-600 hover:text-red-700" title="Reject"><XCircle className="w-4 h-4" /></button>
                        </>}
                        <button onClick={() => handleDelete(q.id)} className="p-1 text-red-400 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detail Modal */}
        {selectedQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl text-gray-900">{selectedQuote.namaKlien || 'Untitled Quote'}</h2>
                  <p className="text-sm text-gray-500">ID: {selectedQuote.id}</p>
                </div>
                <button onClick={() => setSelectedQuote(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div><span className="text-gray-500">Segmen:</span> <span className="font-medium">{selectedQuote.segmen}</span></div>
                <div><span className="text-gray-500">Region:</span> <span className="font-medium">{selectedQuote.region}</span></div>
                <div><span className="text-gray-500">Status:</span> <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(selectedQuote.status)}`}>{selectedQuote.status}</span></div>
                <div><span className="text-gray-500">Created:</span> <span className="font-medium">{new Date(selectedQuote.createdAt).toLocaleString()}</span></div>
              </div>

              {selectedQuote.calculation && (
                <div className="border-t pt-4">
                  <h3 className="text-lg text-gray-900 mb-3">Calculation Result</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Solution:</span><span className="font-medium">{selectedQuote.calculation.solution}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Brand:</span><span>{selectedQuote.calculation.brand}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Harga/bulan:</span><span className="font-medium text-purple-600">{rp(selectedQuote.calculation.hargaNetBulan)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Total Revenue:</span><span>{rp(selectedQuote.calculation.totalRev)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Total Cost:</span><span>{rp(selectedQuote.calculation.totalCost)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Margin:</span><span className="font-medium text-green-600">{(selectedQuote.calculation.margin * 100).toFixed(1)}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Komisi:</span><span>{rp(selectedQuote.calculation.komisiRp)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Payback:</span><span>{selectedQuote.calculation.payback} bulan</span></div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                {selectedQuote.status === 'draft' && <button onClick={() => { handleSubmit(selectedQuote.id); setSelectedQuote(null); }} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">Submit for Approval</button>}
                <button onClick={() => setSelectedQuote(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EnterpriseLayout>
  );
}

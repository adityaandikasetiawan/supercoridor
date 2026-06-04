import { useEffect, useState } from 'react';
import { EnterpriseLayout } from './EnterpriseLayout';
import { enterpriseApi } from './api';
import { Device } from './types';
import { Plus, Edit, Trash2, RotateCcw, Search, Save, Tag } from 'lucide-react';

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

interface Category {
  id: string;
  label: string;
  icon: string;
}

export function EnterpriseDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [catForm, setCatForm] = useState({ id: '', label: '', icon: '' });
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [form, setForm] = useState({
    kategori: 'internet' as string,
    segmen: 'SME' as 'SME' | 'Enterprise',
    nama: '',
    brand: '',
    userMin: 10,
    userMax: 100,
    bwMin: 0,
    bwMax: 0,
    hargaHW: 0,
    hargaBW: 0,
    budgetTier: 'Low' as string,
  });

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (kategoriFilter) params.kategori = kategoriFilter;
      if (search) params.search = search;
      const [devData, catData] = await Promise.all([
        enterpriseApi.devices.getAll(params),
        enterpriseApi.categories.getAll(),
      ]);
      setDevices(Array.isArray(devData) ? devData : []);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch {
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [kategoriFilter]);

  const handleSearch = () => load();

  const handleReset = async () => {
    if (!window.confirm('Reset semua device ke default? Data custom akan hilang.')) return;
    try {
      await enterpriseApi.devices.reset();
      setSuccess('Devices reset to default');
      setTimeout(() => setSuccess(''), 3000);
      load();
    } catch { setError('Gagal reset'); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Hapus device ini?')) return;
    try {
      await enterpriseApi.devices.remove(id);
      setDevices(devices.filter(d => d.id !== id));
    } catch { setError('Gagal menghapus'); }
  };

  const handleOpenModal = (device?: Device) => {
    setError('');
    if (device) {
      setEditingDevice(device);
      setForm({
        kategori: device.kategori,
        segmen: device.segmen,
        nama: device.nama,
        brand: device.brand,
        userMin: device.userMin,
        userMax: device.userMax,
        bwMin: device.bwMin ?? 0,
        bwMax: device.bwMax ?? 0,
        hargaHW: device.hargaHW,
        hargaBW: device.hargaBW,
        budgetTier: device.budgetTier,
      });
    } else {
      setEditingDevice(null);
      setForm({ kategori: 'internet', segmen: 'SME', nama: '', brand: '', userMin: 10, userMax: 100, bwMin: 0, bwMax: 0, hargaHW: 0, hargaBW: 0, budgetTier: 'Low' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.brand) { setError('Nama dan Brand wajib diisi'); return; }
    try {
      if (editingDevice) {
        await enterpriseApi.devices.update(editingDevice.id, form);
        setSuccess('Device updated');
      } else {
        await enterpriseApi.devices.create(form);
        setSuccess('Device created');
      }
      setTimeout(() => setSuccess(''), 3000);
      setIsModalOpen(false);
      load();
    } catch { setError('Gagal menyimpan device'); }
  };

  // Category CRUD
  const handleOpenCatModal = (cat?: Category) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({ id: cat.id, label: cat.label, icon: cat.icon });
    } else {
      setEditingCat(null);
      setCatForm({ id: '', label: '', icon: '' });
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.label) { setError('Label wajib diisi'); return; }
    try {
      if (editingCat) {
        const updated = await enterpriseApi.categories.update(editingCat.id, { label: catForm.label, icon: catForm.icon });
        setCategories(updated);
      } else {
        if (!catForm.id) { setError('ID wajib diisi'); return; }
        const updated = await enterpriseApi.categories.create({ id: catForm.id, label: catForm.label, icon: catForm.icon });
        setCategories(updated);
      }
      setSuccess('Category saved');
      setTimeout(() => setSuccess(''), 3000);
      setIsCatModalOpen(false);
    } catch { setError('Gagal menyimpan category'); }
  };

  const handleDeleteCat = async (id: string) => {
    if (!window.confirm(`Hapus category "${id}"? Device dengan kategori ini tidak akan terhapus.`)) return;
    try {
      const updated = await enterpriseApi.categories.remove(id);
      setCategories(updated);
    } catch { setError('Gagal menghapus category'); }
  };

  const getCatLabel = (id: string) => categories.find(c => c.id === id)?.label ?? id;

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h1 className="text-2xl text-gray-900">Device Database</h1><p className="text-gray-600 text-sm">{devices.length} devices</p></div>
          <div className="flex gap-2">
            <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"><RotateCcw className="w-4 h-4" /> Reset</button>
            <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"><Plus className="w-4 h-4" /> Add Device</button>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">{success}</div>}

        {/* Filters */}
        <div className="flex gap-3">
          <select value={kategoriFilter} onChange={e => setKategoriFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <div className="flex-1 flex gap-2">
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search devices..." className="flex-1 px-3 py-2 border rounded-lg text-sm" />
            <button onClick={handleSearch} className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"><Search className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Categories Management */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg text-gray-900 flex items-center gap-2"><Tag className="w-5 h-5 text-purple-600" /> Categories</h2>
            <button onClick={() => handleOpenCatModal()} className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm group">
                <span className="text-gray-700">{cat.label}</span>
                <button onClick={() => handleOpenCatModal(cat)} className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"><Edit className="w-3 h-3" /></button>
                <button onClick={() => handleDeleteCat(cat.id)} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="px-3 py-2 text-left text-xs text-gray-500">Kategori</th>
              <th className="px-3 py-2 text-left text-xs text-gray-500">Nama</th>
              <th className="px-3 py-2 text-left text-xs text-gray-500">Brand</th>
              <th className="px-3 py-2 text-left text-xs text-gray-500">Segmen</th>
              <th className="px-3 py-2 text-right text-xs text-gray-500">Harga HW</th>
              <th className="px-3 py-2 text-right text-xs text-gray-500">Harga BW</th>
              <th className="px-3 py-2 text-center text-xs text-gray-500">Users</th>
              <th className="px-3 py-2 text-center text-xs text-gray-500">Tier</th>
              <th className="px-3 py-2 text-center text-xs text-gray-500">Actions</th>
            </tr></thead>
            <tbody className="divide-y">
              {devices.map(d => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-600">{getCatLabel(d.kategori)}</td>
                  <td className="px-3 py-2 text-gray-900 font-medium">{d.nama}</td>
                  <td className="px-3 py-2 text-gray-600">{d.brand}</td>
                  <td className="px-3 py-2"><span className={`text-xs px-2 py-0.5 rounded ${d.segmen === 'Enterprise' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{d.segmen}</span></td>
                  <td className="px-3 py-2 text-right text-gray-900">{d.hargaHW ? rp(d.hargaHW) : '-'}</td>
                  <td className="px-3 py-2 text-right text-gray-900">{d.hargaBW ? rp(d.hargaBW) : '-'}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{d.userMin}-{d.userMax}</td>
                  <td className="px-3 py-2 text-center"><span className={`text-xs px-1.5 py-0.5 rounded ${d.budgetTier === 'High' ? 'bg-red-100 text-red-700' : d.budgetTier === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{d.budgetTier}</span></td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => handleOpenModal(d)} className="p-1 text-blue-600 hover:text-blue-700"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(d.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="p-4 text-center text-gray-500">Loading...</p>}
          {!loading && devices.length === 0 && <p className="p-4 text-center text-gray-500">No devices found</p>}
        </div>

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">{editingDevice ? 'Edit Device' : 'Add New Device'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Kategori *</label>
                      <select value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Segmen *</label>
                      <select value={form.segmen} onChange={e => setForm({...form, segmen: e.target.value as 'SME'|'Enterprise'})} className="w-full px-3 py-2 border rounded-lg text-sm">
                        <option>SME</option><option>Enterprise</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Nama Device *</label>
                    <input value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Fortinet FortiGate 60F" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Brand *</label>
                      <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Fortinet" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Budget Tier</label>
                      <select value={form.budgetTier} onChange={e => setForm({...form, budgetTier: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">User Min</label>
                      <input type="number" value={form.userMin} onChange={e => setForm({...form, userMin: +e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">User Max</label>
                      <input type="number" value={form.userMax} onChange={e => setForm({...form, userMax: +e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">BW Min (Mbps)</label>
                      <input type="number" value={form.bwMin} onChange={e => setForm({...form, bwMin: +e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">BW Max (Mbps)</label>
                      <input type="number" value={form.bwMax} onChange={e => setForm({...form, bwMax: +e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Harga Hardware (Rp)</label>
                      <input type="number" value={form.hargaHW} onChange={e => setForm({...form, hargaHW: +e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Harga Bandwidth (Rp/bln)</label>
                      <input type="number" value={form.hargaBW} onChange={e => setForm({...form, hargaBW: +e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm">
                      <Save className="w-4 h-4" /> {editingDevice ? 'Update' : 'Create'} Device
                    </button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Category Modal */}
        {isCatModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">{editingCat ? 'Edit Category' : 'Add New Category'}</h2>
                <form onSubmit={handleSaveCat} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Category ID {!editingCat && '*'}</label>
                    <input value={catForm.id} onChange={e => setCatForm({...catForm, id: e.target.value})} disabled={!!editingCat} className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-100" placeholder="e.g. ups, rack, cable" required={!editingCat} />
                    {!editingCat && <p className="text-xs text-gray-500 mt-1">Lowercase, no spaces (used as internal key)</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Label *</label>
                    <input value={catForm.label} onChange={e => setCatForm({...catForm, label: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. UPS, Rack, Cable" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Icon (upload gambar atau nama Lucide icon)</label>
                    <div className="space-y-2">
                      <input value={catForm.icon} onChange={e => setCatForm({...catForm, icon: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Battery, Box, atau upload gambar" />
                      <div className="flex items-center gap-2">
                        <input type="file" accept="image/*" className="text-xs" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('image', file);
                          try {
                            const res = await fetch('/api/admin/upload-image', { method: 'POST', body: formData, credentials: 'include' });
                            if (res.ok) { const data = await res.json(); setCatForm({...catForm, icon: data.url}); }
                          } catch { /* ignore */ }
                        }} />
                        {catForm.icon && catForm.icon.startsWith('/') && <img src={catForm.icon} alt="icon" className="w-8 h-8 object-contain rounded" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm">{editingCat ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => setIsCatModalOpen(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </EnterpriseLayout>
  );
}

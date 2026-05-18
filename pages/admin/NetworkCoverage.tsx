import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Save, Plus, Map } from 'lucide-react';
import { apiFetch } from '../../utils/storage';
import { ImageUpload } from '../../components/ImageUpload';

interface CoverageCity {
  id: string;
  name: string;
  province: string;
  pops: number;
  status: 'active' | 'coming-soon';
}

interface CoverageData {
  title: string;
  description: string;
  totalPops: number;
  totalCities: number;
  cities: CoverageCity[];
}

export function AdminNetworkCoverage() {
  const [coverageData, setCoverageData] = useState({
    title: 'Network Coverage',
    description: 'SuperCorridor network spans across major cities in Indonesia',
    totalPops: 150,
    totalCities: 50,
    mapEmbedUrl: '',
    mapImage: '',
    mapApiKey: '',
  });

  const [cities, setCities] = useState<CoverageCity[]>([
    { id: '1', name: 'Jakarta', province: 'DKI Jakarta', pops: 25, status: 'active' },
    { id: '2', name: 'Surabaya', province: 'Jawa Timur', pops: 15, status: 'active' },
    { id: '3', name: 'Bandung', province: 'Jawa Barat', pops: 12, status: 'active' },
    { id: '4', name: 'Medan', province: 'Sumatera Utara', pops: 10, status: 'active' },
    { id: '5', name: 'Semarang', province: 'Jawa Tengah', pops: 8, status: 'active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CoverageCity | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const [cityForm, setCityForm] = useState({
    name: '',
    province: '',
    pops: 1,
    status: 'active' as 'active' | 'coming-soon',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch('/api/admin/content/network-coverage', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          if (data.networkCoverage) {
            const nc = data.networkCoverage as CoverageData & { mapEmbedUrl?: string; mapImage?: string; mapApiKey?: string };
            setCoverageData({
              title: nc.title,
              description: nc.description,
              totalPops: nc.totalPops,
              totalCities: nc.totalCities,
              mapEmbedUrl: nc.mapEmbedUrl ?? '',
              mapImage: nc.mapImage ?? '',
              mapApiKey: nc.mapApiKey ?? '',
            });
            if (nc.cities) setCities(nc.cities);
          }
        }
      } catch {
        // use defaults
      }
    };
    void load();
  }, []);

  const saveToServer = async (generalData: typeof coverageData, cityData: CoverageCity[]) => {
    const payload = {
      networkCoverage: {
        ...generalData,
        cities: cityData,
      },
    };
    const response = await apiFetch('/api/admin/content/network-coverage', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return response.ok;
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await saveToServer(coverageData, cities);
    if (ok) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleOpenModal = (city?: CoverageCity) => {
    if (city) {
      setEditingCity(city);
      setCityForm(city);
    } else {
      setEditingCity(null);
      setCityForm({ name: '', province: '', pops: 1, status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmitCity = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedCities: CoverageCity[];
    if (editingCity) {
      updatedCities = cities.map((c) => (c.id === editingCity.id ? { ...cityForm, id: c.id } : c));
    } else {
      updatedCities = [...cities, { ...cityForm, id: Date.now().toString() }];
    }
    setCities(updatedCities);
    setIsModalOpen(false);
    await saveToServer(coverageData, updatedCities);
  };

  const handleDeleteCity = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      const updatedCities = cities.filter((c) => c.id !== id);
      setCities(updatedCities);
      await saveToServer(coverageData, updatedCities);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl text-gray-900">Network Coverage Management</h1>
          <p className="text-gray-600 mt-1">Manage network coverage and PoPs</p>
        </div>

        {isSaved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Changes saved successfully!
          </div>
        )}

        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">General Information</h2>
          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Page Title</label>
              <input
                type="text"
                value={coverageData.title}
                onChange={(e) => setCoverageData({ ...coverageData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Description</label>
              <textarea
                value={coverageData.description}
                onChange={(e) =>
                  setCoverageData({ ...coverageData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Total PoPs</label>
                <input
                  type="number"
                  value={coverageData.totalPops}
                  onChange={(e) =>
                    setCoverageData({ ...coverageData, totalPops: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Total Cities</label>
                <input
                  type="number"
                  value={coverageData.totalCities}
                  onChange={(e) =>
                    setCoverageData({ ...coverageData, totalCities: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save General Info
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
            <Map className="w-5 h-5 text-orange-600" /> Coverage Map
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Google Maps Embed URL</label>
              <input
                type="url"
                value={coverageData.mapEmbedUrl}
                onChange={(e) => setCoverageData({ ...coverageData, mapEmbedUrl: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Paste the embed URL from Google Maps (Share → Embed a map → copy src URL)</p>
            </div>
            {coverageData.mapEmbedUrl && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={coverageData.mapEmbedUrl}
                  title="Coverage Map Preview"
                  className="w-full h-64"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Google Maps API Key (for interactive map)</label>
              <input
                type="text"
                value={coverageData.mapApiKey}
                onChange={(e) => setCoverageData({ ...coverageData, mapApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Optional: For interactive JavaScript map on the public page</p>
            </div>
            <div>
              <ImageUpload
                value={coverageData.mapImage}
                onChange={(url) => setCoverageData({ ...coverageData, mapImage: url })}
                label="Static Map Image (fallback)"
                previewClassName="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">Upload a static coverage map image as fallback when embed is not available</p>
            </div>
            <button
              onClick={async () => {
                const ok = await saveToServer(coverageData, cities);
                if (ok) { setIsSaved(true); setTimeout(() => setIsSaved(false), 3000); }
              }}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Map Settings
            </button>
          </div>
        </div>

        {/* Cities List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-gray-900">Coverage Cities</h2>
            <button
              onClick={() => handleOpenModal()}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add City
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Province</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">PoPs</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cities.map((city) => (
                  <tr key={city.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><div className="text-sm text-gray-900">{city.name}</div></td>
                    <td className="px-6 py-4"><div className="text-sm text-gray-600">{city.province}</div></td>
                    <td className="px-6 py-4"><div className="text-sm text-gray-900">{city.pops}</div></td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded ${city.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {city.status === 'active' ? 'Active' : 'Coming Soon'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenModal(city)} className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                        <button onClick={() => handleDeleteCity(city.id)} className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* City Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">{editingCity ? 'Edit City' : 'Add New City'}</h2>
                <form onSubmit={handleSubmitCity} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">City Name</label>
                    <input type="text" value={cityForm.name} onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Province</label>
                    <input type="text" value={cityForm.province} onChange={(e) => setCityForm({ ...cityForm, province: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Number of PoPs</label>
                    <input type="number" value={cityForm.pops} onChange={(e) => setCityForm({ ...cityForm, pops: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" min="1" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Status</label>
                    <select value={cityForm.status} onChange={(e) => setCityForm({ ...cityForm, status: e.target.value as 'active' | 'coming-soon' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="active">Active</option>
                      <option value="coming-soon">Coming Soon</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">{editingCity ? 'Update' : 'Add'} City</button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
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

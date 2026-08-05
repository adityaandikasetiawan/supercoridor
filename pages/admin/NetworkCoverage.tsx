import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Save, Plus, Map, MapPin, Route, List } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../../utils/storage';
import { ImageUpload } from '../../components/ImageUpload';
import { GradientPicker } from '../../components/GradientPicker';
import { MapPinEditor } from '../../components/admin/MapPinEditor';
import { RouteEditor, LegendEditor } from '../../components/admin/RouteEditor';
import type { MapCity, NetworkRoute, LegendItem } from '../../components/InteractiveNetworkMap';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoverageCity extends MapCity {
  // MapCity already has all fields; this alias keeps naming consistent
}

interface CoverageData {
  title: string;
  description: string;
  totalPops: number;
  totalCities: number;
  mapEmbedUrl: string;
  mapImage: string;
  mapApiKey: string;
}


// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_CITIES: CoverageCity[] = [
  { id: '1', name: 'Jakarta', province: 'DKI Jakarta', pops: 25, status: 'active' },
  { id: '2', name: 'Surabaya', province: 'Jawa Timur', pops: 15, status: 'active' },
  { id: '3', name: 'Bandung', province: 'Jawa Barat', pops: 12, status: 'active' },
  { id: '4', name: 'Medan', province: 'Sumatera Utara', pops: 10, status: 'active' },
  { id: '5', name: 'Semarang', province: 'Jawa Tengah', pops: 8, status: 'active' },
];

const DEFAULT_STATS = [
  { id: '1', value: '50+', label: 'Cities Covered', color: 'orange' },
  { id: '2', value: '150+', label: 'Points of Presence', color: 'blue' },
  { id: '3', value: '99.99%', label: 'Network Uptime', color: 'green' },
];

const DEFAULT_INFRA = [
  { id: '1', title: 'Fiber-Optic Backbone', color: 'orange', items: ['Dense Wave Division Multiplexing (DWDM) technology', 'Multiple redundant paths for high availability', 'Geographic diversity for disaster resilience'] },
  { id: '2', title: 'Data Centers', color: 'blue', items: ['Tier III certified facilities in major cities', '24/7 physical and network security', 'Redundant power and cooling systems'] },
  { id: '3', title: 'Internet Exchanges', color: 'green', items: ['Direct peering with major content providers', 'Connections to international submarine cables', 'Low-latency access to global networks'] },
  { id: '4', title: 'Network Operations', color: 'orange', items: ['24/7 Network Operations Center (NOC)', 'Proactive monitoring and incident response', 'Rapid fault detection and resolution'] },
];

const DEFAULT_LEGEND: LegendItem[] = [
  { id: '1', label: 'Progress Subsea', lineType: 'solid', color: '#EAB308' },
  { id: '2', label: 'Existing Inland', lineType: 'solid', color: '#3B82F6' },
  { id: '3', label: 'Existing Subsea', lineType: 'solid', color: '#60A5FA' },
  { id: '4', label: 'Plan Inland', lineType: 'dashed', color: '#F97316' },
  { id: '5', label: 'Plan Subsea', lineType: 'dashed', color: '#93C5FD' },
];


// ─── Component ────────────────────────────────────────────────────────────────

export function AdminNetworkCoverage() {
  // General info
  const [coverageData, setCoverageData] = useState<CoverageData>({
    title: 'Network Coverage',
    description: 'SuperCorridor network spans across major cities in Indonesia',
    totalPops: 150,
    totalCities: 50,
    mapEmbedUrl: '',
    mapImage: '',
    mapApiKey: '',
  });

  // Cities / pins
  const [cities, setCities] = useState<CoverageCity[]>(DEFAULT_CITIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CoverageCity | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Stats & infrastructure (existing)
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [infrastructure, setInfrastructure] = useState(DEFAULT_INFRA);

  // NEW: routes & legend
  const [routes, setRoutes] = useState<NetworkRoute[]>([]);
  const [legend, setLegend] = useState<LegendItem[]>(DEFAULT_LEGEND);

  // Page header
  const [heroTitle, setHeroTitle] = useState('Network & Coverage');
  const [heroSubtitle, setHeroSubtitle] = useState('Extensive fiber-optic infrastructure spanning across 50+ cities, connecting your business to the digital world.');
  const [heroGradient, setHeroGradient] = useState('green');

  // City form
  const [cityForm, setCityForm] = useState({ name: '', province: '', pops: 1, status: 'active' as 'active' | 'coming-soon' });

  // Active tab for map section
  const [mapTab, setMapTab] = useState<'source' | 'pins' | 'routes' | 'legend' | 'area-detail'>('source');


  // ── Load from API ──────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch('/api/admin/content/network-coverage', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          if (data.networkCoverage) {
            const nc = data.networkCoverage as CoverageData & {
              cities?: CoverageCity[];
              stats?: typeof stats;
              infrastructure?: typeof infrastructure;
              routes?: NetworkRoute[];
              legend?: LegendItem[];
            };
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
            if (nc.stats) setStats(nc.stats);
            if (nc.infrastructure) setInfrastructure(nc.infrastructure);
            if (nc.routes) setRoutes(nc.routes);
            if (nc.legend) setLegend(nc.legend);
          }
        }
        // Load page header
        const headerRes = await apiFetch('/api/admin/content/pages/page-network-coverage', { method: 'GET' });
        if (headerRes.ok) {
          const headerData = await headerRes.json();
          if (headerData.data?.heroTitle) setHeroTitle(headerData.data.heroTitle);
          if (headerData.data?.heroSubtitle) setHeroSubtitle(headerData.data.heroSubtitle);
          if (headerData.data?.heroGradient) setHeroGradient(headerData.data.heroGradient);
        }
      } catch {
        // use defaults
      }
    };
    void load();
  }, []);

  // ── Save to API ────────────────────────────────────────────────────────────

  const saveToServer = async (generalData: CoverageData, cityData: CoverageCity[]) => {
    const payload = {
      networkCoverage: {
        ...generalData,
        cities: cityData,
        stats,
        infrastructure,
        routes,
        legend,
      },
    };
    const response = await apiFetch('/api/admin/content/network-coverage', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      toast.success('Berhasil disimpan!');
    } else {
      toast.error('Gagal menyimpan. Coba lagi.');
    }
    return response.ok;
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await saveToServer(coverageData, cities);
    if (ok) { setIsSaved(true); setTimeout(() => setIsSaved(false), 3000); }
  };

  const handleSaveMap = async () => {
    const ok = await saveToServer(coverageData, cities);
    if (ok) { setIsSaved(true); setTimeout(() => setIsSaved(false), 3000); }
  };


  // ── City helpers ───────────────────────────────────────────────────────────

  const handleOpenModal = (city?: CoverageCity) => {
    if (city) {
      setEditingCity(city);
      setCityForm({ name: city.name, province: city.province, pops: city.pops, status: city.status });
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
      updatedCities = cities.map((c) =>
        c.id === editingCity.id ? { ...c, ...cityForm } : c
      );
    } else {
      updatedCities = [...cities, { ...cityForm, id: Date.now().toString() }];
    }
    setCities(updatedCities);
    setIsModalOpen(false);
    await saveToServer(coverageData, updatedCities);
  };

  const handleDeleteCity = async (id: string) => {
    if (window.confirm('Hapus kota ini?')) {
      const updated = cities.filter((c) => c.id !== id);
      setCities(updated);
      await saveToServer(coverageData, updated);
    }
  };

  // Update city fields from MapPinEditor
  const handleUpdateCityPin = (cityId: string, updates: Partial<MapCity>) => {
    setCities((prev) =>
      prev.map((c) => (c.id === cityId ? { ...c, ...updates } : c))
    );
  };

  // Add city from MapPinEditor
  const handleAddCityPin = (city: Omit<MapCity, 'id'>) => {
    const newCity: CoverageCity = { ...city, id: Date.now().toString() };
    const updated = [...cities, newCity];
    setCities(updated);
    void saveToServer(coverageData, updated);
  };

  // Delete city from MapPinEditor
  const handleDeleteCityPin = (cityId: string) => {
    const updated = cities.filter((c) => c.id !== cityId);
    setCities(updated);
    void saveToServer(coverageData, updated);
  };


  // ── Render ─────────────────────────────────────────────────────────────────

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

        {/* ── Page Header ── */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-900">Page Header</h2>
            <button onClick={async () => {
              const res = await apiFetch('/api/admin/content/pages/page-network-coverage', {
                method: 'PUT',
                body: JSON.stringify({ data: { heroTitle, heroSubtitle, heroGradient } }),
              });
              if (res.ok) toast.success('Page header berhasil disimpan!');
              else toast.error('Gagal menyimpan page header.');
            }} className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Save Header
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Hero Title</label>
              <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Hero Subtitle</label>
              <input type="text" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
          </div>
          <div className="mt-3">
            <GradientPicker value={heroGradient} onChange={setHeroGradient} />
          </div>
        </div>

        {/* ── General Settings ── */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4">General Information</h2>
          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Page Title</label>
              <input type="text" value={coverageData.title}
                onChange={(e) => setCoverageData({ ...coverageData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Description</label>
              <textarea value={coverageData.description}
                onChange={(e) => setCoverageData({ ...coverageData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Total PoPs</label>
                <input type="number" value={coverageData.totalPops}
                  onChange={(e) => setCoverageData({ ...coverageData, totalPops: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Total Cities</label>
                <input type="number" value={coverageData.totalCities}
                  onChange={(e) => setCoverageData({ ...coverageData, totalCities: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
            </div>
            <button type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
              <Save className="w-5 h-5 mr-2" /> Save General Info
            </button>
          </form>
        </div>


        {/* ── Coverage Map (tabbed) ── */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
            <Map className="w-5 h-5 text-orange-600" /> Coverage Map
          </h2>

          {/* Tab bar */}
          <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200">
            {([
              { key: 'source',      label: 'Sumber Peta',    icon: Map },
              { key: 'pins',        label: 'Pin Kota',       icon: MapPin },
              { key: 'routes',      label: 'Jalur Kabel',    icon: Route },
              { key: 'legend',      label: 'Legend',         icon: List },
              { key: 'area-detail', label: 'Coverage Detail', icon: MapPin },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMapTab(key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-t-lg transition-colors -mb-px border border-b-0 ${
                  mapTab === key
                    ? 'bg-white border-gray-200 text-orange-600 font-medium'
                    : 'bg-gray-50 border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab: Sumber Peta */}
          {mapTab === 'source' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Google Maps Embed URL</label>
                <input type="url" value={coverageData.mapEmbedUrl}
                  onChange={(e) => setCoverageData({ ...coverageData, mapEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                <p className="text-xs text-gray-500 mt-1">Share → Embed a map → copy src URL</p>
              </div>
              {coverageData.mapEmbedUrl && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe src={coverageData.mapEmbedUrl} title="Coverage Map Preview"
                    className="w-full h-64" style={{ border: 0 }} allowFullScreen loading="lazy" />
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Google Maps API Key</label>
                <input type="text" value={coverageData.mapApiKey}
                  onChange={(e) => setCoverageData({ ...coverageData, mapApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <div>
                <ImageUpload value={coverageData.mapImage}
                  onChange={(url) => setCoverageData({ ...coverageData, mapImage: url })}
                  label="Gambar Peta (background untuk Interactive Map)"
                  previewClassName="w-full h-48 object-cover rounded-lg" />
                <p className="text-xs text-gray-500 mt-1">
                  Upload gambar peta untuk mengaktifkan Interactive Animated Map. Setelah upload, atur Pin Kota dan Jalur Kabel di tab masing-masing.
                </p>
              </div>
              <button onClick={handleSaveMap}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
                <Save className="w-5 h-5 mr-2" /> Save Map Settings
              </button>
            </div>
          )}

          {/* Tab: Pin Kota */}
          {mapTab === 'pins' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Atur posisi setiap kota di atas peta. Mode <strong>Set Posisi</strong>: pilih kota lalu klik di peta.
              </p>
              <MapPinEditor
                mapImage={coverageData.mapImage}
                cities={cities}
                onUpdateCity={handleUpdateCityPin}
                onAddCity={handleAddCityPin}
                onDeleteCity={handleDeleteCityPin}
              />
              <button onClick={handleSaveMap}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
                <Save className="w-5 h-5 mr-2" /> Simpan Pin Positions
              </button>
            </div>
          )}

          {/* Tab: Jalur Kabel */}
          {mapTab === 'routes' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Tambah jalur kabel antar kota. Gunakan Waypoints untuk membuat jalur yang mengikuti kontur pulau.
              </p>
              <RouteEditor
                cities={cities}
                routes={routes}
                onRoutesChange={setRoutes}
              />
              <button onClick={handleSaveMap}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
                <Save className="w-5 h-5 mr-2" /> Simpan Routes
              </button>
            </div>
          )}

          {/* Tab: Legend */}
          {mapTab === 'legend' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Kelola keterangan warna yang tampil di bawah peta interaktif.
              </p>
              <LegendEditor legend={legend} onLegendChange={setLegend} />
              <button onClick={handleSaveMap}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
                <Save className="w-5 h-5 mr-2" /> Simpan Legend
              </button>
            </div>
          )}

          {/* Tab: Coverage Area Detail */}
          {mapTab === 'area-detail' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Detail info setiap kota yang muncul di sidebar kiri peta publik saat diklik. Atur nama, provinsi, PoPs, status, dan tipe koneksi.
              </p>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Kota</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Provinsi</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">PoPs</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Koneksi</th>
                      <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Pin di Peta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cities.map((city) => (
                      <tr key={city.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white shadow"
                              style={{ backgroundColor: city.iconColor === 'red' ? '#EF4444' : city.iconColor === 'yellow' ? '#EAB308' : city.iconColor === 'blue' ? '#3B82F6' : city.iconColor === 'green' ? '#22C55E' : '#FFFFFF' }} />
                            <span className="font-medium text-gray-900">{city.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{city.province}</td>
                        <td className="px-4 py-3 text-gray-900 font-medium">{city.pops}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${city.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {city.status === 'active' ? '✅ Active' : '⏳ Coming Soon'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-600 capitalize">
                            {city.connectionType === 'both' ? 'Inland + Subsea' : city.connectionType ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {city.x !== undefined
                            ? <span className="text-xs text-blue-600 font-mono">({city.x}%, {city.y}%)</span>
                            : <span className="text-xs text-gray-400 italic">Belum dipasang</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                <p className="font-medium mb-1">💡 Cara edit detail kota:</p>
                <ul className="space-y-1 text-xs list-disc list-inside">
                  <li>Klik tab <strong>Pin Kota</strong> → ikon ✏️ untuk edit nama, provinsi, PoPs, status, warna, koneksi</li>
                  <li>Klik ikon 🎯 (crosshair) untuk set/update posisi pin di peta</li>
                  <li>Klik ikon 🔄 untuk reset posisi pin</li>
                  <li>Klik ikon 🗑️ untuk hapus kota</li>
                </ul>
              </div>

              <button onClick={handleSaveMap}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
                <Save className="w-5 h-5 mr-2" /> Simpan Coverage Detail
              </button>
            </div>
          )}
        </div>


        {/* ── Stats Cards ── */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-gray-900">Stats Cards</h2>
            <button type="button"
              onClick={() => setStats([...stats, { id: Date.now().toString(), value: '', label: '', color: 'orange' }])}
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Stat
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={stat.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">Stat {index + 1}</span>
                  <button type="button" onClick={() => setStats(stats.filter((_, i) => i !== index))}
                    className="text-xs text-red-500 hover:text-red-700">Delete</button>
                </div>
                <div className="space-y-2">
                  <input type="text" value={stat.value}
                    onChange={(e) => { const u = [...stats]; u[index] = { ...u[index], value: e.target.value }; setStats(u); }}
                    placeholder="e.g. 50+" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <input type="text" value={stat.label}
                    onChange={(e) => { const u = [...stats]; u[index] = { ...u[index], label: e.target.value }; setStats(u); }}
                    placeholder="e.g. Cities Covered" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <select value={stat.color}
                    onChange={(e) => { const u = [...stats]; u[index] = { ...u[index], color: e.target.value }; setStats(u); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="orange">Orange</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => saveToServer(coverageData, cities)}
            className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center">
            <Save className="w-4 h-4 mr-2" /> Save Stats
          </button>
        </div>

        {/* ── Infrastructure Cards ── */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-gray-900">Network Infrastructure Cards</h2>
            <button type="button"
              onClick={() => setInfrastructure([...infrastructure, { id: Date.now().toString(), title: '', color: 'orange', items: [''] }])}
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Card
            </button>
          </div>
          <div className="space-y-4">
            {infrastructure.map((card, cardIdx) => (
              <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">Card {cardIdx + 1}</span>
                  <button type="button" onClick={() => setInfrastructure(infrastructure.filter((_, i) => i !== cardIdx))}
                    className="text-xs text-red-500 hover:text-red-700">Delete Card</button>
                </div>
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <input type="text" value={card.title}
                    onChange={(e) => { const u = [...infrastructure]; u[cardIdx] = { ...u[cardIdx], title: e.target.value }; setInfrastructure(u); }}
                    placeholder="Card Title" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <select value={card.color}
                    onChange={(e) => { const u = [...infrastructure]; u[cardIdx] = { ...u[cardIdx], color: e.target.value }; setInfrastructure(u); }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="orange">Orange</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                  </select>
                </div>
                <div className="space-y-2">
                  {card.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex gap-2">
                      <input type="text" value={item}
                        onChange={(e) => { const u = [...infrastructure]; const items = [...u[cardIdx].items]; items[itemIdx] = e.target.value; u[cardIdx] = { ...u[cardIdx], items }; setInfrastructure(u); }}
                        placeholder="List item" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <button type="button"
                        onClick={() => { const u = [...infrastructure]; u[cardIdx] = { ...u[cardIdx], items: u[cardIdx].items.filter((_, i) => i !== itemIdx) }; setInfrastructure(u); }}
                        className="text-red-400 hover:text-red-600 text-sm px-2">✕</button>
                    </div>
                  ))}
                  <button type="button"
                    onClick={() => { const u = [...infrastructure]; u[cardIdx] = { ...u[cardIdx], items: [...u[cardIdx].items, ''] }; setInfrastructure(u); }}
                    className="text-xs text-blue-600 hover:text-blue-700">+ Add Item</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => saveToServer(coverageData, cities)}
            className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center">
            <Save className="w-4 h-4 mr-2" /> Save Infrastructure
          </button>
        </div>


        {/* ── Coverage Cities table ── */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-gray-900">Coverage Cities</h2>
            <button onClick={() => handleOpenModal()}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
              <Plus className="w-5 h-5 mr-2" /> Add City
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Province</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">PoPs</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Pin</th>
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
                      <span className={`text-xs px-2 py-1 rounded ${city.x !== undefined ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {city.x !== undefined ? `${city.x}%, ${city.y}%` : 'Belum dipasang'}
                      </span>
                    </td>
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

        {/* ── City Modal ── */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="p-6">
                <h2 className="text-xl text-gray-900 mb-4">{editingCity ? 'Edit City' : 'Add New City'}</h2>
                <form onSubmit={handleSubmitCity} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">City Name</label>
                    <input type="text" value={cityForm.name}
                      onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Province</label>
                    <input type="text" value={cityForm.province}
                      onChange={(e) => setCityForm({ ...cityForm, province: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Number of PoPs</label>
                    <input type="number" value={cityForm.pops}
                      onChange={(e) => setCityForm({ ...cityForm, pops: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" min="1" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Status</label>
                    <select value={cityForm.status}
                      onChange={(e) => setCityForm({ ...cityForm, status: e.target.value as 'active' | 'coming-soon' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="active">Active</option>
                      <option value="coming-soon">Coming Soon</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit"
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      {editingCity ? 'Update' : 'Add'} City
                    </button>
                    <button type="button" onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
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

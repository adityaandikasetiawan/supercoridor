import { useRef, useState } from 'react';
import { Crosshair, RotateCcw, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import type { MapCity } from '../InteractiveNetworkMap';

interface MapPinEditorProps {
  mapImage: string;
  cities: MapCity[];
  onUpdateCity: (cityId: string, updates: Partial<MapCity>) => void;
  onAddCity: (city: Omit<MapCity, 'id'>) => void;
  onDeleteCity: (cityId: string) => void;
}

const ICON_COLORS: { value: MapCity['iconColor']; label: string; hex: string }[] = [
  { value: 'red',    label: 'Merah',  hex: '#EF4444' },
  { value: 'yellow', label: 'Kuning', hex: '#EAB308' },
  { value: 'blue',   label: 'Biru',   hex: '#3B82F6' },
  { value: 'green',  label: 'Hijau',  hex: '#22C55E' },
  { value: 'white',  label: 'Putih',  hex: '#FFFFFF' },
];

const CONNECTION_TYPES: { value: MapCity['connectionType']; label: string }[] = [
  { value: 'inland', label: 'Inland' },
  { value: 'subsea', label: 'Subsea' },
  { value: 'both',   label: 'Inland + Subsea' },
];

const EMPTY_FORM = {
  name: '', province: '', pops: 1,
  status: 'active' as MapCity['status'],
  iconColor: 'red' as MapCity['iconColor'],
  connectionType: 'inland' as MapCity['connectionType'],
  x: undefined as number | undefined,
  y: undefined as number | undefined,
};

export function MapPinEditor({ mapImage, cities, onUpdateCity, onAddCity, onDeleteCity }: MapPinEditorProps) {
  const [mode, setMode]               = useState<'view' | 'set-position' | 'add'>('view');
  const [selectedCityId, setSelectedCityId] = useState<string>(cities[0]?.id ?? '');
  const [editingCityId, setEditingCityId]   = useState<string | null>(null);
  const [editForm, setEditForm]   = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [addForm,  setAddForm]    = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [pendingAdd, setPendingAdd] = useState(false); // waiting for map click to set x/y for new city
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCity = cities.find((c) => c.id === selectedCityId);

  // ── Map click handler ──────────────────────────────────────────────────────
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
    const y = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));

    if (mode === 'set-position' && selectedCityId) {
      onUpdateCity(selectedCityId, { x, y });
    } else if (pendingAdd) {
      setAddForm((f) => ({ ...f, x, y }));
      setPendingAdd(false);
    }
  };

  // ── Confirm add ────────────────────────────────────────────────────────────
  const handleConfirmAdd = () => {
    if (!addForm.name.trim() || !addForm.province.trim()) return;
    onAddCity({
      name: addForm.name.trim(),
      province: addForm.province.trim(),
      pops: addForm.pops,
      status: addForm.status ?? 'active',
      iconColor: addForm.iconColor ?? 'red',
      connectionType: addForm.connectionType ?? 'inland',
      x: addForm.x,
      y: addForm.y,
    });
    setAddForm({ ...EMPTY_FORM });
    setMode('view');
    setPendingAdd(false);
  };

  // ── Start edit ─────────────────────────────────────────────────────────────
  const startEdit = (city: MapCity) => {
    setEditingCityId(city.id);
    setEditForm({
      name: city.name,
      province: city.province,
      pops: city.pops,
      status: city.status,
      iconColor: city.iconColor ?? 'red',
      connectionType: city.connectionType ?? 'inland',
      x: city.x,
      y: city.y,
    });
  };

  const confirmEdit = () => {
    if (!editingCityId) return;
    onUpdateCity(editingCityId, {
      name: editForm.name.trim(),
      province: editForm.province.trim(),
      pops: editForm.pops,
      status: editForm.status,
      iconColor: editForm.iconColor,
      connectionType: editForm.connectionType,
    });
    setEditingCityId(null);
  };

  const cancelEdit = () => setEditingCityId(null);

  const isCursorActive = mode === 'set-position' || pendingAdd;

  return (
    <div className="space-y-4">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={() => { setMode('view'); setPendingAdd(false); }}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${mode === 'view' && !pendingAdd ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'}`}>
            View
          </button>
          <button type="button" onClick={() => { setMode('set-position'); setPendingAdd(false); }}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors flex items-center gap-1.5 ${mode === 'set-position' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'}`}>
            <Crosshair className="w-3.5 h-3.5" /> Set Posisi
          </button>
          <button type="button" onClick={() => { setMode('add'); setPendingAdd(false); setAddForm({ ...EMPTY_FORM }); }}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors flex items-center gap-1.5 ${mode === 'add' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}>
            <Plus className="w-3.5 h-3.5" /> Tambah Kota
          </button>
        </div>

        {mode === 'set-position' && (
          <select value={selectedCityId} onChange={(e) => setSelectedCityId(e.target.value)}
            className="flex-1 min-w-0 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500">
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}{city.x !== undefined ? ` (${city.x}%, ${city.y}%)` : ' — belum dipasang'}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ── Info banner ── */}
      {mode === 'set-position' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-sm text-orange-700 flex items-center gap-2">
          <Crosshair className="w-4 h-4 flex-shrink-0" />
          Klik di peta untuk set posisi <strong>{selectedCity?.name}</strong>
        </div>
      )}
      {mode === 'add' && pendingAdd && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700 flex items-center gap-2">
          <Crosshair className="w-4 h-4 flex-shrink-0" />
          Klik di peta untuk menetapkan posisi kota baru
        </div>
      )}

      {/* ── Add form ── */}
      {mode === 'add' && (
        <div className="border border-green-200 rounded-lg p-4 bg-green-50 space-y-3">
          <h4 className="text-sm font-medium text-green-800 flex items-center gap-1.5"><Plus className="w-4 h-4" /> Tambah Kota Baru</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Nama Kota *</label>
              <input type="text" value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Medan" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Provinsi *</label>
              <input type="text" value={addForm.province} onChange={(e) => setAddForm((f) => ({ ...f, province: e.target.value }))}
                placeholder="e.g. Sumatera Utara" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">PoPs</label>
              <input type="number" min="1" value={addForm.pops} onChange={(e) => setAddForm((f) => ({ ...f, pops: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Status</label>
              <select value={addForm.status ?? 'active'} onChange={(e) => setAddForm((f) => ({ ...f, status: e.target.value as MapCity['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                <option value="active">Active</option>
                <option value="coming-soon">Coming Soon</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Warna Pin</label>
              <select value={addForm.iconColor ?? 'red'} onChange={(e) => setAddForm((f) => ({ ...f, iconColor: e.target.value as MapCity['iconColor'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                {ICON_COLORS.map((c) => <option key={c.value} value={c.value ?? ''}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Koneksi</label>
              <select value={addForm.connectionType ?? 'inland'} onChange={(e) => setAddForm((f) => ({ ...f, connectionType: e.target.value as MapCity['connectionType'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                {CONNECTION_TYPES.map((ct) => <option key={ct.value} value={ct.value ?? ''}>{ct.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Posisi di Peta</label>
              <div className="flex gap-1">
                <button type="button" onClick={() => setPendingAdd(true)}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-xs hover:border-green-500 flex items-center justify-center gap-1 text-gray-600 hover:text-green-600">
                  <Crosshair className="w-3 h-3" />
                  {addForm.x !== undefined ? `${addForm.x}%, ${addForm.y}%` : 'Klik di peta'}
                </button>
                {addForm.x !== undefined && (
                  <button type="button" onClick={() => setAddForm((f) => ({ ...f, x: undefined, y: undefined }))}
                    className="px-2 py-2 border border-gray-300 rounded-lg text-red-400 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={handleConfirmAdd} disabled={!addForm.name.trim() || !addForm.province.trim()}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" /> Simpan Kota
            </button>
            <button type="button" onClick={() => { setMode('view'); setAddForm({ ...EMPTY_FORM }); setPendingAdd(false); }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ── Map preview ── */}
      {mapImage ? (
        <div ref={containerRef}
          className="relative rounded-lg overflow-hidden border-2 border-gray-200"
          style={{ cursor: isCursorActive ? 'crosshair' : 'default' }}
          onClick={handleMapClick}
        >
          <img src={mapImage} alt="Map Preview" className="w-full h-auto block" />
          {cities.filter((c) => c.x !== undefined && c.y !== undefined).map((city) => {
            const hex = ICON_COLORS.find((ic) => ic.value === city.iconColor)?.hex ?? '#EF4444';
            const isActive = city.id === selectedCityId && mode === 'set-position';
            return (
              <div key={city.id} style={{ position: 'absolute', left: `${city.x}%`, top: `${city.y}%`, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                <div style={{ width: isActive ? 14 : 8, height: isActive ? 14 : 8, borderRadius: '50%', backgroundColor: hex, border: '2px solid white', boxShadow: isActive ? `0 0 0 3px ${hex}66` : '0 1px 3px rgba(0,0,0,0.4)', transition: 'all 0.2s' }} />
                {isActive && (
                  <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.75)', color: 'white', fontSize: 9, padding: '1px 5px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                    {city.name}
                  </div>
                )}
              </div>
            );
          })}
          {addForm.x !== undefined && (
            <div style={{ position: 'absolute', left: `${addForm.x}%`, top: `${addForm.y}%`, transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: ICON_COLORS.find(c => c.value === addForm.iconColor)?.hex ?? '#22C55E', border: '2px solid white', boxShadow: '0 0 0 3px #22C55E66' }} />
              <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', background: 'rgba(34,197,94,0.85)', color: 'white', fontSize: 9, padding: '1px 5px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                {addForm.name || 'Kota Baru'}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500 text-sm">Upload gambar peta terlebih dahulu</div>
      )}

      {/* ── City list with inline edit / delete ── */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Daftar Kota ({cities.length})</span>
        </div>
        {cities.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">Belum ada kota. Klik "Tambah Kota".</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {cities.map((city) => {
              const isEditing = editingCityId === city.id;
              const hex = ICON_COLORS.find((ic) => ic.value === city.iconColor)?.hex ?? '#EF4444';
              return (
                <li key={city.id} className="px-4 py-3">
                  {isEditing ? (
                    /* ── Inline edit form ── */
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="Nama kota" className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-orange-500" />
                        <input type="text" value={editForm.province} onChange={(e) => setEditForm((f) => ({ ...f, province: e.target.value }))}
                          placeholder="Provinsi" className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-orange-500" />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <input type="number" min="1" value={editForm.pops} onChange={(e) => setEditForm((f) => ({ ...f, pops: parseInt(e.target.value) || 1 }))}
                          className="px-2 py-1.5 border border-gray-300 rounded text-sm" />
                        <select value={editForm.status ?? 'active'} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value as MapCity['status'] }))}
                          className="px-2 py-1.5 border border-gray-300 rounded text-sm">
                          <option value="active">Active</option>
                          <option value="coming-soon">Coming Soon</option>
                        </select>
                        <select value={editForm.iconColor ?? 'red'} onChange={(e) => setEditForm((f) => ({ ...f, iconColor: e.target.value as MapCity['iconColor'] }))}
                          className="px-2 py-1.5 border border-gray-300 rounded text-sm">
                          {ICON_COLORS.map((c) => <option key={c.value} value={c.value ?? ''}>{c.label}</option>)}
                        </select>
                        <select value={editForm.connectionType ?? 'inland'} onChange={(e) => setEditForm((f) => ({ ...f, connectionType: e.target.value as MapCity['connectionType'] }))}
                          className="px-2 py-1.5 border border-gray-300 rounded text-sm">
                          {CONNECTION_TYPES.map((ct) => <option key={ct.value} value={ct.value ?? ''}>{ct.label}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={confirmEdit}
                          className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white rounded text-xs hover:bg-orange-700">
                          <Check className="w-3 h-3" /> Simpan
                        </button>
                        <button type="button" onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50">
                          <X className="w-3 h-3" /> Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Read row ── */
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full flex-shrink-0 border border-white shadow-sm" style={{ backgroundColor: hex }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{city.name}</p>
                        <p className="text-xs text-gray-500 truncate">{city.province} · {city.pops} PoPs · {city.status === 'active' ? '✅' : '⏳'}</p>
                        <p className="text-xs text-gray-400">{city.x !== undefined ? `📍 ${city.x}%, ${city.y}%` : '📍 Belum dipasang'}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        {/* Set position shortcut */}
                        <button type="button"
                          onClick={() => { setSelectedCityId(city.id); setMode('set-position'); }}
                          className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Set posisi di peta">
                          <Crosshair className="w-3.5 h-3.5" />
                        </button>
                        {/* Edit */}
                        <button type="button" onClick={() => startEdit(city)}
                          className="p-1.5 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {/* Reset pin */}
                        {city.x !== undefined && (
                          <button type="button" onClick={() => onUpdateCity(city.id, { x: undefined, y: undefined })}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded" title="Reset posisi">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {/* Delete */}
                        <button type="button" onClick={() => { if (window.confirm(`Hapus kota ${city.name}?`)) onDeleteCity(city.id); }}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

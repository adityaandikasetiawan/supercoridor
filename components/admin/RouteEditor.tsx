import { Plus, Trash2 } from 'lucide-react';
import type { MapCity, NetworkRoute, LegendItem } from '../InteractiveNetworkMap';

// ─── Route Editor ─────────────────────────────────────────────────────────────

interface RouteEditorProps {
  cities: MapCity[];
  routes: NetworkRoute[];
  onRoutesChange: (routes: NetworkRoute[]) => void;
}

const ROUTE_TYPE_LABELS: Record<NetworkRoute['type'], string> = {
  'existing-inland': 'Existing Inland (Biru)',
  'existing-subsea': 'Existing Subsea (Biru Tebal)',
  'plan-inland': 'Plan Inland (Orange Putus)',
  'plan-subsea': 'Plan Subsea (Biru Putus)',
  'progress-subsea': 'Progress Subsea (Kuning)',
};

const ROUTE_TYPE_COLORS: Record<NetworkRoute['type'], string> = {
  'existing-inland': '#3B82F6',
  'existing-subsea': '#60A5FA',
  'plan-inland': '#F97316',
  'plan-subsea': '#93C5FD',
  'progress-subsea': '#EAB308',
};

export function RouteEditor({ cities, routes, onRoutesChange }: RouteEditorProps) {
  const addRoute = () => {
    if (cities.length < 2) return;
    const newRoute: NetworkRoute = {
      id: Date.now().toString(),
      fromCityId: cities[0].id,
      toCityId: cities[1].id,
      type: 'existing-inland',
      waypoints: [],
    };
    onRoutesChange([...routes, newRoute]);
  };

  const updateRoute = (id: string, updates: Partial<NetworkRoute>) => {
    onRoutesChange(routes.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRoute = (id: string) => {
    onRoutesChange(routes.filter((r) => r.id !== id));
  };

  const addWaypoint = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId);
    if (!route) return;
    const newWaypoints = [...(route.waypoints ?? []), { x: 50, y: 50 }];
    updateRoute(routeId, { waypoints: newWaypoints });
  };

  const updateWaypoint = (
    routeId: string,
    wpIndex: number,
    axis: 'x' | 'y',
    value: number
  ) => {
    const route = routes.find((r) => r.id === routeId);
    if (!route) return;
    const newWaypoints = (route.waypoints ?? []).map((wp, i) =>
      i === wpIndex ? { ...wp, [axis]: value } : wp
    );
    updateRoute(routeId, { waypoints: newWaypoints });
  };

  const removeWaypoint = (routeId: string, wpIndex: number) => {
    const route = routes.find((r) => r.id === routeId);
    if (!route) return;
    updateRoute(routeId, {
      waypoints: (route.waypoints ?? []).filter((_, i) => i !== wpIndex),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {routes.length} route terdaftar
        </p>
        <button
          type="button"
          onClick={addRoute}
          disabled={cities.length < 2}
          className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Tambah Route
        </button>
      </div>

      {cities.length < 2 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-700">
          Tambahkan minimal 2 kota di "Coverage Cities" terlebih dahulu
        </div>
      )}

      {routes.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
          Belum ada route. Klik "+ Tambah Route" untuk mulai.
        </div>
      ) : (
        <div className="space-y-3">
          {routes.map((route, idx) => {
            const typeColor = ROUTE_TYPE_COLORS[route.type];
            return (
              <div
                key={route.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Route header */}
                <div
                  className="flex items-center justify-between px-4 py-2"
                  style={{ borderLeft: `4px solid ${typeColor}`, background: '#fafafa' }}
                >
                  <span className="text-sm font-medium text-gray-700">
                    Route #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteRoute(route.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  {/* From / To */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Dari Kota</label>
                      <select
                        value={route.fromCityId}
                        onChange={(e) => updateRoute(route.id, { fromCityId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      >
                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Ke Kota</label>
                      <select
                        value={route.toCityId}
                        onChange={(e) => updateRoute(route.id, { toCityId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                      >
                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Route type */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tipe Jalur</label>
                    <select
                      value={route.type}
                      onChange={(e) =>
                        updateRoute(route.id, { type: e.target.value as NetworkRoute['type'] })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                    >
                      {(Object.entries(ROUTE_TYPE_LABELS) as [NetworkRoute['type'], string][]).map(
                        ([val, label]) => (
                          <option key={val} value={val}>
                            {label}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Waypoints */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-gray-500">
                        Waypoints (titik belok jalur)
                      </label>
                      <button
                        type="button"
                        onClick={() => addWaypoint(route.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Tambah Titik
                      </button>
                    </div>

                    {(route.waypoints ?? []).length === 0 ? (
                      <p className="text-xs text-gray-400 italic">
                        Tidak ada waypoint — jalur lurus dari kota ke kota
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {(route.waypoints ?? []).map((wp, wpIdx) => (
                          <div key={wpIdx} className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-14 flex-shrink-0">
                              Titik {wpIdx + 1}
                            </span>
                            <div className="flex items-center gap-1 flex-1">
                              <span className="text-xs text-gray-400">X</span>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.5"
                                value={wp.x}
                                onChange={(e) =>
                                  updateWaypoint(
                                    route.id,
                                    wpIdx,
                                    'x',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-orange-500"
                              />
                              <span className="text-xs text-gray-400">%</span>
                            </div>
                            <div className="flex items-center gap-1 flex-1">
                              <span className="text-xs text-gray-400">Y</span>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.5"
                                value={wp.y}
                                onChange={(e) =>
                                  updateWaypoint(
                                    route.id,
                                    wpIdx,
                                    'y',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-orange-500"
                              />
                              <span className="text-xs text-gray-400">%</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeWaypoint(route.id, wpIdx)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Legend Editor ────────────────────────────────────────────────────────────

interface LegendEditorProps {
  legend: LegendItem[];
  onLegendChange: (legend: LegendItem[]) => void;
}

export function LegendEditor({ legend, onLegendChange }: LegendEditorProps) {
  const addItem = () => {
    onLegendChange([
      ...legend,
      { id: Date.now().toString(), label: '', lineType: 'solid', color: '#3B82F6' },
    ]);
  };

  const updateItem = (id: string, updates: Partial<LegendItem>) => {
    onLegendChange(legend.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteItem = (id: string) => {
    onLegendChange(legend.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{legend.length} item legend</p>
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Tambah Item
        </button>
      </div>

      {legend.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
          Belum ada item legend. Klik "+ Tambah Item".
        </div>
      ) : (
        <div className="space-y-2">
          {legend.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 border border-gray-200 rounded-lg p-2"
            >
              {/* Color preview */}
              <div
                className="w-8 h-1.5 rounded flex-shrink-0"
                style={{
                  background: item.color,
                  borderBottom:
                    item.lineType === 'dashed'
                      ? `2px dashed ${item.color}`
                      : 'none',
                  height: item.lineType === 'dashed' ? 0 : 4,
                }}
              />

              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(item.id, { label: e.target.value })}
                placeholder="Label legend"
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500"
              />

              <select
                value={item.lineType}
                onChange={(e) =>
                  updateItem(item.id, { lineType: e.target.value as LegendItem['lineType'] })
                }
                className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
              </select>

              <input
                type="color"
                value={item.color}
                onChange={(e) => updateItem(item.id, { color: e.target.value })}
                className="w-9 h-8 border border-gray-300 rounded cursor-pointer p-0.5"
                title="Pilih warna"
              />

              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Preview */}
      {legend.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <p className="text-xs text-gray-500 mb-2">Preview Legend:</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legend.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <svg width="28" height="10">
                  <line
                    x1="0"
                    y1="5"
                    x2="28"
                    y2="5"
                    stroke={item.color}
                    strokeWidth="2.5"
                    strokeDasharray={item.lineType === 'dashed' ? '5 3' : undefined}
                  />
                </svg>
                <span className="text-xs text-gray-600">{item.label || '(kosong)'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

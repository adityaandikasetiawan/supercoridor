import { useEffect, useRef, useState } from 'react';
import { CheckCircle, Wifi, Globe, X } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MapCity {
  id: string;
  name: string;
  province: string;
  pops: number;
  status: 'active' | 'coming-soon';
  x?: number;
  y?: number;
  iconType?: 'dot' | 'star' | 'diamond' | 'tower';
  iconColor?: 'red' | 'yellow' | 'blue' | 'green' | 'white';
  connectionType?: 'inland' | 'subsea' | 'both';
}

export interface NetworkRoute {
  id: string;
  fromCityId: string;
  toCityId: string;
  type:
    | 'existing-inland'
    | 'existing-subsea'
    | 'plan-inland'
    | 'plan-subsea'
    | 'progress-subsea';
  waypoints?: { x: number; y: number }[];
}

export interface LegendItem {
  id: string;
  label: string;
  lineType: 'solid' | 'dashed';
  color: string;
}

interface InteractiveNetworkMapProps {
  mapImage: string;
  cities: MapCity[];
  routes: NetworkRoute[];
  legend?: LegendItem[];
  fullWidth?: boolean; // if true: no sidebar, map takes full width
}

// ─── Style config ─────────────────────────────────────────────────────────────
// strokeWidth is a ratio of image width (e.g. 0.003 = 0.3% of imgWidth)
// This gets multiplied by imgRatio.w at render time → pixel-correct thickness

const ROUTE_STYLES: Record<
  NetworkRoute['type'],
  { stroke: string; strokeWidthRatio: number; dashRatio: string; animClass: string }
> = {
  'existing-inland':  { stroke: '#3B82F6', strokeWidthRatio: 0.003,  dashRatio: 'none',       animClass: 'route-flow-blue' },
  'existing-subsea':  { stroke: '#60A5FA', strokeWidthRatio: 0.004,  dashRatio: 'none',       animClass: 'route-flow-blue-thick' },
  'plan-inland':      { stroke: '#F97316', strokeWidthRatio: 0.003,  dashRatio: 'dashed',     animClass: 'route-blink' },
  'plan-subsea':      { stroke: '#93C5FD', strokeWidthRatio: 0.003,  dashRatio: 'dashed',     animClass: 'route-blink' },
  'progress-subsea':  { stroke: '#EAB308', strokeWidthRatio: 0.004,  dashRatio: 'none',       animClass: 'route-flow-yellow' },
};

const ICON_COLORS: Record<string, string> = {
  red: '#EF4444', yellow: '#EAB308', blue: '#3B82F6', green: '#22C55E', white: '#FFFFFF',
};

function buildPath(
  from: { x: number; y: number },
  to: { x: number; y: number },
  waypoints: { x: number; y: number }[] = []
): string {
  return [from, ...waypoints, to].map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
}

// ─── City pin — pixel-based (no distortion) ──────────────────────────────────

function CityIconPx({
  city, cx, cy, imgW, imgH, isSelected, isDimmed, index, onClick,
}: {
  city: MapCity; cx: number; cy: number; imgW: number; imgH: number;
  isSelected: boolean; isDimmed: boolean; index: number; onClick: () => void;
}) {
  const color = ICON_COLORS[city.iconColor ?? 'red'];
  // Scale pin relative to image size so it looks the same regardless of resolution
  // Base: ~0.5% of image width for normal, 0.75% for selected
  const base = imgW * 0.004;
  const r    = isSelected ? base * 1.5 : base;
  const fontSize = imgW * 0.011; // ~1.1% of image width
  const strokeW  = imgW * 0.0015;
  const ringStW  = imgW * 0.001;

  return (
    <g
      style={{ opacity: isDimmed ? 0.2 : 1, cursor: 'pointer', animationDelay: `${index * 80}ms` }}
      className="city-pin-enter"
      onClick={onClick}
    >
      {/* Selected pulse ring */}
      {isSelected && (
        <circle
          cx={cx} cy={cy} r={r * 2.2}
          fill="none" stroke={color} strokeWidth={ringStW}
          className="pulse-ring-fast"
          style={{ opacity: 0.6 }}
        />
      )}
      {/* Idle soft glow */}
      {!isDimmed && !isSelected && (
        <circle
          cx={cx} cy={cy} r={r * 1.8}
          fill="none" stroke={color} strokeWidth={ringStW * 0.8}
          className="pulse-ring"
          style={{ opacity: 0.35 }}
        />
      )}
      {/* Main dot — perfect circle, no distortion */}
      <circle
        cx={cx} cy={cy} r={r}
        fill={color} stroke="white" strokeWidth={strokeW}
        style={{ filter: isSelected ? `drop-shadow(0 0 ${r}px ${color})` : 'none' }}
      />
      {/* Label */}
      <text
        x={cx} y={cy - r - fontSize * 0.4}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight={isSelected ? '600' : '400'}
        style={{
          pointerEvents: 'none',
          fill: 'white',
          paintOrder: 'stroke',
          stroke: 'rgba(0,0,20,0.75)',
          strokeWidth: fontSize * 0.25,
          strokeLinejoin: 'round' as const,
        }}
      >
        {city.name}
      </text>
    </g>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function InteractiveNetworkMap({ mapImage, cities, routes, legend, fullWidth = false }: InteractiveNetworkMapProps) {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [sidebarCity, setSidebarCity] = useState<MapCity | null>(null);
  // Track natural image ratio so SVG viewBox matches exactly → no stretching
  const [imgRatio, setImgRatio] = useState<{ w: number; h: number }>({ w: 1000, h: 500 });
  const imgRef = useRef<HTMLImageElement>(null);

  const mappedCities = cities.filter((c) => c.x !== undefined && c.y !== undefined);

  const connectedRouteIds = selectedCityId
    ? new Set(routes.filter((r) => r.fromCityId === selectedCityId || r.toCityId === selectedCityId).map((r) => r.id))
    : null;

  const handleCityClick = (city: MapCity) => {
    if (selectedCityId === city.id) { setSelectedCityId(null); setSidebarCity(null); }
    else { setSelectedCityId(city.id); setSidebarCity(city); }
  };

  const handleDeselect = () => { setSelectedCityId(null); setSidebarCity(null); };

  useEffect(() => {
    const t = setTimeout(() => setMapReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Handle image load — read natural dimensions for correct viewBox
  const handleImgLoad = () => {
    if (imgRef.current) {
      const { naturalWidth: w, naturalHeight: h } = imgRef.current;
      if (w > 0 && h > 0) setImgRatio({ w, h });
    }
    setMapReady(true);
  };

  const defaultLegend: LegendItem[] = legend?.length ? legend : [
    { id: '1', label: 'Progress Subsea',  lineType: 'solid',  color: '#EAB308' },
    { id: '2', label: 'Existing Inland',  lineType: 'solid',  color: '#3B82F6' },
    { id: '3', label: 'Existing Subsea',  lineType: 'solid',  color: '#60A5FA' },
    { id: '4', label: 'Plan Inland',      lineType: 'dashed', color: '#F97316' },
    { id: '5', label: 'Plan Subsea',      lineType: 'dashed', color: '#93C5FD' },
  ];

  return (
    <>
      <style>{`
        @keyframes pulseRingMap {
          0%   { opacity: 0.5; transform: scale(1);   }
          70%  { opacity: 0;   transform: scale(2.2); }
          100% { opacity: 0;   transform: scale(2.2); }
        }
        @keyframes pulseRingMapFast {
          0%   { opacity: 0.7; transform: scale(1);   }
          70%  { opacity: 0;   transform: scale(2.8); }
          100% { opacity: 0;   transform: scale(2.8); }
        }
        @keyframes flowBlue   { from { stroke-dashoffset: 600; } to { stroke-dashoffset: 0; } }
        @keyframes flowYellow { from { stroke-dashoffset: 600; } to { stroke-dashoffset: 0; } }
        @keyframes blinkRoute { 0%,100%{opacity:.8} 50%{opacity:.25} }
        @keyframes pinEnter   { 0%{opacity:0;transform:scale(0)} 60%{transform:scale(1.15)} 100%{opacity:1;transform:scale(1)} }
        @keyframes routeGrow  { from{stroke-dashoffset:9999;opacity:0} to{stroke-dashoffset:0;opacity:1} }
        @keyframes mapFadeIn  { from{opacity:0} to{opacity:1} }
        .pulse-ring      { animation: pulseRingMap     2.5s ease-out infinite; transform-box: fill-box; transform-origin: center; }
        .pulse-ring-fast { animation: pulseRingMapFast 1.2s ease-out infinite; transform-box: fill-box; transform-origin: center; }
        /* Flow animations — dasharray diset via SVG attribute prop */
        .route-flow-blue        { animation: routeGrow 1.5s ease-out forwards, flowBlue   1.5s linear 1.5s infinite; }
        .route-flow-blue-thick  { animation: routeGrow 1.5s ease-out forwards, flowBlue   1.2s linear 1.5s infinite; }
        .route-flow-yellow      { animation: routeGrow 1.5s ease-out forwards, flowYellow 0.9s linear 1.5s infinite; }
        .route-blink            { animation: routeGrow 1.5s ease-out forwards, blinkRoute 2s ease-in-out 1.5s infinite; }
        .city-pin-enter         { animation: pinEnter   0.5s ease-out both; }
        .route-draw             { animation: routeGrow  1.5s ease-out forwards; }
        .map-container          { animation: mapFadeIn  0.6s ease-out both; }
      `}</style>

      <div className="flex flex-col lg:flex-row gap-3 w-full">
        {/* ── Sidebar — hidden in fullWidth mode ── */}
        {!fullWidth && (
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-slate-900 rounded-xl overflow-hidden" style={{ maxHeight: 420 }}>
            <div className="px-3 py-2.5 border-b border-slate-700">
              <h3 className="text-white font-semibold text-xs uppercase tracking-wider">Coverage Area</h3>
              <p className="text-slate-400 text-xs mt-0.5">Klik kota untuk detail</p>
            </div>

            {sidebarCity ? (
              <div className="p-3">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-bold text-sm">{sidebarCity.name}</h4>
                    <p className="text-slate-400 text-xs">{sidebarCity.province}</p>
                  </div>
                  <button onClick={handleDeselect} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="bg-slate-800 rounded-lg p-2 flex items-center gap-2">
                    <Wifi className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 text-xs">PoPs</p>
                      <p className="text-white font-bold text-sm">{sidebarCity.pops}</p>
                    </div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-2 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-slate-400 text-xs">Status</p>
                      <p className={`text-xs font-medium ${sidebarCity.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {sidebarCity.status === 'active' ? '✅ Active' : '⏳ Coming Soon'}
                      </p>
                    </div>
                  </div>
                  {sidebarCity.connectionType && (
                    <div className="bg-slate-800 rounded-lg p-2 flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                      <div>
                        <p className="text-slate-400 text-xs">Koneksi</p>
                        <p className="text-white text-xs capitalize">
                          {sidebarCity.connectionType === 'both' ? 'Inland + Subsea' : sidebarCity.connectionType}
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-slate-500 text-xs px-1">
                    {routes.filter((r) => r.fromCityId === sidebarCity.id || r.toCityId === sidebarCity.id).length} jalur terhubung
                  </p>
                  <button onClick={handleDeselect} className="w-full text-slate-400 hover:text-white text-xs py-1.5 border border-slate-700 rounded-lg hover:border-slate-500 transition-colors">
                    ← Semua area
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto" style={{ maxHeight: 360 }}>
                {cities.length === 0 ? (
                  <p className="p-3 text-center text-slate-500 text-xs">Belum ada data kota</p>
                ) : (
                  <ul>
                    {cities.map((city) => (
                      <li key={city.id}>
                        <button
                          onClick={() => handleCityClick(city)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-0 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ICON_COLORS[city.iconColor ?? 'red'] }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">{city.name}</p>
                            <p className="text-slate-500 text-xs truncate">{city.province}</p>
                          </div>
                          <span className={`text-xs px-1 py-0.5 rounded flex-shrink-0 ${city.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>
                            {city.status === 'active' ? '●' : '○'}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
        )} {/* end !fullWidth sidebar */}

        {/* ── Map ── */}
        <div className="flex-1 min-w-0">
          <div className="relative rounded-xl overflow-hidden bg-slate-900 map-container">
            <img
              ref={imgRef}
              src={mapImage}
              alt="Network Coverage Map"
              className="w-full h-auto block"
              onLoad={handleImgLoad}
            />

            {mapReady && mappedCities.length > 0 && (
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${imgRatio.w} ${imgRatio.h}`}
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: 'none' }}
                onClick={handleDeselect}
              >
                {/* Routes */}
                {routes.map((route, idx) => {
                  const from = mappedCities.find((c) => c.id === route.fromCityId);
                  const to   = mappedCities.find((c) => c.id === route.toCityId);
                  if (!from || !to) return null;
                  const s = ROUTE_STYLES[route.type];
                  // Convert % coords → pixel
                  const fromPx = { x: (from.x! / 100) * imgRatio.w, y: (from.y! / 100) * imgRatio.h };
                  const toPx   = { x: (to.x!   / 100) * imgRatio.w, y: (to.y!   / 100) * imgRatio.h };
                  const wpPx   = (route.waypoints ?? []).map(wp => ({ x: (wp.x / 100) * imgRatio.w, y: (wp.y / 100) * imgRatio.h }));
                  // Scale stroke to image pixel space
                  const sw     = imgRatio.w * s.strokeWidthRatio;
                  // For flow animation on solid lines, set dasharray proportional to image width
                  // For dashed lines, use longer dash pattern
                  const dash   = s.dashRatio === 'dashed'
                    ? `${sw * 4} ${sw * 2}`
                    : `${imgRatio.w * 0.04} ${imgRatio.w * 0.02}`;
                  const isConnected   = connectedRouteIds ? connectedRouteIds.has(route.id) : true;
                  const isDimmed      = connectedRouteIds ? !isConnected : false;
                  const isHighlighted = connectedRouteIds ? isConnected : false;
                  return (
                    <path
                      key={route.id}
                      d={buildPath(fromPx, toPx, wpPx)}
                      fill="none"
                      stroke={s.stroke}
                      strokeWidth={isHighlighted ? sw * 2.5 : sw}
                      strokeDasharray={dash}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={s.animClass}
                      style={{
                        opacity: isDimmed ? 0.1 : isHighlighted ? 1 : 0.85,
                        animationDelay: `${idx * 60}ms`,
                        filter: isHighlighted
                          ? `drop-shadow(0 0 ${sw * 2}px ${s.stroke})`
                          : `drop-shadow(0 0 ${sw}px ${s.stroke}66)`,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none',
                      }}
                    />
                  );
                })}

                {/* Pins */}
                <g style={{ pointerEvents: 'all' }}>
                  {mappedCities.map((city, idx) => {
                    const isSelected = selectedCityId === city.id;
                    const isDimmed = selectedCityId
                      ? !isSelected && !routes.some(
                          (r) => (r.fromCityId === selectedCityId && r.toCityId === city.id) ||
                                 (r.toCityId === selectedCityId && r.fromCityId === city.id)
                        )
                      : false;
                    // Convert % → pixel
                    const px = (city.x! / 100) * imgRatio.w;
                    const py = (city.y! / 100) * imgRatio.h;
                    return (
                      <CityIconPx
                        key={city.id} city={city}
                        cx={px} cy={py}
                        imgW={imgRatio.w} imgH={imgRatio.h}
                        isSelected={isSelected} isDimmed={isDimmed}
                        index={idx} onClick={() => handleCityClick(city)}
                      />
                    );
                  })}
                </g>
              </svg>
            )}

            {selectedCityId && (
              <div className="absolute inset-0" style={{ pointerEvents: 'auto' }} onClick={handleDeselect} />
            )}
          </div>

          {/* Legend — compact */}
          {defaultLegend.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1">
              {defaultLegend.map((item) => (
                <div key={item.id} className="flex items-center gap-1.5">
                  <svg width="20" height="8" className="flex-shrink-0">
                    <line x1="0" y1="4" x2="20" y2="4" stroke={item.color} strokeWidth="2"
                      strokeDasharray={item.lineType === 'dashed' ? '4 2' : undefined} />
                  </svg>
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white shadow" style={{ backgroundColor: '#EF4444' }} />
                <span className="text-xs text-gray-500">City / PoP</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

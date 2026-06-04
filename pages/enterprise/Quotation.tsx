import { useState } from 'react';
import { EnterpriseLayout } from './EnterpriseLayout';
import { enterpriseApi } from './api';
import { QuoteParams, Recommendation, SolutionKey, SOLUTION_LABELS, REGIONS } from './types';

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const DEFAULT_PARAMS: QuoteParams = {
  namaKlien: '', segmen: 'SME', region: 'JABOTABEK', jumlahUser: 50, bandwidthTarget: 100,
  durasiKontrak: 12, durasiPM: 3, jarakKabel: 0, jarakKota: 0, hariKerja: 1,
  jumlahKunjungan: 2, jumlahMeeting: 6, selectedSolusi: ['internet'],
  targetMargin: 40, komisi: 5, diskon: 0, skema: 'recurring', jborRate: 6.25, provisiRate: 2.0,
  budgetTierFilter: 'All', qtyMap: {},
  wifiConfig: { mode: 'standalone' }, cctvConfig: { type: 'nvr', recQty: 1, camQty: 8 }, ippbxConfig: { pbxQty: 1, phoneQty: 10 },
};

const ALL_SOLUTIONS: SolutionKey[] = ['internet','router','sdwan','firewall','cctv','wifi','switch','switch_l2','server','storage','ippbx'];

export function EnterpriseQuotation() {
  const [params, setParams] = useState<QuoteParams>(DEFAULT_PARAMS);
  const [results, setResults] = useState<Recommendation[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');

  const toggleSolution = (sol: SolutionKey) => {
    const current = params.selectedSolusi;
    setParams({ ...params, selectedSolusi: current.includes(sol) ? current.filter(s => s !== sol) : [...current, sol] });
  };

  const handleGenerate = async () => {
    setGenerating(true); setError(''); setResults([]);
    try {
      const data = await enterpriseApi.pricing.generate(params);
      setResults(data.recommendations || []);
      if (!data.recommendations?.length) setError(data.message || 'Tidak ada hasil');
    } catch { setError('Gagal generate. Periksa parameter.'); }
    finally { setGenerating(false); }
  };

  const handleSaveQuote = async (rec: Recommendation) => {
    try {
      const quote = await enterpriseApi.quotes.create({ ...params, calculation: rec });
      setSaved(`Quotation saved: ${quote.id}`);
      setTimeout(() => setSaved(''), 5000);
    } catch { setError('Gagal menyimpan quotation'); }
  };

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <h1 className="text-2xl text-gray-900">New Quotation</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Parameters */}
          <div className="lg:col-span-2 space-y-4">
            {/* Client Info */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg text-gray-900 mb-3">Client Info</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="col-span-2"><label className="text-xs text-gray-500">Nama Klien</label><input value={params.namaKlien} onChange={e => setParams({...params, namaKlien: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="PT. Contoh Indonesia" /></div>
                <div><label className="text-xs text-gray-500">Segmen</label><select value={params.segmen} onChange={e => setParams({...params, segmen: e.target.value as 'SME'|'Enterprise'})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>SME</option><option>Enterprise</option></select></div>
                <div><label className="text-xs text-gray-500">Region</label><select value={params.region} onChange={e => setParams({...params, region: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">{REGIONS.map(r => <option key={r}>{r}</option>)}</select></div>
                <div><label className="text-xs text-gray-500">Jumlah User</label><input type="number" value={params.jumlahUser || ''} onChange={e => setParams({...params, jumlahUser: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="50" /></div>
                <div><label className="text-xs text-gray-500">Bandwidth (Mbps)</label><input type="number" value={params.bandwidthTarget || ''} onChange={e => setParams({...params, bandwidthTarget: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="100" /></div>
                <div><label className="text-xs text-gray-500">Durasi Kontrak (bln)</label><input type="number" value={params.durasiKontrak || ''} onChange={e => setParams({...params, durasiKontrak: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="12" /></div>
                <div><label className="text-xs text-gray-500">Skema</label><select value={params.skema} onChange={e => setParams({...params, skema: e.target.value as 'recurring'|'otc'})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option value="recurring">Recurring</option><option value="otc">OTC</option></select></div>
              </div>
            </div>

            {/* Solutions */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg text-gray-900 mb-3">Solutions</h2>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {ALL_SOLUTIONS.map(sol => (
                  <label key={sol} className={`flex items-center gap-2 p-2 rounded border cursor-pointer text-sm ${params.selectedSolusi.includes(sol) ? 'bg-purple-50 border-purple-300' : 'border-gray-200'}`}>
                    <input type="checkbox" checked={params.selectedSolusi.includes(sol)} onChange={() => toggleSolution(sol)} className="w-4 h-4 text-purple-600 rounded" />
                    {SOLUTION_LABELS[sol]}
                  </label>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg text-gray-900 mb-3">Pricing</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div><label className="text-xs text-gray-500">Target Margin (%)</label><input type="number" value={params.targetMargin || ''} onChange={e => setParams({...params, targetMargin: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="40" /></div>
                <div><label className="text-xs text-gray-500">Komisi (%)</label><input type="number" value={params.komisi || ''} onChange={e => setParams({...params, komisi: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="5" /></div>
                <div><label className="text-xs text-gray-500">Diskon (%)</label><input type="number" value={params.diskon || ''} onChange={e => setParams({...params, diskon: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="0" /></div>
                <div><label className="text-xs text-gray-500">Budget Tier</label><select value={params.budgetTierFilter} onChange={e => setParams({...params, budgetTierFilter: e.target.value as 'All'|'Low'|'Medium'|'High'})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>All</option><option>Low</option><option>Medium</option><option>High</option></select></div>
              </div>
            </div>

            {/* Technical */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg text-gray-900 mb-3">Technical Costs</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div><label className="text-xs text-gray-500">Jarak Kabel (m)</label><input type="number" value={params.jarakKabel || ''} onChange={e => setParams({...params, jarakKabel: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="0" /></div>
                <div><label className="text-xs text-gray-500">Jarak Kota (km)</label><input type="number" value={params.jarakKota || ''} onChange={e => setParams({...params, jarakKota: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="0" /></div>
                <div><label className="text-xs text-gray-500">Hari Kerja</label><input type="number" value={params.hariKerja || ''} onChange={e => setParams({...params, hariKerja: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="1" /></div>
                <div><label className="text-xs text-gray-500">Durasi PM (bln)</label><input type="number" value={params.durasiPM || ''} onChange={e => setParams({...params, durasiPM: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="3" /></div>
              </div>
            </div>

            <button onClick={handleGenerate} disabled={generating || !params.selectedSolusi.length} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium">
              {generating ? 'Generating...' : 'Generate Recommendations'}
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-5 sticky top-6">
              <h2 className="text-lg text-gray-900 mb-3">Results</h2>
              {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
              {saved && <p className="text-sm text-green-600 mb-3">{saved}</p>}
              {results.length === 0 && !error && <p className="text-sm text-gray-500">Click "Generate" to see recommendations</p>}
              <div className="space-y-3">
                {results.map((rec, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">{rec.solution}</p>
                    <p className="text-xs text-gray-500 mb-2">{rec.brand}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div><span className="text-gray-500">Harga/bln:</span> <span className="font-medium">{rp(rec.hargaNetBulan)}</span></div>
                      <div><span className="text-gray-500">Total Rev:</span> <span className="font-medium">{rp(rec.totalRev)}</span></div>
                      <div><span className="text-gray-500">Margin:</span> <span className="font-medium text-green-600">{(rec.margin * 100).toFixed(1)}%</span></div>
                      <div><span className="text-gray-500">Payback:</span> <span className="font-medium">{rec.payback} bln</span></div>
                    </div>
                    <button onClick={() => handleSaveQuote(rec)} className="w-full text-xs bg-purple-600 text-white py-2 rounded hover:bg-purple-700">Save as Quote</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
}

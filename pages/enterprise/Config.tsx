import { useEffect, useState } from 'react';
import { EnterpriseLayout } from './EnterpriseLayout';
import { enterpriseApi } from './api';
import { Save, RotateCcw } from 'lucide-react';

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export function EnterpriseConfig() {
  const [config, setConfig] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => { enterpriseApi.config.getBiayaTeknis().then(setConfig).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleSave = async () => {
    await enterpriseApi.config.updateBiayaTeknis(config);
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = async () => {
    const data = await enterpriseApi.config.resetBiayaTeknis();
    setConfig(data);
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  const fields = [
    { key: 'kabelRate', label: 'Biaya Kabel (per meter)', suffix: '/m' },
    { key: 'instalasi', label: 'Biaya Instalasi', suffix: '' },
    { key: 'delivery', label: 'Biaya Delivery', suffix: '' },
    { key: 'managedRate', label: 'Managed Service (per bulan)', suffix: '/bln' },
    { key: 'pmRate', label: 'Project Management (per bulan)', suffix: '/bln' },
    { key: 'perjalanan', label: 'Biaya Perjalanan (per kunjungan)', suffix: '/visit' },
    { key: 'meeting', label: 'Biaya Meeting (per meeting)', suffix: '/mtg' },
  ];

  if (loading) return <EnterpriseLayout><p className="text-gray-500">Loading...</p></EnterpriseLayout>;

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h1 className="text-2xl text-gray-900">Biaya Teknis Config</h1><p className="text-gray-600 text-sm">Konfigurasi biaya dasar untuk kalkulasi harga</p></div>
          <div className="flex gap-2">
            <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"><RotateCcw className="w-4 h-4" /> Reset</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"><Save className="w-4 h-4" /> Save</button>
          </div>
        </div>

        {saved && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">Config saved!</div>}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-sm text-gray-700 mb-1">{f.label}</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={config[f.key] ?? 0} onChange={e => setConfig({...config, [f.key]: +e.target.value})} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                  <span className="text-xs text-gray-500 w-16">{rp(config[f.key] ?? 0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
}

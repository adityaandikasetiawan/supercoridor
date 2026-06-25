import { useEffect, useState } from 'react';
import { EnterpriseLayout } from './EnterpriseLayout';
import { enterpriseApi } from './api';
import { useAuth } from '../../contexts/AuthContext';
import {
  QuoteParams, Recommendation, SolutionKey, SOLUTION_LABELS, REGIONS,
  EnterprisePackage, PackageItem, Device,
} from './types';
import {
  Save, RotateCcw, Plus, Edit, Trash2, CheckCircle2, ChevronDown, ChevronUp,
  Package, Cpu, ListChecks, Tag,
} from 'lucide-react';

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const DEFAULT_PARAMS: QuoteParams = {
  namaKlien: '', segmen: 'SME', region: 'JABOTABEK',
  regionAsal: 'JABOTABEK', regionTujuan: 'JABOTABEK',
  kotaAsal: '', kotaTujuan: '',
  services: '',
  jumlahUser: 0, bandwidthTarget: 0,
  durasiKontrak: 0, durasiPM: 0, jarakKabel: 0, jarakKota: 0, hariKerja: 0,
  operasionalPct: 0,
  selectedSolusi: [],
  targetMargin: 0, komisi: 0, diskon: 0, skema: 'recurring', jborRate: 0, provisiRate: 0,
  budgetTierFilter: 'All', qtyMap: {}, deviceMap: {},
  wifiConfig: { mode: 'standalone' }, cctvConfig: { type: 'nvr', recQty: 0, camQty: 0 }, ippbxConfig: { pbxQty: 0, phoneQty: 0 },
};

const ALL_SOLUTIONS: SolutionKey[] = ['internet','router','sdwan','firewall','cctv','wifi','switch','switch_l2','server','storage','ippbx'];

const TIER_COLOR: Record<string, string> = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-red-100 text-red-700',
};

const SEGMEN_COLOR: Record<string, string> = {
  SME: 'bg-green-100 text-green-700',
  Enterprise: 'bg-blue-100 text-blue-700',
};

// ─── Blank package form ───────────────────────────────────────────────────────
const blankPkg: Omit<EnterprisePackage, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> = {
  nama: '',
  deskripsi: '',
  segmen: 'SME',
  budgetTier: 'Low',
  skema: 'recurring',
  durasiKontrak: 12,
  hargaBulan: null,
  hargaOTC: null,
  perangkat: [],
  fitur: [],
  services: '',
};

// ─── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({
  pkg,
  onEdit,
  onDelete,
  onSelect,
  selectedId,
  isAdmin,
}: {
  pkg: EnterprisePackage;
  onEdit: (p: EnterprisePackage) => void;
  onDelete: (id: string) => void;
  onSelect?: (p: EnterprisePackage) => void;
  selectedId?: string;
  isAdmin?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isSelected = selectedId === pkg.id;

  return (
    <div className={`bg-white rounded-xl border-2 transition-all ${isSelected ? 'border-purple-500 shadow-md' : 'border-gray-200 hover:border-purple-200'}`}>
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEGMEN_COLOR[pkg.segmen] ?? 'bg-gray-100 text-gray-600'}`}>{pkg.segmen}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${TIER_COLOR[pkg.budgetTier] ?? 'bg-gray-100 text-gray-600'}`}>{pkg.budgetTier}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{pkg.skema === 'recurring' ? 'Recurring' : 'OTC'}</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 leading-tight">{pkg.nama}</h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{pkg.deskripsi}</p>
          </div>
          {isAdmin && (
            <div className="flex gap-1 shrink-0">
              <button onClick={() => onEdit(pkg)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><Edit className="w-3.5 h-3.5" /></button>
              <button onClick={() => onDelete(pkg.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-3 p-3 bg-purple-50 rounded-lg">
          {pkg.hargaBulan ? (
            <div>
              <span className="text-xl font-bold text-purple-700">{rp(pkg.hargaBulan)}</span>
              <span className="text-xs text-purple-500 ml-1">/ bulan</span>
              <p className="text-xs text-gray-500 mt-0.5">Kontrak {pkg.durasiKontrak} bulan · Total {rp(pkg.hargaBulan * pkg.durasiKontrak)}</p>
              <p className="text-xs text-green-600 mt-1 italic">* Harga sudah termasuk seluruh komponen biaya</p>
            </div>
          ) : pkg.hargaOTC ? (
            <div>
              <span className="text-xl font-bold text-purple-700">{rp(pkg.hargaOTC)}</span>
              <span className="text-xs text-purple-500 ml-1">OTC</span>
              <p className="text-xs text-green-600 mt-1 italic">* Harga final, seluruh biaya sudah termasuk</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Harga belum diatur</p>
          )}
        </div>

        {/* Services */}
        {pkg.services && (
          <div className="mt-2 px-3 py-2 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-0.5">Services</p>
            <p className="text-xs text-blue-600 whitespace-pre-line">{pkg.services}</p>
          </div>
        )}
      </div>

      {/* Expandable details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 hover:bg-gray-50"
      >
        <span className="flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5" />
          {pkg.perangkat.length} perangkat · {pkg.fitur.length} fitur
        </span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
          {/* Perangkat */}
          {pkg.perangkat.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-600 flex items-center gap-1 mb-2">
                <Cpu className="w-3.5 h-3.5 text-purple-500" /> Perangkat
              </p>
              <div className="space-y-1.5">
                {pkg.perangkat.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="shrink-0 mt-0.5 w-5 h-5 bg-gray-100 rounded text-center leading-5 text-gray-500 font-medium">{p.qty}×</span>
                    <div className="min-w-0">
                      <span className="text-gray-800 font-medium">{p.nama}</span>
                      <span className="text-gray-400 ml-1">({p.brand})</span>
                      {p.keterangan && <p className="text-gray-400 truncate">{p.keterangan}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fitur */}
          {pkg.fitur.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 flex items-center gap-1 mb-2">
                <ListChecks className="w-3.5 h-3.5 text-green-500" /> Fitur & SLA
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pkg.fitur.map((f, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Select button */}
      {onSelect && (
        <div className="px-5 pb-5">
          <button
            onClick={() => onSelect(pkg)}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            {isSelected ? '✓ Paket Dipilih' : 'Pilih Paket Ini'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Package Form Modal ───────────────────────────────────────────────────────
function PackageModal({
  pkg,
  onClose,
  onSave,
}: {
  pkg: Partial<EnterprisePackage> | null;
  onClose: () => void;
  onSave: (data: Partial<EnterprisePackage>) => Promise<void>;
}) {
  const isEdit = !!pkg?.id;
  const [form, setForm] = useState<Omit<EnterprisePackage, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>({
    ...blankPkg,
    ...(pkg ?? {}),
  });
  const [saving, setSaving] = useState(false);
  const [fiturInput, setFiturInput] = useState('');

  const addPerangkat = () =>
    setForm({ ...form, perangkat: [...form.perangkat, { nama: '', brand: '', qty: 1, keterangan: '' }] });

  const updatePerangkat = (i: number, field: keyof PackageItem, val: string | number) =>
    setForm({
      ...form,
      perangkat: form.perangkat.map((p, idx) => idx === i ? { ...p, [field]: val } : p),
    });

  const removePerangkat = (i: number) =>
    setForm({ ...form, perangkat: form.perangkat.filter((_, idx) => idx !== i) });

  const addFitur = () => {
    const val = fiturInput.trim();
    if (!val) return;
    setForm({ ...form, fitur: [...form.fitur, val] });
    setFiturInput('');
  };

  const removeFitur = (i: number) =>
    setForm({ ...form, fitur: form.fitur.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            {isEdit ? 'Edit Paket' : 'Tambah Paket Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Info Umum */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Package className="w-4 h-4 text-purple-500" /> Info Paket</p>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nama Paket *</label>
                <input value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Paket Business Pro" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Deskripsi</label>
                <textarea value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm resize-none" placeholder="Deskripsi singkat paket..." />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Segmen</label>
                  <select value={form.segmen} onChange={e => setForm({...form, segmen: e.target.value as 'SME'|'Enterprise'})} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option>SME</option><option>Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Budget Tier</label>
                  <select value={form.budgetTier} onChange={e => setForm({...form, budgetTier: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Skema</label>
                  <select value={form.skema} onChange={e => setForm({...form, skema: e.target.value as 'recurring'|'otc'})} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="recurring">Recurring</option><option value="otc">OTC</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Harga */}
            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Tag className="w-4 h-4 text-purple-500" /> Harga</p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                Harga paket fix bersifat final — seluruh komponen biaya (perangkat, instalasi, perjalanan, operasional) sudah termasuk dalam harga ini.
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Durasi Kontrak (bulan)</label>
                  <input type="number" value={form.durasiKontrak || ''} onChange={e => setForm({...form, durasiKontrak: +e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {form.skema === 'recurring' ? 'Harga per Bulan (Rp)' : 'Harga OTC (Rp)'}
                  </label>
                  {form.skema === 'recurring'
                    ? <input type="number" value={form.hargaBulan ?? ''} onChange={e => setForm({...form, hargaBulan: e.target.value ? +e.target.value : null})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="3500000" />
                    : <input type="number" value={form.hargaOTC ?? ''} onChange={e => setForm({...form, hargaOTC: e.target.value ? +e.target.value : null})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="50000000" />
                  }
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><ListChecks className="w-4 h-4 text-blue-500" /> Services</p>
              <textarea
                value={form.services}
                onChange={e => setForm({...form, services: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                placeholder="Deskripsi layanan yang diberikan, contoh: Instalasi perangkat, konfigurasi jaringan, managed service 24x7, monitoring NOC..."
              />
            </div>

            {/* Perangkat */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Cpu className="w-4 h-4 text-purple-500" /> Perangkat</p>
                <button type="button" onClick={addPerangkat} className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Tambah</button>
              </div>
              {form.perangkat.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-3 border border-dashed rounded-lg">Belum ada perangkat. Klik "+ Tambah" untuk menambahkan.</p>
              )}
              <div className="space-y-2">
                {form.perangkat.map((p, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-start bg-gray-50 rounded-lg p-2">
                    <div className="col-span-5">
                      <input value={p.nama} onChange={e => updatePerangkat(i, 'nama', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" placeholder="Nama perangkat *" />
                    </div>
                    <div className="col-span-3">
                      <input value={p.brand} onChange={e => updatePerangkat(i, 'brand', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" placeholder="Brand" />
                    </div>
                    <div className="col-span-2">
                      <input type="number" min={1} value={p.qty} onChange={e => updatePerangkat(i, 'qty', +e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" placeholder="Qty" />
                    </div>
                    <div className="col-span-1 flex justify-center pt-1.5">
                      <button type="button" onClick={() => removePerangkat(i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="col-span-11">
                      <input value={p.keterangan ?? ''} onChange={e => updatePerangkat(i, 'keterangan', e.target.value)} className="w-full px-2 py-1 border rounded text-xs text-gray-500" placeholder="Keterangan (opsional)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fitur */}
            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><ListChecks className="w-4 h-4 text-green-500" /> Fitur & SLA</p>
              <div className="flex gap-2">
                <input
                  value={fiturInput}
                  onChange={e => setFiturInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFitur(); } }}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  placeholder="e.g. SLA 99.99%, Support 24x7 — Enter untuk tambah"
                />
                <button type="button" onClick={addFitur} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.fitur.map((f, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                    {f}
                    <button type="button" onClick={() => removeFitur(i)} className="text-green-400 hover:text-red-500 ml-0.5">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t">
              <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 text-sm font-medium disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : isEdit ? 'Update Paket' : 'Simpan Paket'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 text-sm">Batal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Quote from Package Modal ─────────────────────────────────────────────────
function QuoteFromPackageModal({
  pkg,
  onClose,
  onSave,
}: {
  pkg: EnterprisePackage;
  onClose: () => void;
  onSave: (namaKlien: string, region: string, note: string) => Promise<void>;
}) {
  const [namaKlien, setNamaKlien] = useState('');
  const [region, setRegion] = useState('JABOTABEK');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(namaKlien, region, note); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Buat Quotation</h2>
          <p className="text-sm text-gray-500 mb-4">dari <span className="font-medium text-purple-700">{pkg.nama}</span></p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nama Klien *</label>
              <input value={namaKlien} onChange={e => setNamaKlien(e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="PT. Contoh Indonesia" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Region *</label>
              <select value={region} onChange={e => setRegion(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Catatan (opsional)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm resize-none" placeholder="Catatan tambahan untuk klien..." />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={saving} className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 text-sm font-medium disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan Quotation'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 text-sm">Batal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Paket Fix ───────────────────────────────────────────────────────────
function TabPaketFix({ isAdmin }: { isAdmin: boolean }) {
  const [packages, setPackages] = useState<EnterprisePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [filterSegmen, setFilterSegmen] = useState<'' | 'SME' | 'Enterprise'>('');
  const [filterTier, setFilterTier] = useState('');

  const [modalPkg, setModalPkg] = useState<Partial<EnterprisePackage> | null | false>(false);
  const [quoteModalPkg, setQuoteModalPkg] = useState<EnterprisePackage | null>(null);
  const [selectedPkgId, setSelectedPkgId] = useState<string>('');

  const load = async () => {
    setLoading(true);
    try {
      const data = isAdmin
        ? await enterpriseApi.packages.getAllAdmin()
        : await enterpriseApi.packages.getAll();
      setPackages(Array.isArray(data) ? data : []);
    } catch { setError('Gagal memuat paket'); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const showMsg = (msg: string, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 4000); }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 4000); }
  };

  const handleSavePkg = async (data: Partial<EnterprisePackage>) => {
    try {
      if ((data as EnterprisePackage).id) {
        await enterpriseApi.packages.update((data as EnterprisePackage).id, data);
        showMsg('Paket berhasil diupdate');
      } else {
        await enterpriseApi.packages.create(data);
        showMsg('Paket berhasil ditambahkan');
      }
      load();
    } catch { showMsg('Gagal menyimpan paket', true); throw new Error('save failed'); }
  };

  const handleDeletePkg = async (id: string) => {
    if (!window.confirm('Hapus paket ini?')) return;
    try {
      await enterpriseApi.packages.remove(id);
      showMsg('Paket dihapus');
      load();
    } catch { showMsg('Gagal menghapus paket', true); }
  };

  const handleSaveQuote = async (pkg: EnterprisePackage, namaKlien: string, region: string, note: string) => {
    try {
      const quote = await enterpriseApi.quotes.create({
        namaKlien,
        region,
        segmen: pkg.segmen,
        skema: pkg.skema,
        durasiKontrak: pkg.durasiKontrak,
        selectedPaketId: pkg.id,
        selectedPaketNama: pkg.nama,
        note,
        calculation: {
          solution: pkg.nama,
          brand: pkg.perangkat.map(p => p.brand).filter(Boolean).join(' / ') || '-',
          segmen: pkg.segmen,
          skema: pkg.skema,
          hargaNet: pkg.hargaOTC ?? (pkg.hargaBulan ?? 0) * pkg.durasiKontrak,
          hargaNetBulan: pkg.hargaBulan ?? 0,
          totalRev: (pkg.hargaBulan ?? 0) * pkg.durasiKontrak + (pkg.hargaOTC ?? 0),
          totalCost: 0,
          margin: 0,
          komisiRp: 0,
          comVal: 0,
          comAnnualPct: 0,
          payback: 0,
          data: { perangkat: pkg.perangkat, fitur: pkg.fitur },
        },
      });
      showMsg(`Quotation disimpan: ${quote.id}`);
    } catch { showMsg('Gagal menyimpan quotation', true); throw new Error('quote failed'); }
  };

  const filtered = packages.filter(p =>
    p.isActive !== false &&
    (filterSegmen === '' || p.segmen === filterSegmen) &&
    (filterTier === '' || p.budgetTier === filterTier)
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          <select value={filterSegmen} onChange={e => setFilterSegmen(e.target.value as ''|'SME'|'Enterprise')} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">Semua Segmen</option>
            <option value="SME">SME</option>
            <option value="Enterprise">Enterprise</option>
          </select>
          <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
            <option value="">Semua Tier</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        {isAdmin && (
          <button
            onClick={() => setModalPkg({})}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Tambah Paket
          </button>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}

      {loading && (
        <div className="flex justify-center py-16 text-gray-400 text-sm">Memuat paket...</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Package className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-sm">Belum ada paket tersedia</p>
          {isAdmin && <button onClick={() => setModalPkg({})} className="mt-3 text-sm text-purple-600 hover:underline">+ Tambah paket pertama</button>}
        </div>
      )}

      {/* Package Grid */}
      {!loading && filtered.length > 0 && (
        <div>
          {/* Summary strip */}
          <p className="text-xs text-gray-500 mb-3">{filtered.length} paket ditemukan</p>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(pkg => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onEdit={p => setModalPkg(p)}
                onDelete={handleDeletePkg}
                onSelect={p => { setSelectedPkgId(p.id); setQuoteModalPkg(p); }}
                selectedId={selectedPkgId}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      )}

      {/* Package form modal */}
      {modalPkg !== false && (
        <PackageModal
          pkg={modalPkg}
          onClose={() => setModalPkg(false)}
          onSave={handleSavePkg}
        />
      )}

      {/* Quote modal */}
      {quoteModalPkg && (
        <QuoteFromPackageModal
          pkg={quoteModalPkg}
          onClose={() => { setQuoteModalPkg(null); setSelectedPkgId(''); }}
          onSave={(namaKlien, region, note) => handleSaveQuote(quoteModalPkg, namaKlien, region, note)}
        />
      )}
    </div>
  );
}

// ─── Tab: Customize ───────────────────────────────────────────────────────────
function TabCustomize() {
  const [params, setParams] = useState<QuoteParams>(DEFAULT_PARAMS);
  const [results, setResults] = useState<Recommendation[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    // Load devices and config
    enterpriseApi.devices.getAll().then(data => {
      if (Array.isArray(data)) setDevices(data);
    }).catch(() => {});
    enterpriseApi.config.getBiayaTeknis().then((cfg: Record<string, number>) => {
      if (cfg?.operasionalPct != null) {
        setParams(prev => ({ ...prev, operasionalPct: cfg.operasionalPct }));
      }
    }).catch(() => {});
  }, []);

  const toggleSolution = (sol: SolutionKey) => {
    const current = params.selectedSolusi;
    setParams({ ...params, selectedSolusi: current.includes(sol) ? current.filter(s => s !== sol) : [...current, sol] });
  };

  const handleGenerate = async () => {
    setGenerating(true); setError(''); setResults([]);
    try {
      // Auto-include internet if bandwidth is specified
      let payload = { ...params };
      if (params.bandwidthTarget > 0 && !params.selectedSolusi.includes('internet')) {
        payload = { ...payload, selectedSolusi: ['internet', ...payload.selectedSolusi] };
      }
      const data = await enterpriseApi.pricing.generate(payload);
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
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Client Info */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg text-gray-900 mb-3">Client Info</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2"><label className="text-xs text-gray-500">Nama Klien</label><input value={params.namaKlien} onChange={e => setParams({...params, namaKlien: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="PT. Contoh Indonesia" /></div>
            <div><label className="text-xs text-gray-500">Segmen</label><select value={params.segmen} onChange={e => setParams({...params, segmen: e.target.value as 'SME'|'Enterprise'})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option>SME</option><option>Enterprise</option></select></div>
            <div><label className="text-xs text-gray-500">Region Klien</label><select value={params.region} onChange={e => setParams({...params, region: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">{REGIONS.map(r => <option key={r}>{r}</option>)}</select></div>
            <div><label className="text-xs text-gray-500">Jumlah User</label><input type="number" value={params.jumlahUser || ''} onChange={e => setParams({...params, jumlahUser: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="user" /></div>
            <div className="relative group">
              <label className="text-xs text-gray-500 flex items-center gap-1">
                Bandwidth (Mbps)
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-purple-100 text-purple-600 rounded-full text-[9px] font-bold cursor-help">?</span>
              </label>
              <input type="number" value={params.bandwidthTarget || ''} onChange={e => setParams({...params, bandwidthTarget: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="Mbps" />
              {params.jumlahUser > 0 && (() => {
                const rekMbps = params.jumlahUser * 2;
                const fmtBw = (mbps: number) => mbps >= 1000000 ? `${(mbps / 1000000).toFixed(1)} Tbps` : mbps >= 1000 ? `${(mbps / 1000).toFixed(1)} Gbps` : `${mbps} Mbps`;
                return (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Rekomendasi: <span className="font-medium text-purple-600">{fmtBw(rekMbps)}</span> ({params.jumlahUser} user × 2 Mbps)
                  </p>
                );
              })()}
              {params.jumlahUser > 0 && params.bandwidthTarget > 0 && params.bandwidthTarget < params.jumlahUser * 2 && (
                <p className="text-[10px] text-amber-600 mt-0.5">⚠ Di bawah rekomendasi</p>
              )}
              {params.bandwidthTarget > 0 && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  = {params.bandwidthTarget >= 1000000
                    ? `${(params.bandwidthTarget / 1000000).toFixed(2)} Tbps`
                    : params.bandwidthTarget >= 1000
                      ? `${(params.bandwidthTarget / 1000).toFixed(2)} Gbps`
                      : `${params.bandwidthTarget} Mbps`}
                </p>
              )}
              {/* Hover tooltip with details */}
              {params.jumlahUser > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 z-10 hidden group-hover:block pointer-events-none">
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-2.5 shadow-lg max-w-xs">
                    <p className="font-medium mb-1">💡 Rekomendasi Bandwidth</p>
                    <p>Rasio: <span className="font-bold">1 user = 2 Mbps</span></p>
                    <table className="mt-1 text-[10px] w-full">
                      <thead><tr className="text-gray-400"><th className="text-left pr-2">User</th><th className="text-left pr-2">Mbps</th><th className="text-left">Setara</th></tr></thead>
                      <tbody>
                        <tr><td className="pr-2 text-gray-300">50</td><td className="pr-2">100</td><td>100 Mbps</td></tr>
                        <tr><td className="pr-2 text-gray-300">100</td><td className="pr-2">200</td><td>200 Mbps</td></tr>
                        <tr><td className="pr-2 text-gray-300">250</td><td className="pr-2">500</td><td>500 Mbps</td></tr>
                        <tr><td className="pr-2 text-gray-300">500</td><td className="pr-2">1.000</td><td className="text-blue-300">1 Gbps</td></tr>
                        <tr><td className="pr-2 text-gray-300">1.000</td><td className="pr-2">2.000</td><td className="text-blue-300">2 Gbps</td></tr>
                        <tr><td className="pr-2 text-gray-300">5.000</td><td className="pr-2">10.000</td><td className="text-blue-300">10 Gbps</td></tr>
                        <tr><td className="pr-2 text-gray-300">50.000</td><td className="pr-2">100.000</td><td className="text-blue-300">100 Gbps</td></tr>
                        <tr><td className="pr-2 text-gray-300">500.000</td><td className="pr-2">1.000.000</td><td className="text-green-300">1 Tbps</td></tr>
                      </tbody>
                    </table>
                    <p className="mt-1.5 border-t border-gray-700 pt-1">
                      Anda: {params.jumlahUser.toLocaleString('id-ID')} user →{' '}
                      <span className="font-bold text-green-300">
                        {(() => { const m = params.jumlahUser * 2; return m >= 1000000 ? `${(m/1000000).toFixed(1)} Tbps` : m >= 1000 ? `${(m/1000).toFixed(1)} Gbps` : `${m} Mbps`; })()}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div><label className="text-xs text-gray-500">Durasi Kontrak (bln)</label><input type="number" value={params.durasiKontrak || ''} onChange={e => setParams({...params, durasiKontrak: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="bulan" /></div>
            <div><label className="text-xs text-gray-500">Skema</label><select value={params.skema} onChange={e => setParams({...params, skema: e.target.value as 'recurring'|'otc'|'otc_mrc'})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option value="recurring">Recurring</option><option value="otc">OTC</option><option value="otc_mrc">OTC + MRC</option></select></div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg text-gray-900 mb-3">Services</h2>
          <textarea
            value={params.services}
            onChange={e => setParams({...params, services: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
            placeholder="Deskripsi layanan yang akan diberikan, contoh: Instalasi & konfigurasi perangkat, managed service 24x7, monitoring NOC, maintenance bulanan..."
          />
        </div>

        {/* Perjalanan: Kota Asal & Tujuan */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg text-gray-900 mb-1">Perjalanan</h2>
          <p className="text-xs text-gray-500 mb-3">Informasi asal & tujuan digunakan sebagai referensi perhitungan biaya perjalanan</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-500">Region Asal</label>
              <select value={params.regionAsal} onChange={e => setParams({...params, regionAsal: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Kota Asal</label>
              <input value={params.kotaAsal} onChange={e => setParams({...params, kotaAsal: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="Jakarta" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Region Tujuan</label>
              <select value={params.regionTujuan} onChange={e => setParams({...params, regionTujuan: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Kota Tujuan</label>
              <input value={params.kotaTujuan} onChange={e => setParams({...params, kotaTujuan: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="Surabaya" />
            </div>
          </div>
          {params.regionAsal !== params.regionTujuan && (
            <p className="text-xs text-amber-600 mt-2">ℹ Perjalanan lintas regional: {params.regionAsal} → {params.regionTujuan}</p>
          )}
        </div>

        {/* Solutions with qty & device selection */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg text-gray-900 mb-1">Solutions & Qty</h2>
          <p className="text-xs text-gray-500 mb-3">Pilih solusi, tentukan jumlah unit, dan pilih jenis perangkat</p>
          <div className="space-y-2">
            {ALL_SOLUTIONS.map(sol => {
              const checked = params.selectedSolusi.includes(sol);
              const devicesForSol = devices.filter(d => d.kategori === sol);
              // Internet is auto-locked when bandwidth is filled in Client Info
              const isInternetLocked = sol === 'internet' && params.bandwidthTarget > 0;
              const isDisabled = isInternetLocked;
              return (
                <div key={sol} className={`rounded-lg border transition-all ${checked ? 'bg-purple-50 border-purple-300' : 'border-gray-200'} ${isDisabled ? 'opacity-70' : ''}`}>
                  <div className="flex items-center gap-3 p-3">
                    <input
                      type="checkbox"
                      checked={isInternetLocked ? true : checked}
                      onChange={() => { if (!isDisabled) toggleSolution(sol); }}
                      disabled={isDisabled}
                      className="w-4 h-4 text-purple-600 rounded disabled:cursor-not-allowed"
                    />
                    <span className="text-sm flex-1 font-medium">{SOLUTION_LABELS[sol]}</span>
                    {isInternetLocked && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Auto · {params.bandwidthTarget} Mbps</span>
                    )}
                    {checked && !isInternetLocked && (
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500">Qty:</label>
                        <input type="number" min={1} value={params.qtyMap[sol] ?? 1} onChange={e => setParams({ ...params, qtyMap: { ...params.qtyMap, [sol]: +e.target.value } })} className="w-20 px-2 py-1 border rounded text-sm" />
                      </div>
                    )}
                  </div>
                  {isInternetLocked && (
                    <p className="px-3 pb-3 text-xs text-blue-600">Bandwidth sudah ditentukan di Client Info ({params.bandwidthTarget} Mbps untuk {params.jumlahUser} user). Kosongkan bandwidth di atas untuk memilih manual.</p>
                  )}
                  {checked && !isInternetLocked && devicesForSol.length > 0 && (
                    <div className="px-3 pb-3 pt-0">
                      <select
                        value={params.deviceMap[sol] ?? ''}
                        onChange={e => setParams({ ...params, deviceMap: { ...params.deviceMap, [sol]: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      >
                        <option value="">— Otomatis (sesuai user & bandwidth) —</option>
                        {devicesForSol.map(d => (
                          <option key={d.id} value={d.nama}>
                            {d.nama} — {d.brand} ({d.budgetTier}) {d.hargaHW ? `· ${rp(d.hargaHW)}` : ''}
                          </option>
                        ))}
                      </select>
                      {params.deviceMap[sol] && (
                        <p className="text-xs text-purple-600 mt-1">Dipilih: {params.deviceMap[sol]}</p>
                      )}
                    </div>
                  )}
                  {checked && !isInternetLocked && devicesForSol.length === 0 && (
                    <p className="px-3 pb-3 text-xs text-gray-400">Tidak ada device tersedia untuk kategori ini</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* WiFi Config */}
        {params.selectedSolusi.includes('wifi') && (
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg text-gray-900 mb-3">WiFi Config</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gray-500">Mode</label>
                <select value={params.wifiConfig.mode} onChange={e => setParams({...params, wifiConfig: {...params.wifiConfig, mode: e.target.value as 'standalone'|'wlc'}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
                  <option value="standalone">Standalone</option>
                  <option value="wlc">WLC</option>
                </select>
              </div>
              {params.wifiConfig.mode === 'wlc' && <>
                <div><label className="text-xs text-gray-500">WLC Model</label><input value={params.wifiConfig.wlcModel ?? ''} onChange={e => setParams({...params, wifiConfig: {...params.wifiConfig, wlcModel: e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs text-gray-500">WLC Qty</label><input type="number" value={params.wifiConfig.wlcQty ?? ''} onChange={e => setParams({...params, wifiConfig: {...params.wifiConfig, wlcQty: +e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
                <div><label className="text-xs text-gray-500">WLC Harga</label><input type="number" value={params.wifiConfig.wlcHarga ?? ''} onChange={e => setParams({...params, wifiConfig: {...params.wifiConfig, wlcHarga: +e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              </>}
            </div>
          </div>
        )}

        {/* CCTV Config */}
        {params.selectedSolusi.includes('cctv') && (
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg text-gray-900 mb-3">CCTV Config</h2>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs text-gray-500">Type</label><select value={params.cctvConfig.type} onChange={e => setParams({...params, cctvConfig: {...params.cctvConfig, type: e.target.value as 'nvr'|'dvr'}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option value="nvr">NVR</option><option value="dvr">DVR</option></select></div>
              <div><label className="text-xs text-gray-500">Recorder Qty</label><input type="number" value={params.cctvConfig.recQty || ''} onChange={e => setParams({...params, cctvConfig: {...params.cctvConfig, recQty: +e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="text-xs text-gray-500">Camera Qty</label><input type="number" value={params.cctvConfig.camQty || ''} onChange={e => setParams({...params, cctvConfig: {...params.cctvConfig, camQty: +e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            </div>
          </div>
        )}

        {/* IP-PBX Config */}
        {params.selectedSolusi.includes('ippbx') && (
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg text-gray-900 mb-3">IP-PBX Config</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-500">PBX Qty</label><input type="number" value={params.ippbxConfig.pbxQty || ''} onChange={e => setParams({...params, ippbxConfig: {...params.ippbxConfig, pbxQty: +e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="text-xs text-gray-500">Phone Qty</label><input type="number" value={params.ippbxConfig.phoneQty || ''} onChange={e => setParams({...params, ippbxConfig: {...params.ippbxConfig, phoneQty: +e.target.value}})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" /></div>
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg text-gray-900 mb-3">Pricing</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><label className="text-xs text-gray-500">Target Margin (%)</label><input type="number" value={params.targetMargin || ''} onChange={e => setParams({...params, targetMargin: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="%" /></div>
            <div><label className="text-xs text-gray-500">Komisi (%)</label><input type="number" value={params.komisi || ''} onChange={e => setParams({...params, komisi: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="%" /></div>
            <div><label className="text-xs text-gray-500">Diskon (%)</label><input type="number" value={params.diskon || ''} onChange={e => setParams({...params, diskon: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="%" /></div>
            <div><label className="text-xs text-gray-500">JBOR Rate (%)</label><input type="number" value={params.jborRate || ''} onChange={e => setParams({...params, jborRate: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="%" /></div>
            <div><label className="text-xs text-gray-500">Provisi Rate (%)</label><input type="number" value={params.provisiRate || ''} onChange={e => setParams({...params, provisiRate: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="%" /></div>
          </div>
        </div>

        {/* Technical Costs */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg text-gray-900 mb-3">Biaya Teknis & Operasional</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><label className="text-xs text-gray-500">Jarak Kabel (m)</label><input type="number" value={params.jarakKabel || ''} onChange={e => setParams({...params, jarakKabel: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="meter" /></div>
            <div><label className="text-xs text-gray-500">Jarak Kota (km)</label><input type="number" value={params.jarakKota || ''} onChange={e => setParams({...params, jarakKota: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="km" /></div>
            <div><label className="text-xs text-gray-500">Hari Kerja</label><input type="number" value={params.hariKerja || ''} onChange={e => setParams({...params, hariKerja: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="hari" /></div>
            <div><label className="text-xs text-gray-500">Durasi PM (bln)</label><input type="number" value={params.durasiPM || ''} onChange={e => setParams({...params, durasiPM: +e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="bulan" /></div>
            {params.operasionalPct > 0 && (
              <div className="col-span-2 md:col-span-4 bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-500">Biaya Operasional & Perjalanan: <span className="font-medium text-gray-700">{params.operasionalPct}%</span> dari total HW</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Diatur oleh Admin Sales di tab Biaya Teknis</p>
              </div>
            )}
          </div>
        </div>

        {/* Validation: nama klien required if bandwidth > 300 */}
        {params.bandwidthTarget > 300 && !params.namaKlien.trim() && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
            ⚠ Untuk bandwidth &gt; 300 Mbps, <span className="font-medium">Nama Klien wajib diisi</span> agar title quotation tergenerate dengan benar.
          </div>
        )}

        <button onClick={handleGenerate} disabled={generating || !params.selectedSolusi.length || (params.bandwidthTarget > 300 && !params.namaKlien.trim())} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium">
          {generating ? 'Generating...' : 'Generate Quotation'}
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-5 sticky top-6">
          <h2 className="text-lg text-gray-900 mb-3">Results</h2>
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          {saved && <p className="text-sm text-green-600 mb-3">{saved}</p>}
          {results.length === 0 && !error && <p className="text-sm text-gray-500">Klik "Generate" untuk melihat kalkulasi</p>}
          <div className="space-y-3">
            {results.map((rec, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {params.namaKlien ? `Paket ${params.namaKlien}` : rec.solution}
                </p>
                <p className="text-xs text-gray-500 mb-2">{rec.solution} — {rec.brand}</p>

                {/* Services info */}
                {params.services && (
                  <div className="text-xs bg-blue-50 text-blue-700 p-2 rounded mb-2">
                    <span className="font-medium">Services:</span> {params.services.substring(0, 100)}{params.services.length > 100 ? '...' : ''}
                  </div>
                )}

                {/* Perjalanan info */}
                {params.regionAsal !== params.regionTujuan && (
                  <p className="text-xs text-amber-600 mb-2">Perjalanan: {params.regionAsal} ({params.kotaAsal || '-'}) → {params.regionTujuan} ({params.kotaTujuan || '-'})</p>
                )}

                {/* Pricing summary */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div><span className="text-gray-500">Harga/bln:</span> <span className="font-medium">{rp(rec.hargaNetBulan)}</span></div>
                  <div><span className="text-gray-500">Total Rev:</span> <span className="font-medium">{rp(rec.totalRev)}</span></div>
                  <div><span className="text-gray-500">Total Cost:</span> <span className="font-medium">{rp(rec.totalCost)}</span></div>
                  <div><span className="text-gray-500">Margin:</span> <span className="font-medium text-green-600">{(rec.margin * 100).toFixed(1)}%</span></div>
                  <div><span className="text-gray-500">Komisi:</span> <span className="font-medium">{rp(rec.komisiRp)}</span></div>
                  <div><span className="text-gray-500">Payback:</span> <span className="font-medium">{rec.payback} bln</span></div>
                </div>

                {/* OTC + MRC Summary */}
                {rec.data && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-2 text-xs space-y-1.5">
                    {rec.skema === 'otc' && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">OTC (One-Time Cost)</span>
                        <span className="font-bold text-gray-900">{rp(rec.hargaOTC || rec.hargaNet)}</span>
                      </div>
                    )}
                    {rec.skema === 'recurring' && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">MRC (Monthly Recurring)</span>
                        <span className="font-bold text-gray-900">{rp(rec.hargaMRC || rec.hargaNetBulan)}<span className="text-gray-400 font-normal">/bln</span></span>
                      </div>
                    )}
                    {rec.skema === 'otc_mrc' && (<>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">OTC (One-Time Cost)</span>
                        <span className="font-bold text-gray-900">{rp(rec.hargaOTC)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">MRC (Monthly Recurring)</span>
                        <span className="font-bold text-gray-900">{rp(rec.hargaMRC)}<span className="text-gray-400 font-normal">/bln</span></span>
                      </div>
                    </>)}
                    <div className="flex items-center justify-between border-t border-gray-200 pt-1.5">
                      <span className="text-gray-600 font-medium">Total ({rec.data.durasi ?? 12} bln)</span>
                      <span className="font-bold text-purple-700">{rp(rec.totalRev)}</span>
                    </div>
                  </div>
                )}

                {/* Detailed cost breakdown */}
                {rec.data && (
                  <details className="text-xs border-t pt-2 mt-2">
                    <summary className="cursor-pointer text-gray-500 hover:text-gray-700 font-medium">Rincian Biaya</summary>
                    <div className="mt-2 space-y-3">
                      {/* Instalasi (one-time) */}
                      <div>
                        <p className="font-medium text-gray-700 mb-1">🔧 Biaya Instalasi (One-Time)</p>
                        <div className="grid grid-cols-2 gap-1 text-gray-600 pl-2">
                          {typeof rec.data.bKabel === 'number' && (rec.data.bKabel as number) > 0 && <div>Kabel: <span className="font-medium">{rp(rec.data.bKabel as number)}</span></div>}
                          {typeof rec.data.bInstalasi === 'number' && <div>Instalasi: <span className="font-medium">{rp(rec.data.bInstalasi as number)}</span></div>}
                          {typeof rec.data.bDelivery === 'number' && <div>Delivery: <span className="font-medium">{rp(rec.data.bDelivery as number)}</span></div>}
                          {typeof rec.data.bAkomodasi === 'number' && (rec.data.bAkomodasi as number) > 0 && <div>Akomodasi: <span className="font-medium">{rp(rec.data.bAkomodasi as number)}</span></div>}
                          {typeof rec.data.hargaHW === 'number' && <div>Hardware: <span className="font-medium">{rp(rec.data.hargaHW as number)}</span></div>}
                          {typeof rec.data.bOperasional === 'number' && <div>Operasional ({rec.data.operasionalPct ?? 10}%): <span className="font-medium">{rp(rec.data.bOperasional as number)}</span></div>}
                          <div className="col-span-2 border-t pt-1 mt-1 font-medium text-gray-800">
                            Subtotal Instalasi: {rp(rec.data.biayaInstalasi as number || 0)}
                          </div>
                        </div>
                      </div>

                      {/* Recurring */}
                      <div>
                        <p className="font-medium text-gray-700 mb-1">🔄 Biaya Recurring (Bulanan)</p>
                        <div className="grid grid-cols-2 gap-1 text-gray-600 pl-2">
                          {typeof rec.data.bManaged === 'number' && <div>Managed Svc: <span className="font-medium">{rp(rec.data.bManaged as number)}/bln</span></div>}
                          {typeof rec.data.bPM === 'number' && <div>Project Mgmt: <span className="font-medium">{rp(rec.data.bPM as number)}/bln</span></div>}
                          {typeof rec.data.hargaBW === 'number' && <div>Bandwidth: <span className="font-medium">{rp(rec.data.hargaBW as number)}/bln</span></div>}
                          {typeof rec.data.biayaRecurringBulan === 'number' && (
                            <div className="col-span-2 text-gray-500">Per bulan: {rp(rec.data.biayaRecurringBulan as number)}</div>
                          )}
                          <div className="col-span-2 border-t pt-1 mt-1 font-medium text-gray-800">
                            Subtotal Recurring ({rec.data.durasi ?? 12} bln): {rp(rec.data.biayaRecurringTotal as number || 0)}
                          </div>
                        </div>
                      </div>

                      {/* Grand total */}
                      <div className="border-t pt-2 font-medium text-gray-900">
                        Total Biaya: {rp(rec.data.totalBiaya as number || 0)}
                      </div>
                    </div>
                  </details>
                )}

                {/* Material / Perangkat detail */}
                {rec.data?.items && typeof rec.data.items === 'object' && Object.keys(rec.data.items as Record<string, unknown>).length > 0 && (
                  <details className="text-xs border-t pt-2 mt-2" open>
                    <summary className="cursor-pointer text-gray-500 hover:text-gray-700 font-medium">📦 Material / Perangkat</summary>
                    <div className="mt-2 space-y-1.5">
                      {Object.entries(rec.data.items as Record<string, Record<string, unknown>>).map(([kategori, device]) => {
                        if (!device || typeof device !== 'object') return null;
                        const nama = device.nama as string || kategori;
                        const brand = device.brand as string || '-';
                        const hargaHW = device.hargaHW as number || 0;
                        const qty = (rec.data.qtyMap as Record<string, number>)?.[kategori] || 1;
                        return (
                          <div key={kategori} className="flex items-start gap-2 p-1.5 bg-gray-50 rounded">
                            <span className="shrink-0 w-5 h-5 bg-purple-100 text-purple-700 rounded text-center leading-5 font-medium text-[10px]">{qty}×</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-800 font-medium truncate">{nama}</p>
                              <p className="text-gray-400">{brand} · {SOLUTION_LABELS[kategori as SolutionKey] ?? kategori}{hargaHW > 0 ? ` · ${rp(hargaHW)}` : ''}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                )}

                <button onClick={() => handleSaveQuote(rec)} className="w-full text-xs bg-purple-600 text-white py-2 rounded hover:bg-purple-700 mt-2">Save as Quote</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Biaya Teknis Config ─────────────────────────────────────────────────
function TabBiayaTeknis() {
  const [config, setConfig] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    enterpriseApi.config.getBiayaTeknis().then(setConfig).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await enterpriseApi.config.updateBiayaTeknis(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = async () => {
    const data = await enterpriseApi.config.resetBiayaTeknis();
    setConfig(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fields = [
    { key: 'kabelRate', label: 'Biaya Kabel (per meter)', suffix: '/m' },
    { key: 'instalasi', label: 'Biaya Instalasi', suffix: '' },
    { key: 'delivery', label: 'Biaya Delivery', suffix: '' },
    { key: 'managedRate', label: 'Managed Service (per bulan)', suffix: '/bln' },
    { key: 'pmRate', label: 'Project Management (per bulan)', suffix: '/bln' },
    { key: 'operasionalPct', label: 'Biaya Operasional & Perjalanan (% dari HW)', suffix: '%' },
  ];

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600 text-sm">Konfigurasi biaya dasar untuk kalkulasi harga quotation</p>
        <div className="flex gap-2">
          <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
      {saved && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">Config saved!</div>}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm text-gray-700 mb-1">{f.label}</label>
              <div className="flex items-center gap-2">
                <input type="number" step={f.suffix === '%' ? '0.5' : '1'} value={config[f.key] ?? 0} onChange={e => setConfig({...config, [f.key]: +e.target.value})} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                <span className="text-xs text-gray-500 w-28 text-right">
                  {f.suffix === '%' ? `${config[f.key] ?? 0}%` : `${rp(config[f.key] ?? 0)}${f.suffix}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
type Tab = 'fix' | 'customize' | 'config';

export function EnterpriseQuotation() {
  const { user } = useAuth();
  const role = user?.role ?? 'sales';
  const isAdmin = role === 'super_admin' || role === 'sales_admin';

  const [activeTab, setActiveTab] = useState<Tab>('fix');

  const tabs: { id: Tab; label: string; adminOnly?: boolean }[] = [
    { id: 'fix', label: 'Paket Fix' },
    { id: 'customize', label: 'Customize' },
    { id: 'config', label: 'Biaya Teknis', adminOnly: true },
  ];

  const visibleTabs = tabs.filter(t => !t.adminOnly || isAdmin);

  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <h1 className="text-2xl text-gray-900">New Quotation</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-1">
            {visibleTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white border border-b-white border-gray-200 text-purple-600 -mb-px'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'fix' && <TabPaketFix isAdmin={isAdmin} />}
        {activeTab === 'customize' && <TabCustomize />}
        {activeTab === 'config' && isAdmin && <TabBiayaTeknis />}
      </div>
    </EnterpriseLayout>
  );
}
